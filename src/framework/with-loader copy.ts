import { json, LoaderFunction } from "@remix-run/node";
import { getAppEngineClient } from "./appengine-client";
import { initializeStore } from "~/store/site-store";
import { getLanguage } from "~/server/language.server";
import { getRequestInfo } from "./log-request-helper";
import { getTranslations } from "~/server/i18n.server";

export interface RootLoaderData {
    site: any;
    page: any;
    initialZustandState: any;
    translations: any;
}

export const withLoader = (loader?: LoaderFunction) => {
    return async (context: any) => {
        const { request, params } = context;
        const url = new URL(request.url);
        const hostname = url.hostname;

        // Handle the path properly
        let requestPath = url.pathname;

        const accept = request.headers.get('accept');
        const isNavigationRequest = accept?.includes('text/html');

        if (!isNavigationRequest) {
            return json({
                site: null,
                page: null,
                initialZustandState: null,
                translations: null
            });
        }

        const locale = getLanguage(request);

        // Execute the base loader if provided
        const baseLoader: any = loader ? await loader(context) : { props: {} };
        console.log('baseLoader', baseLoader);

        // Fetch tenant data
        const tenantData = await getAppEngineClient().getSite(hostname);
        if (!tenantData) {
            throw new Response("Tenant Not Found", { status: 404 });
        }

        let page = null;
        const localPaths = ['/business', '/store', '/account'];
        const isLocalPath = localPaths.some((path) => requestPath.startsWith(path));

        if (!isLocalPath) {
            try {
                const clientInfo: any = await getRequestInfo(request);
                page = await getAppEngineClient().getPage(
                    hostname,
                    tenantData.data.name,
                    requestPath,
                    url.searchParams.toString(),
                    clientInfo || {}
                );
            } catch (error) {
                console.error(`Error fetching page for host: ${hostname} - ${requestPath}`, error);
            }
        }

        // Handle sitemap.xml specially
        if (requestPath.endsWith('sitemap.xml') && page) {
            return new Response(page, {
                headers: { 'Content-Type': 'application/xml' },
            });
        }

        // Throw 404 if page not found and it's not a local path
        if (!page && !isLocalPath) {
            throw new Response("Page Not Found", { status: 404 });
        }

        const translations = await getTranslations(tenantData.id, locale);
        const zustandStore = initializeStore({
            site: tenantData,
            page,
            dataStore: {}
        });

        const loaderData: RootLoaderData = {
            ...(baseLoader || {}),
            site: tenantData,
            page: page || null,
            initialZustandState: zustandStore,
            translations,
        };

        return json(loaderData);
    }
}
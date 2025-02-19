import { siteConfig } from "./site-config";
import * as jwt from 'jsonwebtoken';
import { UAParser } from 'ua-parser-js';
import { appEndpoints, DataType } from "@jaclight/dbsdk";
import { getAppEngineClient } from "./appengine-client";
import { createBaseData } from "@/utils/data.utils";
// import { createBaseData } from "~/store/site-store";

interface ClientInfo {
    siteName: string;
    realIp: string;
    socketIp: string;
    forwardIp: string;
    clientIp: string;
    referrer: string;
    host: string;
    protocol: string;
    domain: string;
    url: string;
    userAgentString: string;
    browser: string;
    browserVersion: string;
    os: string;
    osVersion: string;
    deviceType: string | undefined;
    deviceVendor: string | undefined;
    deviceModel: string | undefined;
    sharedHost: string;
    configSite: string;
    configOrg: string;
    multipart?: boolean;
    customer?: {
        phone: string;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
    };
}


export const getRequestInfo = async (req: any) => {
    if (!req) return {};

    const forwardIp = req.headers['X-Forwarded-For'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
    const protocol = req.headers['X-Forwarded-Proto'] || req.headers['x-forwarded-proto'] || req['protocol'];
    const host = req.headers['X-Forwarded-Host'] || req.headers['x-forwarded-host'] || req.headers['host'];
    const connectionIp = req.headers['DO-Connecting-IP']
    const socketIp = req.socket?.remoteAddress || '';
    const clientIp = req.headers['X-Real-IP'] || req.headers['x-real-ip'] || req.connection?.remoteAddress;
    const realIp = connectionIp || forwardIp || clientIp;
    const url = req.url

    const userAgentString = req.headers['user-agent'] || '';
    const parser = new UAParser(userAgentString);
    const result = parser.getResult();
    const browser = result.browser.name;
    const browserVersion = result.browser.version;
    const os = result.os.name;
    const osVersion = result.os.version;
    const deviceType = result.device.type;
    const deviceVendor = result.device.vendor;
    const deviceModel = result.device.model;

    const referrer = req.headers.referer || '';
    const domain = req.headers.host;
    const siteName = siteConfig.siteName
    return { siteName, realIp, socketIp, forwardIp, clientIp, referrer, host, protocol, domain, url, userAgentString, browser, browserVersion, os, osVersion, deviceType, deviceVendor, deviceModel, sharedHost: siteConfig.domainAsOrg ? siteConfig.orgId : '', configSite: siteConfig.siteName, configOrg: siteConfig.orgId };
}


// Function to log requests
export const logRequest = async (hostName: string, req: Request): Promise<void> => {
    const clientInfo: any = await getRequestInfo(req);
    clientInfo.host = hostName || clientInfo.host;
    const baseData = createBaseData(DataType.web_visit, clientInfo, "system");
    baseData.name = baseData.data.url;
    clientInfo.multipart =
        req.headers.get("content-type")?.includes("multipart/form-data") || false;

    const authorization = req.headers.get("authorization") || req.headers.get("Authorization");
    if (authorization) {
        const token = authorization.split(" ")[1];
        if (token) {
            try {
                const decodedToken: any = jwt.decode(token);
                if (decodedToken?.data) {
                    const { phone, email, username, firstName, lastName } = decodedToken.data;
                    clientInfo.customer = { phone, email, username, firstName, lastName };
                }
            } catch (error) {
                console.error("Error decoding JWT token:", error);
            }
        }
    }

    // Validate IP address before logging
    if (validIPAddressCheck(clientInfo.realIp)) {
        try {
            await getAppEngineClient().processRequest("post", appEndpoints.web_visit.path, baseData);
        } catch (err: any) {
            console.error("Error logging request", err.message);
        }
    } else {
        console.error("Invalid IP address " + clientInfo.realIp);
    }
};


const validIPAddressCheck = (v4OrV6Ip: string) => {
    if (v4OrV6Ip) {
        const v4IpPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        const v6IpPattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return v4IpPattern.test(v4OrV6Ip) || v6IpPattern.test(v4OrV6Ip);
    }
    return false;

}


import { isNotEmpty, isEmpty } from "@jaclight/dbsdk";


export function generateCartItem(item: any, attributes: object, url: string = "") {
  const { sk, name, link, slug, image, images, price, discount, plan } = item;
  const [imageOne] = (images || []);
  attributes = isEmpty(attributes) ? item.attributes : attributes;
  return {
    id: isNotEmpty(attributes) ? `${sk}.${Object.values(attributes).join(".")}`
      : sk,
    name,
    slug,
    link,
    image: image || imageOne?.url,
    discount,
    price,
    attributes,
    plan,
    url,
  };
}

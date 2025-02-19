export type productTypes = {
  data: {
    name: string
    price: number
    cost: string
    status: string
    description: string
    images: {
      url: string
      path: string
    }[]
    attributes: {
      name: string
      options: {
        label: string
        value: string
      }[]
    }[]
    slug: string
  }
  name: string
  sk: string
}

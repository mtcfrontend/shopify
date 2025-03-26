module.exports = {
  integrations: {
    shopify: {
      location: '@mtcmedia/shopify-api/server',
      configuration: {
        api: {
          domain: process.env.SHOPIFY_DOMAIN,
          storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_TOKEN,
          apiVersion: "2022-01"
        },
        cms: {
          blogs: '/blogs',
          articles: '/articles'
        },
        currency: 'USD',
        country: 'US'
      }
    }
  }
};

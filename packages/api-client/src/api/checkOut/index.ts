/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomQuery } from '@vue-storefront/core';
import { gql } from '@apollo/client/core'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function checkOut(context, cartId, customQuery?: CustomQuery) {
  const DEFAULT_QUERY = `query FETCH_CART($id: ID!) {
    cart(id: $id) {
      id
      checkoutUrl
      createdAt
      updatedAt
      note
  
      appliedGiftCards {
        id
        amountUsed {
          amount
          currencyCode
        }
        balance {
          amount
          currencyCode
        }
      }
  
      attributes {
        key
        value
      }
  
      discountCodes {
        code
        applicable
      }
  
      lines(first: 250) {
        edges {
          node {
            id
            quantity
            attributes {
              key
              value
            }
            merchandise {
              ... on ProductVariant {
                id
                title
                availableForSale
                requiresShipping
                sku
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                unitPrice {
                  amount
                  currencyCode
                }
                image {
                  altText
                  id
                  src
                  width
                  height
                }
                product {
                  id
                  handle
                  title
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
  
      estimatedCost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
      }
  
      deliveryGroups(first: 10) {
        edges {
          node {
            deliveryOptions {
                handle
                title
                estimatedCost {
                    amount
                    currencyCode
                }
            }
          }
        }
      }
  
      buyerIdentity {
        email
        countryCode
      }
    }
  }`

  const payload = {
    id: cartId,
  }

  const { cart } = context.extendQuery(
    customQuery,
    {
      cart: {
        query: DEFAULT_QUERY as any,
        variables: payload
      }
    }
  )

  return await context.client.apolloClient.query({
    query: gql(cart.query) as any,
    variables: cart.variables
  }).then((result) => {

    // Extract discount codes
    const discountCodes = result.data.cart.discountCodes?.map(discount => ({
      code: discount.code,
      applicable: discount.applicable
    })) || [];

    // Extract line items
    const lines = result.data.cart.lines.edges?.map(edge => edge.node) || [];

    // Create a clean result object
    const newResult = {
      ...result,
      data: {
        ...result.data,
        cart: {
          ...result.data.cart,
          discountCodes,
          lines
        }
      }
    };

    return newResult.data.cart;
  });

}

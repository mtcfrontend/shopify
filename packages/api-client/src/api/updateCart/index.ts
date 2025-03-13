/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomQuery } from '@vue-storefront/core';
import { gql } from '@apollo/client/core'
import { print } from 'graphql'
import { getCountry } from '../../helpers/utils';
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function updateCart(context, params, _customQuery?: CustomQuery) {
  const { currentCart, product, quantity } = params;

// Find the correct cart line ID using the product's variant ID
  const lineItem = currentCart.lines.edges.find(
    (line) => line.node.merchandise.id === product.variantBySelectedOptions?.id || line.node.merchandise.id === product.id
  );

  const linesToUpdate = lineItem
    ? [{
      id: lineItem.node.id, // Correct cart line ID
      quantity
    }]
    : [];


  const DEFAULT_MUTATION = gql`mutation cartLinesUpdate($country: CountryCode, $cartId: ID!, $lines: [CartLineUpdateInput!]!) @inContext(country: $country) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
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
                    height
                    width
                    src
                  }
                  product {
                    handle
                    id
                  }
                  selectedOptions {
                    name
                    value
                  }
                  sku
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
  
        deliveryGroups {
          edges {
            node {
              deliveryMethods {
                handle
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
  
        shippingAddress {
          id
        }
  
        buyerIdentity {
          email
          countryCode
        }
      }
      userErrors {
        field
        message
        code
      }
    }
  }`
  const payload = {
    lines: linesToUpdate,
    country: getCountry(context),
    cartId: currentCart.id
  }

  const { cartLinesUpdate } = context.extendQuery(
    _customQuery,
    {
      cartLinesUpdate: {
        mutation: print(DEFAULT_MUTATION as any),
        payload,
      },
    }
  );

  return await context.client.apolloClient.mutate({
    mutation: gql(cartLinesUpdate.mutation) as any,
    variables: cartLinesUpdate.payload,
  }).then((result) => {
    const cartData = result.data.cartLinesUpdate.cart;

    // Extract discount codes
    const discountCodes = cartData.discountCodes?.map((discount) => ({
      code: discount.code,
      applicable: discount.applicable,
    })) || [];

    // Extract updated line items
    const lines = cartData.lines.edges?.map((edge) => edge.node) || [];

    // Return the structured result
    return {
      ...cartData,
      discountCodes,
      lines,
    };
  });
}

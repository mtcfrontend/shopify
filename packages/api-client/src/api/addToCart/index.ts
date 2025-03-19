import { CustomQuery } from '@vue-storefront/core';
import { gql } from '@apollo/client/core'
export async function addToCart(context, params, _customQuery?: CustomQuery) {
  const { currentCart, product, quantity, customQuery } = params;
  // Items to be add to cart
  const linesToAdd = [
    {
      merchandiseId: product.variantBySelectedOptions && product.variantBySelectedOptions !== null
        ? product.variantBySelectedOptions.id
        : product.variantId,
      quantity,
      attributes: customQuery
    }
  ];

  const DEFAULT_MUTATION = gql`mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        createdAt
        updatedAt
        note
        
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
  
        discountCodes {
          code
          applicable
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
  
        attributes {
          key
          value
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
      }
      userErrors {
        field
        message
        code
      }
    }
  }`
  const payload = {
    lines: linesToAdd,
    cartId: currentCart.id// .split('?')[0]
  }

  const { cartLinesAdd } = context.extendQuery(
    customQuery,
    {
      cartLinesAdd: {
        mutation: DEFAULT_MUTATION,
        payload
      }
    }
  )

  return await context.client.apolloClient.mutate({
    mutation: cartLinesAdd.mutation,
    variables: cartLinesAdd.payload,
    fetchPolicy: 'no-cache'
  }).then((result) => {

    const cartData = result.data.cartLinesAdd.cart;

    // Extract discount codes
    const discountCodes = (cartData.discountCodes || []).map(discount => ({
      code: discount.code,
      applicable: discount.applicable
    }));

    // Extract line items
    const lines = (cartData.lines.edges || []).map(edge => edge.node);

    // Clean up and structure the final cart object
    const finalCart = {
      ...cartData,
      discountCodes,
      lines
    };

    return finalCart;
  });
}

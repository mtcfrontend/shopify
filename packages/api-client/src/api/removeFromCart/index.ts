import { CustomQuery } from '@vue-storefront/core';
import { gql } from '@apollo/client/core';
import { getCountry } from '../../helpers/utils';
export async function removeFromCart(context, params, _customQuery?: CustomQuery) {
  const { currentCart, product } = params;
  // products to be remove
  const lineItemIdsToRemove = currentCart.lines.edges
    .filter((line) => line.node.merchandise.id === product.variantBySelectedOptions?.id || line.node.merchandise.id === product.id)
    .map((line) => line.node.id);

  const DEFAULT_MUTATION = `mutation cartLinesRemove($country: CountryCode, $cartId: ID!, $lineIds: [ID!]!) @inContext(country: $country) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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
    lineIds: lineItemIdsToRemove,
    country: getCountry(context),
    cartId: currentCart.id,
  };

    const { cartLinesRemove } = context.extendQuery(
      _customQuery,
      {
        cartLinesRemove: {
          mutation: DEFAULT_MUTATION,
          payload
        }
      }
    )


  return await context.client.apolloClient.mutate({
    mutation: gql(cartLinesRemove.mutation) as any,
    variables: cartLinesRemove.payload,
  }).then((result) => {
    const cartData = result.data.cartLinesRemove.cart;

    // Extract discount codes
    const discountCodes = cartData.discountCodes?.map((discount) => ({
      code: discount.code,
      applicable: discount.applicable,
    })) || [];

    // Extract line items
    const lines = cartData.lines.edges?.map((edge) => edge.node) || [];

    // Return the structured cart data
    return {
      ...cartData,
      discountCodes,
      lines,
    };
  });
}

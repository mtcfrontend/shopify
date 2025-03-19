/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomQuery } from '@vue-storefront/core';
import { gql } from '@apollo/client/core'
import { print } from 'graphql'
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function updateCart(context, params, _customQuery?: CustomQuery) {
  const { currentCart, product, quantity } = params;

  const lineToUpdate = [{
    id: product.id,
    attributes: product.attributes,
    quantity
  }];

  const DEFAULT_MUTATION = gql`mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              attributes {
                key
                value
              }
            }
          }
        }
      }
    }
  }`;

  const payload = {
    lines: lineToUpdate,
    cartId: currentCart.id
  };

  const { cartLinesUpdate } = context.extendQuery(
    _customQuery,
    {
      cartLinesUpdate: {
        mutation: print(DEFAULT_MUTATION as any),
        payload,
      },
    }
  );

  const result = await context.client.apolloClient.mutate({
    mutation: gql(cartLinesUpdate.mutation) as any,
    variables: cartLinesUpdate.payload,
  });

  const updatedCart = await context.client.apolloClient.query({
    query: gql`
      query FETCH_CART($id: ID!) {
        cart(id: $id) {
          id
          checkoutUrl
          createdAt
          updatedAt
          note
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
        }
      }
    `,
    variables: { id: currentCart.id },
    fetchPolicy: 'network-only' // Ensure fresh data
  });

  const cartData = updatedCart.data.cart;

  const discountCodes = (cartData.discountCodes || []).map(discount => ({
    code: discount.code,
    applicable: discount.applicable
  }));

  const lines = (cartData.lines.edges || []).map(edge => edge.node);

  const finalCart = {
    ...cartData,
    discountCodes,
    lines
  };

  return finalCart;
}

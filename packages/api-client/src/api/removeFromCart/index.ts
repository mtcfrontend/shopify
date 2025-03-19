import { CustomQuery } from '@vue-storefront/core';
import { gql } from '@apollo/client/core';
export async function removeFromCart(context, params, _customQuery?: CustomQuery) {
  const { currentCart, product } = params;
  // products to be remove
  const lineItemIdsToRemove = [
    product.id
  ];

  const DEFAULT_MUTATION = `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                }
              }
            }
          }
        }
      }
    }
  }`
  const payload = {
    lineIds: lineItemIdsToRemove,
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

  const result = await context.client.apolloClient.mutate({
    mutation: gql(cartLinesRemove.mutation) as any,
    variables: cartLinesRemove.payload,
  });

  const updatedCart = await context.client.apolloClient.query({
    query: gql`query FETCH_CART($id: ID!) {
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
    }`,
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

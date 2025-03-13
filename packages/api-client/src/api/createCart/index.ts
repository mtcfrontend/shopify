import { CustomQuery } from '@vue-storefront/core';
import { gql } from '@apollo/client/core'
import { getCountry } from '../../helpers/utils'

export default async function createCart(context, _params, _customQuery?: CustomQuery) {

  const DEFAULT_MUTATION = gql`mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
        code
      }
    }
  }`

  const payload = {
    input: {
      buyerIdentity: {
        countryCode: getCountry(context)
      }
    }
  }

  const { cartCreate } = context.extendQuery(
      _customQuery,
      {
        cartCreate: {
          mutation: DEFAULT_MUTATION,
          payload
        }
      }
  )
  return await context.client.apolloClient.mutate({
    mutation: cartCreate.mutation,
    variables: cartCreate.payload
  }).then((result) => {
    return result.data.cartCreate.cart;
  });
}

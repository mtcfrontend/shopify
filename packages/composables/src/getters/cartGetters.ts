/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CartGetters, AgnosticPrice, AgnosticTotals, AgnosticCoupon, AgnosticDiscount } from '@vue-storefront/core';
import { Cart, LineItem } from '@vue-storefront/shopify-api/src/types';
import { formatSelectedAttributeList } from './_utils';

export const getCartItems = (cart: Cart): LineItem[] => {
  return cart?.lines?.map((lineItem) => ({
    ...lineItem,
    variant: lineItem.merchandise, // Duplicates the 'merchandise' as 'variant' as a fallback
  })) || [];
};

export const getCartItemName = (product: any): string => product?.title || (product?.merchandise?.product?.title || 'Product\'s name');
export const getCartItemId = (product: any): string => product.id || '0';
export const getCartItemSlug = (product: any): string => {
  return product.slug || '0';
};

export const getCartItemImage = (product: any): string => {
  if (product.merchandise && product?.merchandise?.image !== null) {
    const imgPath = product?.merchandise?.image?.src.substring(0, product?.merchandise.image.src.lastIndexOf('.'));
    const imgext = product?.merchandise?.image?.src.split('.').pop();
    const cartImg = imgPath + '_120x120.' + imgext;
    return cartImg;
  }
  return '';
};

export const getCartItemPrice = (product: any): AgnosticPrice => {
  return {
    regular: product?.merchandise?.compareAtPrice?.amount || null,
    special: product?.merchandise?.price?.amount || null
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCartItemQty = (product: LineItem): number => product?.quantity;

export const getCartItemAttributes = (product: LineItem) => {
  const formatAttedattributeList = formatSelectedAttributeList(product?.merchandise.selectedOptions);
  if (formatAttedattributeList.length) {
    const attribArr = [];
    formatAttedattributeList.forEach((attr) => {
      attribArr[attr.name] = attr.value;
    });
    return { ...attribArr };
  }
  return {};
};

export const getCartItemSku = (product: any): string => product?.merchandise.sku || '-';

export const getCartTotals = (cart: Cart | null): AgnosticTotals => {
  if (!cart) {
    return {
      total: 0,
      subtotal: 0,
      special: 0,
    };
  }

  return {
    total: parseFloat(cart.estimatedCost?.totalAmount?.amount || '0'),
    subtotal: parseFloat(cart.estimatedCost?.subtotalAmount?.amount || '0'),
    special: parseFloat(cart.estimatedCost?.subtotalAmount?.amount || '0'), // Change if "special" has a unique meaning
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCartShippingPrice = (cart: Cart): number => 0;

export const getCartSubTotal = (cart: Cart): { amount: number; currencyCode: string } => {
  return {
    amount: parseFloat(cart?.estimatedCost?.subtotalAmount?.amount || '0'),
    currencyCode: cart?.estimatedCost?.subtotalAmount?.currencyCode || 'USD',
  };
};

export const getcheckoutURL = (cart: Cart): string => cart.checkoutUrl || '';

export const getCartTotalItems = (cart: Cart): number => cart?.lines?.length > 0 ? cart.lines.reduce((n, { quantity }) => n + quantity, 0):0;

export const getCartTotalDiscount = (cart: Cart): number => {
  return cart?.discountCodes?.filter(code => code.applicable)?.length || 0;
};

export const getAppliedCoupons = (cart: Cart): string[] => {
  return cart?.discountCodes
    ?.filter(code => code.applicable)
    .map(code => code.code) || [];
};

export const getFormattedPrice = (price: number) => String(price);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCoupons = (cart: Cart): AgnosticCoupon[] => [];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getDiscounts = (cart: Cart): AgnosticDiscount[] => [];

const cartGetters: CartGetters<Cart, LineItem> = {
  getTotals: getCartTotals,
  getShippingPrice: getCartShippingPrice,
  getItems: getCartItems,
  getItemName: getCartItemName,
  getItemImage: getCartItemImage,
  getItemId: getCartItemId,
  getItemSlug: getCartItemSlug,
  getItemPrice: getCartItemPrice,
  getItemQty: getCartItemQty,
  getItemAttributes: getCartItemAttributes,
  getItemSku: getCartItemSku,
  getFormattedPrice,
  getTotalItems: getCartTotalItems,
  getTotalDiscount:getCartTotalDiscount,
  getcheckoutURL,
  getSubTotal: getCartSubTotal,
  getCoupon: getAppliedCoupons,
  getCoupons,
  getDiscounts
};

export default cartGetters;

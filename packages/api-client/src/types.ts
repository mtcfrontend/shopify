/* eslint-disable @typescript-eslint/ban-types */
type Maybe<T> = T | null;
type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;

  /** The `Long` scalar type represents non-fractional signed whole numeric values.
   * Long can represent values between -(2^63) and 2^63 - 1.
   */
  Long: any;

  /** DateTime is a scalar value that represents an ISO8601 formatted date and time. */
  DateTime: any;
  /**
   * A signed decimal number, which supports arbitrary precision and is serialized as a string.
   *
   * Example values: `"29.99"`, `"29.999"`.
   */
  Decimal: any;

  /** [ISO 3166-1](http://en.wikipedia.org/wiki/ISO_3166-1) country code. */
  Country: any;

  /** Locale is a scalar value represented as a string language tag. */
  Locale: any;

  /** DateTime is a scalar value that represents an ISO8601 formatted date. */
  Date: any;

  /** Raw JSON value */
  Json: any;

  /** Array */
  Array: any;

  /** Represents a currency. Currencies are identified by their [ISO
   * 4217](http://www.iso.org/iso/home/standards/currency_codes.htm) currency codes.
   */
  Currency: any;

  /** A key that references a resource. */
  KeyReferenceInput: any;

  /** Search filter. It is represented as a string and has th same format as in REST API: "field:filter_criteria" */
  SearchFilter: any;

  /** Search sort */
  SearchSort: any;

  /** YearMonth is a scalar value that represents an ISO8601 formatted year and month. */
  YearMonth: any;

  /** The `BigDecimal` scalar type represents signed fractional values with arbitrary precision. */
  BigDecimal: any;

  /** Time is a scalar value that represents an ISO8601 formatted time. */
  Time: any;
  URL: any;
};
export type Cart = {
  __typename?: 'Cart';
  id: Maybe<Scalars['String']>;
  checkoutUrl?: Maybe<Scalars['String']>;
  createdAt: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;

  appliedGiftCards: Maybe<Array<{
    id: string;
    amountUsed: {
      amount: string;
      currencyCode: string;
    };
    balance: {
      amount: string;
      currencyCode: string;
    };
  }>>;

  attributes: Maybe<Array<{
    key: string;
    value: string;
  }>>;

  discountCodes: Maybe<Array<{
    code: string;
    applicable: boolean;
  }>>;

  lines: Maybe<Array<{
    __typename?: 'CartLine';
    /** The unique identifier for the cart line item. */
    id: string;
    /** The quantity of the item in the cart. */
    quantity: number;
    /** Custom attributes associated with the cart line. */
    attributes?: Maybe<Array<{
      key: string;
      value: string;
    }>>;
    /** The merchandise details (product variant) for the cart line. */
    merchandise: {
      __typename?: 'ProductVariant';
      /** The unique identifier for the product variant. */
      id: string;
      /** The title of the product variant. */
      title: string;
      /** Indicates if the variant is available for sale. */
      availableForSale: boolean;
      /** Whether the variant requires shipping. */
      requiresShipping: boolean;
      /** The SKU (stock keeping unit) for the product variant. */
      sku?: Maybe<string>;
      /** The price of the variant. */
      price: {
        amount: string;
        currencyCode: string;
      };
      /** The compare-at price of the variant, if any. */
      compareAtPrice?: Maybe<{
        amount: string;
        currencyCode: string;
      }>;
      /** The unit price of the variant, if applicable. */
      unitPrice?: Maybe<{
        amount: string;
        currencyCode: string;
      }>;
      /** The product image. */
      image?: Maybe<{
        altText?: Maybe<string>;
        id?: string;
        src?: string;
        width?: Maybe<number>;
        height?: Maybe<number>;
      }>;
      /** The associated product details. */
      product: {
        handle: string;
        id: string;
      };
      /** The selected options for the variant, like size or color. */
      selectedOptions?: Maybe<Array<{
        name: string;
        value: string;
      }>>;
    };
  }>>;

  estimatedCost?: Maybe<{
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalTaxAmount?: Maybe<{
      amount: string;
      currencyCode: string;
    }>;
  }>;

  deliveryGroups?: Maybe<Array<{
    deliveryMethods: Array<{
      handle: string;
      title: string;
      price: {
        amount: string;
        currencyCode: string;
      };
    }>;
  }>>;

  shippingAddress?: Maybe<Scalars['Json']>;

  buyerIdentity?: Maybe<{
    email?: Maybe<Scalars['String']>;
    countryCode?: Maybe<Scalars['String']>;
  }>;

  userErrors?: Maybe<Array<{
    field?: Maybe<Array<Scalars['String']>>;
    message: string;
    code?: Maybe<string>;
  }>>;
};

export type CartItem = {
  __typename?: 'CartItem';
  id: Maybe<Scalars['String']>;
  quantity: number;
  attributes?: Maybe<Array<{
    key: string;
    value: string;
  }>>;
  merchandise?: Maybe<{
    id: string;
    title: string;
    sku?: string;
    availableForSale: boolean;
    price: {
      amount: string;
      currencyCode: string;
    };
    compareAtPrice?: {
      amount: string;
      currencyCode: string;
    };
    product: {
      id: string;
      handle: string;
    };
    selectedOptions?: Maybe<Array<{
      name: string;
      value: string;
    }>>;
    image?: Maybe<{
      altText?: string;
      src: string;
      width?: number;
      height?: number;
    }>;
  }>;
};
export type Wishlist = {}
/** A monetary value with currency. */
export type MoneyV2 = {
  __typename?: 'MoneyV2';
  /** Decimal money amount. */
  amount: string;
  /** Currency of the money. */
  currencyCode: string;
};
export type Image = {
  __typename?: 'Image';
  id?: Maybe<string>;
  src?:  Maybe<Scalars['URL']>;
  altText?: Maybe<Scalars['String']>;
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
};
export type ProductVariant = {
  __typename?: 'ProductVariant';
  id: string;
  title: string;
  availableForSale: boolean;
  requiresShipping: boolean;
  sku?: Maybe<string>;
  price: MoneyV2;
  compareAtPrice?: Maybe<MoneyV2>;
  unitPrice?: Maybe<MoneyV2>;
  image?: Maybe<Image>;
  product: {
    id: string;
    handle: string;
  };
  selectedOptions?: Maybe<Array<{
    name: string;
    value: string;
  }>>;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  items: Category[];
}
export type CategoryFilter = {}
export type ShippingMethod = {}
export type LineItem = {
  __typename?: 'CartLine';
  id: string;
  quantity: number;
  attributes?: Maybe<Array<{
    key: string;
    value: string;
  }>>;
  merchandise: ProductVariant;
};

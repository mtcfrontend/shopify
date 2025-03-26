import { QueryRootPageArgs, QueryRootBlogsArgs, QueryRootBlogArgs } from "@mtcmedia/shopify-apollo/src/shopify";
import { GetArticlesParams } from "@mtcmedia/shopify-apollo/src/types/GetArticlesParams";
import { ContentType } from "./ContentType";

export interface BaseUseContentParams {
  contentType: ContentType
}

export type UseContentParams = BaseUseContentParams & (QueryRootBlogArgs | QueryRootBlogsArgs | QueryRootPageArgs | GetArticlesParams)
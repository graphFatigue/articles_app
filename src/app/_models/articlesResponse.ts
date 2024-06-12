import { Article } from "./article"

export interface ArticleResponse {
  count: number
  next: string
  previous: string
  results: Article[]
}

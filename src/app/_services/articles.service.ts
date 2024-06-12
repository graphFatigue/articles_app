import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ArticleResponse } from '../_models/articlesResponse';
import { concat } from 'rxjs/internal/operators/concat';
import { concatWith } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllArticles() {
    return this.http.get<ArticleResponse>(this.baseUrl + 'articles/?limit=100');
  }

  getAllArticlesWithFilterTitle(filter: string) {
    return this.http.get<ArticleResponse>(this.baseUrl +  'articles/?limit=100&&title_contains_one=' + filter);
  }

  getAllArticlesWithFilterSummary(filter: string) {
    return this.http.get<ArticleResponse>(this.baseUrl +  'articles/?limit=100&&summary_contains_one=' + filter);
  }
}

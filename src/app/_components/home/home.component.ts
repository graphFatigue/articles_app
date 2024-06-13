import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ArticleResponse } from 'src/app/_models/articlesResponse';
import { ArticlesService } from 'src/app/_services/articles.service';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  articles$?: Observable<ArticleResponse>;
  @ViewChildren('refEl') cards!: QueryList<CardComponent>;
  showResultsCount = false;

  constructor(private articlesService: ArticlesService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles() {
    this.articles$ = this.articlesService.getAllArticles();
  }

  filterArticles(event: any) {
    const filter: string = String(event.target.value).trim().split(/\s+/).join(',');
    this.showResultsCount = !!filter;
    if (!filter) {
      this.loadArticles();
      return;
    }
    const articlesByTitleAll$ = this.articlesService.getAllArticlesWithFilterTitleAll(filter);
    const articlesByTitle$ = this.articlesService.getAllArticlesWithFilterTitle(filter);
    const articlesBySummary$ = this.articlesService.getAllArticlesWithFilterSummary(filter);
    this.articles$ = combineLatest([articlesByTitle$, articlesBySummary$, articlesByTitleAll$]).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(([title, summary, titleAll]) => {
        const combinedResults = titleAll.results.concat(title.results.concat(summary.results));
        return of({
          ...title,
          results: this.uniqueArray(combinedResults, 'id')
        });
      })
    );
    this.formatTextTimeout(String(event.target.value).trim());
  }

  private uniqueArray(target: Array<any>, property: any): Array<any> {
    return target.filter(
      (item, index) =>
        index === target.findIndex((t) => t[property] === item[property])
    );
  }

  formatTextTimeout(value: string) {
    const values = value.split(/\s+/).filter(x => x);
    setTimeout(() => {
      this.formatText(values);
    }, 1000);
  }

  formatText(values: string[]) {
    const cardsArray: CardComponent[] = this.cards.toArray();
    cardsArray.forEach((result) => {
      const titleMatches = values.some(val => result.article.title.toLowerCase().includes(val.toLowerCase()));
      const summaryMatches = values.some(val => result.article.summary.toLowerCase().includes(val.toLowerCase()));

      if (titleMatches) {
        result.formatTitle(values);
      }
      if (summaryMatches) {
        result.formatSummary(values);
      }
    });
  }
}

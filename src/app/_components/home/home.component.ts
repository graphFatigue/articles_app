import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
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

  constructor(private articlesService: ArticlesService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles() {
    this.articles$ = this.articlesService.getAllArticles();
  }

  filterArticles(event: any) {
    var filter: string = String(event.target.value).split(' ').join(',');
    var articlesByTitle$ =
      this.articlesService.getAllArticlesWithFilterTitle(filter);
    var articlesBySummary$ =
      this.articlesService.getAllArticlesWithFilterSummary(filter);
      this.articles$ = combineLatest([articlesByTitle$, articlesBySummary$]).pipe(
        map(([title, summary]) => {
          const combinedResults = title.results.concat(summary.results);
          return {
            ...title,
            results: this.uniqueArray(combinedResults, 'id')
          };
        })
      );
    this.formatTextTimeout(String(event.target.value));
  }

  private uniqueArray(target: Array<any>, property: any): Array<any> {
    return target.filter(
      (item, index) =>
        index === target.findIndex((t) => t[property] === item[property])
    );
  }

  formatTextTimeout(value: string) {
    var values = value.split(' ');
    setTimeout(() => {
      this.formatText(values);
    }, 1000);
  }

  formatText(values: string[]) {
    var cardsArray: CardComponent[] = this.cards.toArray();
    values.forEach((val) => {
      cardsArray.forEach((result) => {
        if (result.article.summary.toLowerCase().includes(val)) {
          result.formatSummary(val);
        }
        if (result.article.title.toLowerCase().includes(val)) {
          result.formatTitle(val);
        }
      });
    });
  }
}

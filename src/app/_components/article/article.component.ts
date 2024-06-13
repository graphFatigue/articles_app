import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Article } from 'src/app/_models/article';
import { ArticlesService } from 'src/app/_services/articles.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent {
  article$?: Observable<Article>;

  constructor(
    private articlesService: ArticlesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadArticle();
  }

  loadArticle() {
    var id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.article$ = this.articlesService.getArticle(id);
  }
}

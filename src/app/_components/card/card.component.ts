import { Component, Input, Renderer2, ViewChild } from '@angular/core';
import { Article } from 'src/app/_models/article';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() article!: Article;
  @ViewChild('refEl1', { static: true }) refEl1: any;
  @ViewChild('refEl2', { static: true }) refEl2: any;

  constructor(private renderer: Renderer2) {}

  limitSummary(article: Article | undefined) {
    if (article) {
      return article.summary.substring(0, 100);
    } else {
      return 'ERROR';
    }
  }

  formatTitle(val: string) {
    if (this.refEl2)
      this.renderer.setProperty(
        this.refEl2.nativeElement,
        'innerHTML',
        (this.article.title = this.getFormattedText(val, this.article.title))
      );
  }

  formatSummary(val: string) {
    if (this.refEl1)
      this.renderer.setProperty(
        this.refEl1.nativeElement,
        'innerHTML',
        (this.article.summary = this.getFormattedText(
          val,
          this.article.summary
        ))
      );
  }

  getFormattedText(value: string, text: string) {
    const valuestring = value.trim().split(' ');
    const re = new RegExp(`(${valuestring.join('|')})`, 'gi');
    return text.replace(
      re,
      `<span style="background-color:yellow" class="selected">$1</span>`
    );
  }

  convertToLocalDate(responseDate: any): string | null {
    try {
      if (responseDate != null) {
        const dt = new Date(responseDate);
        dt.setHours(dt.getHours() + 2);
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
          dt
        );

        return formattedDate;
      } else {
        return null;
      }
    } catch (error) {
      return responseDate;
    }
  }
}

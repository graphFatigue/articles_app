import { createReducer, on } from '@ngrx/store';
import { articleId } from './article.state';
import { closeArticle, openArticle } from './article.actions';

const _articleReducer = createReducer(
  articleId,
  on(openArticle, (state, action) => {
    return {
      ...state,
      id: action.id,
    };
  }),
  on(closeArticle, (state) => {
    return {
      ...state,
      id: 0,
    };
  })
);

export function articleReducer(state: any, action: any) {
  return _articleReducer(state, action);
}

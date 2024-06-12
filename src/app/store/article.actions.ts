import { createAction, props } from '@ngrx/store';

export const openArticle = createAction('openArticle', props<{ id: number }>());
export const closeArticle = createAction('closeArticle');

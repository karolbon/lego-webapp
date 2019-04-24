// @flow

import { createSelector } from 'reselect';
import { Article } from '../actions/ActionTypes';
import { mutateComments } from 'app/reducers/comments';
import createEntityReducer from 'app/utils/createEntityReducer';
import joinReducers from 'app/utils/joinReducers';
import { orderBy } from 'lodash';
import { pull } from 'lodash';
import produce from 'immer';

export type ArticleEntity = {
  id: number,
  title: string,
  commentTarget: string,
  description: string,
  author: Object,
  cover: string,
  createdAt: string,
  content: string,
  startTime: string,
  text: string,
  tags: Array<string>,
  actionGrant: Object,
  comments: Array<number>,
  youtubeUrl: string
};

type State = any;

const mutateArticle = produce(
  (newState: State, action: any): void => {
    switch (action.type) {
      case Article.DELETE.SUCCESS:
        pull(newState.items, action.meta.articleId);
        break;
    }
  }
);

const mutate = joinReducers(mutateComments('articles'), mutateArticle);

export default createEntityReducer({
  key: 'articles',
  types: {
    fetch: Article.FETCH,
    mutate: Article.CREATE
  },
  mutate
});

function transformArticle(article) {
  return {
    ...article
  };
}

export const selectArticles = createSelector(
  state => state.articles.byId,
  state => state.articles.items,
  (articlesById, articleIds) =>
    orderBy(
      articleIds.map(id => transformArticle(articlesById[id])),
      ['createdAt', 'id'],
      ['desc', 'desc']
    )
);

export const selectArticlesByTag = createSelector(
  selectArticles,
  (state, props) => props.tag,
  (articles, tag) =>
    articles.filter(article => (tag ? article.tags.indexOf(tag) !== -1 : true))
);

export const selectArticleById = createSelector(
  state => state.articles.byId,
  (state, props) => props.articleId,
  (articlesById, articleId) => transformArticle(articlesById[articleId])
);

export const selectCommentsForArticle = createSelector(
  selectArticleById,
  state => state.comments.byId,
  (article, commentsById) => {
    if (!article) return [];
    return (article.comments || []).map(commentId => commentsById[commentId]);
  }
);

// @flow

import { Quote } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';
import { mutateComments } from 'app/reducers/comments';
import joinReducers from 'app/utils/joinReducers';
import type { ID } from 'app/models';
import produce from 'immer';

export type QuoteEntity = {
  id: ID,
  text: string,
  source: string,
  approved: boolean,
  comments: Object,
  commentCount: string,
  commentTarget: string,
  createdAt?: string
};

type State = any;

const mutateQuote = produce(
  (newState: State, action: any): void => {
    switch (action.type) {
      case Quote.DELETE.SUCCESS:
        newState.items = newState.items.filter(
          id => id !== action.meta.quoteId
        );
        break;

      case Quote.UNAPPROVE.SUCCESS:
        newState.byId[action.meta.quoteId].approved = false;
        break;

      case Quote.APPROVE.SUCCESS:
        newState.byId[action.meta.quoteId].approved = true;
        break;
    }
  }
);

const mutate = joinReducers(mutateComments('quotes'), mutateQuote);

export default createEntityReducer({
  key: 'quotes',
  types: {
    fetch: Quote.FETCH,
    mutate: Quote.ADD
  },
  mutate
});

const compareByDate = (a, b) => {
  const date1 = new Date(a.createdAt);
  const date2 = new Date(b.createdAt);
  return date2.getTime() - date1.getTime();
};

export const selectQuotes = createSelector(
  state => state.quotes.byId,
  state => state.quotes.items,
  (quotesById, ids) => {
    if (!quotesById || !ids) return [];
    return ids.map(quoteId => quotesById[quoteId]);
  }
);

export const selectQuoteById = createSelector(
  selectQuotes,
  (state, quoteId) => quoteId,
  (quotes, quoteId) => {
    if (!quotes || !quoteId) return {};
    return quotes.find(quote => Number(quote.id) === Number(quoteId));
  }
);

export const selectSortedQuotes = createSelector(
  selectQuotes,
  (state, props) => ({ filter: props.filter }),
  (quotes, query) => {
    return quotes
      .filter(
        quote =>
          typeof quote !== 'undefined' &&
          quote.approved === (query.filter !== 'unapproved')
      )
      .sort(compareByDate);
  }
);

export const selectCommentsForQuotes = createSelector(
  selectQuotes,
  state => state.comments.byId,
  (quotesById, commentsById) => {
    if (!quotesById || !commentsById) return {};
    const comments = {};
    quotesById.map(quote => {
      if (!quote.comments) return;
      comments[quote.id] = quote.comments.map(
        commentId => commentsById[commentId]
      );
    });
    return comments;
  }
);

export const selectCommentsForQuote = createSelector(
  selectCommentsForQuotes,
  (state, props) => props.quoteId,
  (comments, quoteId) => {
    if (!comments || !quoteId) return {};
    return { [quoteId]: comments[quoteId] };
  }
);

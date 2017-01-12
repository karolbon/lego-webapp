import { arrayOf } from 'normalizr';
import { Page } from './ActionTypes';
import { pageSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';

export function fetchPage(pageSlug) {
  return callAPI({
    types: Page.FETCH,
    endpoint: `/pages/${pageSlug}/`,
    schema: pageSchema,
    meta: {
      errorMessage: 'Fetching page failed'
    }
  });
}

export function fetchAll() {
  return callAPI({
    types: Page.FETCH,
    endpoint: '/pages/',
    schema: arrayOf(pageSchema),
    meta: {
      errorMessage: 'Fetching pages failed'
    }
  });
}

// @flow

import { Joblistings } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';
import { pull } from 'lodash';
import produce from 'immer';

type State = any;

export default createEntityReducer({
  key: 'joblistings',
  types: {
    fetch: Joblistings.FETCH,
    mutate: Joblistings.CREATE
  },
  mutate: produce(
    (newState: State, action: any): void => {
      switch (action.type) {
        case Joblistings.DELETE.SUCCESS:
          pull(newState.items, action.meta.id);
          break;
      }
    }
  )
});

export const selectJoblistings = createSelector(
  state => state.joblistings.byId,
  state => state.joblistings.items,
  (joblistingsById, joblistingIds) =>
    joblistingIds.map(id => joblistingsById[id])
);

export const selectJoblistingById = createSelector(
  state => state.joblistings.byId,
  (state, props) => props.joblistingId,
  (joblistingsById, joblistingId) => joblistingsById[joblistingId]
);

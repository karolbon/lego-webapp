// @flow
import { createSelector } from 'reselect';
import { Penalty } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import produce from 'immer';

type State = any;

export default createEntityReducer({
  key: 'penalties',
  types: {
    fetch: Penalty.FETCH,
    mutate: Penalty.CREATE
  },
  mutate: produce(
    (newState: State, action: any): void => {
      switch (action.type) {
        case Penalty.DELETE.SUCCESS:
          newState.items = newState.items.filter(
            id => action.meta.penaltyId !== id
          );
      }
    }
  )
});

export const selectPenalties = createSelector(
  state => state.penalties.byId,
  state => state.penalties.items,
  (penaltiesById, penaltyIds) => penaltyIds.map(id => penaltiesById[id])
);

export const selectPenaltyByUserId = createSelector(
  selectPenalties,
  (state, props) => props.userId,
  (penaltiesById, userId) =>
    penaltiesById.filter(penalty => penalty.user === userId)
);

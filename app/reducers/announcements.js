// @flow

import { createSelector } from 'reselect';
import { Announcements } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import moment from 'moment-timezone';
import { pull } from 'lodash';
import produce from 'immer';

type State = any;

export default createEntityReducer({
  key: 'announcements',
  types: {
    fetch: Announcements.FETCH_ALL,
    mutate: Announcements.CREATE
  },
  mutate: produce(
    (newState: State, action: any): void => {
      switch (action.type) {
        case Announcements.SEND.SUCCESS:
          newState.byId[action.meta.announcementId].sent = moment();
          break;
        case Announcements.DELETE.SUCCESS:
          pull(newState.items, action.meta.announcementId);
          break;
      }
    }
  )
});

export const selectAnnouncements = createSelector(
  state => state.announcements.byId,
  state => state.announcements.items,
  (announcementsById, announcementIds) =>
    announcementIds.map(id => announcementsById[id])
);

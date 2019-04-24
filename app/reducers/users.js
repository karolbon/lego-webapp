// @flow

import { union, find } from 'lodash';
import { createSelector } from 'reselect';
import { User, Event } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { normalize } from 'normalizr';
import { eventSchema, registrationSchema } from 'app/reducers';
import mergeObjects from 'app/utils/mergeObjects';
import produce from 'immer';

export type UserEntity = {
  id: number,
  username: string,
  fullName: string,
  firstName: string,
  lastName: string,
  gender: string,
  profilePicture: string,
  emailListsEnabled?: boolean
};

type State = any;

export default createEntityReducer({
  key: 'users',
  types: {
    fetch: User.FETCH
  },
  mutate: produce(
    (newState: State, action: any): void => {
      switch (action.type) {
        case Event.SOCKET_EVENT_UPDATED: {
          const users =
            normalize(action.payload, eventSchema).entities.users || {};
          newState.byId = mergeObjects(newState.byId, users);
          newState.items = union(newState.items, Object.keys(users));
          break;
        }

        case Event.SOCKET_REGISTRATION.SUCCESS:
        case Event.ADMIN_REGISTER.SUCCESS: {
          const users = normalize(action.payload, registrationSchema).entities
            .users;
          newState.byId = mergeObjects(newState.byId, users);
          newState.items.push(action.payload.id);
          break;
        }

        case User.CONFIRM_STUDENT_USER.SUCCESS: {
          newState.byId = mergeObjects(newState.byId, action.payload);
          break;
        }
      }
    }
  )
});

export const selectUserById = createSelector(
  state => state.users.byId,
  (state, props) => props.userId,
  (usersById, userId) => usersById[userId] || {}
);

export const selectUserByUsername = createSelector(
  state => state.users.byId,
  (state, props) => props.username,
  (usersById, username) => find(usersById, ['username', username])
);

export const selectUserWithGroups = createSelector(
  selectUserByUsername,
  state => state.groups.byId,
  (user, groupsById) => {
    if (!user) return;
    return {
      ...user,
      abakusGroups: user.abakusGroups
        ? user.abakusGroups.map(groupId => groupsById[groupId])
        : []
    };
  }
);

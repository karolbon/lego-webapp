// @flow
import { createSelector } from 'reselect';

import { OAuth2 } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import produce from 'immer';

export type OAuth2ApplicationEntity = {
  id: number,
  name: string,
  description: string,
  redirectUris: string,
  clientId: string,
  clientSecret: string
};

export type OAuth2GrantEntity = {
  application: {
    id: number,
    name: string,
    description: string
  },
  token: string,
  expires: string,
  scopes: Object
};

type State = any;

export const oauth2Applications = createEntityReducer({
  key: 'oauth2Application',
  types: {
    fetch: OAuth2.FETCH_APPLICATIONS
  }
});

export const oauth2Grants = createEntityReducer({
  key: 'oauth2Grant',
  types: {
    fetch: OAuth2.FETCH_GRANTS
  },
  mutate: produce(
    (newState: State, action: any): void => {
      switch (action.type) {
        case OAuth2.DELETE_GRANT.SUCCESS:
          newState.items = newState.items.filter(
            grant => Number(grant) !== Number(action.meta.grantId)
          );
      }
    }
  )
});

export const selectOAuth2Applications = createSelector(
  state => state.oauth2Applications.byId,
  state => state.oauth2Applications.items,
  (oauth2ApplicationsById, oauth2ApplicationIds) =>
    oauth2ApplicationIds.map(id => oauth2ApplicationsById[id])
);

export const selectOAuth2ApplicationById = createSelector(
  state => state.oauth2Applications.byId,
  (state, props) => props.applicationId,
  (applicationsById, applicationId) => {
    const application = applicationsById[applicationId];
    return application || {};
  }
);

export const selectOAuth2Grants = createSelector(
  state => state.oauth2Grants.byId,
  state => state.oauth2Grants.items,
  (oauth2GrantsById, oauth2GrantIds) =>
    oauth2GrantIds.map(id => oauth2GrantsById[id])
);

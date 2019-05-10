// Hack because we have circular dependencies
// (companies -> events -> index -> frontpage -> events)
// This import resolves dependencies properly..
import 'app/reducers';

import events from '../events';
import { Event } from '../../actions/ActionTypes';

describe('reducers', () => {
  describe('previous and upcoming events', () => {
    it('Event.FETCH_PREVIOUS.SUCCESS', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt'
          }
        }
      };
      const action = {
        type: Event.FETCH_PREVIOUS.SUCCESS,
        meta: {},
        payload: {
          entities: {
            events: {
              2: {
                id: 2,
                name: 'test'
              }
            }
          },
          result: [2]
        }
      };
      expect(events(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [1, 2],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt'
          },
          2: {
            id: 2,
            name: 'test',
            isUsersUpcoming: false
          }
        }
      });
    });

    it('Event.FETCH_UPCOMING.SUCCESS', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt'
          }
        }
      };
      const action = {
        type: Event.FETCH_UPCOMING.SUCCESS,
        meta: {},
        payload: {
          entities: {
            events: {
              2: {
                id: 2,
                name: 'test'
              }
            }
          },
          result: [2]
        }
      };
      expect(events(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [1, 2],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt'
          },
          2: {
            id: 2,
            name: 'test',
            isUsersUpcoming: true
          }
        }
      });
    });
  });

  describe('event reducer', () => {
    it('Event.SOCKET_EVENT_UPDATED', () => {});
    it('Event.CLEAR', () => {});
  });
  describe('event registrations', () => {
    it('Event.REQUEST_REGISTER.BEGIN', () => {});
    it('Event.SOCKET_REGISTRATION.SUCCESS', () => {});
    it('Event.SOCKET_REGISTRATION.FAILURE', () => {});
    it('Event.SOCKET_UNREGISTRATION.SUCCESS', () => {});
    it('Event.REQUEST_REGISTER.FAILURE', () => {});
  });
  describe('event following', () => {
    it('Event.FOLLOW.SUCCESS', () => {});
    it('Event.UNFOLLOW.SUCCESS', () => {});
    it('Event.IS_USER_FOLLOWING.SUCCESS', () => {});
  });
});

// @flow

import { createSelector } from 'reselect';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Podcast } from '../actions/ActionTypes';
import { without } from 'lodash';
import produce from 'immer';

export type PodcastEntity = {
  id: number,
  createdAt: string,
  source: string,
  title: string,
  discription: string
};

type State = any;

const deletePodcast = produce(
  (newState: State, action: any): void => {
    switch (action.type) {
      case Podcast.DELETE.SUCCESS:
        newState.items = without(newState.items, action.meta.podcastId);
    }
  }
);

export default createEntityReducer({
  key: 'podcasts',
  types: {
    fetch: Podcast.FETCH,
    mutate: Podcast.CREATE
  },
  mutate: deletePodcast
});

export const selectPodcasts = createSelector(
  state => state.podcasts.byId,
  state => state.podcasts.items,
  (podcastsById, podcastIds) => {
    return podcastIds.map(id => podcastsById[id]);
  }
);

export const selectPodcastById = createSelector(
  selectPodcasts,
  (state, podcastId) => podcastId,
  (podcasts, podcastId) => {
    if (!podcasts || !podcastId) return {};
    return podcasts.find(podcast => Number(podcast.id) === Number(podcastId));
  }
);

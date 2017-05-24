// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  Attributes,
  ReceiveAttributesAction,
  Lease,
  LeasesList,
  ReceiveLeasesAction,
  ReceiveSingleLeaseAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  // 'mvj/leases/FETCH_IDENTIFIERS': () => true,
  // 'mvj/leases/RECEIVE_ATTRIBUTES': () => false,
  'mvj/leases/FETCH_ALL': () => true,
  'mvj/leases/RECEIVE_ALL': () => false,
  'mvj/leases/FETCH_SINGLE': () => true,
  'mvj/leases/RECEIVE_SINGLE': () => false,
  'mvj/leases/NOT_FOUND': () => false,
  'mvj/leases/CREATE': () => true,
  'mvj/leases/EDIT': () => true,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/leases/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, {});

const leasesListReducer: Reducer<LeasesList> = handleActions({
  ['mvj/leases/RECEIVE_ALL']: (state: LeasesList, {payload: leases}: ReceiveLeasesAction) => {
    return leases;
  },
}, []);

const currentLeaseReducer: Reducer<Lease> = handleActions({
  ['mvj/leases/RECEIVE_SINGLE']: (state: Lease, {payload: lease}: ReceiveSingleLeaseAction) => {
    return lease;
  },
}, {});

export default combineReducers({
  attributes: attributesReducer,
  current: currentLeaseReducer,
  list: leasesListReducer,
  isFetching: isFetchingReducer,
});
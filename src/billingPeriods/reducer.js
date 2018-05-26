// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {BillingPeriodListMap, ReceiveBillingPeriodsAction} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/billingperiods/FETCH_ALL': () => true,
  'mvj/billingperiods/NOT_FOUND': () => false,
  'mvj/billingperiods/RECEIVE_ALL': () => false,
}, false);

const byLeaseReducer: Reducer<BillingPeriodListMap> = handleActions({
  ['mvj/billingperiods/RECEIVE_ALL']: (state: BillingPeriodListMap, {payload}: ReceiveBillingPeriodsAction) => {
    return {
      ...state,
      [payload.leaseId]: payload.billingPeriods,
    };
  },
}, {});

export default combineReducers({
  byLease: byLeaseReducer,
  isFetching: isFetchingReducer,
});

// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {CreateRelatedLeasePayload, LeaseId, Lease} from './types';

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('lease/'), {method: 'OPTIONS'}));
};

export const fetchLeases = (search: string): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease/${search || ''}`)));
};

export const fetchSingleLease = (id: LeaseId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease/${id}/`)));
};

export const createLease = (lease: Lease): Generator<any, any, any> => {
  const body = JSON.stringify(lease);

  return callApi(new Request(createUrl(`lease/`), {
    method: 'POST',
    body,
  }));
};

export const patchLease = (lease: Lease): Generator<any, any, any> => {
  const {id} = lease;
  const body = JSON.stringify(lease);

  return callApi(new Request(createUrl(`lease/${id}/`), {
    method: 'PATCH',
    body,
  }));
};

export const createRelatedLease = (payload: CreateRelatedLeasePayload): Generator<any, any, any> => {
  const body = JSON.stringify(payload);

  return callApi(new Request(createUrl(`related_lease/`), {
    method: 'POST',
    body,
  }));
};

export const deleteReleatedLease = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`related_lease/${id}/`), {
    method: 'DELETE',
  }));
};

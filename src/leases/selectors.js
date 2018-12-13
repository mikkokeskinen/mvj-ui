// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import type {RootState} from '$src/root/types';
import type {Attributes, Selector} from '$src/types';
import type {
  LeaseId,
  Lease,
  LeaseList,
  LeaseState,
} from './types';

export const getIsArchiveAreaModalOpen: Selector<boolean, void> = (state: RootState): boolean =>
  state.lease.isArchiveAreaModalOpen;

export const getIsEditMode: Selector<boolean, void> = (state: RootState): boolean =>
  state.lease.isEditMode;

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.lease.isFetching;

export const getIsSaving: Selector<boolean, void> = (state: RootState): boolean =>
  state.lease.isSaving;

export const getIsFetchingAllLeases: Selector<Array<boolean>, void> = (state: RootState): Array<boolean> =>
  state.lease.isFetchingById;

export const getIsFetchingById: Selector<boolean, LeaseId> = (state: RootState, id: LeaseId): boolean =>
  state.lease.isFetchingById[id];

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.lease.isFetchingAttributes;

export const getIsFormValidById: Selector<boolean, string> = (state: RootState, id: string): boolean =>
  state.lease.isFormValidById[id];

export const getIsFormValidFlags: Selector<Object, void> = (state: RootState): Object =>
  state.lease.isFormValidById;

export const getIsSaveClicked: Selector<boolean, void> = (state: RootState): boolean =>
  state.lease.isSaveClicked;

export const getIsUnarchiveAreaModalOpen: Selector<boolean, void> = (state: RootState): boolean =>
  state.lease.isUnarchiveAreaModalOpen;

export const getAttributes: Selector<Attributes, void> = (state: RootState): LeaseState =>
  state.lease.attributes;

export const getLeasesList: Selector<LeaseList, void> = (state: RootState): LeaseList =>
  state.lease.list;

export const getCurrentLease: Selector<Lease, void> = (state: RootState): Lease =>
  state.lease.current;

export const getAllLeases: Selector<Array<Lease>, void> = (state: RootState): Array<Lease> =>
  state.lease.byId;

export const getLeaseById: Selector<Lease, LeaseId> = (state: RootState, id: LeaseId): Lease =>
  state.lease.byId[id];

export const getErrorsByFormName: Selector<?Object, string> = (state: Object, formName: string): ?Object => {
  const form = state.form[formName];
  if(!isEmpty(form)) {
    return form.syncErrors;
  }
  return null;
};

export const getCollapseStateByKey: Selector<?Object, string> = (state: RootState, key: string): ?Object => {
  return get(state.lease.collapseStates, key);
};

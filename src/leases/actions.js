// @flow

import {createAction} from 'redux-actions';

import type {
  Attributes,
  FetchAttributesAction,
  ReceiveAttributesAction,
  Lease,
  LeaseId,
  LeaseNotFoundAction,
  LeaseNotFoundByIdAction,
  LeaseList,
  CreateLeaseAction,
  PatchLeaseAction,
  ArchiveLeaseAreaAction,
  UnarchiveLeaseAreaAction,
  FetchLeasesAction,
  FetchSingleLeaseAction,
  FetchSingleLeaseWithoutLoaderAction,
  ReceiveLeasesAction,
  ReceiveSingleLeaseAction,
  FetchLeaseByIdAction,
  ReceiveLeaseByIdAction,
  StartInvoicingAction,
  StopInvoicingAction,
  HideEditModeAction,
  ShowEditModeAction,
  CreateRelatedLeasePayload,
  CreateRelatedLeaseAction,
  DeleteRelatedLeasePayload,
  DeleteRelatedLeaseAction,
  CopyAreasToContractAction,
  ReceiveFormValidFlagsAction,
  ClearFormValidFlagsAction,
  ReceiveIsSaveClickedAction,
  ReceiveCollapseStatesAction,
  CreateChargePayload,
  CreateChargeAction,
  HideArchiveAreaModalAction,
  ShowArchiveAreaModalAction,
  HideUnarchiveAreaModalAction,
  ShowUnarchiveAreaModalAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/leases/FETCH_ATTRIBUTES')();

export const receiveAttributes = (identifiers: Attributes): ReceiveAttributesAction =>
  createAction('mvj/leases/RECEIVE_ATTRIBUTES')(identifiers);

export const fetchLeases = (search: string): FetchLeasesAction =>
  createAction('mvj/leases/FETCH_ALL')(search);

export const receiveLeases = (leases: LeaseList): ReceiveLeasesAction =>
  createAction('mvj/leases/RECEIVE_ALL')(leases);

export const fetchSingleLease = (id: LeaseId): FetchSingleLeaseAction =>
  createAction('mvj/leases/FETCH_SINGLE')(id);

export const fetchSingleLeaseWithoutLoader = (id: LeaseId): FetchSingleLeaseWithoutLoaderAction =>
  createAction('mvj/leases/FETCH_SINGLE_WITHOUT_LOADER')(id);

export const receiveSingleLease = (lease: Lease): ReceiveSingleLeaseAction =>
  createAction('mvj/leases/RECEIVE_SINGLE')(lease);

export const fetchLeaseById = (id: LeaseId): FetchLeaseByIdAction =>
  createAction('mvj/leases/FETCH_BY_ID')(id);

export const receiveLeaseById = (lease: Lease): ReceiveLeaseByIdAction =>
  createAction('mvj/leases/RECEIVE_BY_ID')(lease);

export const createLease = (lease: Lease): CreateLeaseAction =>
  createAction('mvj/leases/CREATE')(lease);

export const patchLease = (lease: Lease): PatchLeaseAction =>
  createAction('mvj/leases/PATCH')(lease);

export const archiveLeaseArea = (lease: Lease): ArchiveLeaseAreaAction =>
  createAction('mvj/leases/ARCHIVE_AREA')(lease);

export const unarchiveLeaseArea = (lease: Lease): UnarchiveLeaseAreaAction =>
  createAction('mvj/leases/UNARCHIVE_AREA')(lease);

export const startInvoicing = (id: LeaseId): StartInvoicingAction =>
  createAction('mvj/leases/START_INVOICING')(id);

export const stopInvoicing = (id: LeaseId): StopInvoicingAction =>
  createAction('mvj/leases/STOP_INVOICING')(id);

export const notFound = (): LeaseNotFoundAction =>
  createAction('mvj/leases/NOT_FOUND')();

export const notFoundById = (id: LeaseId): LeaseNotFoundByIdAction =>
  createAction('mvj/leases/NOT_FOUND_BY_ID')(id);

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/leases/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/leases/SHOW_EDIT')();

export const createReleatedLease = (payload: CreateRelatedLeasePayload): CreateRelatedLeaseAction =>
  createAction('mvj/leases/CREATE_RELATED_LEASE')(payload);

export const deleteReleatedLease = (payload: DeleteRelatedLeasePayload): DeleteRelatedLeaseAction =>
  createAction('mvj/leases/DELETE_RELATED_LEASE')(payload);

export const copyAreasToContract = (leaseId: LeaseId): CopyAreasToContractAction =>
  createAction('mvj/leases/COPY_AREAS_TO_CONTRACT')(leaseId);

export const receiveFormValidFlags = (valid: Object): ReceiveFormValidFlagsAction =>
  createAction('mvj/leases/RECEIVE_FORM_VALID_FLAGS')(valid);

export const clearFormValidFlags = (): ClearFormValidFlagsAction =>
  createAction('mvj/leases/CLEAR_FORM_VALID_FLAGS')();

export const receiveIsSaveClicked = (isClicked: boolean): ReceiveIsSaveClickedAction =>
  createAction('mvj/leases/RECEIVE_SAVE_CLICKED')(isClicked);

export const receiveCollapseStates = (status: Object): ReceiveCollapseStatesAction =>
  createAction('mvj/leases/RECEIVE_COLLAPSE_STATES')(status);

export const createCharge = (payload: CreateChargePayload): CreateChargeAction =>
  createAction('mvj/leases/CREATE_CHARGE')(payload);

export const hideArchiveAreaModal = (): HideArchiveAreaModalAction =>
  createAction('mvj/leases/HIDE_ARCHIVE_AREA_MODAL')();

export const showArchiveAreaModal = (): ShowArchiveAreaModalAction =>
  createAction('mvj/leases/SHOW_ARCHIVE_AREA_MODAL')();

export const hideUnarchiveAreaModal = (): HideUnarchiveAreaModalAction =>
  createAction('mvj/leases/HIDE_UNARCHIVE_AREA_MODAL')();

export const showUnarchiveAreaModal = (): ShowUnarchiveAreaModalAction =>
  createAction('mvj/leases/SHOW_UNARCHIVE_AREA_MODAL')();

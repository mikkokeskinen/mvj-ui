import type {Property} from './types';
import {removeSessionStorageItem} from '$util/storage';
import {FormNames} from '$src/enums';
import {
  getApiResponseResults, 
} from '$util/helpers';

/** 
 * Get property basic information content
 * @param {Object} property
 * @return {Object}
 */
export const getContentBasicInformation = (property: Property): Object => {
  return {
    id: property.id,
    search_name: property.search_name,
    preparer: property.preparer,
    applications: property.applications,
    type: property.type,
    step: property.step,
    subtype: property.subtype,
    start_date: property.start_date,
    start_time: property.start_time,
    end_date: property.end_date,
    end_time: property.end_time,
    last_update: property.last_update,
    property_sites: getContentSearchProperties(property.property_sites),
    decisions: property.decisions,
  };
};

/** 
 * Get property application content
 * @param {Object} property
 * @return {Object}
 */
export const getContentApplication = (property: Property): Object => {
  return {
    default: property.application_base.default,
    extra: property.application_base.extra,
    previous: property.application_base.previous,
    created: property.application_base.created,
    applicants: property.application_base.applicants,
    targets: property.application_base.targets,
  };
};

/** 
 * Get search properties
 * @param {Object} searchProperties
 * @return {Object}
 */
export const getContentSearchProperties = (searchProperties: Object): Object => {
  return searchProperties;
};

/** 
 * Get property list item
 * @param {Object} contract
 * @return {Object}
 */
export const getContentPropertyListItem = (property: Property): Object => {
  return {
    id: property.id,
    basicInformation: getContentBasicInformation(property),
    application: getContentApplication(property),
    ...getContentBasicInformation(property),
  };
};

/** 
 * Get property list results
 * @param {Object} property
 * @return {Object[]}
 */
export const getContentPropertyListResults = (content: Object): Array<Object> =>
  getApiResponseResults(content).map((property) => getContentPropertyListItem(property));


/**
 * Clear all unsaved changes from local storage
 */
export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.PROPERTY_BASIC_INFORMATION);
  removeSessionStorageItem(FormNames.PROPERTY_APPLICATION);
  removeSessionStorageItem('propertyId');
  removeSessionStorageItem('propertyValidity');
};

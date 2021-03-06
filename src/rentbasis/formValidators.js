// @flow
import {dateGreaterOrEqual} from '$components/form/validations';

/** 
 * Validate basis of rent form
 * @param {Object} values
 * @returns {Object}
 */
export const validateRentBasisForm = (values: Object): Object => {
  const errors = {};
  const endDateError =  dateGreaterOrEqual(values.end_date, values.start_date);

  if (endDateError) {
    errors.end_date = endDateError;
  }

  return errors;
};

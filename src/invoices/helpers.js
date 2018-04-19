// @flow
import get from 'lodash/get';

import {formatDecimalNumberForDb} from '$util/helpers';

export const getInvoiceSharePercentage = (invoice: Object, precision: number = 0) => {
  const numerator = get(invoice, 'share_numerator');
  const denominator = get(invoice, 'share_denominator');

  if((numerator !== 0 && !numerator || !denominator)) {
    return '';
  }
  return (Number(numerator)/Number(denominator)*100).toFixed(precision);
};

export const getEditedInvoiceForDb = (invoice: Object) => {
  return {
    id: invoice.id,
    lease: invoice.lease,
    due_date: get(invoice, 'due_date'),
    billing_period_start_date: get(invoice, 'billing_period_start_date'),
    billing_period_end_date: get(invoice, 'billing_period_end_date'),
    total_amount: formatDecimalNumberForDb(get(invoice, 'total_amount')),
    notes: get(invoice, 'notes'),
  };
};

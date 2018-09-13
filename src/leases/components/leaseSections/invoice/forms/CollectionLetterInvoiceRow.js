// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import Loader from '$src/components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import RemoveButton from '$components/form/RemoveButton';
import {fetchPenaltyInterestByInvoice} from '$src/penaltyInterest/actions';
import {FormNames} from '$src/leases/enums';
import {formatDecimalNumberForDb, formatNumber} from '$util/helpers';
import {getIsFetchingByInvoice, getPenaltyInterestByInvoice} from '$src/penaltyInterest/selectors';

type Props = {
  field: any,
  collectionCharge: number,
  disableDirty?: boolean,
  fetchPenaltyInterestByInvoice: Function,
  invoice: ?number,
  invoiceOptions: Array<Object>,
  isFetching: boolean,
  onRemove: Function,
  penaltyInterest: ?Object,
  selectedInvoices: Array<Object>,
  showDeleteButton: boolean,
}

class CollectionLetterInvoiceRow extends Component<Props> {
  componentDidUpdate(prevProps: Props) {
    if(prevProps.invoice !== this.props.invoice && isEmpty(this.props.penaltyInterest)) {
      const {fetchPenaltyInterestByInvoice, invoice} = this.props;
      fetchPenaltyInterestByInvoice(invoice);
    }
  }

  getTotalAmount = () => {
    const {collectionCharge, penaltyInterest} = this.props;
    if(!penaltyInterest || isEmpty(penaltyInterest)) {
      return 0;
    }
    const formatedCollectionCharge = formatDecimalNumberForDb(collectionCharge);
    return penaltyInterest.outstanding_amount + penaltyInterest.total_interest_amount + (!isNaN(formatedCollectionCharge) ? formatedCollectionCharge : 0);
  }

  render() {
    const {
      collectionCharge,
      disableDirty,
      field,
      invoiceOptions,
      isFetching,
      onRemove,
      penaltyInterest,
      selectedInvoices,
      showDeleteButton,
    } = this.props;
    const formatedCollectionCharge = formatDecimalNumberForDb(collectionCharge),
      filteredInvoiceOptions = invoiceOptions.filter((invoice) => selectedInvoices.indexOf(invoice.value) === -1);

    return(
      <Row>
        <Column small={4}>
          <FormField
            disableDirty={disableDirty}
            fieldAttributes={{
              type: 'choice',
              required: true,
              label: '',
            }}
            name={field}
            overrideValues={{
              options: filteredInvoiceOptions,
            }}
          />
        </Column>
        <Column small={2}>
          <LoaderWrapper className='invoice-row-wrapper'><Loader isLoading={isFetching} className='small' /></LoaderWrapper>
          {!isFetching &&
            <p>{!isEmpty(penaltyInterest) ? `${formatNumber(get(penaltyInterest, 'outstanding_amount'))} €` : '-'}</p>
          }
        </Column>
        <Column small={2}>
          <p>{!isEmpty(penaltyInterest) ? `${formatNumber(get(penaltyInterest, 'total_interest_amount'))} €` : '-'}</p>
        </Column>
        <Column small={2}>
          <p>{!isEmpty(penaltyInterest) ? `${formatNumber((formatedCollectionCharge && !isNaN(formatedCollectionCharge)) ? formatedCollectionCharge : 0)} €` : '-'}</p>
        </Column>
        <Column small={2}>
          <FieldAndRemoveButtonWrapper
            field={
              <p style={{width: '100%'}}>{!isEmpty(penaltyInterest) ? `${formatNumber(this.getTotalAmount())} €` : '-'}</p>
            }
            removeButton={showDeleteButton &&
              <RemoveButton
                className='third-level'
                onClick={onRemove}
                title="Poista rivi"
              />
            }
          />
        </Column>
      </Row>
    );
  }
}

const formName = FormNames.CREATE_COLLECTION_LETTER;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    const invoice = selector(state, props.field);
    const selectedInvoices = [];
    props.fields.forEach((field) => {
      const item = selector(state, field);
      if(item && (item !== invoice)) {
        selectedInvoices.push(item);
      }
    });

    return {
      isFetching: getIsFetchingByInvoice(state, invoice),
      invoice: invoice,
      penaltyInterest: getPenaltyInterestByInvoice(state, invoice),
      selectedInvoices: selectedInvoices,
    };
  },
  {
    fetchPenaltyInterestByInvoice,
  }
)(CollectionLetterInvoiceRow);
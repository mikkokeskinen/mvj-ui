// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {FieldArray, formValueSelector, getFormValues, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Button from '$components/button/Button';
import CloseButton from '$components/button/CloseButton';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import WhiteBox from '$components/content/WhiteBox';
import {receiveIsCreateClicked} from '$src/invoices/actions';
import {ButtonColors} from '$components/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames, RecipientOptions} from '$src/leases/enums';
import {validateInvoiceForm} from '$src/leases/formValidators';
import {getInvoiceRecipientOptions} from '$src/leases/helpers';
import {getAttributes as getInvoiceAttributes, getIsCreateClicked} from '$src/invoices/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type InvoiceRowsProps = {
  attributes: Attributes,
  fields: any,
  isCreateClicked: boolean,
}

const InvoiceRows = ({attributes, fields, isCreateClicked}: InvoiceRowsProps): Element<*> => {
  const handleAdd = () => fields.push({});

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            <SubTitle>Erittely</SubTitle>
            {!!fields && !!fields.length &&
              <div>
                <Row>
                  <Column small={3} large={2}>
                    <FormTextTitle
                      required={get(attributes, 'rows.child.children.receivable_type.required')}
                      title='Saamislaji'
                    />
                  </Column>
                  <Column small={3} large={2}>
                    <FormTextTitle
                      required={get(attributes, 'rows.child.children.amount.required')}
                      title='Määrä (alviton)'
                    />
                  </Column>
                </Row>
                {fields.map((row, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText: 'Poista',
                      confirmationModalLabel: DeleteModalLabels.INVOICE_ROW,
                      confirmationModalTitle: DeleteModalTitles.INVOICE_ROW,
                    });
                  };

                  return (
                    <Row key={index}>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isCreateClicked}
                          fieldAttributes={get(attributes, 'rows.child.children.receivable_type')}
                          invisibleLabel={true}
                          name={`${row}.receivable_type`}
                          overrideValues={{
                            label: 'Saamislaji',
                          }}
                        />
                      </Column>
                      <Column small={2} large={2}>
                        <FormField
                          disableTouched={isCreateClicked}
                          fieldAttributes={get(attributes, 'rows.child.children.amount')}
                          invisibleLabel={true}
                          name={`${row}.amount`}
                          unit='€'
                          overrideValues={{
                            label: 'Määrä (alviton)',
                          }}
                        />
                      </Column>
                      <Column small={1} large={2}>
                        {fields.length > 1 &&
                          <RemoveButton
                            className='third-level'
                            onClick={handleRemove}
                            title="Poista rivi"
                          />
                        }
                      </Column>
                    </Row>
                  );
                })}
              </div>
            }
            <Row>
              <Column>
                <AddButtonThird
                  label='Lisää rivi'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>

  );
};

type Props = {
  formValues: Object,
  handleSubmit: Function,
  invoiceAttributes: Attributes,
  isCreateClicked: boolean,
  lease: Lease,
  onClose: Function,
  onSave: Function,
  receiveIsCreateClicked: Function,
  recipient: string,
  setRefForFirstField?: Function,
  valid: boolean,
}

const NewInvoiceForm = ({
  formValues,
  handleSubmit,
  invoiceAttributes,
  isCreateClicked,
  lease,
  onClose,
  onSave,
  receiveIsCreateClicked,
  recipient,
  setRefForFirstField,
  valid,
}: Props) => {
  const handleSave = () => {
    receiveIsCreateClicked(true);
    if(valid) {
      onSave(formValues);
    }
  };

  const recipientOptions = getInvoiceRecipientOptions(lease);

  return (
    <form onSubmit={handleSubmit} className='invoice__new-invoice_form'>
      <WhiteBox>
        <BoxContentWrapper>
          <h3>Luo lasku</h3>
          <CloseButton
            className="position-topright"
            onClick={onClose}
          />
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isCreateClicked}
                fieldAttributes={get(invoiceAttributes, 'recipient')}
                name='recipient'
                setRefForField={setRefForFirstField}
                overrideValues={{
                  label: 'Vuokralainen',
                  options: recipientOptions,
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isCreateClicked}
                fieldAttributes={get(invoiceAttributes, 'due_date')}
                name='due_date'
                overrideValues={{
                  label: 'Eräpäivä',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isCreateClicked}
                fieldAttributes={get(invoiceAttributes, 'billing_period_start_date')}
                name='billing_period_start_date'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isCreateClicked}
                fieldAttributes={get(invoiceAttributes, 'billing_period_end_date')}
                name='billing_period_end_date'
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <FormField
                disableTouched={isCreateClicked}
                fieldAttributes={recipient === RecipientOptions.ALL
                  ? {...get(invoiceAttributes, 'notes'), required: true}
                  : get(invoiceAttributes, 'notes')
                }
                name='notes'
                overrideValues={{
                  label: 'Tiedote',
                }}
              />
            </Column>
          </Row>
          <FieldArray
            attributes={invoiceAttributes}
            component={InvoiceRows}
            isCreateClicked={isCreateClicked}
            name='rows'
          />
          <Row>
            <Column>
              <div className='button-wrapper'>
                <Button
                  className={ButtonColors.SECONDARY}
                  onClick={onClose}
                  text='Peruuta'
                />
                <Button
                  className={ButtonColors.SUCCESS}
                  disabled={isCreateClicked && !valid}
                  onClick={handleSave}
                  text='Tallenna'
                />
              </div>
            </Column>
          </Row>
        </BoxContentWrapper>
      </WhiteBox>
    </form>
  );
};

const formName = FormNames.INVOICE_NEW;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        formValues: getFormValues(formName)(state),
        invoiceAttributes: getInvoiceAttributes(state),
        isCreateClicked: getIsCreateClicked(state),
        lease: getCurrentLease(state),
        recipient: selector(state, 'recipient'),
      };
    },
    {
      receiveIsCreateClicked,
    }
  ),
  reduxForm({
    form: formName,
    initialValues: {
      recipient: RecipientOptions.ALL,
      rows: [{}],
    },
    validate: validateInvoiceForm,
  }),
)(NewInvoiceForm);

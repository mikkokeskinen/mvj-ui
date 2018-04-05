// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

import FieldTypeCheckbox from '$components/form/FieldTypeCheckbox';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import FormSection from '$components/form/FormSection';
import {receiveContactFormValid} from '../../actions';
import {
  getInitialContactFormValues,
  getIsContactFormValid,
} from '../../selectors';
import {genericValidator, required} from '$components/form/validations';
import {getAttributeFieldOptions} from '$src/util/helpers';

import type {Attributes} from '../../types';
import type {RootState} from '$src/root/types';

type Props = {
  attributes: Attributes,
  initialValues: Object,
  is_business: boolean,
  isContactFormValid: boolean,
  handleSubmit: Function,
  receiveContactFormValid: Function,
  valid: boolean,
}

class ContactForm extends Component {
  props: Props

  componentDidMount() {
    const {receiveContactFormValid, valid} = this.props;
    receiveContactFormValid(valid);
  }

  componentDidUpdate() {
    const {isContactFormValid, receiveContactFormValid, valid} = this.props;
    if(isContactFormValid !== valid) {
      receiveContactFormValid(valid);
    }
  }

  render() {
    const {attributes, handleSubmit, is_business} = this.props;
    const languageOptions = getAttributeFieldOptions(attributes, 'language');

    return(
      <form onSubmit={handleSubmit}>
        <FormSection>
          <Row>
            <Column small={6} medium={4} large={2}>
              <Field
                className='checkbox-inline'
                component={FieldTypeCheckbox}
                label='Yritys'
                name="is_business"
                options= {[
                  {value: 'true', label: 'Yritys'},
                ]}
                validate={[
                  (value) => genericValidator(value, get(attributes, 'is_business')),
                ]}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <Field
                component={FieldTypeText}
                label='Etunimi'
                name='first_name'
                validate={[
                  (value) => is_business ? null : required(value),
                  (value) => genericValidator(value, get(attributes, 'first_name')),
                ]}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <Field
                component={FieldTypeText}
                label='Sukunimi'
                name='last_name'
                validate={[
                  (value) => is_business ? null : required(value),
                  (value) => genericValidator(value, get(attributes, 'last_name')),
                ]}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <Field
                component={FieldTypeText}
                label='Henkilötunnus'
                name='national_identification_number'
                validate={[
                  (value) => genericValidator(value, get(attributes, 'national_identification_number')),
                ]}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <Field
                component={FieldTypeText}
                label='Y-tunnus'
                name='business_id'
                validate={[
                  (value) => genericValidator(value, get(attributes, 'business_id')),
                ]}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <Field
                component={FieldTypeText}
                label='Yrityksen nimi'
                name='business_name'
                validate={[
                  (value) => is_business ? required(value) : null,
                  (value) => genericValidator(value, get(attributes, 'business_name')),
                ]}
              />
            </Column>
          </Row>
          <Row>
            <Column small={12} medium={8} large={4}>
              <Field
                component={FieldTypeText}
                label='Katuosoite'
                name='address'
                validate={[
                  (value) => genericValidator(value, get(attributes, 'address')),
                ]}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <Field
                component={FieldTypeText}
                label='Postinumero'
                name='postal_code'
                validate={[
                  (value) => genericValidator(value, get(attributes, 'postal_code')),
                ]}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <Field
                component={FieldTypeText}
                label='Kaupunki'
                name='city'
                validate={[
                  (value) => genericValidator(value, get(attributes, 'city')),
                ]}
              />
            </Column>
            <Column small={12} medium={8} large={4}>
              <Field
                component={FieldTypeText}
                label='Sähköposti'
                name='email'
                validate={[
                  (value) => genericValidator(value, get(attributes, 'email')),
                ]}
              />
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={4} large={2}>
              <Field
                component={FieldTypeText}
                label='Puhelinnumero'
                name='phone'
                validate={[
                  (value) => genericValidator(value, get(attributes, 'phone')),
                ]}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <Field
                component={FieldTypeText}
                label='Asiakasnumero'
                name='customer_number'
                validate={[
                  (value) => genericValidator(value, get(attributes, 'customer_number')),
                ]}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <Field
                component={FieldTypeSelect}
                label='Kieli'
                name='language'
                options={languageOptions}
                validate={[
                  (value) => genericValidator(value, get(attributes, 'language')),
                ]}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <Field
                className='checkbox-inline'
                component={FieldTypeCheckbox}
                label='Turvakielto'
                name="address_protection"
                options= {[
                  {value: 'true', label: 'Turvakielto'},
                ]}
                validate={[
                  (value) => genericValidator(value, get(attributes, 'address_protection')),
                ]}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <Field
                component={FieldTypeText}
                label='SAP asiakasnumero'
                name='sap_customer_number'
                validate={[
                  (value) => genericValidator(value, get(attributes, 'sap_customer_number')),
                ]}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <Field
                component={FieldTypeText}
                label='Ovt tunnus'
                name='electronic_billing_address'
                validate={[
                  (value) => genericValidator(value, get(attributes, 'electronic_billing_address')),
                ]}
              />
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={4} large={2}>
              <Field
                component={FieldTypeText}
                label='Kumppanikoodi'
                name='partner_code'
                validate={[
                  (value) => genericValidator(value, get(attributes, 'partner_code')),
                ]}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <Field
                className='checkbox-inline'
                component={FieldTypeCheckbox}
                label='Vuokranantaja'
                name="is_lessor"
                options= {[
                  {value: 'true', label: 'Vuokranantaja'},
                ]}
                validate={[
                  (value) => genericValidator(value, get(attributes, 'is_lessor')),
                ]}
              />
            </Column>
          </Row>
        </FormSection>
      </form>
    );
  }
}

const formName = 'contact-form';
const selector = formValueSelector(formName);

const mapStateToProps = (state: RootState) => {
  return {
    is_business: selector(state, 'is_business'),
    isContactFormValid: getIsContactFormValid(state),
    initialValues: getInitialContactFormValues(state),
  };
};

export default flowRight(
  connect(
    mapStateToProps,
    {
      receiveContactFormValid,
    },
  ),
  reduxForm({
    form: formName,
  }),
)(ContactForm);
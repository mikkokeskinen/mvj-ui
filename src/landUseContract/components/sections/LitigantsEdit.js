// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {FieldArray, getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButton from '$components/form/AddButton';
import ContactModal from '$src/contacts/components/ContactModal';
import LitigantItemEdit from './LitigantItemEdit';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import {
  createContactOnModal as createContact,
  editContactOnModal as editContact,
  hideContactModal,
  receiveContactModalSettings,
  receiveIsSaveClicked,
} from '$src/contacts/actions';
import {receiveFormValidFlags} from '$src/landUseContract/actions';
import {ConfirmationModalTexts, FormNames} from '$src/enums';
import {ContactTypes} from '$src/contacts/enums';
import {ButtonColors} from '$components/enums';
import {validateLitigantForm} from '$src/landUseContract/formValidators';
import {getContentContact} from '$src/contacts/helpers';
import {getContentLitigants} from '$src/landUseContract/helpers';
import {isEmptyValue} from '$util/helpers';
import {contactExists} from '$src/contacts/requestsAsync';
import {
  getContactModalSettings,
  getIsContactFormValid,
  getIsContactModalOpen,
  getIsFetching as getIsFetchingContact,
} from '$src/contacts/selectors';
import {getCurrentLandUseContract} from '$src/landUseContract/selectors';
import {withContactAttributes} from '$components/attributes/ContactAttributes';

import type {ContactModalSettings} from '$src/contacts/types';
import type {LandUseContract} from '$src/landUseContract/types';

type LitigantsProps = {
  archived: boolean,
  fields: any,
  litigants: Array<Object>,
  showAddButton: boolean,
}

const renderLitigants = ({
  archived,
  fields,
  litigants,
}: LitigantsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!!archived && fields && !!fields.length &&
              <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>
            }
            {fields && !!fields.length && fields.map((litigant, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: ConfirmationModalTexts.DELETE_LITIGANT.BUTTON,
                  confirmationModalLabel: ConfirmationModalTexts.DELETE_LITIGANT.LABEL,
                  confirmationModalTitle: ConfirmationModalTexts.DELETE_LITIGANT.TITLE,
                });
              };

              return (
                <LitigantItemEdit
                  key={index}
                  field={litigant}
                  index={index}
                  litigants={litigants}
                  onRemove={handleRemove}
                />
              );
            })}
            {!archived &&
              <Row>
                <Column>
                  <AddButton
                    className='no-margin'
                    label='Lisää osapuoli'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            }
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  change: Function,
  contactModalSettings: ContactModalSettings,
  contactFormValues: Object,
  createContact: Function,
  currentLandUseContract: LandUseContract,
  editContact: Function,
  hideContactModal: Function,
  isContactFormValid: boolean,
  isContactModalOpen: boolean,
  isFetchingContact: boolean,
  isFetchingContactAttributes: boolean,
  receiveContactModalSettings: Function,
  receiveFormValidFlags: Function,
  receiveIsSaveClicked: Function,
  valid: boolean,
}

type State = {
  litigants: Array<Object>,
  currentLandUseContract: LandUseContract,
  litigants: Array<Object>,
}

class TenantsEdit extends PureComponent<Props, State> {
  state = {
    currentLandUseContract: {},
    litigants: [],
  }

  componentDidMount() {
    const {hideContactModal} = this.props;
    hideContactModal();
  }

  static getDerivedStateFromProps(props, state) {
    if(props.currentLandUseContract !== state.currentLandUseContract) {
      return {
        currentLandUseContract: props.currentLandUseContract,
        litigants: getContentLitigants(props.currentLandUseContract),
      };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    const {change, contactModalSettings, receiveContactModalSettings, receiveFormValidFlags} = this.props;
    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.LAND_USE_CONTRACT_LITIGANTS]: this.props.valid,
      });
    }

    if(contactModalSettings && contactModalSettings.contact) {
      change(
        contactModalSettings.field,
        getContentContact(contactModalSettings.contact)
      );
      receiveContactModalSettings(null);
    }
  }

  handleCancel = () => {
    const {hideContactModal, receiveContactModalSettings} = this.props;

    hideContactModal();
    receiveContactModalSettings(null);
  }

  handleClose = () => {
    const {hideContactModal, receiveContactModalSettings} = this.props;

    hideContactModal();
    receiveContactModalSettings(null);
  }

  createOrEditContact = () => {
    const {
      contactFormValues,
      contactModalSettings,
      createContact,
      editContact,
    } = this.props;

    if(contactModalSettings && contactModalSettings.isNew) {
      createContact(contactFormValues);
    } else if(contactModalSettings && !contactModalSettings.isNew){
      editContact(contactFormValues);
    }
  }

  render () {
    const {
      contactModalSettings,
      isContactModalOpen,
      isFetchingContact,
      isFetchingContactAttributes,
    } = this.props;

    const {litigants} = this.state;

    if(isFetchingContactAttributes) return <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>;

    return (
      <AppConsumer>
        {({dispatch}) => {
          const handleCreateOrEdit = async() => {
            const {contactFormValues, contactModalSettings, isContactFormValid, receiveIsSaveClicked} = this.props;
            const {business_id, national_identification_number, type} = contactFormValues;

            receiveIsSaveClicked(true);

            if(!isContactFormValid) return;

            if(!contactModalSettings || !contactModalSettings.isNew) {
              this.createOrEditContact();
              return;
            }

            const contactIdentifier = type
              ? type === ContactTypes.PERSON ? national_identification_number : business_id
              : null;

            if(contactIdentifier && !isEmptyValue(contactIdentifier)) {
              const exists = await contactExists(contactIdentifier);

              if(exists) {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    this.createOrEditContact();
                  },
                  confirmationModalButtonClassName: ButtonColors.SUCCESS,
                  confirmationModalButtonText: ConfirmationModalTexts.CREATE_CONTACT.BUTTON,
                  confirmationModalLabel: ConfirmationModalTexts.CREATE_CONTACT.LABEL,
                  confirmationModalTitle: ConfirmationModalTexts.CREATE_CONTACT.TITLE,
                });

              } else {
                this.createOrEditContact();
              }
            } else {
              this.createOrEditContact();
            }
          };

          return(
            <Fragment>
              {isFetchingContact &&
                <LoaderWrapper className='overlay-wrapper'><Loader isLoading={isFetchingContact} /></LoaderWrapper>
              }

              <ContactModal
                isOpen={isContactModalOpen}
                onCancel={this.handleCancel}
                onClose={this.handleClose}
                onSave={handleCreateOrEdit}
                onSaveAndAdd={handleCreateOrEdit}
                showSave={contactModalSettings && !contactModalSettings.isNew}
                showSaveAndAdd={contactModalSettings && contactModalSettings.isNew}
                title={(contactModalSettings && contactModalSettings.isNew)
                  ? 'Uusi asiakas'
                  : 'Muokkaa asiakasta'
                }
              />

              <form>
                <FieldArray
                  component={renderLitigants}
                  litigants={litigants}
                  name='activeLitigants'
                />
                {/* Archived tenants */}
                <FieldArray
                  component={renderLitigants}
                  archived
                  litigants={litigants}
                  name='archivedLitigants'
                />
              </form>
            </Fragment>
          );
        }}
      </AppConsumer>
    );
  }
}

const formName = FormNames.LAND_USE_CONTRACT_LITIGANTS;

export default flowRight(
  withContactAttributes,
  connect(
    (state) => {
      return {
        contactModalSettings: getContactModalSettings(state),
        contactFormValues: getFormValues(FormNames.CONTACT)(state),
        currentLandUseContract: getCurrentLandUseContract(state),
        isContactFormValid: getIsContactFormValid(state),
        isContactModalOpen: getIsContactModalOpen(state),
        isFetchingContact: getIsFetchingContact(state),
      };
    },
    {
      createContact,
      editContact,
      hideContactModal,
      receiveContactModalSettings,
      receiveFormValidFlags,
      receiveIsSaveClicked,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    validate: validateLitigantForm,
  }),
)(TenantsEdit);

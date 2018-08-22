// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getFormValues, isDirty} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import ConfirmationModal from '$components/modal/ConfirmationModal';
import ContactForm from './forms/ContactForm';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import {createContact, fetchAttributes, receiveIsSaveClicked} from '../actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {FormNames} from '../enums';
import {getRouteById} from '$src/root/routes';
import {getAttributes, getIsContactFormValid, getIsSaveClicked} from '../selectors';

import type {RootState} from '$src/root/types';
import type {Attributes, Contact} from '../types';

type Props = {
  attributes: Attributes,
  contactFormValues: Contact,
  createContact: Function,
  fetchAttributes: Function,
  isContactFormDirty: boolean,
  isContactFormValid: boolean,
  isSaveClicked: boolean,
  receiveIsSaveClicked: Function,
  receiveTopNavigationSettings: Function,
  router: Object,
}

type State = {
  isCancelModalOpen: boolean,
}

class NewContactPage extends Component<Props, State> {
  state = {
    isCancelModalOpen: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {attributes, fetchAttributes, receiveIsSaveClicked, receiveTopNavigationSettings} = this.props;

    receiveIsSaveClicked(false);
    receiveTopNavigationSettings({
      linkUrl: getRouteById('contacts'),
      pageTitle: 'Asiakkaat',
      showSearch: false,
    });

    if(isEmpty(attributes)) {
      fetchAttributes();
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleLeavePage);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleLeavePage);
  }

  handleLeavePage = (e) => {
    const {isContactFormDirty} = this.props;
    if(isContactFormDirty) {
      const confirmationMessage = '';
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    }
  }

  handleBack = () => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('contacts')}`,
      query,
    });
  }

  handleCancel = () => {
    const {router} = this.context;
    return router.push({
      pathname: getRouteById('contacts'),
    });
  }

  handleSave = () => {
    const {contactFormValues, createContact, isSaveClicked, receiveIsSaveClicked} = this.props;
    receiveIsSaveClicked(true);
    if(isSaveClicked) {
      createContact(contactFormValues);
    }
  }

  render() {
    const {attributes, isContactFormDirty, isContactFormValid, isSaveClicked} = this.props;
    const {isCancelModalOpen} = this.state;

    return (
      <PageContainer>
        <ConfirmationModal
          confirmButtonLabel='Hylkää muutokset'
          isOpen={isCancelModalOpen}
          label='Haluatko varmasti hylätä muutokset?'
          onCancel={() => this.setState({isCancelModalOpen: false})}
          onClose={() => this.setState({isCancelModalOpen: false})}
          onSave={this.handleCancel}
          title='Hylkää muutokset'
        />

        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              isCopyDisabled={true}
              isEditMode={true}
              isSaveDisabled={isSaveClicked && !isContactFormValid}
              onCancelClick={isContactFormDirty ? () => this.setState({isCancelModalOpen: true}) : this.handleCancel}
              onSaveClick={this.handleSave}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          infoComponent={<h1>Uusi asiakas</h1>}
          onBack={this.handleBack}
        />
        <ContentContainer>
          {isEmpty(attributes) &&
            <Row>
              <Column>
                <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>
              </Column>
            </Row>
          }
          {!isEmpty(attributes) &&
            <GreenBoxEdit className='no-margin'>
              <ContactForm isFocusedOnMount/>
            </GreenBoxEdit>
          }
        </ContentContainer>
      </PageContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    attributes: getAttributes(state),
    contactFormValues: getFormValues(FormNames.CONTACT)(state),
    isContactFormDirty: isDirty(FormNames.CONTACT)(state),
    isContactFormValid: getIsContactFormValid(state),
    isSaveClicked: getIsSaveClicked(state),
  };
};

export default flowRight(
  connect(
    mapStateToProps,
    {
      createContact,
      fetchAttributes,
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
    },
  ),
)(NewContactPage);

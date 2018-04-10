// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import EditRentCriteriaForm from './forms/EditRentCriteriaForm';

import {getRouteById} from '$src/root/routes';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import PageContainer from '$components/content/PageContainer';
import {createRentCriteria} from '../actions';
import {getRentBasis} from '../selectors';
import type {RootState} from '$src/root/types';

type Props = {
  createRentCriteria: Function,
  criteria: ?Object,
  receiveTopNavigationSettings: Function,
}

class NewRentCriteriaPage extends Component {
  props: Props

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {receiveTopNavigationSettings} = this.props;
    receiveTopNavigationSettings({
      linkUrl: getRouteById('rentbasis'),
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });
  }

  handleCancel = () => {
    const {router} = this.context;
    return router.push({
      pathname: getRouteById('rentbasis'),
    });
  }

  handleSave = () => {
    const {createRentCriteria, criteria} = this.props;
    createRentCriteria(criteria);
  }

  render() {
    return (
      <PageContainer>
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              isCopyDisabled={true}
              isEditMode={true}
              isSaveDisabled={false}
              onCancelClick={this.handleCancel}
              onSaveClick={this.handleSave}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
        />
        <ContentContainer>
          <h2>Uusi vuokrausperuste</h2>
          <div className="divider" />
          <GreenBoxEdit>
            <EditRentCriteriaForm
              initialValues={{
                decisions: [''],
                prices: [{}],
                real_estate_ids: [''],
              }}
            />
          </GreenBoxEdit>
        </ContentContainer>
      </PageContainer>

    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    criteria: getRentBasis(state),
  };
};

export default flowRight(
  connect(
    mapStateToProps,
    {
      createRentCriteria,
      receiveTopNavigationSettings,
    },
  ),
)(NewRentCriteriaPage);

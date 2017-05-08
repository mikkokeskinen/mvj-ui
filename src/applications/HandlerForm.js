// @flow
import React, {createElement, Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {reduxForm, formValueSelector} from 'redux-form';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import find from 'lodash/find';

import Tabs from '../components/tabs/Tabs';
import Hero from '../components/hero/Hero';

import ApplicantInfo from './form/ApplicantInfo';
import BasicInfo from './form/BasicInfo';
import Billing from './form/Billing';
import Lease from './form/Lease';
import Summary from './form/Summary';

import FormActions from './form/FormActions';
import validate from './form/NewApplicationValidator';
import {getActiveLanguage} from '../util/helpers';
import {fetchSingleApplication} from './actions';
import {getCurrentApplication, getIsFetching} from './selectors';

type Props = {
  applicationId: String,
  fetchSingleApplication: Function,
  handleSubmit: Function,
  invalid: Boolean,
  isFetching: boolean,
  isOpenApplication: String,
  location: Object,
  onCancel: Function,
  onSave: Function,
  pristine: Boolean,
  submitting: Boolean,
  t: Function,
};

type State = {
  activeTab: string,
};

type TabsType = Array<any>;

class HandlerForm extends Component {
  props: Props;
  state: State;
  tabs: TabsType;

  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeTab: '',
    };
  }

  componentWillMount() {
    const {applicationId, fetchSingleApplication, location} = this.props;

    if (location.query.tab) {
      this.setState({activeTab: location.query.tab});
    }

    fetchSingleApplication(applicationId);
  }

  componentWillReceiveProps(nextProps) {
    const {applicationId, fetchSingleApplication} = nextProps;

    if (applicationId !== this.props.applicationId) {
      fetchSingleApplication(applicationId);
    }

    this.setTabs();
  }

  setTabs = () => {
    const {isOpenApplication} = this.props;

    this.tabs = [
      {
        id: 'yhteenveto',
        label: 'Yhteenveto',
        component: Summary,
      },
      {
        id: 'vuokralaiset',
        label: 'Vuokralaiset',
        component: ApplicantInfo,
      },
      {
        id: 'kohde',
        label: 'Kohde',
        component: BasicInfo,
        props: {
          isOpenApplication: !!isOpenApplication,
        },
      },
      {
        id: 'vuokra',
        label: 'Vuokra',
        component: Lease,
      },
      {
        id: 'laskutus',
        label: 'Laskutus',
        component: Billing,
      },
    ];

    if (!this.state.activeTab) {
      const {id} = this.tabs[0];
      this.setState({
        activeTab: id,
      });
    }

  };

  getActiveTab = (id) => find(this.tabs, {id});

  handleTabClick = (tabId) => {
    const {router} = this.context;
    const {location} = this.props;

    this.setState({activeTab: tabId}, () => {
      return router.push({
        ...location,
        query: {tab: tabId},
      });
    });
  };

  renderTabContent = () => {
    const {activeTab} = this.state;
    const tab = this.getActiveTab(activeTab);

    return createElement(tab.component, tab.props);
  };

  // Just for demo...
  goBack = () => {
    const {router} = this.context;
    const lang = getActiveLanguage().id;

    return router.push({
      pathname: `/${lang}/applications`,
    });
  };

  save = (values) => {
    console.log('saving', values);
  };

  render() {
    const {activeTab} = this.state;

    const {
      applicationId,
      handleSubmit,
      invalid,
      isFetching,
      pristine,
      submitting,
      t,
    } = this.props;

    const formActionProps = {
      invalid,
      pristine,
      submitting,
      icon: <i className="mi mi-send"/>,
      label: 'Lähetä hakemus',
    };

    if (isFetching || !activeTab) {
      return <p>Loading...</p>;
    }

    return (
      <div className="full__width">

        <Hero>
          <h2>
            <span onClick={this.goBack} style={{cursor: 'pointer'}}>
              <i className="mi mi-keyboard-backspace"/>
            </span> {t('applications:single')} {applicationId}</h2>

          <Tabs
            active={activeTab}
            className="hero__navigation"
            items={this.tabs}
            onTabClick={(id) => this.handleTabClick(id)}
          />
        </Hero>

        <form className="mvj-form" onSubmit={handleSubmit(this.save)}>
          {this.renderTabContent()}

          <FormActions {...formActionProps}/>
        </form>
      </div>
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    (state) => {
      const selector = formValueSelector('handler-form');
      const isOpenApplication = selector(state, 'open_application');

      return {
        isOpenApplication,
        initialValues: getCurrentApplication(state),
        application: getCurrentApplication(state),
        isFetching: getIsFetching(state),
      };
    },
    {fetchSingleApplication}
  ),
  reduxForm({
    form: 'handler-form',
    validate,
  }),
  translate(['common', 'applications'])
)(HandlerForm);

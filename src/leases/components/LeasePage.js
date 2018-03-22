// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {destroy, formValueSelector, reduxForm} from 'redux-form';
import {withRouter} from 'react-router';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import forEach from 'lodash/forEach';
import get from 'lodash/get';

import {getLoggedInUser} from '$src/auth/selectors';
import {receiveBilling} from './leaseSections/billing/actions';
import {getBilling} from './leaseSections/billing/selectors';
import {
  getAreasFormTouched,
  getAreasFormValues,
  getAttributes,
  getComments,
  getCurrentLease,
  getIsEditMode,
  getIsFetching,
  getIsLeaseAreasValid,
  getIsLeaseInfoValid,
  getIsSummaryValid,
  getLeaseInfoFormTouched,
  getLeaseInfoFormValues,
  getLessors,
  getSummaryFormTouched,
  getSummaryFormValues,
} from '../selectors';
import {
  clearFormValidFlags,
  fetchAttributes,
  fetchComments,
  fetchLessors,
  fetchSingleLease,
  hideEditMode,
  patchLease,
  receiveLeaseAreasFormValid,
  receiveLeaseInfoFormValid,
  receiveSummaryFormValid,
  showEditMode,
} from '../actions';
import {getRouteById} from '$src/root/routes';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import * as contentHelpers from '../helpers';
import {
  displayUIMessage,
  getAttributeFieldOptions,
  getLabelOfOption,
  getLessorOptions,
} from '$util/helpers';

import Billing from './leaseSections/billing/Billing';
import BillingEdit from './leaseSections/billing/BillingEdit';
import CommentPanel from '$components/commentPanel/CommentPanel';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtons from '$components/controlButtons/ControlButtons';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import DecisionsMain from './leaseSections/contract/DecisionsMain';
import DecisionsMainEdit from './leaseSections/contract/DecisionsMainEdit';
import Divider from '$components/content/Divider';
import EditableMap from '$components/map/EditableMap';
import LeaseAreas from './leaseSections/leaseArea/LeaseAreas';
import LeaseAreasEdit from './leaseSections/leaseArea/LeaseAreasEdit';
import LeaseHistory from './leaseSections/summary/LeaseHistory';
import LeaseInfo from './leaseSections/leaseInfo/LeaseInfo';
import LeaseInfoEdit from './leaseSections/leaseInfo/LeaseInfoEdit';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import Rent from './leaseSections/rent/Rent';
import RentEdit from './leaseSections/rent/RentEdit';
import RightSubtitle from '$components/content/RightSubtitle';
import Summary from './leaseSections/summary/Summary';
import SummaryEdit from './leaseSections/summary/SummaryEdit';
import Tabs from '$components/tabs/Tabs';
import TabPane from '$components/tabs/TabPane';
import TabContent from '$components/tabs/TabContent';
import TenantsEdit from './leaseSections/tenant/TenantsEdit';
import Tenants from './leaseSections/tenant/Tenants';
import ConstructionEligibility from './leaseSections/constructionEligibility/ConstructionEligibility';
import ConstructionEligibilityEdit from './leaseSections/constructionEligibility/ConstructionEligibilityEdit';


import mockData from '../mock-data.json';

type Props = {
  areasFormTouched: boolean,
  areasFormValues: Object,
  attributes: Object,
  billing: Object,
  clearFormValidFlags: Function,
  commentsStore: Array<Object>,
  contractsForm: Array<Object>,
  contractsTouched: boolean,
  currentLease: Object,
  dispatch: Function,
  eligibilityForm: Array<Object>,
  eligibilityTouched: boolean,
  fetchAttributes: Function,
  fetchComments: Function,
  fetchLessors: Function,
  fetchSingleLease: Function,
  hideEditMode: Function,
  inspectionsForm: Array<Object>,
  inspectionTouched: boolean,
  isEditMode: boolean,
  isFetching: boolean,
  isLeaseAreasValid: boolean,
  isLeaseInfoValid: boolean,
  isSummaryValid: boolean,
  leaseInfoFormTouched: boolean,
  leaseInfoFormValues: Object,
  lessors: Array<Object>,
  location: Object,
  params: Object,
  patchLease: Function,
  receiveBilling: Function,
  receiveLeaseAreasFormValid: Function,
  receiveLeaseInfoFormValid: Function,
  receiveSummaryFormValid: Function,
  receiveTopNavigationSettings: Function,
  rentsForm: Object,
  rentsTouched: boolean,
  rulesForm: Array<Object>,
  rulesTouched: boolean,
  showEditMode: Function,
  summaryFormTouched: boolean,
  summaryFormValues: Object,
  tenantsForm: Array<Object>,
  tenantsTouched: boolean,
  user: Object,
}

type State = {
  activeTab: number,
  areasMock: Array<Object>,
  contracts: Array<Object>,
  history: Array<Object>,
  inspections: Array<Object>,
  isCancelLeaseModalOpen: boolean,
  isCommentPanelOpen: boolean,
  isSaveLeaseModalOpen: boolean,
  oldTenants: Array<Object>,
  rents: Object,
  rules: Array<Object>,
  tenants: Array<Object>,
};

class PreparerForm extends Component {
  props: Props

  state: State = {
    activeTab: 0,
    areasMock: [],
    contracts: [],
    history: [],
    isCancelLeaseModalOpen: false,
    isCommentPanelOpen: false,
    isSaveLeaseModalOpen: false,
    oldTenants: [],
    rents: {},
    rules: [],
    tenants: [],
    terms: [],
    inspections: [],
  }

  commentPanel: any

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {
      clearFormValidFlags,
      fetchAttributes,
      fetchComments,
      fetchLessors,
      fetchSingleLease,
      location, params: {leaseId},
      receiveBilling,
      receiveTopNavigationSettings,
    } = this.props;
    const lease = mockData.leases[0];

    receiveTopNavigationSettings({
      linkUrl: getRouteById('leases'),
      pageTitle: 'Vuokraukset',
      showSearch: true,
    });

    // Destroy forms to initialize new values when data is fetched
    this.destroyAllForms();
    clearFormValidFlags();

    if (location.query.tab) {
      this.setState({activeTab: location.query.tab});
    }

    this.setState({
      areasMock: contentHelpers.getContentLeaseAreasMock(lease),
      contracts: contentHelpers.getContentContracts(lease),
      history: contentHelpers.getContentHistory(lease),
      inspections: contentHelpers.getContentInspections(lease),
      oldTenants: lease.tenants_old,
      rents: contentHelpers.getContentRents(lease),
      rules: contentHelpers.getContentRules(lease),
      tenants: contentHelpers.getContentTenants(lease),
    });
    receiveBilling(contentHelpers.getContentBilling(lease));
    fetchAttributes();
    fetchComments(leaseId);
    fetchLessors();
    fetchSingleLease(leaseId);
  }

  showModal = (modalName: string) => {
    const modalVisibilityKey = `is${modalName}ModalOpen`;
    this.setState({
      [modalVisibilityKey]: true,
    });
  }

  hideModal = (modalName: string) => {
    const modalVisibilityKey = `is${modalName}ModalOpen`;
    this.setState({
      [modalVisibilityKey]: false,
    });
  }

  cancel = () => {
    const {clearFormValidFlags, hideEditMode} = this.props;
    hideEditMode();
    this.hideModal('CancelLease');
    this.destroyAllForms();
    clearFormValidFlags();
  }

  save = () => {
    const {
      clearFormValidFlags,
      areasFormValues,
      leaseInfoFormValues,
      summaryFormValues,

      contractsForm,
      currentLease,
      eligibilityForm,
      hideEditMode,
      inspectionsForm,
      patchLease,
      rentsForm,
      rulesForm,
      tenantsForm,
    } = this.props;

    let payload: Object = {id: currentLease.id};

    if(leaseInfoFormValues !== undefined) {
      payload = contentHelpers.addLeaseInfoFormValues(payload, leaseInfoFormValues);
    }

    if(summaryFormValues !== undefined) {
      payload = contentHelpers.addSummaryFormValues(payload, summaryFormValues);
    }

    if(areasFormValues !== undefined) {
      payload = contentHelpers.addAreasFormValues(payload, areasFormValues);
    }

    patchLease(payload);

    // TODO: Temporarily save changes to state. Replace with api call when end points are ready
    if(eligibilityForm !== undefined) {
      this.setState({areasMock: eligibilityForm});
    }
    if(contractsForm !== undefined) {
      this.setState({contracts: contractsForm});
    }
    if(inspectionsForm !== undefined) {
      this.setState({inspections: inspectionsForm});
    }
    if(rentsForm !== undefined) {
      this.setState({rents: rentsForm});
    }
    if(rulesForm !== undefined) {
      this.setState({rules: rulesForm});
    }
    if(tenantsForm !== undefined) {
      this.setState({tenants: tenantsForm});
    }

    hideEditMode();
    this.hideModal('SaveLease');

    this.destroyAllForms();
    clearFormValidFlags();
  }

  agreeCriteria = (criteria: Object) => {
    const {rents, rents: {criterias}} = this.state;
    forEach(criterias, (x) => {
      if(x === criteria) {
        x.agreed = true;
      }
    });
    this.setState({rents: rents});
    displayUIMessage({title: 'Vuokranperuste hyväksytty', body: 'Vuokranperuste on hyväksytty onnistuneesti'});
  }

  destroyAllForms = () => {
    const {dispatch} = this.props;
    dispatch(destroy('lease-area-form'));
    dispatch(destroy('lease-info-form'));
    dispatch(destroy('summary-form'));

    dispatch(destroy('billing-edit-form'));
    dispatch(destroy('contract-edit-form'));
    dispatch(destroy('inspection-edit-form'));
    dispatch(destroy('rent-edit-form'));
    dispatch(destroy('rule-edit-form'));
    dispatch(destroy('tenant-edit-form'));
  }

  validateForms = () => {
    const {
      isLeaseAreasValid,
      isLeaseInfoValid,
      isSummaryValid,
    } = this.props;

    return isLeaseAreasValid &&
      isLeaseInfoValid &&
      isSummaryValid;
  }

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

  toggleCommentPanel = () => {
    const {isCommentPanelOpen} = this.state;
    this.setState({isCommentPanelOpen: !isCommentPanelOpen});
  }

  isAnyFormTouched = () => {
    const {
      areasFormTouched,
      leaseInfoFormTouched,
      summaryFormTouched,

      contractsTouched,
      eligibilityTouched,
      inspectionTouched,
      rentsTouched,
      rulesTouched,
      tenantsTouched,
    } = this.props;

    return areasFormTouched ||
      leaseInfoFormTouched ||
      summaryFormTouched ||

      contractsTouched ||
      eligibilityTouched ||
      inspectionTouched ||
      rentsTouched ||
      rulesTouched ||
      tenantsTouched;
  }

  render() {
    const {
      activeTab,
      areasMock,
      contracts,
      history,
      inspections,
      isCancelLeaseModalOpen,
      isCommentPanelOpen,
      isSaveLeaseModalOpen,
      oldTenants,
      rents,
      rules,
      tenants,
    } = this.state;

    const {
      attributes,
      billing,
      commentsStore,
      currentLease,
      dispatch,
      isEditMode,
      isFetching,
      lessors,
      showEditMode,
    } = this.props;

    const areFormsValid = this.validateForms();
    const isAnyFormTouched = this.isAnyFormTouched();

    const classificationOptions = getAttributeFieldOptions(attributes, 'classification');
    const lessorOptions = getLessorOptions(lessors);

    const leaseInfo = contentHelpers.getContentLeaseInfo(currentLease);
    const summary = contentHelpers.getContentSummary(currentLease);
    const areas = contentHelpers.getContentLeaseAreas(currentLease);
    const comments = contentHelpers.getContentComments(commentsStore);

    let sum_areas = 0;
    areas && areas.length > 0 && areas.map((area) =>
      sum_areas = sum_areas + area.area
    );

    if(isFetching) {
      return (
        <div className='lease-page'><Loader isLoading={true} /></div>
      );
    }

    return (
      <PageContainer className='lease-page'>
        <ConfirmationModal
          isOpen={isSaveLeaseModalOpen}
          label='Haluatko varmasti tallentaa muutokset?'
          onCancel={() => this.hideModal('SaveLease')}
          onClose={() => this.hideModal('SaveLease')}
          onSave={this.save}
          title='Tallenna'
        />
        <ConfirmationModal
          isOpen={isCancelLeaseModalOpen}
          label='Haluatko varmasti peruuttaa muutokset?'
          onCancel={() => this.hideModal('CancelLease')}
          onClose={() => this.hideModal('CancelLease')}
          onSave={this.cancel}
          saveButtonLabel='Vahvista'
          title='Peruuta muutokset'
        />
        <CommentPanel
          comments={comments}
          dispatch={dispatch}
          isOpen={isCommentPanelOpen}
          onClose={this.toggleCommentPanel}
          ref={(input) => {this.commentPanel = input;}}
        />
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              commentAmount={comments ? comments.length : 0}
              isCancelDisabled={activeTab.toString() === '6'}
              isEditDisabled={activeTab.toString() === '6'}
              isEditMode={isEditMode}
              isSaveDisabled={!areFormsValid || activeTab.toString() === '6'}
              onCancelClick={isAnyFormTouched ? () => this.showModal('CancelLease') : this.cancel}
              onCommentClick={this.toggleCommentPanel}
              onEditClick={showEditMode}
              onSaveClick={() => this.showModal('SaveLease')}
            />
          }
          infoComponent={isEditMode
            ? (
              <LeaseInfoEdit
                attributes={attributes}
                initialValues={{
                  state: leaseInfo.state,
                  start_date: leaseInfo.start_date,
                  end_date: leaseInfo.end_date,
                }}
                leaseInfo={leaseInfo}
              />
            ) : (
              <LeaseInfo
                leaseInfo={leaseInfo}
              />
            )
          }
        />

        <Tabs
          active={activeTab}
          className="hero__navigation"
          tabs={[
            'Yhteenveto',
            'Vuokra-alue',
            'Vuokralaiset',
            'Vuokra',
            'Päätökset ja sopimukset',
            'Rakentamiskelpoisuus',
            'Laskutus',
            'Kartta',
          ]}
          onTabClick={(id) => this.handleTabClick(id)}
        />

        <TabContent active={activeTab}>
          <TabPane>
            <ContentContainer>
              <h1>Yhteenveto</h1>
              {!isEditMode &&
                <RightSubtitle
                  className='publicity-label'
                  text={summary.classification
                    ? getLabelOfOption(classificationOptions, summary.classification)
                    : '-'
                  }
                />
              }
              <Divider />
              <Row>
                <Column medium={9}>
                  {isEditMode
                    ? <SummaryEdit
                        attributes={attributes}
                        initialValues={{...summary}}
                        lessorOptions={lessorOptions}
                      />
                    : <Summary
                        attributes={attributes}
                        lessorOptions={lessorOptions}
                        summary={summary}
                      />
                  }
                  </Column>
                <Column medium={3}>
                  <LeaseHistory history={history}/>
                </Column>
              </Row>
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              <h1>Vuokra-alue</h1>
              <RightSubtitle
                text={<span>{sum_areas} m<sup>2</sup></span>}
              />
              <Divider />
              {isEditMode
                ? <LeaseAreasEdit
                    attributes={attributes}
                    initialValues={{lease_areas: areas}}
                  />
                : <LeaseAreas
                    areas={areas}
                    attributes={attributes}
                  />
              }
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              <h1>Vuokralaiset</h1>
              <Divider />
              {isEditMode
                ? <TenantsEdit initialValues={{tenants: tenants}} />
                : <Tenants tenants={tenants} oldTenants={oldTenants} />
              }
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              {isEditMode
                ? <RentEdit initialValues={{rents: rents}}/>
                : <Rent onCriteriaAgree={(criteria) => this.agreeCriteria(criteria)} rents={rents}/>
              }
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              {isEditMode
                ? (
                  <DecisionsMainEdit
                    contracts={contracts}
                    inspections={inspections}
                    rules={rules}
                  />
                ) : (
                  <DecisionsMain
                    contracts={contracts}
                    inspections={inspections}
                    rules={rules}
                  />
                )
              }
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              <h1>Rakentamiskelpoisuus</h1>
              <Divider />
              {isEditMode
                ? <ConstructionEligibilityEdit areas={areasMock} initialValues={{areas: areasMock}}/>
                : <ConstructionEligibility areas={areasMock}/>
              }
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              {isEditMode
                ? <BillingEdit billing={billing}/>
                : <Billing billing={billing}/>
              }
            </ContentContainer>
          </TabPane>

          <TabPane>
            <ContentContainer>
              <EditableMap/>
            </ContentContainer>
          </TabPane>
        </TabContent>
      </PageContainer>
    );
  }
}

const contractFormSelector = formValueSelector('contract-edit-form');
const eligibilityFormSelector = formValueSelector('eligibility-edit-form');
const inspectionFormSelector = formValueSelector('inspection-edit-form');
const rentFormSelector = formValueSelector('rent-edit-form');
const ruleFormSelector = formValueSelector('rule-edit-form');
const tenantFormSelector = formValueSelector('tenant-edit-form');

export default flowRight(
  withRouter,
  reduxForm({
    form: 'lease-main-page-form',
  }),
  connect(
    (state) => {
      const user = getLoggedInUser(state);
      return {
        areasFormTouched: getAreasFormTouched(state),
        areasFormValues: getAreasFormValues(state),
        attributes: getAttributes(state),
        billing: getBilling(state),
        commentsStore: getComments(state),
        contractsForm: contractFormSelector(state, 'contracts'),
        contractsTouched: get(state, 'form.contract-edit-form.anyTouched'),
        currentLease: getCurrentLease(state),
        eligibilityForm: eligibilityFormSelector(state, 'areas'),
        eligibilityTouched: get(state, 'form.eligibility-edit-form.anyTouched'),
        isEditMode: getIsEditMode(state),
        isLeaseAreasValid: getIsLeaseAreasValid(state),
        isLeaseInfoValid: getIsLeaseInfoValid(state),
        isSummaryValid: getIsSummaryValid(state),
        inspectionsForm: inspectionFormSelector(state, 'inspections'),
        inspectionTouched: get(state, 'form.inspection-edit-form.anyTouched'),
        isFetching: getIsFetching(state),
        leaseInfoFormTouched: getLeaseInfoFormTouched(state),
        leaseInfoFormValues: getLeaseInfoFormValues(state),
        lessors: getLessors(state),
        rentsForm: rentFormSelector(state, 'rents'),
        rentsTouched: get(state, 'form.rent-edit-form.anyTouched'),
        rulesForm: ruleFormSelector(state, 'rules'),
        rulesTouched: get(state, 'form.rule-edit-form.anyTouched'),
        summaryFormTouched: getSummaryFormTouched(state),
        summaryFormValues: getSummaryFormValues(state),
        tenantsForm: tenantFormSelector(state, 'tenants'),
        tenantsTouched: get(state, 'form.tenant-edit-form.anyTouched'),
        user,
      };
    },
    {
      clearFormValidFlags,
      fetchAttributes,
      fetchComments,
      fetchLessors,
      fetchSingleLease,
      hideEditMode,
      patchLease,
      receiveBilling,
      receiveLeaseAreasFormValid,
      receiveLeaseInfoFormValid,
      receiveSummaryFormValid,
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(PreparerForm);

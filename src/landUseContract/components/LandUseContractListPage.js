// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import Button from '$components/button/Button';
import CreateLandUseContractModal from './createLandUseContract/CreateLandUseContractModal';
import ListItem from '$components/content/ListItem';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import Search from './search/Search';
import SearchWrapper from '$components/search/SearchWrapper';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableWrapper from '$components/table/TableWrapper';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {createLandUseContract, fetchLandUseContractAttributes, fetchLandUseContractList} from '$src/landUseContract/actions';
import {FormNames} from '$src/landUseContract/enums';
import {getContentLandUseContractList} from '$src/landUseContract/helpers';
import {getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getAttributes, getIsFetching, getLandUseContractList} from '$src/landUseContract/selectors';

import type {Attributes, LandUseContract, LandUseContractList} from '$src/landUseContract/types';

const PAGE_SIZE = 25;

type Props = {
  attributes: Attributes,
  createLandUseContract: Function,
  fetchLandUseContractAttributes: Function,
  fetchLandUseContractList: Function,
  initialize: Function,
  isFetching: boolean,
  landUseContractListData: LandUseContractList,
  location: Object,
  receiveTopNavigationSettings: Function,
  router: Object,
};

type State = {
  activePage: number,
  count: number,
  isModalOpen: boolean,
  landUseContracts: Array<Object>,
  maxPage: number,
  selectedStates: Array<string>,
}

class LandUseContractListPage extends Component<Props, State> {
  state = {
    activePage: 1,
    count: 0,
    isModalOpen: false,
    landUseContracts: [],
    maxPage: 0,
    selectedStates: [],
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {
      attributes,
      fetchLandUseContractAttributes,
      receiveTopNavigationSettings,
      router: {location: {query}},
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('landUseContract'),
      pageTitle: 'Maankäyttösopimukset',
      showSearch: false,
    });

    const page = query.page ? Number(query.page) : 1;
    if(page <= 1) {
      this.setState({activePage: 1});
    } else {
      this.setState({activePage: page});
    }

    this.search();
    this.initializeSearchForm();

    if(isEmpty(attributes)) {
      fetchLandUseContractAttributes();
    }
  }

  componentDidUpdate = (prevProps) => {
    if(JSON.stringify(this.props.location.query) !== JSON.stringify(prevProps.location.query)) {
      this.search();
      this.initializeSearchForm();
    }
    if(prevProps.landUseContractListData !== this.props.landUseContractListData) {
      this.updateTableData();
    }
  }

  handleCreateButtonClick = () => {
    const {initialize} = this.props;

    this.setState({
      isModalOpen: true,
    });

    initialize(FormNames.CREATE_LAND_USE_CONTRACT, {});
  }

  hideCreateLandUseContractModal = () => {
    this.setState({
      isModalOpen: false,
    });
  }

  handleCreateLease = (landUseContract: LandUseContract) => {
    const {createLandUseContract} = this.props;
    createLandUseContract(landUseContract);
  }

  handleSearchChange = (query: Object) => {
    const {router} = this.context;

    this.setState({activePage: 1});
    delete query.page;

    return router.push({
      pathname: getRouteById('landUseContract'),
      query,
    });
  }

  initializeSearchForm = () => {
    const {initialize, router: {location: {query}}} = this.props;

    const searchValues = {...query};
    delete searchValues.page;
    initialize(FormNames.LAND_USE_CONTRACT_SEARCH, searchValues);
  }

  search = () => {
    const {fetchLandUseContractList, router: {location: {query}}} = this.props;

    const searchQuery = {...query};
    delete searchQuery.page;
    fetchLandUseContractList(searchQuery);
  }

  handleRowClick = (id) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('landUseContract')}/${id}`,
      query,
    });
  };

  handlePageClick = (page: number) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    if(page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    return router.push({
      pathname: getRouteById('landUseContract'),
      query,
    });
  }

  updateTableData = () => {
    const {landUseContractListData} = this.props;

    this.setState({
      count: this.getLandUseContractListCount(landUseContractListData),
      landUseContracts: getContentLandUseContractList(landUseContractListData),
      maxPage: this.getLandUseContractListMaxPage(landUseContractListData),
    });
  }

  getLandUseContractListCount = (landUseContractListData: LandUseContractList) => {
    return get(landUseContractListData, 'count', 0);
  }

  getLandUseContractListMaxPage = (landUseContractListData: LandUseContractList) => {
    const count = this.getLandUseContractListCount(landUseContractListData);
    if(!count) {
      return 0;
    }
    return Math.ceil(count/PAGE_SIZE);
  }

  handleSelectedStatesChange = (states: Array<string>) => {
    this.setState({
      selectedStates: states,
    });
  }

  render() {
    const {attributes, isFetching} = this.props;
    const {activePage, isModalOpen, landUseContracts, maxPage, selectedStates} = this.state;
    const stateOptions = getAttributeFieldOptions(attributes, 'state', false);
    const filteredLandUseContracts = selectedStates.length
      ? (landUseContracts.filter((contract) => selectedStates.indexOf(contract.state.toString())  !== -1))
      : landUseContracts;
    const count = filteredLandUseContracts.length;

    return (
      <PageContainer>
        <CreateLandUseContractModal
          isOpen={isModalOpen}
          onClose={this.hideCreateLandUseContractModal}
          onSubmit={this.handleCreateLease}
        />

        <SearchWrapper
          buttonComponent={
            <Button
              className='no-margin'
              onClick={this.handleCreateButtonClick}
              text='Luo maankäyttösopimus'
            />
          }
          searchComponent={
            <Search
              onSearch={this.handleSearchChange}
            />
          }
        />

        <Row>
          <Column small={12} medium={6}></Column>
          <Column small={12} medium={6}>
            <TableFilters
              amountText={isFetching ? 'Ladataan...' : `Löytyi ${count} kpl`}
              filterOptions={stateOptions}
              filterValue={selectedStates}
              onFilterChange={this.handleSelectedStatesChange}
            />
          </Column>
        </Row>

        <TableWrapper>
          {isFetching &&
            <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={isFetching} /></LoaderWrapper>
          }
          <SortableTable
            columns={[
              {key: 'identifier', text: 'MA-tunnus'},
              {key: 'litigants', text: 'Osapuoli', renderer: (val) => val.map((litigant, index) => <ListItem key={index}>{litigant}</ListItem>)},
              {key: 'plan_number', text: 'Asemakaavan numero'},
              {key: 'area', text: 'Kohde'},
              {key: 'project_area', text: 'Hankealue'},
              {key: 'state', text: 'Neuvotteluvaihe', renderer: (val) => getLabelOfOption(stateOptions, val)},
            ]}
            data={filteredLandUseContracts}
            onRowClick={this.handleRowClick}
          />
          <Pagination
            activePage={activePage}
            maxPage={maxPage}
            onPageClick={this.handlePageClick}
          />
        </TableWrapper>
      </PageContainer>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        isFetching: getIsFetching(state),
        landUseContractListData: getLandUseContractList(state),
      };
    },
    {
      createLandUseContract,
      fetchLandUseContractAttributes,
      fetchLandUseContractList,
      initialize,
      receiveTopNavigationSettings,
    }
  ),
)(LandUseContractListPage);

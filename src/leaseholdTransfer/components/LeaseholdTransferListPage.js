// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {initialize} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import AuthorizationError from '$components/authorization/AuthorizationError';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import Search from '$src/leaseholdTransfer/components/search/Search';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableWrapper from '$components/table/TableWrapper';
import {fetchLeaseholdTransferList} from '$src/leaseholdTransfer/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {LIST_TABLE_PAGE_SIZE} from '$src/constants';
import {DEFAULT_SORT_KEY, DEFAULT_SORT_ORDER} from '$src/leaseholdTransfer/constants';
import {FormNames, Methods, PermissionMissingTexts} from '$src/enums';
import {LeaseholdTransferFieldPaths, LeaseholdTransferFieldTitles} from '$src/leaseholdTransfer/enums';
import {
  getLeaseholdTransferListCount,
  getLeaseholdTransferListMaxPage,
  getLeaseholdTransfers,
  mapLeaseholdTransferSearchFilters,
} from '$src/leaseholdTransfer/helpers';
import {
  formatDate,
  getSearchQuery,
  getUrlParams,
  isFieldAllowedToRead,
  isMethodAllowed,
  setPageTitle,
} from '$src/util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getIsFetching, getLeaseholdTransferList} from '$src/leaseholdTransfer/selectors';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';

import type {Attributes, Methods as MethodsType} from '$src/types';
import type {LeaseholdTransferList} from '$src/leaseholdTransfer/types';

const getColumns = (leaseholdTransferAttributes: Attributes) => {
  const columns = [];

  if(isFieldAllowedToRead(leaseholdTransferAttributes, LeaseholdTransferFieldPaths.PROPERTIES)) {
    columns.push({
      key: 'properties',
      text: LeaseholdTransferFieldTitles.PROPERTIES,
      sortable: false,
    });
  }
  if(isFieldAllowedToRead(leaseholdTransferAttributes, LeaseholdTransferFieldPaths.INSTITUTION_IDENTIFIER)) {
    columns.push({
      key: 'institution_identifier',
      text: LeaseholdTransferFieldTitles.INSTITUTION_IDENTIFIER,
    });
  }
  if(isFieldAllowedToRead(leaseholdTransferAttributes, LeaseholdTransferFieldPaths.DECISION_DATE)) {
    columns.push({
      key: 'decision_date',
      text: LeaseholdTransferFieldTitles.DECISION_DATE,
      renderer: (val) => formatDate(val),
    });
  }
  if(isFieldAllowedToRead(leaseholdTransferAttributes, LeaseholdTransferFieldPaths.PARTIES)) {
    columns.push({
      key: 'conveyors',
      text: LeaseholdTransferFieldTitles.CONVEYORS,
      renderer: (val) => val.name,
      sortable: false,
    });
  }
  if(isFieldAllowedToRead(leaseholdTransferAttributes, LeaseholdTransferFieldPaths.PARTIES)) {
    columns.push({
      key: 'acquirers',
      text: LeaseholdTransferFieldTitles.ACQUIRERS,
      renderer: (val) => val.name,
      sortable: false,
    });
  }

  return columns;
};

type Props = {
  fetchLeaseholdTransferList: Function,
  history: Object,
  initialize: Function,
  isFetching: boolean,
  isFetchingCommonAttributes: boolean,
  leaseholdTransferAttributes: Attributes,
  leaseholdTransferList: LeaseholdTransferList,
  leaseholdTransferMethods: MethodsType,
  location: Object,
  receiveTopNavigationSettings: Function,
}

type State = {
  activePage: number,
  columns: Array<Object>,
  count: number,
  isSearchInitialized: boolean,
  leaseholdTransferAttributes: Attributes,
  leaseholdTransferList: LeaseholdTransferList,
  leaseholdTransfers: Array<Object>,
  maxPage: number,
  sortKey: string,
  sortOrder: string,
}

class LeaseholdTransferListPage extends PureComponent<Props, State> {
  state = {
    activePage: 1,
    columns: [],
    count: 0,
    isSearchInitialized: false,
    leaseholdTransferAttributes: null,
    leaseholdTransferList: {},
    leaseholdTransfers: [],
    maxPage: 0,
    sortKey: DEFAULT_SORT_KEY,
    sortOrder: DEFAULT_SORT_ORDER,
  }

  componentDidMount() {
    const {receiveTopNavigationSettings} = this.props;

    setPageTitle('Vuokraoikeuden siirrot');

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.LEASEHOLD_TRANSFER),
      pageTitle: 'Vuokraoikeuden siirrot',
      showSearch: false,
    });

    this.search();

    this.setSearchFormValues();

    window.addEventListener('popstate', this.handlePopState);
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.leaseholdTransferAttributes !== state.leaseholdTransferAttributes) {
      newState.leaseholdTransferAttributes = props.leaseholdTransferAttributes;
      newState.columns = getColumns(props.leaseholdTransferAttributes);
    }
    if(props.leaseholdTransferList !== state.leaseholdTransferList) {
      newState.leaseholdTransferList = props.leaseholdTransferList;
      newState.count = getLeaseholdTransferListCount(props.leaseholdTransferList);
      newState.leaseholdTransfers = getLeaseholdTransfers(props.leaseholdTransferList);
      newState.maxPage = getLeaseholdTransferListMaxPage(props.leaseholdTransferList, LIST_TABLE_PAGE_SIZE);
    }

    return !isEmpty(newState) ? newState : null;
  }

  componentDidUpdate(prevProps) {
    const {location: {search: currentSearch}} = this.props;
    const {location: {search: prevSearch}} = prevProps;
    const searchQuery = getUrlParams(currentSearch);

    if(currentSearch !== prevSearch) {
      this.search();

      delete searchQuery.sort_key;
      delete searchQuery.sort_order;

      if(!Object.keys(searchQuery).length) {
        this.setSearchFormValues();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handlePopState);
  }

  handlePopState = () => {
    this.setSearchFormValues();
  }

  setSearchFormValues = () => {
    const {location: {search}, initialize} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    const setSearchFormReady = () => {
      this.setState({isSearchInitialized: true});
    };

    const initializeSearchForm = async() => {
      const initialValues = {...searchQuery};

      delete initialValues.page;
      delete initialValues.sort_key;
      delete initialValues.sort_order;
      await initialize(FormNames.LEASEHOLD_TRANSFER_SEARCH, initialValues);
    };

    this.setState({
      activePage: page,
      isSearchInitialized: false,
      sortKey: searchQuery.sort_key || DEFAULT_SORT_KEY,
      sortOrder: searchQuery.sort_order || DEFAULT_SORT_ORDER,
    }, async() => {
      await initializeSearchForm();
      setSearchFormReady();
    });
  }

  search = () => {
    const {fetchLeaseholdTransferList, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    if(page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    delete searchQuery.page;

    searchQuery.sort_key = searchQuery.sort_key || DEFAULT_SORT_KEY;
    searchQuery.sort_order = searchQuery.sort_order || DEFAULT_SORT_ORDER;

    fetchLeaseholdTransferList(mapLeaseholdTransferSearchFilters(searchQuery));
  }

  handleSearchChange = (query: any, resetActivePage?: boolean = false) => {
    const {history} = this.props;

    if(resetActivePage) {
      this.setState({activePage: 1});
    }

    return history.push({
      pathname: getRouteById(Routes.LEASEHOLD_TRANSFER),
      search: getSearchQuery(query),
    });
  }

  handleSortingChange = ({sortKey, sortOrder}) => {
    const {location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    searchQuery.sort_key = sortKey;
    searchQuery.sort_order = sortOrder;

    this.setState({
      sortKey,
      sortOrder,
    });

    this.handleSearchChange(searchQuery);
  }

  handlePageClick = (page: number) => {
    const {history, location: {search}} = this.props;
    const query = getUrlParams(search);

    if(page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    this.setState({activePage: page});

    return history.push({
      pathname: getRouteById(Routes.LEASEHOLD_TRANSFER),
      search: getSearchQuery(query),
    });
  }

  render() {
    const {
      isFetching,
      isFetchingCommonAttributes,
      leaseholdTransferMethods,
    } = this.props;
    const {
      activePage,
      columns,
      count,
      isSearchInitialized,
      leaseholdTransfers,
      maxPage,
      sortKey,
      sortOrder,
    } = this.state;

    if(isFetchingCommonAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!leaseholdTransferMethods) return null;

    if(!isMethodAllowed(leaseholdTransferMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.LEASEHOLD_TRANSFER} /></PageContainer>;

    return (
      <PageContainer>
        <Row>
          <Column small={12} large={6}></Column>
          <Column small={12} large={6}>
            <Search
              isSearchInitialized={isSearchInitialized}
              onSearch={this.handleSearchChange}
              sortKey={sortKey}
              sortOrder={sortOrder}
            />
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6}></Column>
          <Column small={12} medium={6}>
            <TableFilters
              amountText={isFetching ? 'Ladataan...' : `Löytyi ${count} kpl`}
              filterOptions={[]}
              filterValue={[]}
            />
          </Column>
        </Row>

        <TableWrapper>
          {isFetching &&
            <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={isFetching} /></LoaderWrapper>
          }
          <SortableTable
            columns={columns}
            data={leaseholdTransfers}
            listTable
            onSortingChange={this.handleSortingChange}
            serverSideSorting
            showCollapseArrowColumn
            sortable
            sortKey={sortKey}
            sortOrder={sortOrder}
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
  withCommonAttributes,
  withRouter,
  connect(
    (state) => {
      return {
        isFetching: getIsFetching(state),
        leaseholdTransferList: getLeaseholdTransferList(state),
      };
    },
    {
      fetchLeaseholdTransferList,
      initialize,
      receiveTopNavigationSettings,
    },
  ),
)(LeaseholdTransferListPage);

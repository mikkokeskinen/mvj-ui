// @flow
import React, {Component} from 'react';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import classNames from 'classnames';
import scrollToComponent from 'react-scroll-to-component';

import {formatDate,
  formatDateRange,
  formatDecimalNumber,
  formatNumberWithThousandSeparator} from '$util/helpers';
import BillModal from './BillModal';
import {getLabelOfOption} from '$util/helpers';
import {billingStatusOptions, billingTypeOptions} from '../constants';

const MODAL_HEIGHT = 530;
const MODAL_WIDTH = 700;

type Props = {
  bills: Array<Object>,
}

type State = {
  selectedBill: Object,
  selectedBillIndex: number,
  showAllColumns: boolean,
  showModal: boolean,
  tableHeight: ?number,
  tableWidth: ?number,
}

class BillsTable extends Component {
  props: Props

  container: any
  modal: any
  tableElement: any
  tableWrapper : any

  state: State = {
    selectedBill: {},
    selectedBillIndex: -1,
    showAllColumns: true,
    showModal: false,
    tableHeight: null,
    tableWidth: null,
  }

  calculateHeight = () => {
    let {clientHeight} = this.tableElement;
    const {showModal} = this.state;

    if(showModal) {clientHeight = MODAL_HEIGHT;}
    if(clientHeight > MODAL_HEIGHT) {clientHeight = MODAL_HEIGHT;}

    this.setState({tableHeight: clientHeight});
  }

  calculateTableWidth = () => {
    let {clientWidth} = this.container;
    const {showModal} = this.state;

    if(showModal) {
      if(clientWidth - MODAL_WIDTH - 10 <= 0) {
        clientWidth = 0;
      } else {
        clientWidth = clientWidth - MODAL_WIDTH - 10;
      }
    }
    this.setState({tableWidth: clientWidth});
  }

  transitionEnds = () => {
    const {clientWidth} = this.container;
    const {clientWidth: tableWidth} = this.tableWrapper;
    if(clientWidth === tableWidth) {
      this.setState({showAllColumns: true});
    }
  }

  componentDidMount() {
    this.calculateHeight();
    this.calculateTableWidth();
    this.tableWrapper.addEventListener('transitionend', this.transitionEnds);
  }

  componentDidUpdate() {
    this.calculateHeight();
    this.calculateTableWidth();
  }

  shouldComponentUpdate(nextProps: Object, nextState: Object) {
    return (
      this.state.containerWidth !== nextState.containerWidth ||
      this.state.showAllColumns !== nextState.showAllColumns ||
      this.state.tableHeight !== nextState.tableHeight ||
      this.state.selectedBill !== nextState.selectedBill ||
      this.state.showModal !== nextState.showModal
    );
  }

  componentWillUnmount() {
    this.tableWrapper.removeEventListener('transitionend', this.transitionEnds);
  }

  scrolToModal = () => {
    setTimeout(() => {
      scrollToComponent(this.modal, {
        offset: -130,
        align: 'top',
        duration: 450,
      });
    }, 50);
  }

  handleKeyCodeDown = () => {
    const {bills} = this.props;
    const {selectedBillIndex} = this.state;
    if(selectedBillIndex < bills.length - 1) {
      const newIndex = selectedBillIndex + 1;
      this.setState({selectedBill: bills[newIndex], selectedBillIndex: newIndex, showModal: true});
      this.scrolToModal();
    }
  }

  handleKeyCodeUp = () => {
    const {bills} = this.props;
    const {selectedBillIndex} = this.state;
    if(selectedBillIndex > 0) {
      const newIndex = selectedBillIndex - 1;
      this.setState({selectedBill: bills[newIndex], selectedBillIndex: newIndex, showModal: true});
      this.scrolToModal();
    }
  }

  getTableHeaders = () => {
    const {showAllColumns} = this.state;
    if(showAllColumns) {
      return [
        'Vuokraaja',
        'Eräpäivä',
        'Laskun numero',
        'Osuus',
        'Laskutuskausi',
        'Saamislaji',
        'Laskun tila',
        'Laskutettu',
        'Maksamatta',
        'Tiedote',
        'Läh. SAP:iin',
      ];
    } else {
      return [
        'Vuokraaja',
        'Eräpäivä',
        'Laskun numero',
        'Osuus',
      ];
    }
  }

  render () {
    const {bills} = this.props;
    const {selectedBill, showAllColumns, showModal, tableHeight, tableWidth} = this.state;
    const headers = this.getTableHeaders();

    return (
      <div
        className='billing__bill-table'
        ref={(ref) => this.container = ref}>
        <div
          className='table-wrapper'
          ref={(ref) => this.tableWrapper = ref}
          style={{maxWidth: tableWidth}}>
          <div className={classNames('table-fixed-header', 'billing-fixed-table', {'is-open': showModal})}>
            <div className="table-fixed-header__container" style={{maxHeight: tableHeight}}>
              <div className="table-fixed-header__header-border" />
              <table
                ref={(ref) => this.tableElement = ref}>
                <thead>
                  {headers && !!headers.length &&
                    <tr>
                      {headers.map((header, index) => <th key={index}>{header}<div>{header}</div></th>)}
                    </tr>
                  }
                </thead>
                {bills && !!bills.length &&
                  <tbody>
                    {bills.map((bill, index) => {
                      return (
                        <tr
                          className={classNames({'selected': selectedBill === bill})}
                          key={index}
                          onClick={() => {
                            this.setState({
                              showAllColumns: false,
                              selectedBill: bill,
                              selectedBillIndex: index,
                              showModal: true});
                            this.scrolToModal();
                          }}
                          >
                          <td>{`${get(bill, 'tenant.lastname')} ${get(bill, 'tenant.firstname')}`}</td>
                          <td>{bill.due_date ? formatDate(bill.due_date) : '-'}</td>
                          <td>{bill.bill_number ? bill.bill_number : '-'}</td>
                          <td>{get(bill, 'tenant.bill_share') ? `${get(bill, 'tenant.bill_share')} %` : '-'}</td>
                          {showAllColumns &&
                            <td>{formatDateRange(bill.billing_period_start_date, bill.billing_period_end_date)}</td>
                          }
                          {showAllColumns &&
                            <td>{bill.type ? getLabelOfOption(billingTypeOptions, bill.type) : '-'}</td>
                          }
                          {showAllColumns &&
                            <td>{bill.status ? getLabelOfOption(billingStatusOptions, bill.status) : '-'}</td>
                          }
                          {showAllColumns &&
                            <td>{bill.invoiced_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(bill.invoiced_amount))} €` : '-'}</td>
                          }
                          {showAllColumns &&
                            <td>{bill.unpaid_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(bill.unpaid_amount))} €` : '-'}</td>
                          }
                          {showAllColumns &&
                            <td>{bill.info ? 'Kyllä' : 'Ei'}</td>
                          }
                          {showAllColumns &&
                            <td>{bill.sent_to_SAP_date ? formatDate(bill.sent_to_SAP_date) : '-'}</td>
                          }
                        </tr>
                      );
                    })}
                  </tbody>
                }
                {!bills || !bills.length && <tbody><tr className='no-data'><td colSpan={showAllColumns ? 11 : 4}>Ei laskuja</td></tr></tbody>}
              </table>
            </div>
          </div>
        </div>
        <BillModal
          ref={(ref) => this.modal = ref}
          bill={selectedBill}
          containerHeight={isNumber(tableHeight) ? tableHeight + 33 : null}
          onClose={() => this.setState({selectedBill: {}, selectedBillIndex: -1, showModal: false})}
          onKeyCodeDown={() => this.handleKeyCodeDown()}
          onKeyCodeUp={() => this.handleKeyCodeUp()}
          show={showModal}
        />
      </div>
    );
  }
}

export default BillsTable;

// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import classNames from 'classnames';
import ReactResizeDetector from 'react-resize-detector';
import {Row, Column} from 'react-foundation';

type Props = {
  children: Object,
  className?: string,
  defaultOpen: boolean,
  hasErrors: boolean,
  header?: any,
  headerTitle: any,
  showTitleOnOpen?: boolean,
}

type State = {
  contentHeight: number,
  isOpen: boolean,
  isResizing: boolean,
  isVisible: boolean,
}

class Collapse extends Component<Props, State> {
  component: any
  content: any
  _isMounted: boolean;

  static defaultProps = {
    defaultOpen: false,
    hasErrors: false,
    showTitleOnOpen: false,
  };

  componentWillMount() {
    const {defaultOpen} = this.props;
    this.setState({
      isOpen: defaultOpen,
      isResizing: false,
      isVisible: defaultOpen,
    });
  }

  componentDidMount() {
    this.component.addEventListener('transitionend', this.transitionEnds);
    this.calculateHeight();
    this._isMounted = true;
  }

  componentWillUnmount() {
    this.component.removeEventListener('transitionend', this.transitionEnds);
    this._isMounted = false;
  }

  componentDidUpdate = (nextProps: Object, nextState: Object) => {
    if(this.state.isOpen !== nextState.isOpen || this.props !== nextProps) {
      this.calculateHeight();
    }
  }

  onResize = () => {
    this.setState({isResizing: true});
    this.calculateHeight();

    setTimeout(
      () => {
        if(this._isMounted) {
          this.setState({isResizing: false});
        }
      },
      200
    );
  }

  calculateHeight = () => {
    const {clientHeight} = this.content;
    const {isOpen} = this.state;

    this.setState({contentHeight: isOpen ? clientHeight : 0});
  }

  transitionEnds = () => {
    const {isOpen} = this.state;
    this.setState({isVisible: isOpen});
  }

  handleToggle = () => {
    return this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  getChildrenOfHeader = (header: any) => {
    if(!header) {
      return null;
    }
    return header.props.children;
  }

  render() {
    const {contentHeight, isOpen, isResizing, isVisible} = this.state;
    const {children, className, hasErrors, header, headerTitle, showTitleOnOpen} = this.props;

    return (
      <div
        ref={(ref) => this.component = ref}
        className={classNames('collapse', className, {'open': isOpen}, {'is-resizing': isResizing})}
      >
        <div className="collapse__header">
          <div className='icon-wrapper' onClick={this.handleToggle}>
            <i className="arrow-icon"/>
          </div>
          <div className='header-info-wrapper'>
            <Row>
              {headerTitle &&
                <Column>
                  <a
                    className='header-info-link'
                    onClick={this.handleToggle}>
                    {headerTitle}
                  </a>
                </Column>
              }
              {(showTitleOnOpen || !isOpen) && this.getChildrenOfHeader(header)}
            </Row>
            {!isOpen && hasErrors && <span className='collapse__header_error-badge' />}
          </div>
        </div>
        <div
          className={classNames('collapse__content', {'visible': isVisible})}
          style={{maxHeight: contentHeight}}>
          <div
            ref={(ref) => this.content = ref}
            className="collapse__content-wrapper">
            <ReactResizeDetector
              handleHeight
              onResize={this.onResize}
            />
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default flowRight(

)(Collapse);

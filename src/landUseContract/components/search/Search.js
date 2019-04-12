// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import debounce from 'lodash/debounce';
import flowRight from 'lodash/flowRight';
import isEqual from 'lodash/isEqual';

import FormField from '$components/form/FormField';
import SearchClearLink from '$components/search/SearchClearLink';
import SearchContainer from '$components/search/SearchContainer';
import {FormNames} from '$src/enums';
import {FieldTypes} from '$components/enums';

type Props = {
  formValues: Object,
  isSearchInitialized: boolean,
  onSearch: Function,
  states: Array<Object>,
}

class Search extends Component<Props> {
  _isMounted: boolean;

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps: Object) {
    const {isSearchInitialized} = this.props;

    if(isSearchInitialized && !isEqual(prevProps.formValues, this.props.formValues)) {
      this.onSearchChange();
    }
  }

  onSearchChange = debounce(() => {
    if(!this._isMounted) return;

    const {formValues, onSearch, states} = this.props;
    onSearch({...formValues, state: (states.length ? states : undefined)});
  }, 500);

  handleClear = () => {
    const {onSearch} = this.props;

    onSearch({});
  }

  render () {
    return (
      <SearchContainer>
        <Row>
          <Column large={12}>
            <FormField
              disableDirty
              fieldAttributes={{
                label: 'Hae hakusanalla',
                type: FieldTypes.SEARCH,
                read_only: false,
              }}
              invisibleLabel
              name='search'
            />
          </Column>
        </Row>
        <Row>
          <Column small={12}>
            <SearchClearLink onClick={this.handleClear}>Tyhjennä haku</SearchClearLink>
          </Column>
        </Row>
      </SearchContainer>
    );
  }
}

const formName = FormNames.LAND_USE_CONTRACT_SEARCH;

export default flowRight(
  connect(
    state => {
      return {
        formValues: getFormValues(formName)(state),
      };
    },
  ),
  reduxForm({
    form: formName,
  }),
)(Search);

// @flow
import React from 'react';
import classNames from 'classnames';

import CheckboxInput from '$components/inputs/CheckboxInput';

type Props = {
  alignFiltersRight?: boolean,
  amountText: string,
  filterOptions: Array<Object>,
  filterValue: Array<string>,
  onFilterChange?: Function,
}
const TableFilters = ({
  alignFiltersRight,
  amountText,
  filterOptions,
  filterValue,
  onFilterChange,
}: Props) => {
  const handleFilterChange = (values: Array<Object>) => {
    if(onFilterChange) {
      onFilterChange(values);
    }
  };

  return (
    <div className='table__filters'>
      <div className='table__filters_filter-wrapper'>
        <div className={classNames('table__filters_filter-inner-wrapper', {
          'table__filters_filter-inner-wrapper--align-right': alignFiltersRight,
        })}>
          {!!filterOptions.length &&
            <p className='table__filters_filter-wrapper_title'>Suodatus</p>
          }
          <CheckboxInput
            checkboxName='lease-type-checkbox'
            legend='Suodata'
            onChange={handleFilterChange}
            options={filterOptions}
            selectAllButton={false}
            value={filterValue}
          />
        </div>
      </div>
      <div className='table__filters_amount-wrapper'>
        <span>{amountText}</span>
      </div>
    </div>
  );
};

export default TableFilters;

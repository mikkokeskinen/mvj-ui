// @flow
import React, {Component} from 'react';
import forEach from 'lodash/forEach';

type Props = {
  checkboxName: string,
  onChange: Function,
  options: Array<Object>,
  selectAllButton?: boolean,
  selectAllButtonLabel?: string,
  value: Array<string>,
}

class StyledCheckboxButtons extends Component {
  props: Props

  handleChange = (event: any) => {
    const {onChange, value} = this.props;
    const newValue = [...value];
    const optionValue = event.target.value;

    if (event.target.checked) {
      newValue.push(optionValue);
    } else {
      newValue.splice(newValue.indexOf(optionValue), 1);
    }
    onChange(newValue);
  }

  areAllOptionsSelected = () => {
    const {options, value} = this.props;

    let allSelected = true;
    forEach(options, (option) => {
      if(value.indexOf(option.value) === -1) {
        allSelected = false;
        return;
      }
    });
    return allSelected;
  }

  unselectAll = () => {
    const {onChange} = this.props;
    onChange([]);
  }

  selectAll = () => {
    const {onChange, options} = this.props;
    const newValues = [];
    forEach(options, (option) => {
      newValues.push(option.value);
    });

    onChange(newValues);
  }

  render () {
    const {checkboxName, options, selectAllButton, selectAllButtonLabel = 'Kaikki', value} = this.props;
    const areAllSelected = this.areAllOptionsSelected();

    return (
      <div className='styled-checkbox-buttons'>
        {selectAllButton &&
          <label className='label select-all'>
            <input
              className='checkbox'
              type='checkbox'
              checked={areAllSelected}
              onClick={() => {
                if(!areAllSelected) {
                  this.selectAll();
                } else {
                  this.unselectAll();
                }
              }} />
            <span className='option-label'>{selectAllButtonLabel}</span>
          </label>
        }
        {options.map((option, index) => {
          return (
            <label className='label' key={index}>
              <input
                className='checkbox'
                type='checkbox'
                name={checkboxName}
                checked={value.indexOf(option.value) !== -1}
                value={option.value}
                onChange={this.handleChange} />
              <span className='option-label'>{option.label}</span>
            </label>
          );
        })}
      </div>
    );
  }
}

export default StyledCheckboxButtons;
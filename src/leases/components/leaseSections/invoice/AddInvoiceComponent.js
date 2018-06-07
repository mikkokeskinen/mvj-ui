// @flow
import React, {Component} from 'react';
import scrollToComponent from 'react-scroll-to-component';

import Button from '$components/button/Button';
import FormSection from '$components/form/FormSection';
import NewInvoiceForm from './forms/NewInvoiceForm';

type Props = {
  editMode: boolean,
  onAdd: Function,
  onClose: Function,
  onSave: Function,
  onStartInvoicing: Function,
  onStopInvoicing: Function,
  ref?: Function,
  showStartInvoicingButton: boolean,
}

class AddInvoiceComponent extends Component <Props> {
  panel: any

  handleOnAdd = () => {
    const {onAdd} = this.props;

    onAdd();
    setTimeout(() => {
      scrollToComponent(this.panel, {
        offset: -70,
        align: 'top',
        duration: 450,
      });
    }, 50);
  }

  render() {
    const {
      editMode,
      onClose,
      onSave,
      onStartInvoicing,
      onStopInvoicing,
      showStartInvoicingButton,
    } = this.props;
    return (
      <div className='invoice__add-invoice'>
        <FormSection>
          <div>
            <Button
              className='button-green no-margin'
              disabled={editMode}
              label='+ Luo lasku'
              onClick={this.handleOnAdd}
              title='Luo lasku'
            />
            {showStartInvoicingButton
              ? (
                <Button
                  className='button-green'
                  label='Käynnistä laskutus'
                  onClick={() => onStartInvoicing()}
                  title='Käynnistä laskutus'
                />
              ) : (
                <Button
                  className='button-red'
                  label='Keskeytä laskutus'
                  onClick={() => onStopInvoicing()}
                  title='Keskeytä laskutus'
                />
              )
            }
          </div>
          <div ref={(ref) => this.panel = ref}>
            {editMode &&
              <NewInvoiceForm
                onClose={onClose}
                onSave={(invoice) => onSave(invoice)}
              />
            }
          </div>
        </FormSection>
      </div>
    );
  }
}

export default AddInvoiceComponent;

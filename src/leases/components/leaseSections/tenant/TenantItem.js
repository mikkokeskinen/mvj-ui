// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

import {formatDate} from '$util/helpers';
import ContactInfo from './ContactInfo';

import type {Attributes as ContactAttributes} from '$src/contacts/types';

type Props = {
  contact: Object,
  contactAttributes: ContactAttributes,
  tenant: Object,
};

const TenantItem = ({
  contact,
  contactAttributes,
  tenant,
}: Props) => {
  const getFullName = () => {
    return contact.is_business ? contact.business_name : `${contact.last_name} ${contact.first_name}`;
  };

  const getInvoiceManagementShare = () => {
    if(!tenant ||
      !tenant.share_numerator ||
      !isNumber(Number(tenant.share_numerator)) ||
      !tenant.share_denominator ||
      !isNumber(Number(tenant.share_denominator))) {
      return null;
    }
    return `${(Number(tenant.share_numerator)*100/Number(tenant.share_denominator)).toFixed(1)} %`;
  };

  if(!contact) {
    return null;
  }

  return (
    <div>
      <Row>
        <Column small={12} medium={6} large={4}>
          <label>Asiakas</label>
          <p>{getFullName()}</p>
        </Column>
        <Column small={12} medium={6} large={2}>
          <label>Osuus murtolukuna</label>
          <p>{tenant.share_numerator || ''} / {tenant.share_denominator || ''}</p>
        </Column>
        <Column small={12} medium={6} large={2}>
          <label>Laskun hallintaosuus</label>
          <p>{getInvoiceManagementShare()}</p>
        </Column>
        <Column small={12} medium={6} large={2}>
          <label>Alkupäivämäärä</label>
          <p>{formatDate(get(tenant, 'tenant.start_date')) || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={2}>
          <label>Loppupäivämäärä</label>
          <p>{formatDate(get(tenant, 'tenant.end_date')) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={4}>
          <label>Viite</label>
          <p>{tenant.reference || '-'}</p>
        </Column>
        <Column small={6} medium={8} large={8}>
          <label>Kommentti</label>
          <p>{tenant.note || '-'}</p>
        </Column>
      </Row>
      <ContactInfo
        contact={contact}
        contactAttributes={contactAttributes}
      />
    </div>
  );
};

export default TenantItem;

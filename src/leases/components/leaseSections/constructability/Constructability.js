// @flow
import React from 'react';
import Collapse from '$components/collapse/Collapse';
import ConstructabilityItem from './ConstructabilityItem';
import {Column} from 'react-foundation';

import {getAttributeFieldOptions, getLabelOfOption} from '$src/util/helpers';

import type {Attributes} from '$src/leases/types';
import type {UserList} from '$src/users/types';

type Props = {
  areas: Array<Object>,
  attributes: Attributes,
  users: UserList,
}

const Constructability = ({areas, attributes, users}: Props) => {
  const getFullAddress = (item: Object) => {
    return `${item.address}, ${item.postal_code} ${item.city}`;
  };

  const locationOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.location');
  const typeOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.type');

  return (
    <div>
      {!areas || !areas.length &&
        <p className='no-margin'>Ei vuokra-alueita</p>
      }
      {areas && !!areas.length && areas.map((area) =>
        <Collapse key={area.id}
          defaultOpen={true}
          header={
            <div>
              <Column>
                <span className='collapse__header-subtitle'>
                  {getLabelOfOption(typeOptions, area.type) || '-'}
                </span>
              </Column>
              <Column>
                <span className='collapse__header-subtitle'>
                  {getFullAddress(area)}
                </span>
              </Column>
              <Column>
                <span className='collapse__header-subtitle'>
                  {area.area} m<sup>2</sup> / {getLabelOfOption(locationOptions, area.location)}
                </span>
              </Column>
            </div>
          }
          headerTitle={
            <h3 className='collapse__header-title'>{area.identifier || '-'}</h3>
          }
        >
          <ConstructabilityItem
            area={area}
            attributes={attributes}
            users={users}
          />
        </Collapse>
      )}
    </div>
  );
};

export default Constructability;

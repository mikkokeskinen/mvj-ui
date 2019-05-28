// @flow
import React, {Fragment, PureComponent, type Element} from 'react';
import {change, FieldArray} from 'redux-form';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import AddButtonThird from '$components/form/AddButtonThird';
import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import DecisionLink from '$components/links/DecisionLink';
import Divider from '$components/content/Divider';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import GreenBox from '$components/content/GreenBox';
import RemoveButton from '$components/form/RemoveButton';
import RentAdjustmentManagementSubventionEdit from './RentAdjustmentManagementSubventionEdit';
import RentAdjustmentTemporarySubventionEdit from './RentAdjustmentTemporarySubventionEdit';
import SubTitle from '$components/content/SubTitle';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {
  LeaseRentAdjustmentsFieldPaths,
  LeaseRentAdjustmentsFieldTitles,
  RentAdjustmentManagementSubventionsFieldPaths,
  RentAdjustmentManagementSubventionsFieldTitles,
  RentAdjustmentTemporarySubventionsFieldPaths,
  RentAdjustmentTemporarySubventionsFieldTitles,
  RentAdjustmentAmountTypes,
  RentAdjustmentTypes,
  SubventionTypes,
} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {
  calculateReLeaseDiscountPercent,
  calculateRentAdjustmentSubventionAmount,
  getDecisionById,
} from '$src/leases/helpers';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {
  formatNumber,
  getFieldAttributes,
  getLabelOfOption,
  hasPermissions,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isFieldRequired,
} from '$util/helpers';
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type ManagementSubventionsProps = {
  fields: any,
  leaseAttributes: Attributes,
  usersPermissions: UsersPermissionsType,
}

const renderManagementSubventions = ({
  fields,
  leaseAttributes,
  usersPermissions,
}: ManagementSubventionsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!isFieldAllowedToEdit(leaseAttributes, RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS) && (!fields || !fields.length) &&
              <FormText>Ei hallintamuotoja</FormText>
            }

            {fields && !!fields.length &&
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT)}>
                    <FormTextTitle
                      required={isFieldRequired(leaseAttributes, RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT)}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT)}
                    >
                      {RentAdjustmentManagementSubventionsFieldTitles.MANAGEMENT}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, RentAdjustmentManagementSubventionsFieldPaths.SUBVENTION_PERCENT)}>
                    <FormTextTitle
                      required={isFieldRequired(leaseAttributes, RentAdjustmentManagementSubventionsFieldPaths.SUBVENTION_PERCENT)}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(RentAdjustmentManagementSubventionsFieldPaths.SUBVENTION_PERCENT)}
                    >
                      {RentAdjustmentManagementSubventionsFieldTitles.SUBVENTION_PERCENT}
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
            }

            {!!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: 'Poista',
                  confirmationModalLabel: DeleteModalLabels.LEASE_MANAGEMENT_SUBVENTION,
                  confirmationModalTitle: DeleteModalTitles.LEASE_MANAGEMENT_SUBVENTION,
                });
              };

              return <RentAdjustmentManagementSubventionEdit
                key={index}
                field={field}
                onRemove={handleRemove}
              />;
            })}

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_MANAGEMENTSUBVENTION)}>
              <Row>
                <Column>
                  <AddButtonThird
                    label='Lisää hallintamuoto'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type TemporarySubventionsProps = {
  fields: any,
  leaseAttributes: Attributes,
  usersPermissions: UsersPermissionsType,
}

const renderTemporarySubventions = ({
  fields,
  leaseAttributes,
  usersPermissions,
}: TemporarySubventionsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!isFieldAllowedToEdit(leaseAttributes, RentAdjustmentTemporarySubventionsFieldPaths.TEMPORARY_SUBVENTIONS) && (!fields || !fields.length) &&
              <FormText>Ei tilapäisalennuksia</FormText>
            }

            {fields && !!fields.length &&
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, RentAdjustmentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                    <FormTextTitle
                      required={isFieldRequired(leaseAttributes, RentAdjustmentTemporarySubventionsFieldPaths.DESCRIPTION)}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(RentAdjustmentTemporarySubventionsFieldPaths.DESCRIPTION)}
                    >
                      {RentAdjustmentTemporarySubventionsFieldTitles.DESCRIPTION}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, RentAdjustmentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}>
                    <FormTextTitle
                      required={isFieldRequired(leaseAttributes, RentAdjustmentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(RentAdjustmentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}
                    >
                      {RentAdjustmentTemporarySubventionsFieldTitles.SUBVENTION_PERCENT}
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
            }

            {!!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: 'Poista',
                  confirmationModalLabel: DeleteModalLabels.LEASE_TEMPORARY_SUBVENTION,
                  confirmationModalTitle: DeleteModalTitles.LEASE_TEMPORARY_SUBVENTION,
                });
              };

              return <RentAdjustmentTemporarySubventionEdit
                key={index}
                field={field}
                onRemove={handleRemove}
              />;
            })}

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_TEMPORARYSUBVENTION)}>
              <Row>
                <Column>
                  <AddButtonThird
                    className='no-bottom-margin'
                    label='Lisää tilapäisalennus'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  amountType: ?string,
  amountTypeOptions: Array<Object>,
  change: Function,
  currentLease:Lease,
  decisionOptions: Array<Object>,
  field: string,
  fullAmount: ?number,
  isSaveClicked: boolean,
  leaseAttributes: Attributes,
  managementSubventions: ?Array<Object>,
  onRemove: Function,
  subventionBasePercent: ?string,
  subventionGraduatedPercent: ?string,
  subventionType: ?string,
  temporarySubventions: ?Array<Object>,
  type: ?string,
  usersPermissions: UsersPermissionsType,
}

type State = {
  showSubventions: boolean,
}

class RentAdjustmentsEdit extends PureComponent<Props, State> {
  state = {
    showSubventions: this.props.subventionType ? true : false,
  }

  componentDidUpdate(prevProps: Props) {
    if(this.props.subventionType !== prevProps.subventionType ||
      this.props.subventionBasePercent !== prevProps.subventionBasePercent ||
      this.props.subventionGraduatedPercent !== prevProps.subventionGraduatedPercent ||
      this.props.managementSubventions !== prevProps.managementSubventions ||
      this.props.temporarySubventions !== prevProps.temporarySubventions) {
      const {change, field} = this.props;

      change(formName, `${field}.full_amount`, formatNumber(this.calculateSubventionAmount()));
    }
  }

  decisionReadOnlyRenderer = (value: ?number) => {
    const {currentLease, decisionOptions} = this.props;

    return <DecisionLink
      decision={getDecisionById(currentLease, value)}
      decisionOptions={decisionOptions}
    />;
  };

  getFullAmountText = () => {
    const {amountType, amountTypeOptions, fullAmount} = this.props;

    if(!fullAmount) return null;

    return `${formatNumber(fullAmount)} ${getLabelOfOption(amountTypeOptions, amountType)}`;
  };

  handleAddSubventions = () => {
    this.setState({showSubventions: true});
  }

  handleRemoveSubventions = () => {
    const {change, field} = this.props;

    change(formName, `${field}.subvention_type`, null);
    this.setState({showSubventions: false});
  }

  calculateReLeaseDiscountPercent = () => {
    const {subventionBasePercent, subventionGraduatedPercent} = this.props;

    return calculateReLeaseDiscountPercent(subventionBasePercent, subventionGraduatedPercent);
  }

  calculateSubventionAmount = () => {
    const {subventionType, subventionBasePercent, subventionGraduatedPercent, managementSubventions, temporarySubventions} = this.props;

    return calculateRentAdjustmentSubventionAmount(
      subventionType,
      subventionBasePercent,
      subventionGraduatedPercent,
      managementSubventions,
      temporarySubventions);
  }

  render() {
    const {
      amountType,
      decisionOptions,
      field,
      isSaveClicked,
      leaseAttributes,
      onRemove,
      subventionType,
      type,
      usersPermissions,
    } = this.props;
    const {showSubventions} = this.state;

    return (
      <BoxItem>
        <BoxContentWrapper>
          <ActionButtonWrapper>
            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_RENTADJUSTMENT)}>
              <RemoveButton
                onClick={onRemove}
                title="Poista alennus/korotus"
              />
            </Authorization>
          </ActionButtonWrapper>
          <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.TYPE)}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.TYPE)}
                  name={`${field}.type`}
                  overrideValues={{label: LeaseRentAdjustmentsFieldTitles.TYPE}}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.TYPE)}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.INTENDED_USE)}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.INTENDED_USE)}
                  name={`${field}.intended_use`}
                  overrideValues={{label: LeaseRentAdjustmentsFieldTitles.INTENDED_USE}}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.INTENDED_USE)}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Row>
                <Column small={6}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.START_DATE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.START_DATE)}
                      name={`${field}.start_date`}
                      overrideValues={{label: LeaseRentAdjustmentsFieldTitles.START_DATE}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.START_DATE)}
                    />
                  </Authorization>
                </Column>
                <Column small={6}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.END_DATE)}>
                    {amountType !== RentAdjustmentAmountTypes.AMOUNT_TOTAL &&
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.END_DATE)}
                        name={`${field}.end_date`}
                        overrideValues={{label: LeaseRentAdjustmentsFieldTitles.END_DATE}}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.END_DATE)}
                      />
                    }
                  </Authorization>
                </Column>
              </Row>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}>
                <FormTextTitle
                  required={isFieldRequired(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}
                >
                  {LeaseRentAdjustmentsFieldTitles.FULL_AMOUNT}
                </FormTextTitle>

                <Row>
                  <Authorization
                    allow={
                      isFieldAllowedToEdit(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT) ||
                      isFieldAllowedToEdit(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE)
                    }
                    errorComponent={<Column><FormText>{this.getFullAmountText()}</FormText></Column>}
                  >
                    <Column small={6}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}>
                        <FormField
                          disabled={type === RentAdjustmentTypes.DISCOUNT && showSubventions}
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}
                          invisibleLabel
                          name={`${field}.full_amount`}
                          overrideValues={{label: LeaseRentAdjustmentsFieldTitles.FULL_AMOUNT}}
                        />
                      </Authorization>
                    </Column>
                    <Column small={6}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE)}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE)}
                          invisibleLabel
                          name={`${field}.amount_type`}
                          overrideValues={{label: LeaseRentAdjustmentsFieldTitles.AMOUNT_TYPE}}
                        />
                      </Authorization>
                    </Column>
                  </Authorization>
                </Row>
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_LEFT)}>
                {amountType === RentAdjustmentAmountTypes.AMOUNT_TOTAL &&
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_LEFT)}
                    name={`${field}.amount_left`}
                    unit='€'
                    overrideValues={{label: LeaseRentAdjustmentsFieldTitles.AMOUNT_LEFT}}
                    enableUiDataEdit
                    tooltipStyle={{right: 12}}
                    uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.AMOUNT_LEFT)}
                  />
                }
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.DECISION)}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.DECISION)}
                  name={`${field}.decision`}
                  readOnlyValueRenderer={this.decisionReadOnlyRenderer}
                  overrideValues={{
                    label: LeaseRentAdjustmentsFieldTitles.DECISION,
                    options: decisionOptions,

                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.DECISION)}
                />
              </Authorization>
            </Column>
          </Row>
          <Row>
            <Column medium={12}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.NOTE)}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.NOTE)}
                  name={`${field}.note`}
                  overrideValues={{label: LeaseRentAdjustmentsFieldTitles.NOTE}}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.NOTE)}
                />
              </Authorization>
            </Column>
          </Row>

          {type === RentAdjustmentTypes.DISCOUNT && !showSubventions &&
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.SUBVENTION_TYPE)}>
              <Row>
                <Column>
                  <AddButtonSecondary
                    label='Lisää subventio'
                    onClick={this.handleAddSubventions}
                  />
                </Column>
              </Row>
            </Authorization>
          }
          {type === RentAdjustmentTypes.DISCOUNT && showSubventions &&
            <AppConsumer>
              {({dispatch}) => {
                const handleRemoveSubventions = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      this.handleRemoveSubventions();
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText: 'Poista',
                    confirmationModalLabel: DeleteModalLabels.LEASE_SUBVENTIONS,
                    confirmationModalTitle: DeleteModalTitles.LEASE_SUBVENTIONS,
                  });
                };

                return(
                  <GreenBox className='with-bottom-margin'>
                    <ActionButtonWrapper>
                      <RemoveButton
                        onClick={handleRemoveSubventions}
                        title="Poista subventiot"
                      />
                    </ActionButtonWrapper>
                    <Row>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.SUBVENTION_TYPE)}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={{...getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.SUBVENTION_TYPE), required: true}}
                            name={`${field}.subvention_type`}
                            overrideValues={{label: LeaseRentAdjustmentsFieldTitles.SUBVENTION_TYPE}}
                            enableUiDataEdit
                            uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.SUBVENTION_TYPE)}
                          />
                        </Authorization>
                      </Column>
                    </Row>
                    {subventionType === SubventionTypes.X_DISCOUNT &&
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS)}>
                        <SubTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS)}>{RentAdjustmentManagementSubventionsFieldTitles.MANAGEMENT_SUBVENTIONS}</SubTitle>
                        <FieldArray
                          component={renderManagementSubventions}
                          leaseAttributes={leaseAttributes}
                          name={`${field}.management_subventions`}
                          usersPermissions={usersPermissions}
                        />
                      </Authorization>
                    }
                    {subventionType === SubventionTypes.RE_LEASE_DISCOUNT &&
                      <Row>
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.SUBVENTION_BASE_PERCENT)}
                              name={`${field}.subvention_base_percent`}
                              overrideValues={{label: LeaseRentAdjustmentsFieldTitles.SUBVENTION_BASE_PERCENT}}
                              unit='%'
                              enableUiDataEdit
                              uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.SUBVENTION_BASE_PERCENT)}
                            />
                          </Authorization>
                        </Column>
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.SUBVENTION_GRADUATED_PERCENT)}
                              name={`${field}.subvention_graduated_percent`}
                              overrideValues={{label: LeaseRentAdjustmentsFieldTitles.SUBVENTION_GRADUATED_PERCENT}}
                              unit='%'
                              enableUiDataEdit
                              uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.SUBVENTION_GRADUATED_PERCENT)}
                            />
                          </Authorization>
                        </Column>
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.SUBVENTION_BASE_PERCENT) ||
                            isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                            <FormTextTitle  enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.SUBVENTION_RE_LEASE_DISCOUNT_PRECENT)}>
                              {LeaseRentAdjustmentsFieldTitles.SUBVENTION_RE_LEASE_DISCOUNT_PRECENT}
                            </FormTextTitle>
                            <FormText>{this.calculateReLeaseDiscountPercent() || '-'} %</FormText>
                          </Authorization>
                        </Column>
                      </Row>
                    }

                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, RentAdjustmentTemporarySubventionsFieldPaths.TEMPORARY_SUBVENTIONS)}>
                      <SubTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(RentAdjustmentTemporarySubventionsFieldPaths.TEMPORARY_SUBVENTIONS)}>
                        {RentAdjustmentTemporarySubventionsFieldTitles.TEMPORARY_SUBVENTIONS}
                      </SubTitle>
                      <FieldArray
                        component={renderTemporarySubventions}
                        leaseAttributes={leaseAttributes}
                        name={`${field}.temporary_subventions`}
                        usersPermissions={usersPermissions}
                      />
                    </Authorization>

                    <Row>
                      <Column small={12} large={6}>
                        <Divider />
                      </Column>
                    </Row>
                    <Row>
                      <Column small={6} medium={4} large={2}>
                        <FormText className='semibold'>Yhteensä</FormText>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <FormText className='semibold'>{formatNumber(this.calculateSubventionAmount())} %</FormText>
                      </Column>
                    </Row>
                  </GreenBox>
                );
              }}
            </AppConsumer>
          }
        </BoxContentWrapper>
      </BoxItem>
    );
  }
}

const formName = FormNames.LEASE_RENTS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    return {
      amountType: selector(state, `${props.field}.amount_type`),
      currentLease: getCurrentLease(state),
      fullAmount: selector(state, `${props.field}.full_amount`),
      leaseAttributes: getLeaseAttributes(state),
      managementSubventions: selector(state, `${props.field}.management_subventions`),
      subventionBasePercent: selector(state, `${props.field}.subvention_base_percent`),
      subventionGraduatedPercent: selector(state, `${props.field}.subvention_graduated_percent`),
      subventionType: selector(state, `${props.field}.subvention_type`),
      temporarySubventions: selector(state, `${props.field}.temporary_subventions`),
      type: selector(state, `${props.field}.type`),
      usersPermissions: getUsersPermissions(state),
    };
  },
  {
    change,
  },
)(RentAdjustmentsEdit);

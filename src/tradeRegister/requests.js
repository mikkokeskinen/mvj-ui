// @flow
import callApi from '$src/api/callApi';
import createUrlWithoutVersionSuffix from '$src/api/createUrlWithoutVersionSuffix';

export const fetchCompanyExtended = (businessId: string): Generator<any, any, any> => {
  return callApi(new Request(createUrlWithoutVersionSuffix(`trade_register/company_extended/${businessId}/`)));
};

export const fetchCompanyNotice = (businessId: string): Generator<any, any, any> => {
  return callApi(new Request(createUrlWithoutVersionSuffix(`trade_register/company_notice/${businessId}/`)));
};

export const fetchCompanyRepresent = (businessId: string): Generator<any, any, any> => {
  return callApi(new Request(createUrlWithoutVersionSuffix(`trade_register/company_represent/${businessId}/`)));
};

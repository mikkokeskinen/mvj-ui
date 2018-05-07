// @flow

import {takeLatest} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';

import {
  notFound,
  receiveDistrictsByMunicipality,
} from './actions';
import {fetchDistricts} from './requests';
import {receiveError} from '../api/actions';

function* fetchDistrictsByMunicipalitySaga({payload: municipalityId}): Generator<> {
  try {
    let {response: {status: statusCode}, bodyAsJson: body} = yield call(fetchDistricts, `?municipality=${municipalityId}`);
    let districts = body.results;
    while(statusCode === 200 && body.next) {
      const {response: {status}, bodyAsJson} = yield call(fetchDistricts, `?${body.next.split('?').pop()}`);
      statusCode = status;
      body = bodyAsJson;
      districts = [...districts, ...body.results];
    }

    switch (statusCode) {
      case 200:
        yield put(receiveDistrictsByMunicipality({municipality: municipalityId, districts: districts}));
        break;
      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch districts by municipality with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/district/FETCH_BY_MUNICIPALITY', fetchDistrictsByMunicipalitySaga);
    }),
  ];
}
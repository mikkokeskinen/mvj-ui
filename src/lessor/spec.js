// @flow
import {expect} from 'chai';

import {
  fetchLessors,
  receiveLessors,
} from './actions';
import lessorReducer from './reducer';

import type {LessorState} from './types';

const defaultState: LessorState = {
  list: [],
};

// $FlowFixMe
describe('Lessors', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('lessorReducer', () => {

      // $FlowFixMe
      it('fetchLessors should not change state', () => {
        const state = lessorReducer({}, fetchLessors());

        expect(state).to.deep.equal(defaultState);
      });

      it('receive lessor list', () => {
        const dummyLessors = [{
          foo: 'bar',
        }];
        const newState = {...defaultState, list: dummyLessors};

        const state = lessorReducer({}, receiveLessors(dummyLessors));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});

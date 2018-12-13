// @flow
import {expect} from 'chai';
import {
  fetchUsers,
  receiveUsers,
  notFound,
} from './actions';
import usersReducer from './reducer';

import type {UserState} from './types';

const defaultState: UserState = {
  isFetching: false,
  list: [],
};

// $FlowFixMe
describe('Users', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('userReducer', () => {

      // $FlowFixMe
      it('should update user list', () => {
        const dummyUsers = [
          {
            id: 1,
            name: 'User1',
          },
          {
            id: 2,
            name: 'User1',
          },
        ];

        const newState = {...defaultState, list: dummyUsers};

        const state = usersReducer({}, receiveUsers(dummyUsers));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching users', () => {
        const newState = {...defaultState, isFetching: true};

        const state = usersReducer({}, fetchUsers(''));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...defaultState, isFetching: false};

        let state = usersReducer({}, fetchUsers(''));
        state = usersReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});

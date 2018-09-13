import {expect} from 'chai';
import {
  fetchPenaltyInterestByInvoice,
  receivePenaltyInterestByInvoice,
  penaltyInterestNotFoundByInvoice,
} from './actions';
import penaltyInterestReducer from './reducer';

const defaultState = {
  byInvoice: {},
  isFetchingByInvoice: {},
};

describe('PenaltyInterest', () => {

  describe('Reducer', () => {

    describe('penaltyInterestReducer', () => {
      it('should update isFetchingPenaltyInterestByInvoice flag to true when fetching', () => {
        const invoice = 1;
        const newState = {...defaultState, isFetchingByInvoice: {[invoice]: true}};

        const state = penaltyInterestReducer({}, fetchPenaltyInterestByInvoice(invoice));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingPenaltyInterestByInvoice flag to false by penaltyInterestNotFoundByInvoice', () => {
        const invoice = 1;
        const newState = {...defaultState, isFetchingByInvoice: {[invoice]: false}};

        let state = penaltyInterestReducer({}, penaltyInterestNotFoundByInvoice(invoice));
        penaltyInterestReducer(state, penaltyInterestNotFoundByInvoice(invoice));

        expect(state).to.deep.equal(newState);
      });

      it('should update penaltyInterestByInvoice', () => {
        const invoice = 1;
        const dummyPayload = {invoiceId: invoice, penaltyInterest: {foo: 'bar'}};
        const newState = {...defaultState,
          byInvoice: {[dummyPayload.invoiceId]: dummyPayload.penaltyInterest},
          isFetchingByInvoice: {[dummyPayload.invoiceId]: false},
        };

        const state = penaltyInterestReducer({}, receivePenaltyInterestByInvoice(dummyPayload));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});

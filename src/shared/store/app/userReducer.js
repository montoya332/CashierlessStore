import { ActionTypes } from './actions';

export const initialState = Object.freeze({});

export default (state = initialState, action) => {
    const { type, payload = {} } = action;

    switch (type) {
        case ActionTypes.SIGNIN: {
            return {
                ...state,
                ...payload,
            };
        }
    }

    return state;
};

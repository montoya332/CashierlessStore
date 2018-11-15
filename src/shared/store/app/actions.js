// @flow
import type { LocaleT } from './types';

export const ActionTypes = {
    SETLOCALE: 'app/set-locale',
    SIGNIN: 'app/signin',
    SIGNOUT: 'app/signout',
};

export const setLocale = (locale: LocaleT) => ({
    type: ActionTypes.SETLOCALE,
    payload: locale,
});

export const signInUser = (user = {}) => ({
    type: ActionTypes.SIGNIN,
    payload: user,
});

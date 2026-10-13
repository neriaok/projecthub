import { createAction } from '@reduxjs/toolkit';

/** Dispatched on logout and whenever the server rejects the session. */
export const loggedOut = createAction('auth/loggedOut');

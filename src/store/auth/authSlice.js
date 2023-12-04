import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'not-authenticated', //authenticated, not-authenticated
        user: {},
        errorMessage: undefined,
        users: [],
        verificationCode: '',
    },
    reducers: {
        onLogin: (state, {payload}) => {
            state.status= 'authenticated';
            state.user = payload;
            state.errorMessage = undefined;
        },
        onLogout: (state, {payload}) => {
            state.status= 'not-authenticated';
            state.user = {};
            state.errorMessage = payload;
        },
        onRegister: (state) => {
          state.status = 'registering';
          state.user = {};
          state.errorMessage = undefined;
        },
        onGetUsers: (state, {payload}) => {
            state.status = 'authenticated';
            state.users = payload;
            state.errorMessage = undefined;
        },
        onDeleteUser: (state, {payload}) => {
            state.users = state.users.filter(user => user.user_uuid !== payload.user_uuid);
            state.errorMessage = undefined;
        },
        onUpdateUser: (state, {payload}) => {
            const updatedUserIndex = state.users.findIndex(user => user.user_uuid === payload.user_uuid);
            if (updatedUserIndex !== -1) {
                state.users[updatedUserIndex] = payload.updatedUser;
            }
            state.errorMessage = undefined;
        },
        clearErrorMessage: (state) => {
            state.errorMessage = undefined;
        },
    }
});
export const { onChecking, onLogin, onLogout, onRegister, onGetUsers, onDeleteUser, onUpdateUser, clearErrorMessage } = authSlice.actions;

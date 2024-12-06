import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'not-authenticated', //authenticated, not-authenticated
        user: {},
        errorMessage: undefined,
        users: [],
        registrationData: null,
        currentPage: 0,
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
          state.errorMessage = undefined;
        },
        onSetRegistrationData: (state, {payload}) =>{
            state.registrationData = payload;
        },
        onGetUsers: (state, {payload}) => {
            state.status = 'authenticated';
            state.users = payload;
            console.log(payload)
            state.errorMessage = undefined;
        },
        onSetCurrentPage: (state, { payload }) => {
            state.currentPage = payload; 
        },
        onDeleteUser: (state, {payload}) => {
            state.users = state.users.filter(user => user.user_uuid !== payload);
            state.errorMessage = undefined;
        },
        onUpdateUser: (state, {payload}) => {
            const updatedUserIndex = state.users.findIndex(user => user.uid === payload.uid);
            if (updatedUserIndex !== -1) {
                state.users[updatedUserIndex] = payload.updatedUser;
            }
            state.errorMessage = undefined;
        },
        onForceVerification: (state, {payload})=>{
            state.user = { ...state.user, verified: true };
            state.errorMessage = undefined;
        },
        onUpdatePassword: (state, {payload}) => {
            state.user = { ...state.user, password: payload };
            const userIndex = state.users.findIndex(user => user.uid === state.user.uid);
            if (userIndex !== -1) {
                state.users[userIndex] = { ...state.users[userIndex], password: payload };
            }
            state.errorMessage = undefined;
        },
        clearErrorMessage: (state) => {
            state.errorMessage = undefined;
        },
    }
});
export const { onChecking, onLogin, onLogout, onRegister, onSetRegistrationData, onGetUsers, onSetCurrentPage, onForceVerification, onUpdatePassword, onDeleteUser, onUpdateUser, clearErrorMessage } = authSlice.actions;

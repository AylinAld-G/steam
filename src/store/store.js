import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './auth/authSlice'
import { steamSlice } from './steam/steamSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    steam: steamSlice.reducer
  },
})

import { configureStore } from '@reduxjs/toolkit'
import profileReducer from './profileSlice'
import channelReducer from './channelSlice'
export const store = configureStore({
  reducer: {
    change: profileReducer,
    channel: channelReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

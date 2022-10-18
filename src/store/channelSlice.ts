import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProfileState {
  value: string
}

const initialState: ProfileState = {
  value: '#global',
}

const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    channel: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    },
  },
})

export const { channel } = channelSlice.actions
export default channelSlice.reducer

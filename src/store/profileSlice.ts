import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'
interface ProfileState {
  value: string
}

const localeUser = JSON.parse(localStorage.getItem('user') || '{}')
if (!localeUser[0]?.localeId && !localeUser[0]?.name) {
  const localitem = JSON.stringify([
    { name: `Guest${Math.round(Math.random() * 100000)}`, localeId: `${nanoid()}` },
  ])
  localStorage.setItem('user', localitem)
}

const initialState: ProfileState = {
  value: localeUser[0]?.name,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    change: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    },
  },
})

export const { change } = profileSlice.actions
export default profileSlice.reducer

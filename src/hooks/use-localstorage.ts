/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'

const useLocalStorage = (key: string, initialValue: []) => {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })
  const setLocalStorageState = (newState: any) => {
    try {
      const newStateValue = newState === 'function' ? newState(state) : newState
      setState(newStateValue)
      localStorage.setItem(key, JSON.stringify(newStateValue))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Unable to store new value for in localStorag.`)
    }
  }
  return [state, setLocalStorageState]
}

export default useLocalStorage

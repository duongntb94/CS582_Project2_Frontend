import { selector } from 'recoil'
import { userState } from './globalStates'

export const loginStatusSelector = selector<boolean>({
  key: 'loginStatusSelector',
  get: ({ get }) => {
    const user = get(userState)
    return !!user
  },
})

export const welcomeTextSelector = selector<string>({
  key: 'loginStatusSelector',
  get: ({ get }) => {
    const user = get(userState)
    if (user) {
      return `Welcome back ${user.name}`
    }
    return ''
  },
})

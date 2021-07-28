import { atom } from 'recoil'
import { MovieModel, UserModel } from '../models'

export const userState = atom<UserModel | undefined>({
  key: 'userState',
  default: undefined,
})

export const selectedMovieState = atom<MovieModel | undefined>({
  key: 'selectedMovieState',
  default: undefined,
})

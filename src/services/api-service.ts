import axios from 'axios'
import { plainToClass } from 'class-transformer'
import { API_URL } from '../assets/constants'
import { MovieModel, UserModel } from '../models'
import movies from './movies.json'

const instance = axios.create({ baseURL: API_URL.BASE_URL, timeout: 60000 })

interface ILoginRequestBody {
  email: string
  password: string
}

export const ApiService = {
  getRecommendMovies: async (): Promise<MovieModel[]> => {
    return plainToClass(MovieModel, movies)

    // const response = await instance.get(API_URL.GET_RECOMMEND_MOVIE)
    // const data = response.data as any[]
    // return plainToClass(MovieModel, data)
  },
  login: async (body: ILoginRequestBody): Promise<UserModel> => {
    const user = new UserModel()
    user.email = body.email
    user.name = 'Thomas Frank'
    return user
    // const response = await instance.post(API_URL.LOGIN, body)
    // return plainToClass(UserModel, response.data)
  },
}

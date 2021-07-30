import axios from 'axios'
import { plainToClass } from 'class-transformer'
import { API_URL, TMDB_API_KEY } from '../assets/constants'
import { MovieModel, TMDBMovieModel, UserModel } from '../models'

const instance = axios.create({ baseURL: API_URL.BASE_URL, timeout: 60000 })

interface ILoginRequestBody {
  email: string
  password: string
}

interface ITopMoviesRequestParams {
  genres?: string
  top?: number
}

interface IRatingMovieRequestParams {
  userId?: string
  movieId?: number
}

interface IUserRecommendMovieParams {
  genres?: string
  top?: number
  watched?: boolean
}

export const ApiService = {
  /**
   * Get list of trending movies based on popularity (default: top=10)
   * http://localhost:8080/recommender/trend/popular?genres=<string>&top=<number>
   * @param params genres:string&top:number
   * @returns
   */
  getTopPopularMovies: async (
    params?: ITopMoviesRequestParams
  ): Promise<MovieModel[]> => {
    const response = await instance.get(API_URL.GET_TOP_POPULAR_MOVIES, {
      params,
    })
    const data = response.data as any[]
    return plainToClass(MovieModel, data)
  },
  /**
   * Get list of trending movies based on IMDB rating scores (default: top=10)
   * http://localhost:8080/recommender/trend/rating?genres=<string>&top=<number>
   * @param params genres=<string>&top=<number>
   * @returns
   */
  getTopRatingMovies: async (
    params?: ITopMoviesRequestParams
  ): Promise<MovieModel[]> => {
    const response = await instance.get(API_URL.GET_TOP_RATING_MOVIES, {
      params,
    })
    const data = response.data as any[]
    return plainToClass(MovieModel, data)
  },
  /**
   * Get predicted rating of a user for a movie
   * http://localhost:8080/recommender/predict/rating?userId=<number>&movieId=<number>
   * @param params userId=<number>&movieId=<number>
   * @returns
   */
  predictRatingOfUserForMovie: async (
    params?: IRatingMovieRequestParams
  ): Promise<number> => {
    const response = await instance.get(API_URL.PREDICT_RATING, {
      params,
    })
    return response.data as number
  },
  /**
   * Get list of recommended movies for a user (default: top=10, watched=false)
   * http://localhost:8080/recommender/user/:user_id?genres=<string>&top=<number>&watched=[true|false]
   * @param body genres=<string>&top=<number>&watched=[true|false]
   * @returns
   */
  getUserRecommendMovies: async (
    params?: IUserRecommendMovieParams
  ): Promise<MovieModel[]> => {
    const response = await instance.get(API_URL.GET_RECOMMEND_MOVIES, {
      params,
    })
    const data = response.data as any[]
    return plainToClass(MovieModel, data)
  },
  getMovieDetail: async (imdbId: string): Promise<TMDBMovieModel> => {
    const response = await axios.get(
      API_URL.GET_TMDB_MOVIE_DETAIL.replace(':id', imdbId),
      {
        params: {
          api_key: TMDB_API_KEY,
        },
      }
    )
    return plainToClass(TMDBMovieModel, response.data)
  },
  login: async (body: ILoginRequestBody): Promise<UserModel> => {
    // Todo: Update model later
    const user = new UserModel()
    user.email = body.email
    user.name = 'Thomas Frank'
    return user
    // const response = await instance.post(API_URL.LOGIN, body)
    // return plainToClass(UserModel, response.data)
  },
}

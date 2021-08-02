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

interface ISimillarMovieParams {
  imdbId: string
  top?: number
}

const cacheMovies: Record<string, TMDBMovieModel> = {}

/**
 * Add TMBD data input movie.
 * @param input input movie.
 * @returns inserted tmdb movie.
 */
const addTMBDData = async (input: MovieModel): Promise<MovieModel> => {
  let tmdbMovie = cacheMovies[input.imdbId]
  if (tmdbMovie) {
    input.addTMDBMovieData(tmdbMovie)
    return input
  }
  try {
    tmdbMovie = await ApiService.getMovieDetail(input.imdbId)
    if (tmdbMovie) {
      input.addTMDBMovieData(tmdbMovie)
      cacheMovies[input.imdbId] = tmdbMovie
    }
  } catch (e) {
    console.log('Add TMDB Data error', e)
  }
  return input
}

/**
 * Batch inserted data movie.
 * @param input input.
 * @returns promise movie models.
 */
const runBatchAddTMDBData = (input: MovieModel[]): Promise<MovieModel[]> => {
  const promises = input.map((movie) => addTMBDData(movie))
  return Promise.all(promises)
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
    const movies: MovieModel[] = plainToClass(MovieModel, data)
    return runBatchAddTMDBData(movies)
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
    const movies = plainToClass(MovieModel, data)
    return runBatchAddTMDBData(movies)
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
    userId?: number,
    params?: IUserRecommendMovieParams
  ): Promise<MovieModel[]> => {
    const response = await instance.get(
      API_URL.GET_RECOMMEND_MOVIES.replace(':id', `${userId}`),
      {
        params,
      }
    )
    const data = response.data as any[]
    const movies = plainToClass(MovieModel, data)
    console.log('movies', movies)
    return runBatchAddTMDBData(movies)
  },
  getSimilarMovies: async (
    params: ISimillarMovieParams
  ): Promise<MovieModel[]> => {
    const response = await instance.get(API_URL.GET_SIMILAR_MOVIES, {
      params,
    })
    const data = response.data as any[]
    const movies = plainToClass(MovieModel, data)
    return runBatchAddTMDBData(movies)
  },
  /**
   * Get movie detail from imdb
   * @param imdbId
   * @returns
   */
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

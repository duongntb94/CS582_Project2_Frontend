import { UserModel } from '../models'

const API_URL = {
  BASE_URL: 'http://localhost:8080/recommender',
  GET_TOP_POPULAR_MOVIES: 'trend/popular',
  GET_TOP_RATING_MOVIES: 'trend/rating',
  PREDICT_RATING: 'predict/rating',
  GET_RECOMMEND_MOVIES: 'user/:id',
  LOGIN: 'movies/login',

  GET_TMDB_MOVIE_DETAIL: 'https://api.themoviedb.org/3/movie/:id',
}

// Create a list of users corresponding to IMDB database's users.
const IMDB_USERS: UserModel[] = []
const IDS = [1, 2, 3, 4, 5]
IDS.forEach((i) => IMDB_USERS.push(UserModel.createInstance(i)))

// TMDB keys
const TMDB_API_KEY = 'c5cdd884c2da929d62b263a8eaecb49d'

export { API_URL, IMDB_USERS, TMDB_API_KEY }

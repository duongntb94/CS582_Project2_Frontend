import { Expose, Transform, Type, TransformationType } from 'class-transformer'
import { TMDBMovieModel } from './tmdb-movie-model'

export class MovieModel {
  @Expose()
  @Type(() => String)
  @Transform(({ type, obj, value }) => {
    switch (type) {
      case TransformationType.PLAIN_TO_CLASS:
        const v = obj.id || obj.movieId
        if (v) {
          return String(v)
        }
        return ''
      case TransformationType.CLASS_TO_PLAIN:
        return value
      default:
        return value
    }
  })
  id: string = ''

  @Expose()
  @Type(() => String)
  @Transform(({ type, obj, value }) => {
    switch (type) {
      case TransformationType.PLAIN_TO_CLASS:
        const v = obj.imdb_id
        if (v) {
          let rawImdbId: String = String(v)
          if (rawImdbId.includes('tt')) {
            return rawImdbId
          }
          // Actual IMDB id has 7 digits follow after tt. E.g: ttxxxxxxx
          // IMDB digits, so it may has only 4,5,6 digits.
          const numOfZero = 7 - rawImdbId.length
          let actualImdbId = `${rawImdbId}`
          for (let i = 0; i < numOfZero; i++) {
            actualImdbId = `0${actualImdbId}`
          }
          return `tt${actualImdbId}`
        }
        return ''
      case TransformationType.CLASS_TO_PLAIN:
        return value
      default:
        return value
    }
  })
  imdbId: string = ''

  @Expose()
  @Type(() => String)
  @Transform(({ type, obj, value }) => {
    switch (type) {
      case TransformationType.PLAIN_TO_CLASS:
        const v = obj.original_title || obj.title
        if (v) {
          return String(v)
        }
        return ''
      case TransformationType.CLASS_TO_PLAIN:
        return value
      default:
        return value
    }
  })
  name: string = ''

  @Expose()
  @Transform(({ type, obj, value }) => {
    switch (type) {
      case TransformationType.PLAIN_TO_CLASS:
        const v = obj.genres
        if (typeof v == 'string') {
          return v.split('|')
        }
        return []
      case TransformationType.CLASS_TO_PLAIN:
        return value
      default:
        return value
    }
  })
  genres: string[] = []
  thumbnail: string = 'assets/placeholder_film.png'
  originalImage: string = 'assets/placeholder_film.png'
  description: string = ''

  /**
   * Embedded data from https://api.themoviedb.org/
   * @param data
   */
  addTMDBMovieData(data: TMDBMovieModel) {
    const { overview, poster_path } = data
    if (poster_path) {
      this.thumbnail = `https://image.tmdb.org/t/p/w300${poster_path}`
      this.originalImage = `https://image.tmdb.org/t/p/original/${poster_path}`
    }
    this.description = overview
  }
}

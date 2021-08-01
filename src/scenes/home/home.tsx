import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles'
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import Carousel from '../../components/carousel'
import Copyright from '../../components/copyright'
import HeaderBar from '../../components/header-bar'
import { MovieModel } from '../../models'
import { ApiService } from '../../services'
import { selectedMovieState, userState } from '../../store/globalStates'
import { loginStatusSelector } from '../../store/selectors'

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: '#f44336',
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}))

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  const classes = useStyles()

  // Process global states
  const history = useHistory()
  const setSelectedMovie = useSetRecoilState(selectedMovieState)
  const isLogin = useRecoilValue(loginStatusSelector)
  const [user] = useRecoilState(userState)
  const [popularMovies, setPopularMovies] = useState<MovieModel[]>([])
  const [isLoadPM, setIsLoadPM] = useState<boolean>(false)

  const [ratingMovies, setRatingMovies] = useState<MovieModel[]>([])
  const [isLoadRM, setIsLoadRM] = useState<boolean>(false)

  const [recommendMovies, setRecommendMovies] = useState<MovieModel[]>([])
  const [isLoadRMU, setIsLoadRMU] = useState<boolean>(false)

  // Fetch apis
  const getPopularMovies = useCallback(async () => {
    try {
      setIsLoadPM(true)
      const movies = await ApiService.getTopPopularMovies()
      setPopularMovies(movies)
      setIsLoadPM(false)
    } catch (e) {
      console.log('getPopularMovies e', e)
    }
  }, [])

  const getRatingMovies = useCallback(async () => {
    try {
      setIsLoadRM(true)
      const movies = await ApiService.getTopRatingMovies()
      setRatingMovies(movies)
      setIsLoadRM(false)
    } catch (e) {
      console.log('getRatingMovies e ', e)
    }
  }, [])

  const getRecommendMovies = useCallback(async () => {
    if (!isLogin || !user) {
      setRecommendMovies([])
      return
    }
    try {
      setIsLoadRMU(true)
      const movies = await ApiService.getUserRecommendMovies(user.id)
      setRecommendMovies(movies)
      setIsLoadRMU(false)
    } catch (e) {
      console.log('getRecommendMovies e', e)
    }
  }, [isLogin, user])

  const onClickMovie = useCallback(
    async (item: MovieModel) => {
      setSelectedMovie(item)
      history.push(`movie/${item.id}`)
    },
    [history, setSelectedMovie]
  )

  // Initial load
  useEffect(() => {
    getPopularMovies()
    getRatingMovies()
  }, [getPopularMovies, getRatingMovies])

  useEffect(() => {
    getRecommendMovies()
  }, [getRecommendMovies, isLogin])

  return (
    <React.Fragment>
      <CssBaseline />
      <HeaderBar />
      {/* Content */}
      <Container maxWidth='lg' component='main'>
        {isLogin && (
          <Carousel
            title={'Recommended movies for you'}
            isLoading={isLoadRMU}
            onPress={onClickMovie}
            items={recommendMovies}
          />
        )}
        <Carousel
          title={'Trending movies based on popularity'}
          isLoading={isLoadPM}
          onPress={onClickMovie}
          items={popularMovies}
        />

        <Carousel
          title={'Trending movies based on IMDB rating scores'}
          isLoading={isLoadRM}
          onPress={onClickMovie}
          items={ratingMovies}
        />
      </Container>
      {/* Footer */}
      <Container maxWidth='md' component='footer' className={classes.footer}>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
      {/* End footer */}
    </React.Fragment>
  )
}

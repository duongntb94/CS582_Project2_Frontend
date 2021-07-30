import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles'
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import Carousel from '../../components/carousel'
import Copyright from '../../components/copyright'
import HeaderBar from '../../components/header-bar'
import { MovieModel } from '../../models'
import { ApiService } from '../../services'
import { selectedMovieState } from '../../store/globalStates'

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

  // Store data for trending movies section
  const [recomMovies, setRecomMovies] = useState<MovieModel[]>([])
  const [isLoadRM, setIsLoadRM] = useState<boolean>(false)

  // Fetch trending movies
  const getTrendingMovies = useCallback(async () => {
    try {
      setIsLoadRM(true)
      const movies = await ApiService.getTopPopularMovies()
      setRecomMovies(movies)
      setIsLoadRM(false)
    } catch (e) {
      console.log('getTrendingMovies e', e)
    }
  }, [])

  const onClickMovie = useCallback(
    async (item: MovieModel) => {
      setSelectedMovie(item)
      history.push(`movie/${item.id}`)
    },
    [history, setSelectedMovie]
  )

  // Initial load
  useEffect(() => {
    getTrendingMovies()
  }, [getTrendingMovies])

  return (
    <React.Fragment>
      <CssBaseline />
      <HeaderBar />
      {/* Content */}
      <Container maxWidth='lg' component='main'>
        <Carousel
          title={'Trending Movies'}
          isLoading={isLoadRM}
          onPress={onClickMovie}
          items={recomMovies}
        />

        <Carousel
          title={'Action Movies'}
          isLoading={isLoadRM}
          onPress={onClickMovie}
          items={recomMovies}
        />

        <Carousel
          title={'Comedy Movies'}
          isLoading={isLoadRM}
          onPress={onClickMovie}
          items={recomMovies}
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

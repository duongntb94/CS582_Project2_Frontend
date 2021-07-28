import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import Carousel from '../../components/carousel'
import Copyright from '../../components/copyright'
import { MovieModel } from '../../models'
import { ApiService } from '../../services'
import { selectedMovieState, userState } from '../../store/globalStates'
import { loginStatusSelector, welcomeTextSelector } from '../../store/selectors'

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

interface MovieDetailProps {}

export const MovieDetail: React.FC<MovieDetailProps> = () => {
  const classes = useStyles()

  // Process global states
  const isLogin = useRecoilValue(loginStatusSelector)
  const welcomeMessage = useRecoilValue(welcomeTextSelector)
  const setUser = useSetRecoilState(userState)
  const history = useHistory()
  const [selectedMovie, setSelectedMovie] = useRecoilState(selectedMovieState)

  // Store data for trending movies section
  const [recomMovies, setRecomMovies] = useState<MovieModel[]>([])
  const [isLoadRM, setIsLoadRM] = useState<boolean>(false)

  // Fetch trending movies
  const getTrendingMovies = useCallback(async () => {
    try {
      setIsLoadRM(true)
      const movies = await ApiService.getRecommendMovies()
      setRecomMovies(movies)
      setIsLoadRM(false)
    } catch (e) {
      console.log('getTrendingMovies e', e)
    }
  }, [])

  // Handle actions
  const onClickLogin = useCallback(async () => {
    if (isLogin) {
      setUser(undefined)
    } else {
      history.push('/login')
    }
  }, [history, isLogin, setUser])

  const onClickMovie = useCallback(
    async (item: MovieModel) => {
      setSelectedMovie(item)
      history.replace(`/movie/${item.id}`)
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
      <AppBar
        position='static'
        color='default'
        elevation={0}
        className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography
            variant='h6'
            color='inherit'
            noWrap
            className={classes.toolbarTitle}>
            NetMovies
          </Typography>
          <p>{welcomeMessage}</p>
          <Button
            onClick={onClickLogin}
            color='default'
            variant='outlined'
            className={classes.link}>
            {isLogin ? 'Log out' : 'Log in'}
          </Button>
        </Toolbar>
      </AppBar>
      {/* Content */}
      <Container maxWidth='lg' component='main'>
        <Grid>
          <p style={{ fontSize: 30 }}>Selected movies: {selectedMovie?.name}</p>
        </Grid>

        {/* Recommendation section */}
        <Carousel
          title={'Recommended Movies'}
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

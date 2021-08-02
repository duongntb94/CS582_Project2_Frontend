import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useRecoilState } from 'recoil'
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
    textDecoration: 'none',
    color: 'white',
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
  posterImage: {
    width: 200,
    height: 'auto',
    marginTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  contentContainer: {},
}))

interface MovieDetailProps {}

export const MovieDetail: React.FC<MovieDetailProps> = () => {
  const classes = useStyles()

  // Process global states
  const history = useHistory()
  const [selectedMovie, setSelectedMovie] = useRecoilState(selectedMovieState)

  // Store data for trending movies section
  const [recomMovies, setRecomMovies] = useState<MovieModel[]>([])
  const [isLoadRM, setIsLoadRM] = useState<boolean>(false)

  const getSimilarMovies = useCallback(async () => {
    if (!selectedMovie) {
      return
    }
    try {
      setIsLoadRM(true)
      const movies = await ApiService.getSimilarMovies({
        imdbId: selectedMovie.imdbId,
      })
      setRecomMovies(movies)
    } catch (e) {
      console.log('getSimilarMovies e', e)
    } finally {
      setIsLoadRM(false)
    }
  }, [selectedMovie])

  const onClickMovie = useCallback(
    async (item: MovieModel) => {
      setSelectedMovie(item)
      history.replace(`/movie/${item.id}`)
    },
    [history, setSelectedMovie]
  )

  // Initial load
  useEffect(() => {
    getSimilarMovies()
  }, [getSimilarMovies, selectedMovie])

  return (
    <React.Fragment>
      <CssBaseline />
      <HeaderBar />
      {/* Content */}
      <Container maxWidth='lg' component='main'>
        <Grid container spacing={10}>
          <Grid item xs={12} sm={2}>
            <img
              className={classes.posterImage}
              src={selectedMovie?.thumbnail}
              alt=''
            />
          </Grid>
          <Grid item xs={12} sm={10}>
            <Grid container>
              <Grid item xs={12}>
                <p className={classes.title}>{selectedMovie?.name}</p>
              </Grid>
              <Grid item xs={12}>
                <div>Description:</div>
                {selectedMovie?.description}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Recommendation section */}
        <Carousel
          title={'Relevant movies'}
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

import React from 'react'
import { RecoilRoot } from 'recoil'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import Home from './scenes/home'
import MovieDetail from './scenes/movie-detail'
import Login from './scenes/login'
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import { createTheme } from '@material-ui/core'

const App: React.FC<any> = () => {
  const theme = createTheme({ palette: { type: 'dark' } })
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route path='/movie'>
              <MovieDetail />
            </Route>
            <Route path='/login'>
              <Login />
            </Route>
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </RecoilRoot>
  )
}

export default App

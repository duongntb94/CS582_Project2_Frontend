import { makeStyles, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'

const styles = makeStyles(() => ({
  link: {
    textDecoration: 'none',
    fontWeight: 'bold',
    color: 'white',
  },
}))

export const Copyright: React.FC<any> = () => {
  const classNames = styles()
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link className={classNames.link} to='/'>
        NetMovies
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

import { Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'

export const Copyright: React.FC<any> = () => {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link to='/'>NetMovies</Link> {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

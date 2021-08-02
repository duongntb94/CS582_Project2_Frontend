import { AppBar, Link, Toolbar } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import { blue } from '@material-ui/core/colors'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/DeleteRounded'
import PersonIcon from '@material-ui/icons/Person'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { IMDB_USERS } from '../../assets/constants'
import { UserModel } from '../../models'
import { userState } from '../../store/globalStates'
import { welcomeTextSelector } from '../../store/selectors'

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
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
}))

interface UserSelectDialogProps {
  open: boolean
  selectedUser: UserModel | undefined
  onClose: (value: UserModel | undefined) => void
}

const UserSelecDialog: React.FC<UserSelectDialogProps> = (
  props: UserSelectDialogProps
) => {
  const classes = useStyles()
  const { onClose, selectedUser, open } = props
  const handleClose = () => {
    onClose(selectedUser)
  }

  const handleListItemClick = (user: UserModel) => {
    onClose(user)
  }

  const handleNoAccountClick = () => {
    onClose(undefined)
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby='simple-dialog-title'
      open={open}>
      <DialogTitle id='simple-dialog-title'>Set backup account</DialogTitle>
      <List>
        <ListItem button onClick={() => handleNoAccountClick()}>
          <ListItemAvatar>
            <Avatar>
              <DeleteIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary='No Account' />
        </ListItem>
        {IMDB_USERS.map((user) => (
          <ListItem
            button
            onClick={() => handleListItemClick(user)}
            key={user.name}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.name} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  )
}

export const HeaderBar = () => {
  const [open, setOpen] = React.useState(false)
  const welcomeMessage = useRecoilValue(welcomeTextSelector)
  const [user, setUser] = useRecoilState(userState)
  const history = useHistory()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = (user: UserModel | undefined) => {
    setOpen(false)
    setUser(user)
  }

  const classes = useStyles()

  return (
    <div>
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
            component={Link}
            onClick={() => history.replace('/')}
            className={classes.toolbarTitle}>
            NetMovies
          </Typography>
          <p>{welcomeMessage}</p>
          <Button
            onClick={handleClickOpen}
            color='default'
            variant='outlined'
            className={classes.link}>
            Select User
          </Button>
        </Toolbar>
      </AppBar>
      <UserSelecDialog selectedUser={user} open={open} onClose={handleClose} />
    </div>
  )
}

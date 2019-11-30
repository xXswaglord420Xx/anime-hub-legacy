import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Styles from './LoginForm.css';
import {signUp, signIn} from '../../actions/auth';
import {pushSnack} from "../../actions/notifications";

type LoginFormProps = {
  open: boolean,
  onClose: () => void
};

function loginErrorToString(e) {
  if (e.description || e.data?.description) {
    return e.description || e.data?.description;
  } else if (e.response) {
    console.error(e);
    switch (e.response.status) {
      case 400:
        return "I made a whoopty doo please send me the error logs";
      case 401:
        return "Uhhh... you aren't logged in I guess. Don't ask. Just send me the logs.";
      case 403:
        return "You're lacking the required permissions to do this";
      case 408:
        return "Request has timed out. Please get a better internet connection.";
      case 413:
      case 414:
        return "You're trying to send too much.";
      case 418:
        return "I'm a teapot. I refuse to brew covfefe.";
      case 429:
        return "You're asking me too many things at once";
      case 501:
        return "This is not implemented yet";
      case 511:
        return "You need to log in to your Wi-Fi network (or pay your internet bills idk)";
      default:
        return `I honestly don't know what happened but here a status code (send me the logs): ${e.response.status} `
    }
  } else {
    return "Cannot establish connection to the server"
  }
}

export default function LoginForm(props: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const dispatch = useDispatch();

  async function loginMeow() {
    try {
      await dispatch(signIn(login, password));
    } catch (e) {
      dispatch(pushSnack(loginErrorToString(e)));
    }
  }

  async function registerRightMeow() {
    try {
      await dispatch(signUp(login, password, username));
    } catch (e) {
      dispatch(pushSnack(loginErrorToString(e)));
    }
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>{isRegister? 'Sign up': 'Sign in'}</DialogTitle>
      <DialogContent className={Styles.content} style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '360px'}}>
        <TextField onChange={e => setUsername(e.target.value)} label='Username' style={{display: isRegister? 'inline-flex' : 'none'}} />
        <TextField onChange={e => setLogin(e.target.value)} label='Login' />
        <TextField onChange={e => setPassword(e.target.value)} type='password' label='Password' />
        <DialogContentText style={{fontSize: 'smaller'}}>
          <Typography style={{display: isRegister? 'none': 'inline'}} variant="caption">
            Don&apos;t have an account? <Link component="button" onClick={() => setIsRegister(true)}>Register</Link> right meow OwO
          </Typography>
          <Typography style={{display: isRegister? 'inline': 'none'}} variant="caption">
            Have an account? <Link component="button" onClick={() => setIsRegister(false)}>Log in</Link> right meow OwO
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>

        <Button color='primary' onClick={async () => {
          props.onClose();
          await (isRegister? registerRightMeow() : loginMeow());
        }}>
          {isRegister? 'Sign up' : 'Sign in'}
        </Button>

        <Button color='primary' onClick={props.onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

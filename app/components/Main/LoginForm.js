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
      dispatch(pushSnack(e.description || 'Cannot establish connection to the server.'));
    }
  }

  async function registerRightMeow() {
    try {
      await dispatch(signUp(login, password, username));
    } catch (e) {
      dispatch(pushSnack(e.description || 'Cannot establish connection to the server.'));
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

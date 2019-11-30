import React, {useState} from 'react';
import {useSelector} from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import ThreeDots from "@material-ui/icons/MoreHoriz";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core";
import {pink} from "@material-ui/core/colors";
import type {StateType} from "../../reducers/types";
import {Profile} from "./Profile";
import LoginForm from "./LoginForm";


const useStyles = makeStyles(theme => ({
  toolbar: {...theme.mixins.toolbar, display: 'flex', alignItems: 'center', padding: '7px'},
  wrapper: {
    position: 'relative',
    marginLeft: theme.spacing(1)
  },
  progress: {
    position: 'absolute',
    top: -3,
    left: -3,
    zIndex: 1
  },
  avi: {
    backgroundColor: pink[500],
    color: '#fff'
  }
}));

export default function ProfileBar() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const openLoginDialog = () => setLoginOpen(true);
  const closeLoginDialog = () => setLoginOpen(false);
  const loginStatus = useSelector((state: StateType) => state.auth.loginStatus);
  const username = useSelector((state: StateType) => state.auth.username);
  const classes = useStyles();

  let login;
  switch (loginStatus) {
    case "LOGGED_IN":
      login = (
        <div className={classes.wrapper}>
          <Avatar
            onClick={() => setProfileOpen(true)}
            className={classes.avi}>{username[0].toUpperCase()}
          </Avatar>
        </div>
      );
      break;
    case "ERROR":
    case "LOGGED_OUT":
      login = <Button color='primary' onClick={openLoginDialog}>Login</Button>;
      break;
    case "LOGGING_IN":
      login = (
        <div className={classes.wrapper}>
          <Avatar className={classes.avi}><ThreeDots/></Avatar>
          <CircularProgress color='primary' size={46} className={classes.progress}/>
        </div>
      );
      break;
    default:
      throw new Error("this isnt evne possible shut up eslint its not my fault jabbascripts typing system is so fucking annoying i cant evne have a fucking enum or variant or anything jesus fucking christ");
  }

  return (
    <>
      <Profile visible={isProfileOpen} onClose={() => setProfileOpen(false)}/>
      <LoginForm open={isLoginOpen} onClose={closeLoginDialog}/>
      <div className={classes.toolbar}>
        {login}
      </div>
    </>
  )
}

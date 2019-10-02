import React from "react";
import {useDispatch, useSelector} from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import type {stateType} from "../../reducers/types";
import {signOut} from "../../actions/auth";

type ProfileProps = {
  visible: boolean,
  onClose: () => void
};

export const Profile = ({visible, onClose}: ProfileProps = {visible: false, onClose: () => null}) => {
  const username = useSelector((state: stateType) => state.auth.username);
  const dispatch = useDispatch();

  function logOut() {
    dispatch(signOut());
    onClose();
  }

  return (
    <Dialog open={visible} onClose={onClose}>
      <DialogTitle>{username}</DialogTitle>
      <DialogActions>
        <Button onClick={logOut}>Sign out</Button>
      </DialogActions>
    </Dialog>
  )
};

import {useDispatch, useSelector} from "react-redux";
import React from "react";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import type {StateType} from "../../reducers/types";
import {setSetting} from "../../actions/settings";

const useStyles = makeStyles(() => createStyles({
  container: {
    display: 'flex',
    width: '100%'
  },
  label: {
    flexGrow: 1
  }
}));

type SettingProps = {
  name: string,
  label: string,
  defaultValue: string | boolean | number,
  type: string
};

export default function Setting(props: SettingProps) {
  const setting = useSelector((state: StateType) => state.settings[props.name]);
  const dispatch = useDispatch();
  const classes = useStyles();
  const value = setting?? props.defaultValue;

  function change(v) {
    dispatch(setSetting(props.name, v))
  }

  let control;
  switch (props.type) {
    case 'switch':
      control = <Switch checked={value} onChange={e => change(e.target.checked)}/>;
      break;
    case 'text':
      control = <TextField value={value}
                           onKeyPress={e => e.code === "Enter" && change(e.target.value)}/>;
      break;
    default:
      control = null;
  }

  return (
    <div className={classes.container}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label className={classes.label}>{props.label}</label>
      {control}
    </div>
  )
}

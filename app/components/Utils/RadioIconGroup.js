import React, {useContext, createContext, Context} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import ButtonGroup from "@material-ui/core/ButtonGroup";

type ContextType = Context<ContextArg>;
type ContextArg = {value: string, setValue: string => void};

const RadioContext: ContextType = createContext();

const useStyles = makeStyles(() => ({
  startIcon: {
    margin: 0
  },
  root: {
    padding: 6
  }
}));

type RadioIconGroupProps = {
  children: RadioIcon[],
  value: string,
  onChange: string => void
};

type RadioIconProps = {
  name: string,
  icon: Icon
};

export function RadioIconGroup(props: RadioIconGroupProps) {
  const {value, onChange: setValue} = props;


  return (
    <RadioContext.Provider value={{value, setValue}}>
      <ButtonGroup variant="outlined" color="secondary">
      {
        props.children
      }
      </ButtonGroup>
    </RadioContext.Provider>
  )
}

export function RadioIcon(props: RadioIconProps) {
  const {icon, name, ...rest} = props;
  const classes = useStyles();
  const context: ContextArg = useContext(RadioContext);
  console.log(props.icon);
  return <Button
    {...rest}
    classes={{
      startIcon: classes.startIcon,
      root: classes.root
    }}
    variant={name === context.value? "contained" : "outlined"}
    startIcon={icon}
    onClick={() => context.setValue(name)}>

  </Button>
}

import React from 'react';
import {makeStyles, createStyles, Theme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2)
  }
}));

export function SectionHeader(props: { name: string }) {
  const classes = useStyles();

  return <Typography variant="h5" className={classes.container}>{props.name}</Typography>
}

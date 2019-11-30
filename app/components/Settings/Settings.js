import React from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Template from '../../constants/settings_template';
import {SectionHeader} from "./SectionHeader";
import Setting from "./Setting";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
      padding: theme.spacing(2)
    }
  })
);

function createSection(section) {
  return (
    <div key={section.name}>
      <SectionHeader name={section.name}/>
      {
        section.settings.map(({label, name, default: defaultValue, type}) =>
            <Setting key={name} defaultValue={defaultValue} type={type} label={label} name={name}/>
        )
      }
    </div>
  )
}

export default function Settings() {
  const template: Array = Template;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {template.map(createSection)}
    </div>
  );
}

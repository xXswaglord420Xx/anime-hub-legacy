import React from 'react'
import TextField from '@material-ui/core/TextField';
import InputBase from '@material-ui/core/InputBase';
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles';
import Bar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';

/*
const useStyles = makeStyles(theme => ({
  textField: {
    margin: theme.spacing(2)
  }
}));
*/

const useStyles= makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 120,
        '&:focus': {
          width: 200,
        },
      },
    },
  }),
);


type Props = {
  search: string => void,
  prompt: ?string
};

export function SearchTorrent(props: Props) {
  const {prompt, search, ...rest} = props;

  return <TextField label='Search' size='large' type='text' {...rest} placeholder={prompt} inputProps={{
    onKeyDown: e => {
      if (e.keyCode === 13) {
        e.preventDefault();
        search(e.currentTarget.value);
      }
    }
  }}/>
}


export function AppBar(props: Props) {
  const classes = useStyles();

  const {prompt, search} = props;

  return (
    <Bar position="static">
      <Toolbar>
        <Typography className={classes.title} variant="h6" noWrap>
          Nyaa
        </Typography>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder={prompt}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search', onKeyDown: e => {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  search(e.currentTarget.value);
                }
              }
            }}
          />
        </div>
      </Toolbar>
    </Bar>
  );
}


export default AppBar;

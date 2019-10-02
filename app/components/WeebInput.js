import React, {useEffect, useState} from 'react'
import InputBase from '@material-ui/core/InputBase';
import { createStyles, fade, Theme, makeStyles, useTheme } from '@material-ui/core/styles';
import Bar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import TablePagination from "@material-ui/core/TablePagination";
import Box from "@material-ui/core/Box";

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
  search: (string, {page: number}) => void,
  children: React.ReactNode,
  prompt: ?string
};

export function AppBar(props: Props) {
  const classes = useStyles();
  const theme = useTheme();
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(1);

  const {prompt, search} = props;
  console.log(`Page is ${page}`);

  useEffect(() => {
    search(term, {page, english: true, trusted: true})
  }, [term, page]);

  return (
    <>
      <Bar style={{backgroundColor: theme.palette.background.main, color: 'white'}} position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Nyaa
          </Typography>

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon/>
            </div>
            <InputBase
              placeholder={prompt}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{
                'aria-label': 'search', onKeyDown: e => {
                  if (e.keyCode === 13) {
                    e.preventDefault();
                    setTerm(e.currentTarget.value)
                  }
                }
              }}
            />
          </div>
        </Toolbar>
      </Bar>
      {props.children}
      <Box borderTop={1} borderColor='grey.600'>
        <TablePagination
          rowsPerPageOptions={[]}
          page={page - 1}
          count={Number.MAX_SAFE_INTEGER}
          rowsPerPage={16}
          onChangePage={(_, p) => setPage(p + 1)}
          component="div"
          labelDisplayedRows={() => `Page ${page}`}
        />
      </Box>
    </>
  );
}


export default AppBar;

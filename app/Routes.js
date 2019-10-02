import React from 'react';
import {useSelector} from "react-redux";
import { Switch, Route } from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Snackbar from "@material-ui/core/Snackbar";
import {darkTheme} from './utils/themes';
import routes from './constants/routes';
import App from './containers/App';
import Home from './components/Home';
import AnimePage from './components/Anime/AnimePage';
import WebTorrent from './components/WebTorrentPage';
import SideMenu from './components/Main/SideMenu';
import Player from './components/Player/Player';
import AnimeDisplay from './components/Anime/AnimeDisplay';
import type {stateType} from "./reducers/types";

export default () => {
  const snack = useSelector((state: stateType) => state.notifications.snackbar);

  return (
    <App>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline>
          <SideMenu />

          <Switch>
            <Route path={routes.WEBTORRENT} component={WebTorrent}/>
            <Route path={routes.PLAYER} component={Player}/>
            <Route path={routes.ANIMES} component={AnimePage}/>
            <Route path={routes.ANIME} component={AnimeDisplay}/>
            <Route path={routes.HOME} component={Home}/>
          </Switch>

          <Snackbar
            open={snack !== null}
            anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            message={snack&&snack.text}
          />
        </CssBaseline>
      </ThemeProvider>
    </App>
  )
};

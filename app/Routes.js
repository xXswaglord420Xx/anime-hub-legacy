import React from 'react';
import { Switch, Route } from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import {darkTheme} from './utils/themes';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import WebTorrent from './containers/WebTorrent';
import Menu from './components/NavMenu';

export default () => (
  <App>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline>
        <Menu />
        <Switch>
          <Route path={routes.WEBTORRENT} component={WebTorrent} />
          <Route path={routes.HOME} component={HomePage} />
        </Switch>
      </CssBaseline>
    </ThemeProvider>
  </App>
);

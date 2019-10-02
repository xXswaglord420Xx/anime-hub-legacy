import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

import {grey, amber, red, pink} from '@material-ui/core/colors'

const muiTheme = createMuiTheme({
  palette: {
    primary: amber,
    secondary: pink,
    accent: amber,
    error: red,
    background: {main: grey[800]},
    type: 'dark'
  }
});

export const darkTheme = muiTheme;

import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

import {grey, amber, red, pink} from '@material-ui/core/colors'

const muiTheme = createMuiTheme({
  palette: {
    primary: {main: grey[800]},
    secondary: pink,
    accent: amber,
    error: red,
    type: 'dark'
  }
});

export const darkTheme = muiTheme;

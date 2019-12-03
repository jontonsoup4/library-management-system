import * as constants from './utils/constants';
import { createMuiTheme } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: constants.COLORS.PRIMARY,
    },
    secondary: {
      main: constants.COLORS.SECONDARY,
    },
    background: {
      default: constants.COLORS.BACKGROUND
    },
    negative: red[500],
    positive: green[500],
  },
});

export default theme;

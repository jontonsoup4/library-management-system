import * as constants from 'utils/constants';
import ApolloClient from 'apollo-boost';
import CssBaseline from '@material-ui/core/CssBaseline';
import MomentUtils from '@date-io/moment';
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import theme from './theme';
import { ApolloProvider } from '@apollo/react-hooks';
import { MuiPickersUtilsProvider, } from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/styles';

const client = new ApolloClient({
  uri: constants.GRAPHQL_ENDPOINT,
});

client.defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
};


ReactDOM.render(
  <ApolloProvider client={client}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes />
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  </ApolloProvider>,
  document.querySelector('#root'),
);

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import * as constants from 'utils/constants';
import AppBar from 'components/AppBar';

import Account from './Account';
import Admin from './Admin';
import Book from './Book';
import Books from './Books';
import SignIn from './SignIn';

export default () => {  return (
    <Router>
      <AppBar />
      <Box
        component='main'
        height='100%'
        mt={8}
        pt={2}
      >
        <Container maxWidth='md'>
          <Switch>
            <Route exact path={constants.ROUTES.VIEW_ALL_BOOKS} component={Books} />
            <Route path={constants.ROUTES.VIEW_BOOK} component={Book} />
            <Route path={constants.ROUTES.ACCOUNT} component={Account} />
            <Route path={constants.ROUTES.ADMIN} component={Admin} />
            <Route exact path={constants.ROUTES.SIGN_IN} component={SignIn} />
            <Redirect to={constants.ROUTES.HOME} />
          </Switch>
        </Container>
      </Box>
    </Router>
  )
};

import * as constants from 'utils/constants';
import { Redirect, Route, Switch } from 'react-router-dom'
import React from 'react';

import Books from './Books'
import History from './History';
import ManageBook from './ManageBook';


export default () => {
  const { ADMIN_ROUTES } = constants;
  return (
    <Switch>
      <Route path={ADMIN_ROUTES.ADD_BOOK} component={ManageBook} />
      <Route path={ADMIN_ROUTES.EDIT_BOOK} component={ManageBook} />
      <Route path={ADMIN_ROUTES.MANAGE_BOOKS} component={Books} />
      <Route path={ADMIN_ROUTES.HISTORY} component={History} />
      <Redirect to={constants.ADMIN_ROUTES.MANAGE_BOOKS} />
    </Switch>
  )
};

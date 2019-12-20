import { grey } from '@material-ui/core/colors';

export const SITE_TITLE = 'Library App';
export const DEFAULT_CHECK_OUT_DAYS = 21;
export const GRAPHQL_ENDPOINT = 'https://polar-sands-10307.herokuapp.com/graphql';
export const DEFAULT_USER_ID = '829a0b3a-b7af-49c1-984f-b293c17dd94e';

export const ROUTES = {
  ACCOUNT: '/account',
  ADMIN: '/admin',
  HOME: '/books',
  SIGN_IN: '/sign-in',
  VIEW_ALL_BOOKS: '/books',
  VIEW_BOOK: '/books/:bookId',
};

export const ADMIN_ROUTES = {
  ADD_BOOK: '/admin/add-book',
  EDIT_BOOK: '/admin/books/:bookId',
  MANAGE_BOOKS: '/admin/books',
  HISTORY: '/admin/history',
};

export const COLORS = {
  PRIMARY: '#477BE4',
  SECONDARY: '#E89300',
  BACKGROUND: grey[200],
};

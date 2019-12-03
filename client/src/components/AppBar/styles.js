import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  '@global': {
    body: {
      height: '100vh',
    },
    a: {
      textDecoration: 'none',
    },
    '#root': {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    '.fade-enter': {
      opacity: 0,
      zIndex: 1,
    },
    '.fade-enter.fade-enter-active': {
      opacity: 1,
      transition: 'opacity 250ms ease-in',
    }
  },
  divider: {
    backgroundImage: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.secondary.light})`,
    opacity: '0.6',
  },
  home: {
    lineHeight: 2,
    margin: theme.spacing(2),
    transition: '200ms ease',
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
    }
  },
  title: {
    color: theme.palette.common.white,
    '&:hover': {
      textDecoration: 'underline',
    }
  },
}));

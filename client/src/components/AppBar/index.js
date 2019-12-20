import * as constants from 'utils/constants';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import Slide from '@material-ui/core/Slide';
import styles from './styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { Link } from 'react-router-dom';

const HideOnScroll = (props) => {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction='down' in={!trigger}>
      {children}
    </Slide>
  );
};

const links = [
  { text: 'Search Books', url: constants.ROUTES.VIEW_ALL_BOOKS },
  { text: 'Account', url: constants.ROUTES.ACCOUNT },
];

const adminLinks = [
  { text: 'Manage Books', url: constants.ADMIN_ROUTES.MANAGE_BOOKS },
  { text: 'Add A Book', url: constants.ADMIN_ROUTES.ADD_BOOK },
  { text: 'History', url: constants.ADMIN_ROUTES.HISTORY }
];

export default (props) => {
  const classes = styles();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const scrollTop = () => {
    window.scrollTo(0, 0)
  };

  const buildNav = (links) => (
    <List component='nav'>
      {links.map((link) => (
        <Link to={link.url} key={link.text}>
          <ListItem button onClick={toggleDrawer}>
            <Typography color='textPrimary'>
              {link.text}
            </Typography>
          </ListItem>
        </Link>
      ))}
    </List>
  );

  return (
    <React.Fragment>
      <HideOnScroll {...props}>
        <AppBar >
          <Toolbar>
            <Box mr={2}>
              <IconButton
                aria-label='menu'
                color='inherit'
                edge='start'
                id='menu-button'
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Typography
              className={classes.title}
              component={Link}
              id='site-logo'
              onClick={scrollTop}
              to='/'
              variant='h5'
            >
              {constants.SITE_TITLE}
            </Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Drawer
        open={open}
        onClose={toggleDrawer}
        variant='temporary'
      >
        <Box
          px={0}
          py={2}
          role='presentation'
          width={250}
        >
          <Typography
            className={classes.home}
            color='textSecondary'
            component={Link}
            onClick={toggleDrawer}
            to='/'
            variant='h5'
          >
            {constants.SITE_TITLE}
          </Typography>
          <Divider className={classes.divider} />
          {buildNav(links)}
          <Divider className={classes.divider} />
          {buildNav(adminLinks)}
        </Box>
      </Drawer>
    </React.Fragment>

  )
}

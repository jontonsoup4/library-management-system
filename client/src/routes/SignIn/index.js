// Dummy sign in page

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

export default (props) => {
  const { history } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = (e) => {
    e.preventDefault();
    history.push('/');
  };

  return (
    <form onSubmit={signIn}>
      <Typography
        align='center'
        component='h1'
        variant='h3'
      >
        Sign In
      </Typography>
      <TextField
        fullWidth
        label='Email'
        margin='normal'
        name='Email'
        onChange={(e) => setEmail(e.target.value)}
        required
        value={email}
      />
      <TextField
        fullWidth
        label='Password'
        margin='normal'
        name='Password'
        onChange={(e) => setPassword(e.target.value)}
        required
        type='password'
        value={password}
      />
      <Box my={2}>
        <Button
          color='primary'
          fullWidth
          type='submit'
          variant='contained'
        >
          Sign In
        </Button>
      </Box>
    </form>
  )
}

import * as constants from 'utils/constants';
import Book from 'components/Book';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks';

const QUERY = gql`
  {
    allBooks {
      edges {
        node {
          coverUrl
          id
          statusByStatusId {
            status
          }
          title
        }
      }
    }
  }
`;

export default () => {
  const { data, loading } = useQuery(QUERY);
  const { allBooks } = loading ? {} : data;

  const [query, setQuery] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('');

  const search = (e) => {
    e.preventDefault();
    setAppliedFilter(query);
  };

  return (
    <div>
      <Typography
        align='center'
        component='h1'
        gutterBottom
        variant='h4'
      >
        Search All Books
      </Typography>
      <Box
        component='form'
        display='flex'
        mb={2}
        onSubmit={search}
      >
        <Box mr={1} width='100%'>
          <TextField
            fullWidth
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
        </Box>
        <Button
          color='primary'
          onClick={search}
          type='submit'
          variant='contained'
        >
          Search
        </Button>
      </Box>
      {allBooks && (
        <Grid container spacing={2}>
          {allBooks.edges
            .filter((b) => b.node.title.toLowerCase().includes(appliedFilter.toLowerCase()))
            .map(({ node }) => (
              <Grid item key={node.id} xs={4} sm={3}>
                <Link to={constants.ROUTES.VIEW_BOOK.replace(':bookId', `${node.id}`)}>
                  <Book book={node} />
                </Link>
              </Grid>
            ))}
        </Grid>
      )}
    </div>
  )
}

import * as constants from 'utils/constants';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

const QUERY = gql`
  {
    books {
      id
      status {
        status
      }
      title
    }
  }
`;

const headers = [
  'Book',
  'Status',
];

export default (props) => {
  const { history } = props;
  const { data, loading } = useQuery(QUERY);
  const { books } = loading ? {} : data;

  const BookRow = (props) => {
    const {
      id,
      status: { status },
      title,
    } = props;

    const bookUrl = constants.ADMIN_ROUTES.EDIT_BOOK.replace(':bookId', id);
    const goToBook = () => {
      history.push(bookUrl);
    };

    return (
      <TableRow key={id} hover href={bookUrl} onClick={goToBook} style={{ cursor: 'pointer' }}>
        <TableCell>{title}</TableCell>
        <TableCell>{status}</TableCell>
      </TableRow>
    )
  };

  return (
    <div>
      <Typography
        align='center'
        component='h1'
        gutterBottom
        variant='h4'
      >
        All Books
      </Typography>
      <Table size='small'>
        <TableHead>
          <TableRow>
            {headers.map((text) => (
              <TableCell key={text}>{text}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        {books && (
          <TableBody>
            {books.map((row) => (
              <BookRow key={row.id} {...row} />
            ))}
          </TableBody>
        )}
      </Table>
      <Box my={1}>
        <Link to={constants.ADMIN_ROUTES.ADD_BOOK}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
          >
            Add New Book
          </Button>
        </Link>
      </Box>
    </div>
  )
}

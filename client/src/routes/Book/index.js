import * as constants from 'utils/constants';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ConfirmDialog from 'components/ConfirmDialog';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from '@apollo/react-hooks';


const QUERY = gql`
  query Book($bookId: Int) {
    book(id: $bookId) {
      author,
      coverUrl,
      description,
      isbn,
      pageCount,
      releaseDate,
      status {
        status
      }
      title,
    }
  }
`;

const CHECK_OUT_BOOK = gql`
  mutation ($bookId:Int, $userId:Int, $dueDate:String, $checkedOut:String, $checkedOutBy:Int) {
    createTransaction(bookId:$bookId, userId:$userId, dueDate:$dueDate, checkedOut:$checkedOut, checkedOutBy:$checkedOutBy) {
      dueDate
    }
    updateBook(id:$bookId, statusId: 2) {
      id
    }
  }
`;

export default (props) => {
  const { match: { params: { bookId } } } = props;
  const { data, loading, refetch } = useQuery(QUERY, { variables: { bookId: parseInt(bookId) }});
  const [checkOutBook] = useMutation(CHECK_OUT_BOOK);
  const { book = {} } = loading ? {} : data;
  const [open, setOpen] = useState(false);

  const {
    author,
    coverUrl,
    description,
    isbn,
    pageCount,
    releaseDate,
    status: s,
    title,
  } = book;

  const status = s ? s.status : '';

  const fields = [
    {text: 'Author', value: author},
    {text: 'Pages', value: pageCount},
    {text: 'Released', value: moment(parseInt(releaseDate)).format('MM/DD/YYYY')},
    {text: 'ISBN', value: isbn},
    {text: 'Status', value: status},
  ];

  const closeDialog = () => {
    setOpen(false);
  };

  const openDialog = () => {
    setOpen(true);
  };

  const handleConfirm = () => {
    // TODO: add history row and update book status
    checkOutBook({
      variables: {
        bookId: parseInt(bookId),
        userId: constants.DEFAULT_USER_ID,
        dueDate: moment().add(constants.DEFAULT_CHECK_OUT_DAYS, 'days').format('x'),
        checkedOut: moment().format('x'),
        checkedOutBy: constants.DEFAULT_USER_ID,
      }
    })
      .then(() => refetch({ bookId: parseInt(bookId) }))
      .then(closeDialog);
  };

  const available = status === 'Available';

  return (
    <div>
      <Typography
        align='center'
        component='h1'
        gutterBottom
        variant='h4'
      >
        {title}
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <img
            alt={title}
            src={coverUrl}
            width='100%'
          />
        </Grid>
        <Grid item xs={6}>
          {fields.map((field) => (
            <Box mb={0.5} key={field.text}>
              <Typography color='textSecondary' variant='body2'>
                {field.text}:
              </Typography>
              <Typography color='textPrimary' variant='subtitle2'>
                {field.value}
              </Typography>
            </Box>
          ))}
        </Grid>
      </Grid>
      <p>{description}</p>
      <Box mb={1}>
        <Button
          color='primary'
          disabled={!available}
          fullWidth
          onClick={openDialog}
          variant='contained'
        >
          {available ? 'Check Out' : 'Book Unavailable'}
        </Button>
      </Box>
      <ConfirmDialog
        onClose={closeDialog}
        onConfirm={handleConfirm}
        open={open}
        subtitle={`Books can be checked out for up to ${constants.DEFAULT_CHECK_OUT_DAYS} days.`}
        title='Confirm Check Out?'
      />
    </div>
  )
};

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
  query Book($bookId: UUID!) {
    bookById(id: $bookId) {
      author
      coverUrl
      description
      isbn
      pageCount
      releaseDate
      statusByStatusId {
        status
      }
      title
    }
  }
`;

const CHECK_OUT_BOOK = gql`
  mutation($transaction: TransactionInput!, $bookId: UUID!) {
    createTransaction(input: { transaction: $transaction }) {
      clientMutationId
    }
    updateBookById(
      input: {
        id: $bookId,
        bookPatch: { statusId: "971b1e2b-3b41-4f8c-9604-670e8548f3b9" }
      }
    ) {
      clientMutationId
    }
  }
`;

export default (props) => {
  const { match: { params: { bookId } } } = props;
  const { data, loading, refetch } = useQuery(QUERY, { variables: { bookId }});
  const [checkOutBook] = useMutation(CHECK_OUT_BOOK);
  const [open, setOpen] = useState(false);
  const { bookById: book = {} } = loading ? {} : data;

  const {
    author,
    coverUrl,
    description,
    isbn,
    pageCount,
    releaseDate,
    statusByStatusId,
    title,
  } = book;

  const status = statusByStatusId ? statusByStatusId.status : '';

  const fields = [
    {text: 'Author', value: author},
    {text: 'Pages', value: pageCount},
    {text: 'Released', value: releaseDate ? moment(releaseDate).format('MM/DD/YYYY') : ''},
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
    checkOutBook({
      variables: {
        bookId,
        transaction: {
          bookId,
          checkedOut: moment().format(),
          checkedOutBy: constants.DEFAULT_USER_ID,
          dueDate: moment().add(constants.DEFAULT_CHECK_OUT_DAYS, 'days').format(),
          userId: constants.DEFAULT_USER_ID,
        },
      }
    })
      .then(() => refetch({ bookId }))
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

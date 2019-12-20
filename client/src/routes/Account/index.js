import * as constants from 'utils/constants';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import ConfirmDialog from 'components/ConfirmDialog';
import moment from 'moment';
import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from '@apollo/react-hooks';

const QUERY = gql`
  query($userId: UUID!) {
    userById(id: $userId) {
      transactionsByUserId(orderBy: CHECKED_OUT_DESC) {
        edges {
          node {
            bookByBookId {
              id
              title
            }
            checkedIn
            checkedOut
            dueDate
            id
          }
        }
      }
    }
  }
`;

const CHECK_IN_BOOK = gql`
  mutation($id: UUID!, $bookId: UUID!, $transaction: TransactionPatch!) {
    updateTransactionById(input: { transactionPatch: $transaction, id: $id }) {
      clientMutationId
    }
    updateBookById(
      input: {
        id: $bookId
        bookPatch: { statusId: "fc7553a6-e2d7-4c29-a3a8-eb8d8c7b9527" }
      }
    ) {
      clientMutationId
    }
  }
`;

const outstandingHeaders = [
  'Book',
  'Due Date',
  'Check In'
];

const historyHeaders = [
  'Book',
  'Checked Out',
  'Due Date',
  'Checked In',
];

export default (props) => {
  const { history } = props;
  const [checked, setChecked] = useState(new Set([]));
  const [open, setOpen] = useState(false);
  const [checkInBook] = useMutation(CHECK_IN_BOOK);
  // Hardcoded userId
  const { data, loading, refetch } = useQuery(QUERY, {
    variables: { userId: constants.DEFAULT_USER_ID },
  });
  const { userById: user = {} } = loading ? {} : data;
  const transactions = user.transactionsByUserId ? user.transactionsByUserId.edges : [];

  const checkIn = () => {
    Promise.all(Array.from(checked).map((id) => (
      checkInBook({
        variables: {
          bookId: (transactions.find((t) => t.node.id === id)).node.bookByBookId.id,
          id,
          transaction: {
            checkedIn: moment().format(),
            checkedInBy: constants.DEFAULT_USER_ID,
          },
        },
      })
    )))
      .then(() => {
        setChecked(new Set());
        return refetch({ userId: constants.DEFAULT_USER_ID })
      })
      .then(closeDialog);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const openDialog = () => {
    setOpen(true);
  };

  const OutstandingRow = (props) => {
    const {
      bookByBookId: { title },
      dueDate,
      id,
    } = props;
    const isChecked = checked.has(id);

    const handleChecked = (e) => {
      const newChecked = new Set([...checked]);
      if (e.target.checked){
        newChecked.add(id);
      } else {
        newChecked.delete(id);
      }
      setChecked(newChecked);
    };

    return (
      <TableRow>
        <TableCell>
          {title}
        </TableCell>
        <TableCell>{moment(dueDate).format('MM/DD/YYYY')}</TableCell>
        <TableCell>
          <Checkbox
            checked={isChecked}
            color='primary'
            onClick={handleChecked}
          />
        </TableCell>
      </TableRow>
    )
  };

  const HistoryRow = (props) => {
    const {
      bookByBookId: { id: bookId, title },
      checkedIn,
      checkedOut,
      dueDate,
      id,
    } = props;

    const bookUrl = constants.ROUTES.VIEW_BOOK.replace(':bookId', `${bookId}`);
    const goToBook = () => {
      history.push(bookUrl);
    };

    return (
      <TableRow key={id} hover href={bookUrl} onClick={goToBook} style={{ cursor: 'pointer' }}>
        <TableCell>{title}</TableCell>
        <TableCell>{moment(checkedOut).format('MM/DD/YYYY')}</TableCell>
        <TableCell>{moment(dueDate).format('MM/DD/YYYY')}</TableCell>
        <TableCell>{moment(checkedIn).format('MM/DD/YYYY')}</TableCell>
      </TableRow>
    )
  };

  const booksToBeCheckedIn = Array.from(checked)
    .map((c) => (transactions.find((t) => t.node.id === c)).node.bookByBookId.title);

  const joinBooks = (books) => {
    const l = books.length;
    if (l < 2) {
      return books[0];
    } else if (l < 3) {
      return books.join(' and ');
    }
    books[l - 1] = `and ${books[l - 1]}`;
    return books.join(', ');
  };
  let outstandingBooks = [];
  let historicalBooks = [];
  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];
    if (transaction.node.checkedIn) {
      historicalBooks.push(transaction);
    } else {
      outstandingBooks.push(transaction);
    }
  }

  return (
    <div>
      {outstandingBooks.length > 0 && (
        <Box>
          <Typography
            align='center'
            component='h2'
            gutterBottom
            variant='h4'
          >
            Outstanding Books
          </Typography>
          <Table size='small'>
            <TableHead>
              <TableRow>
                {outstandingHeaders.map((text) => (
                  <TableCell key={text}>{text}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {outstandingBooks.map(({ node }) => (
                <OutstandingRow key={node.id} {...node} />
              ))}
            </TableBody>
          </Table>
          <Box my={1}>
            <Button
              color='primary'
              disabled={booksToBeCheckedIn.length < 1}
              fullWidth
              onClick={openDialog}
              variant='contained'
            >
              Check In
            </Button>
          </Box>
        </Box>
      )}
      {historicalBooks.length > 0 && (
        <Box mt={4}>
          <Typography
            align='center'
            component='h2'
            gutterBottom
            variant='h4'
          >
            History
          </Typography>
          <Table size='small'>
            <TableHead>
              <TableRow>
                {historyHeaders.map((text) => (
                  <TableCell key={text}>{text}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map(({ node }) => node.checkedIn && (
                <HistoryRow key={node.id} {...node} />
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
      <ConfirmDialog
        onClose={closeDialog}
        onConfirm={checkIn}
        open={open}
        subtitle={`You are checking in ${joinBooks(booksToBeCheckedIn)}`}
        title='Confirm Check In?'
      />
    </div>
  )
};

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
  query ($userId: Int!){
    user(id: $userId) {
      transactions {
        book {
          title
        }
        bookId
        checkedIn
        checkedOut
        dueDate
        id
      }
    }
  }
`;

const CHECK_IN_BOOK = gql`
  mutation ($id:Int, $checkedIn:String, $checkedInBy:Int, $bookId:Int) {
    updateTransaction(id: $id, checkedIn: $checkedIn, checkedInBy: $checkedInBy) {
      id
    }
    updateBook(id:$bookId, statusId:1) {
      id
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
  const { user = {} } = loading ? {} : data;
  const { transactions = [] } = user;

  const checkIn = () => {
    const checkedIn = moment().format('x');
    const checkedInBy = constants.DEFAULT_USER_ID;
    Promise.all(Array.from(checked).map((id) => (
      checkInBook({
        variables: { bookId: (user.transactions.find((t) => t.id === id)).bookId, checkedIn, checkedInBy, id },
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
      book: { title },
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
        <TableCell>{moment(parseInt(dueDate)).format('MM/DD/YYYY')}</TableCell>
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
      book: { title },
      bookId,
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
        <TableCell>{moment(parseInt(checkedOut)).format('MM/DD/YYYY')}</TableCell>
        <TableCell>{moment(parseInt(dueDate)).format('MM/DD/YYYY')}</TableCell>
        <TableCell>{moment(parseInt(checkedIn)).format('MM/DD/YYYY')}</TableCell>
      </TableRow>
    )
  };

  const booksToBeCheckedIn = Array.from(checked)
    .map((c) => (user.transactions.find((t) => t.id === c)).book.title);

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

  return (
    <div>
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
            {transactions.map((row) => !row.checkedIn && (
              <OutstandingRow key={row.id} {...row} />
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
           {transactions.map((row) => row.checkedIn && (
             <HistoryRow key={row.id} {...row} />
           ))}
         </TableBody>
       </Table>
     </Box>
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

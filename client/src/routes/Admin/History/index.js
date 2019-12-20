// TODO: create history table. Use the same history table as book history, but add book titled


import * as constants from 'utils/constants';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ConfirmDialog from 'components/ConfirmDialog';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { gql } from 'apollo-boost';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useMutation, useQuery } from '@apollo/react-hooks';

const CREATE_BOOK = gql`
  mutation ($title:String, $author:String, $isbn:String, $description:String, $pageCount:Int, $releaseDate:String, $statusId:Int) {
    createBook(title:$title, author:$author, isbn:$isbn, description:$description, pageCount:$pageCount, releaseDate:$releaseDate, coverUrl:"/images/books/placeholder.png", statusId:$statusId) {
      title
    }
  }
`;

const EDIT_BOOK = gql`
  mutation ($id:Int, $title:String, $author:String, $isbn:String, $description:String, $pageCount:Int, $releaseDate:String, $statusId:Int) {
    updateBook(id:$id, title:$title, author:$author, isbn:$isbn, description:$description, pageCount:$pageCount, releaseDate:$releaseDate, coverUrl:"/images/books/placeholder.png", statusId:$statusId) {
      id
    }
  }
`;

const DELETE_BOOK = gql`
  mutation($id:Int!) {
    deleteBook(id:$id) {
      success
    }
  }
`;

const QUERY = gql`
  query Book($bookId: Int) {
    book(id: $bookId) {
      author,
      coverUrl,
      description,
      isbn,
      pageCount,
      releaseDate,
      statusId
      title,
      
      transactions {
        id
        checkedOut
        checkedOutBy
        checkedIn
        checkedInBy
        dueDate
        user {
          firstName
          lastName
          id
          email
        }
      }
    }
    statuses {
      id
      status
    }
  }
`;

const fields = [
  { text: 'Title', value: 'title' },
  { text: 'Author', value: 'author' },
];

const headers = [
  'Checked Out By',
  'Checked Out',
  'Due Date',
  'Checked In By',
  'Checked In',
];

const INITIAL_STATE = {
  author: '',
  coverUrl: '',
  description: '',
  isbn: '',
  pageCount: '',
  releaseDate: '',
  status: '',
  title: '',
  transactions: [],
};

const TransactionRow = (props) => {
  const {
    checkedIn,
    checkedInBy,
    checkedOut,
    dueDate,
    id,
    user: {
      email,
      firstName,
      lastName,
    }
  } = props;

  return (
    <TableRow key={id}>
      <TableCell>{`${firstName} ${lastName} (${email})`}</TableCell>
      <TableCell>{moment(parseInt(checkedOut)).format('MM/DD/YYYY')}</TableCell>
      <TableCell>{moment(parseInt(dueDate)).format('MM/DD/YYYY')}</TableCell>
      <TableCell>{checkedInBy ? `${firstName} ${lastName} (${email})` : ''}</TableCell>
      <TableCell>{checkedIn ? moment(parseInt(checkedIn)).format('MM/DD/YYYY') : ''}</TableCell>
    </TableRow>
  )
};

export default (props) => {
  const { history, match: { params: { bookId: b } } } = props;
  const bookId = parseInt(b);
  const [values, setValues] = useState(INITIAL_STATE);
  const [edited, setEdited] = useState(false);
  const [open, setOpen] = useState(false);
  const [createBook] = useMutation(CREATE_BOOK);
  const [editBook] = useMutation(EDIT_BOOK);
  const [deleteBook] = useMutation(DELETE_BOOK);
  const { data, refetch } = useQuery(QUERY, {
    variables: { bookId: bookId },
    onCompleted: (res) => {
      if (!res.book) {
        history.replace(constants.ADMIN_ROUTES.ADD_BOOK);
      } else {
        const newValues = { ...res.book};
        newValues['releaseDate'] = moment(parseInt(newValues['releaseDate']));
        setValues(newValues);
      }
    },
  });

  useEffect(() => {
    if (!bookId) {
      setValues(INITIAL_STATE);
    }
  }, [bookId]);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const { statuses = [] } = data || {};
  const isNewBook = !bookId;

  const handleDeleteBook = () => {
    deleteBook({
      variables: { id: bookId },
    }).then(() => {
      closeDialog();
      history.push(constants.ADMIN_ROUTES.MANAGE_BOOKS);
    })
  };

  const update = () => {
    const action = isNewBook ? createBook : editBook;
    const variables = {
      ...values,
      pageCount: parseInt(values.pageCount),
      releaseDate: values.releaseDate ? values.releaseDate.format('x') : '',
    };
    if (!isNewBook) {
      variables.id = bookId;

    }
    action({ variables })
      .then(() => refetch({ bookId }))
      .then((res) => {
        const newValues = { ...res.data.book};
        newValues['releaseDate'] = moment(parseInt(newValues['releaseDate']));
        setEdited(false);
        setValues(newValues);
        history.push(constants.ADMIN_ROUTES.MANAGE_BOOKS);
      });
  };

  const updateValue = (field) => (e) => {
    const newValues = {...values};
    newValues[field] = e.target.value;
    setEdited(true);
    setValues(newValues);
  };

  const updateDate = (field) => (date) => {
    const newValues = {...values};
    newValues[field] = date;
    setEdited(true);
    setValues(newValues);
  };

  return (
    <div>
      <Typography
        align='center'
        component='h1'
        gutterBottom
        variant='h4'
      >
        {isNewBook ? 'Add New' : 'Edit'} Book
      </Typography>
      <Grid container spacing={1}>
        {fields.map((field) => (
          <Grid item key={field.value} xs={12}>
            <TextField
              fullWidth
              label={field.text}
              margin='normal'
              onChange={updateValue(field.value)}
              value={values[field.value]}
            />
          </Grid>
        ))}
        <Grid item xs={6}>
          <TextField
            fullWidth
            label='ISBN'
            margin='normal'
            onChange={updateValue('isbn')}
            value={values['isbn']}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label='Page Count'
            margin='normal'
            onChange={updateValue('pageCount')}
            type='number'
            value={values['pageCount']}
          />
        </Grid>
        <Grid item xs={6}>
          <KeyboardDatePicker
            format='MM/DD/YYYY'
            fullWidth
            label='Release Date'
            margin='normal'
            onChange={updateDate('releaseDate')}
            value={values['releaseDate'] || moment()}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth margin='normal'>
            <InputLabel>Status</InputLabel>
            <Select
              onChange={updateValue('statusId')}
              value={values['statusId'] || ''}
            >
              {statuses.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label='Description'
            margin='normal'
            multiline
            onChange={updateValue('description')}
            rows={4}
            value={values['description']}
            variant='outlined'
          />
        </Grid>
      </Grid>
      <Box mb={2}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              {headers.map((text) => (
                <TableCell key={text}>{text}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          {values['transactions'].length > 0 && (
            <TableBody>
              {values['transactions'].map((row) => (
                <TransactionRow key={row.id} {...row} />
              ))}
            </TableBody>
          )}
        </Table>
      </Box>
      <Box my={1}>
        {isNewBook ? (
          <Button
            color='primary'
            disabled={!edited}
            fullWidth
            onClick={update}
            variant='contained'
          >
            Create Book
          </Button>
        ) : (
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button
                color='primary'
                disabled={!edited}
                fullWidth
                onClick={update}
                variant='contained'
              >
                Update Book
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                color='secondary'
                fullWidth
                onClick={openDialog}
                variant='outlined'
              >
                Delete Book
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
      <ConfirmDialog
        onClose={closeDialog}
        onConfirm={handleDeleteBook}
        open={open}
        subtitle={`Are you sure you wish to delete ${values['title']}?`}
        title='Confirm Delete?'
      />
    </div>
  )
}

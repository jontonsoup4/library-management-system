import Box from '@material-ui/core/Box';
import moment from 'moment';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

const QUERY = gql`
  {
    allTransactions(orderBy: CHECKED_OUT_DESC) {
      edges {
        node {
          bookByBookId {
            title
          }
          checkedOut
          checkedIn
          dueDate
          id
          userByCheckedInBy {
            firstName
            lastName
          }
          userByCheckedOutBy {
            firstName
            lastName
          }
          userByUserId {
            firstName
            lastName
            id
            email
          }
        }
      }
    }
  }
`;

const headers = [
  'Title',
  'User',
  'Checked Out By',
  'Checked Out',
  'Due Date',
  'Checked In By',
  'Checked In',
];

const TransactionRow = (props) => {
  const {
    bookByBookId,
    checkedIn,
    checkedOut,
    dueDate,
    id,
    userByCheckedInBy,
    userByCheckedOutBy,
    userByUserId,
  } = props;

  const formatName = (user) => `${user.firstName} ${user.lastName}`;

  return (
    <TableRow key={id}>
      <TableCell>{bookByBookId ? bookByBookId.title : ''}</TableCell>
      <TableCell>{userByUserId ? formatName(userByUserId) : ''}</TableCell>
      <TableCell>{userByCheckedOutBy ? formatName(userByCheckedOutBy) : ''}</TableCell>
      <TableCell>{moment(checkedOut).format('MM/DD/YYYY')}</TableCell>
      <TableCell>{moment(dueDate).format('MM/DD/YYYY')}</TableCell>
      <TableCell>{userByCheckedInBy ? formatName(userByCheckedInBy) : ''}</TableCell>
      <TableCell>{checkedIn ? moment(checkedIn).format('MM/DD/YYYY') : ''}</TableCell>
    </TableRow>
  )
};

export default () => {
  const { data, loading } = useQuery(QUERY);
  const { allTransactions: transactions } = loading ? {} : data;

  return (
    <div>
      <Typography
        align='center'
        component='h1'
        gutterBottom
        variant='h4'
      >
        Transaction History
      </Typography>

      {transactions && (
        <Box mb={2}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                {headers.map((text) => (
                  <TableCell key={text}>{text}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.edges.map(({ node }) => (
                <TransactionRow key={node.id} {...node} />
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </div>
  )
}

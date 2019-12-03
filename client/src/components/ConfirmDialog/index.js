import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

export default (props) => {
  const {
    confirmText = 'Yes',
    declineText = 'No',
    onClose,
    onConfirm,
    open,
    subtitle = 'Are you sure?',
    title = 'Confirm',
  } = props;

  return (
    <Dialog
      aria-describedby="alert-dialog-description"
      aria-labelledby="alert-dialog-title"
      disableBackdropClick
      onClose={onClose}
      open={open}
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      {subtitle && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {subtitle}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button
          color='primary'
          onClick={onClose}
          variant='outlined'
        >
          {declineText}
        </Button>
        <Button
          autoFocus
          color='primary'
          onClick={onConfirm}
          variant='contained'
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

import Box from '@material-ui/core/Box';
import ButtonBase from '@material-ui/core/ButtonBase';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import styles from './styles';
import Typography from '@material-ui/core/Typography';

export default (props) => {
  const { book, ...rest } = props;
  const {
    coverUrl,
    title,
  } = book;
  const classes = styles();

  return (
    <Paper>
      <ButtonBase className={classes.book}>
        <div>
          <Box
            alt={title}
            component='img'
            src={coverUrl}
            width='100%'
            {...rest}
          />
          <Typography color='textPrimary' gutterBottom variant='body2'>
            {title}
          </Typography>
        </div>
      </ButtonBase>
    </Paper>
  )
}

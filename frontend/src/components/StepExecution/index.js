
import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Execution from './ExecutionList';



const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Dashboard() {
  const classes = useStyles();

  return <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Execution />
          </Paper>
        </Grid>
      </Grid>
    
}
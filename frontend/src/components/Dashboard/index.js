
import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Chart from './Chart';
import Deposits from './Deposits';
import Orders from './Orders';



const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 600,
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12}>
          <Paper className={fixedHeightPaper}>
            <Chart />
          </Paper>
        </Grid>
      </Grid>
    
}
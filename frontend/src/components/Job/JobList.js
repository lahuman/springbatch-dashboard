import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Button from '@material-ui/core/Button';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Link } from "react-router-dom";
import fetch from 'node-fetch';
import Title from '../Common/Title';

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

let intervalObj = null;

export default function JobInstance() {
  const [rows, setRows] = React.useState([]);
  const [skip, setSkip] = React.useState(0);
  const [isMore, setIsMore] = React.useState(false);
  const [name, setName] = React.useState('');
  const take = 30;

  const callList = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/batch/jobInstances?take=${take}&skip=${skip}${name !== '' ? `&name=${name}` : ``}`);
    const data = await res.json();
    setRows(r => [...r, ...data.batchJobsInstance]);
    if (data.batchJobsInstance.length < take) setIsMore(false);
    else setIsMore(true);
  }


  const searchAction = () => {
    setRows([]);  
    setIsMore(false);
    if (skip === 0) {
      clearTimeout(intervalObj);
      intervalObj = setTimeout(() => {
        callList();
      }, 800)
    } else {
      setSkip(0);
    }
  };

  React.useEffect(() => {
    searchAction();
  }, [name]);

  React.useEffect(() => {
    callList();
  }, [skip]);

  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid container style={{ flexGrow: 1 }}>
        <Grid item xs={12} style={{ marginBottom: '20px' }}>
          <Grid container direction="row"
            justify="space-between"
            alignItems="center" spacing={2}>
            <Grid item >
              <Title>Job Instance</Title>
            </Grid>
            <Grid item>
              <TextField label="Search Job" placeholder="Job Name" value={name} style={{ width: '400px' }} onChange={e => setName(e.target.value)} />
            </Grid>
          </Grid>
        </Grid>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Job Id</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Job Name</TableCell>
              <TableCell>Job Key</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows && rows.map((row) => (
              <TableRow key={row.jobInstanceId}>
                <TableCell><Link to={`/jobExecution?name=${row.jobName}`}><Button>{row.jobInstanceId}</Button></Link></TableCell>
                <TableCell>{row.version}</TableCell>
                <TableCell> <Button onClick={e => setName(row.jobName)}>{row.jobName}</Button></TableCell>
                <TableCell>{row.jobKey}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {isMore && <div className={classes.seeMore}>
          <Button onClick={e => { setSkip(s => s + take); }}>
            See more orders
        </Button>
        </div>}
      </Grid>
    </React.Fragment>
  );
}
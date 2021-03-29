import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import TextField from '@material-ui/core/TextField';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { Link, useLocation } from 'react-router-dom';
import { subDays, format, parseISO } from 'date-fns';
import { LocalizationProvider, DateRangePicker, DateRangeDelimiter } from '@material-ui/pickers';
import DateFnsUtils from '@material-ui/pickers/adapter/date-fns';
import queryString from 'query-string';

import Title from '../Common/Title';


const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const tableInfo = [
  {
    name: 'Job Execution ID',
    key: 'jobExecutionId',
    isDetail: true
  }, {
    name: 'Version',
    key: 'version'
  }, {
    name: 'Job Name',
    key: 'jobInstanceId',
    isJob: true,
  }, {
    name: 'Create Time',
    key: 'createTime',
    dateFormat: true
  }, {
    name: 'Start Time',
    key: 'startTime',
    dateFormat: true
  }, {
    name: 'End Time',
    key: 'endTime',
    dateFormat: true
  }, {
    name: 'Status',
    key: 'status',
    isStatus: true,
    message: 'exitMessage'
  }
];

let intervalObj = null;

export default function JobExecution() {
  const classes = useStyles();
  const location = useLocation();

  const [rows, setRows] = React.useState([]);
  const [skip, setSkip] = React.useState(0);
  const [isMore, setIsMore] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isFirst, setIsFirst] = React.useState(false);
  const [name, setName] = React.useState('');
  const [value, setValue] = React.useState([subDays(new Date(), 30), new Date()]);
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  const handleOpen = (msg) => {
    setErrorMessage(msg);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const take = 30;

  const callList = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/batch/jobExecution?take=${take}&skip=${skip}${name !== '' ? `&name=${name}` : ``}&startDate=${format(value[0], 'yyyy-MM-dd')}&endDate=${format(value[1], 'yyyy-MM-dd')}`);
    const data = await res.json();
    setRows(r => [...r, ...data.batchJobExecution]);
    if (data.batchJobExecution.length < take) {
      setIsMore(false);
    } else {
      setIsMore(true);
    }
  }

  const searchAction = () => {
    setRows([]);
    setIsMore(false);
    if (skip === 0) {
      clearTimeout(intervalObj);
      intervalObj = setTimeout(() => {
        callList();
      }, 500)
    } else {
      setSkip(0);
    }
  };

  React.useEffect(() => {
    const paramName = queryString.parse(location.search);
    paramName.name  && setName(paramName.name);
    paramName.startDate && setValue([parseISO(paramName.startDate), parseISO(paramName.endDate)]);
  }, []);

  React.useEffect(() => {
    searchAction();
  }, [name, value]);

  React.useEffect(() => {
    if (!isFirst) {
      setIsFirst(true);
      return;
    }
    callList();
  }, [skip]);

  const displayStatus = (status, msg) => {
    const tMsg = msg;
    let display = <span style={{ color: `${status === 'FAILED' ? "red" : "green"}` }}>{status}</span>;
    return msg === '' ? display : <Button onClick={e => handleOpen(tMsg)}>{display}</Button>;
  };

  return (
    <React.Fragment>
      <LocalizationProvider dateAdapter={DateFnsUtils}>


        <Grid container style={{ flexGrow: 1 }}>
          <Grid item xs={12} style={{ marginBottom: '20px' }}>
            <Grid container direction="row"
              justify="space-between"
              alignItems="center" spacing={2}>
              <Grid item >
                <Title>Job Execution</Title>
              </Grid>
              <Grid item >
                <DateRangePicker
                  inputFormat="yyyy-MM-dd"
                  mask="____-__-__"
                  startText="Start Date"
                  endText="End Date"
                  open={calendarOpen}
                  onOpen={() => setCalendarOpen(true)}
                  onClose={() => setCalendarOpen(false)}
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  renderInput={(startProps, endProps) => (
                    <React.Fragment>
                      <TextField
                        {...startProps}
                        size={'small'}
                        helperText=""
                        onClick={() => setCalendarOpen(true)}
                      />
                      <DateRangeDelimiter>~</DateRangeDelimiter>
                      <TextField
                        {...endProps}
                        size={'small'}
                        helperText=""
                        onClick={() => setCalendarOpen(true)}
                      />
                    </React.Fragment>
                  )}
                />
              </Grid>
              <Grid item>
                <TextField label="Search Job" placeholder="Job Name" value={name} style={{ width: '400px' }} onChange={e => setName(e.target.value)} />
              </Grid>
            </Grid>
          </Grid>

          <Table size="small">
            <TableHead>
              <TableRow>
                {tableInfo.map((t, i) => <TableCell key={i}>{t.name}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row[tableInfo[0].key]}>
                  {tableInfo.map((t, i) => <TableCell key={i}>
                    {t.dateFormat ? format(new Date(row[t.key]), "yyyy-MM-dd HH:mm") :
                      t.isStatus ? displayStatus(row[t.key], row[t.message]) :
                        t.isJob ? <Button onClick={e => setName(row.jobInstance.jobName)}>{row.jobInstance.jobName}</Button> :
                          t.isDetail ? <Link to={`/stepExecution/${row[t.key]}`}>{row[t.key]}</Link> :
                            row[t.key]}
                  </TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {isMore && <div className={classes.seeMore}>
            <Button onClick={e => { setSkip(s => s + take); }}>
              See more orders
        </Button>
          </div>}
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <div className={classes.paper}>
                <h2 id="transition-modal-title">Failed Message</h2>
                <p id="transition-modal-description">{errorMessage}</p>
              </div>
            </Fade>
          </Modal>
        </Grid>
      </LocalizationProvider>
    </React.Fragment>
  );
}
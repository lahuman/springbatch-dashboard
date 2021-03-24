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
import Fade from '@material-ui/core/Fade';
import { Link } from "react-router-dom";

import { useParams, useHistory } from 'react-router-dom';
import Title from '../Common/Title';
import { format } from 'date-fns'


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
    name: 'Job Instance ID',
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


export default function JobExecution() {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();

  const [rows, setRows] = React.useState([]);
  const [skip, setSkip] = React.useState(0);
  const [isMore, setIsMore] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [jobId, setJobId] = React.useState(id || '');
  const [isFirst, setIsFirst] = React.useState(false);
  const handleOpen = (msg) => {
    setErrorMessage(msg);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const take = 30;

  const callList = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/batch/jobExecution/${jobId}?take=${take}&skip=${skip}`);
    const data = await res.json();
    setRows(r => [...r, ...data.batchJobExecution]);
    if (data.batchJobExecution.length < take) {
      setIsMore(false);
    }
  }

  React.useEffect(() => {
    setRows([]);
    setIsMore(true);
    history.replace(`/jobExecution/${jobId && jobId}`);
    if (skip === 0) {
      callList();
    } else {
      setSkip(0);
    }
  }, [jobId]);

  React.useEffect(() => {
    if (!id) {
      setJobId('');
    }
  }, [id]);

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
      <Title>Job Execution {!!isMore} &nbsp;&nbsp;&nbsp;&nbsp;{jobId && <span style={{ color: 'black' }}>선택된 Job Instance : {jobId}</span>}</Title>
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
                    t.isJob ? <Button onClick={e => setJobId(row[t.key])}>{row[t.key]}</Button> :
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
    </React.Fragment>
  );
}
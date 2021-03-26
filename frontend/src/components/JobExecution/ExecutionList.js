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
import { useParams, useHistory, Link, useLocation } from 'react-router-dom';
import { format } from 'date-fns'
import AsyncSelect from 'react-select/async';


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
  const location = useLocation();

  const [rows, setRows] = React.useState([]);
  const [skip, setSkip] = React.useState(0);
  const [isMore, setIsMore] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [jobId, setJobId] = React.useState(id || '');
  const [isFirst, setIsFirst] = React.useState(false);
  const [name, setName] = React.useState('');
  const [selectVal, setSelectVal] = React.useState(null);


  const handleOpen = (msg) => {
    setErrorMessage(msg);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const take = 30;

  const callList = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/batch/jobExecution/${jobId}?take=${take}&skip=${skip}${name!==''?`&name=${name}`:``}`);
    const data = await res.json();
    setRows(r => [...r, ...data.batchJobExecution]);
    if (data.batchJobExecution.length < take) {
      setIsMore(false);
    }
  }

  const jobCall = async (id, name) => {
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/batch/jobInstances?${id ? `id=${id}` : ''}&${name ? `name=${name}` : ''}`);
    return await res.json();
  }

  const convetSelectObj = (job) => job && ({ value: job.jobInstanceId, label: job.jobName });

  const jobList = async (name, callback) => {
    if (name.length < 3) return;
    const data = await jobCall(null, name);
    callback(data.batchJobsInstance.map(convetSelectObj));
  }


  const searchAction = () => {
    setRows([]);
    setIsMore(true);
    history.replace(`/jobExecution/${jobId && jobId}`);
    if (skip === 0) {
      callList();
    } else {
      setSkip(0);
    }
  };
  const setJobSelect = (id) => {
    setJobId(id);
    setName('');
    jobCall(id).then(jsonData => setSelectVal(jsonData.batchJobsInstance && convetSelectObj(jsonData.batchJobsInstance[0])));
  }
  
  React.useEffect(() => {
    if (!id) {
      jobId !== '' && setJobId('');
      const paramName = location.search.replace('?name=', '');
      paramName !== '' && setName(paramName);

      setSelectVal(null);
    } else {
      setJobSelect(id)
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
      <Title>Job Execution
      
        <div style={{ width: "200px" , margin: "0px 20px 0px 20px"}}>
          <AsyncSelect
            cacheOptions
            defaultOptions
            width='200px'
            loadOptions={jobList}
            value={selectVal}
            onChange={(data) => {
              setJobId(data.value);
              setSelectVal(data);
            }} />
        </div>
          <Button variant="contained" color="" size="small" onClick={e=>{
            setJobId('');
            setSelectVal(null);
            }}>
            Remove
          </Button>
        <TextField label="Job Name" value={name} onChange={e => setName(e.target.value)} style={{margin: "0 100px 0 20px"}} />
        <Button variant="contained" color="primary" size="small" onClick={searchAction}>
          Search
        </Button>
      </Title>
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
                    t.isJob ? <Button onClick={e => setJobSelect(row[t.key])}>{row[t.key]}</Button> :
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
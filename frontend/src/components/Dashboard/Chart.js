import React from 'react';
import DateFnsUtils from '@material-ui/pickers/adapter/date-fns';
import TextField from "@material-ui/core/TextField";
import { subDays, format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import Title from '../Common/Title';
import { LocalizationProvider, DateRangePicker, DateRangeDelimiter } from '@material-ui/pickers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function JobRunningDashboard() {

  const [value, setValue] = React.useState([subDays(new Date(), 30), new Date()]);
  const [data, setData] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const history = useHistory();

  const callData = async () => {
    if (!value[0] || !value[1]) return;
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/batch/dashBoard?startDate=${format(value[0], 'yyyy-MM-dd')}&endDate=${format(value[1], 'yyyy-MM-dd')}`);
    setData(await res.json())
  }
  React.useEffect(() => {
    callData();
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={DateFnsUtils}>
      <Title>Job Running Story &nbsp;&nbsp;&nbsp;&nbsp;<DateRangePicker
        inputFormat="yyyy-MM-dd"
        mask="____-__-__"
        startText="Start Date"
        endText="End Date"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField
              {...startProps}
              size={'small'}
              helperText=""
              onClick={() => setOpen(true)}
            />
            <DateRangeDelimiter>~</DateRangeDelimiter>
            <TextField
              {...endProps}
              size={'small'}
              helperText=""
              onClick={() => setOpen(true)}
            />
          </React.Fragment>
        )}
      />
      </Title>
      {data && <ResponsiveContainer width="100%" height="100%" >
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          onClick={(dt, idx) => {
            dt.activePayload && history.push(`/jobExecution?name=${dt.activePayload[0].payload.jobName}`);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="jobName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar name="FAIL COUNT" dataKey="failCount" stackId="a" fill="red" />
          <Bar name="COMPLET COUNT" dataKey="completCount" stackId="a" fill="green" />
        </BarChart>
      </ResponsiveContainer>}
    </LocalizationProvider>
  );
}
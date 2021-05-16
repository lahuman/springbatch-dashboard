import React from 'react';
import DateFnsUtils from '@material-ui/pickers/adapter/date-fns';
import TextField from "@material-ui/core/TextField";
import { subDays, format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import Title from '../Common/Title';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import { LocalizationProvider, DateRangePicker, DateRangeDelimiter } from '@material-ui/pickers';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

var canSplit = function (str, token) {
  return (str || '').split(token).length > 1;
}

const CustomizedAxisTick = (props) => {
  const { x, y, stroke, payload } = props;
  const [date, value] = canSplit(payload.value, '\r\n') && payload.value.split('\r\n') || ['', ''];
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} fill="#666">
        <tspan textAnchor="middle" x="0">{date}</tspan>
        <tspan textAnchor="middle" x="0" dy="20">{value}</tspan>
      </text>
    </g>
  );
};


export default function JobRunningDashboard() {

  const [value, setValue] = React.useState([subDays(new Date(), 30), new Date()]);
  const [data, setData] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [chartType, setChartType] = React.useState('summary');
  const history = useHistory();

  const callData = async () => {
    if (!value[0] || !value[1]) return;
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/batch/dashBoard/${chartType}?startDate=${format(value[0], 'yyyy-MM-dd')}&endDate=${format(value[1], 'yyyy-MM-dd')}`);
    const localData = await res.json();
    localData && setData(localData);
  }
  React.useEffect(() => {
    callData();
  }, [value, chartType]);

  return (
    <Grid container style={{ flexGrow: 1 }}>
      <LocalizationProvider dateAdapter={DateFnsUtils}>

        <Grid item xs={12} style={{ arginBottom: '20px' }}>
          <Grid container direction="row"
            justify="space-between"
            alignItems="center" spacing={2}>
            <Grid item >
              <Title>Job Running {chartType === "summary" && "Summary" || "Daliy "}</Title>
            </Grid>
            <Grid item >
              <FormControl style={{ width: '100px' }}>
                <InputLabel id="chartType">Chart Type</InputLabel>
                <Select
                  labelId="chartType"
                  value={chartType}
                  onChange={e => {
                    setChartType(e.target.value)
                  }}
                >
                  <MenuItem value={"summary"}>summary</MenuItem>
                  <MenuItem value={"daily"}>daily</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item >
              <DateRangePicker
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
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} >

          {chartType === "summary" && data && <ResponsiveContainer width="100%" height="100%" >
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
                if (dt && dt.activePayload && dt.activePayload.length > 0) {
                  history.push(`/jobExecution?name=${dt.activePayload[0].payload.jobName}&startDate=${format(value[0], 'yyyy-MM-dd')}&endDate=${format(value[1], 'yyyy-MM-dd')}`);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jobName" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Bar name="FAIL COUNT" dataKey="failCount" stackId="a" fill="red" />
              <Bar name="COMPLET COUNT" dataKey="completCount" stackId="a" fill="green" />
            </BarChart>
          </ResponsiveContainer>}
          {chartType === "daily" && data && <ResponsiveContainer width="100%" height="100%" >
            <LineChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
              onClick={(dt, idx) => {
                if (dt && dt.activePayload && dt.activePayload.length > 0) {
                  history.push(`/jobExecution?name=${dt.activePayload[0].payload.jobName.split('\r\n')[1]}&startDate=${format(value[0], 'yyyy-MM-dd')}&endDate=${format(value[1], 'yyyy-MM-dd')}`);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jobName" tick={<CustomizedAxisTick />} />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" name="FAIL COUNT" dataKey="failCount" stroke="#ff0000" activeDot={{ r: 8 }} />
              <Line type="monotone" name="COMPLET COUNT" dataKey="completCount" stroke="#02b81a" />
            </LineChart>
          </ResponsiveContainer>}
        </Grid>
      </LocalizationProvider>
    </Grid>
  );
}
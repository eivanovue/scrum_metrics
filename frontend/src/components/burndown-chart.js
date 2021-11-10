import React from 'react';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const sumArrayUpTo = (arrData, index) => {
  let total = 0;
  for (let i = 0; i <= index; i++) {
    if (arrData.length > i) {
      total += arrData[i];
    }
  }
  return total;
};

const BurnDownChart = (props) => {
  const { sprintMetrics } = props;
  const totalDaysInSprint = sprintMetrics.length;

  const totalPointsInSprint = sprintMetrics[0].remaining;
  const idealPointsPerDay = totalPointsInSprint / (totalDaysInSprint - 1);

  const scopeChange = sprintMetrics.map((metric, idx) => {
    if (idx === 0) {
      return 0;
    }
    return metric.added;
  });
  let i = 0;
  const ideal = [
    Math.round(totalPointsInSprint - (idealPointsPerDay * i++) + sumArrayUpTo(scopeChange, 0)),
    Math.round(totalPointsInSprint - (idealPointsPerDay * i++) + sumArrayUpTo(scopeChange, 1)),
    Math.round(totalPointsInSprint - (idealPointsPerDay * i++) + sumArrayUpTo(scopeChange, 2)),
    Math.round(totalPointsInSprint - (idealPointsPerDay * i++) + sumArrayUpTo(scopeChange, 3)),
    Math.round(totalPointsInSprint - (idealPointsPerDay * i++) + sumArrayUpTo(scopeChange, 4)),
    Math.round(totalPointsInSprint - (idealPointsPerDay * i++) + sumArrayUpTo(scopeChange, 5)),
    Math.round(totalPointsInSprint - (idealPointsPerDay * i++) + sumArrayUpTo(scopeChange, 6)),
    Math.round(totalPointsInSprint - (idealPointsPerDay * i++) + sumArrayUpTo(scopeChange, 7)),
    Math.round(totalPointsInSprint - (idealPointsPerDay * i++) + sumArrayUpTo(scopeChange, 8)),
    Math.round(totalPointsInSprint - (idealPointsPerDay * i++) + sumArrayUpTo(scopeChange, 9)),
  ];

  const actual = sprintMetrics.map((metric) => metric.remaining);
  const options = {
    chart: {
      width: '1000',
    },
    title: {
      text: '',
    },
    colors: ['rgba(111, 113, 182, 0.06)', '#212243'],
    plotOptions: {
      line: {
        lineWidth: 5,
      },
      tooltip: {
        hideDelay: 200,
      },
    },
    xAxis: {
      categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6',
        'Day 7', 'Day 8', 'Day 9', 'Day 10'],
    },
    yAxis: {
      title: {
        text: '',
      },
      gridLineColor: 'transparent',
      min: 0,
      plotLines: [{
        value: 0,
        width: 1,
      }],
    },
    tooltip: {
      shared: true,
    },
    series: [{
      showInLegend: false,
      name: 'Ideal',
      color: 'rgba(111, 113, 182, 0.6)',
      lineWidth: 5,
      dashStyle: 'DashDot',
      data: ideal,
    }, {
      showInLegend: false,
      name: 'Remaining',
      color: '#212243',
      data: actual,
    }],
    backgroundColor: null,
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      style={{ width: '100%' }}

    />
  );
};

export default BurnDownChart;

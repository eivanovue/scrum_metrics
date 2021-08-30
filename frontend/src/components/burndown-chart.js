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
    title: {
      text: 'Burndown Chart',
      x: -20, // center
    },
    colors: ['blue', 'red'],
    plotOptions: {
      line: {
        lineWidth: 3,
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
        text: 'Story Points',
      },
      min: 0,
      plotLines: [{
        value: 0,
        width: 1,
      }],
    },
    tooltip: {
      valueSuffix: ' points',
      crosshairs: true,
      shared: true,
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      borderWidth: 0,
    },
    series: [{
      name: 'Ideal',
      color: '#6C8893',
      lineWidth: 2,
      dashStyle: 'DashDot',
      data: ideal,
    }, {
      name: 'Remaining',
      color: 'rgba(0,120,200,0.75)',
      marker: {
        radius: 6,
      },
      data: actual,
    }],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
};

export default BurnDownChart;

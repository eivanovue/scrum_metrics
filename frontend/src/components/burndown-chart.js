import React from 'react';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const BurnDownChart = (props) => {
  const { totalPointsInSprint, sprintMetrics } = props;
  let idealRemaining = totalPointsInSprint;
  const ideal = Array(10).fill().map(() => {
    idealRemaining -= (Math.round(totalPointsInSprint / 10));
    return idealRemaining < 0 ? 0 : idealRemaining;
  });
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
      name: 'Ideal remaining',
      color: 'rgba(255,0,0,0.25)',
      lineWidth: 2,
      data: ideal,
    }, {
      name: 'Actual remaining',
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

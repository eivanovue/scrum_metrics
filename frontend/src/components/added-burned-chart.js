import React from 'react';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const AddedBurnedChart = (props) => {
  const { sprintMetrics } = props;

  const added = sprintMetrics.map((metric) => metric.completed);
  const burned = sprintMetrics.map((metric) => metric.added);

  const options = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Story Points Added and Burned',
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
      name: 'Story points added',
      color: 'rgba(255,0,0,0.25)',
      data: burned,
    }, {
      name: 'Story points burned',
      color: 'rgba(0,120,200,0.75)',
      data: added,
    }],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
};

export default AddedBurnedChart;

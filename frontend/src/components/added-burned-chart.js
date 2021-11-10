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
      width: 1000,
    },
    title: {
      text: '',
    },
    colors: ['rgba(111, 113, 182, 0.06)', '#212243'],
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
      gridLineColor: 'transparent',

    },
    yAxis: {
      title: {
        text: '',
      },
      gridLineColor: 'transparent',
      plotLines: [{
        value: 0,
        width: 1,
      }],
    },
    tooltip: {
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
      color: 'rgba(111, 113, 182, 0.6)',
      data: burned,
      showInLegend: false,
    }, {
      name: 'Story points burned',
      color: '#212243',
      data: added,
      showInLegend: false,
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

const options = {
  animation: false,
  color: [
    '#5470c6',
    '#91cc75',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#AFEEEE',
    '#FA8072',
    '#9a60b4',
    '#BDB76B',
    '#ADFF2F',
    '#ea7ccc',
    '#fac858',
    '#ee6666',
    '#FF00FF',
    '#FFA07A',
    '#FAFAD2',
  ],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // Use axis to trigger tooltip
      // type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
    },
  },
  legend: {
    top: '2%',
    left: '3%',
    itemWidth: 16,
    itemHeight: 5,
    textStyle: {
      color: '#bbb',
      fontSize: 10,
      // fontFamily:'serif',
    },
  },
  grid: {
    left: '3%',
    right: '60px',
    bottom: '2%',
    containLabel: true,
  },
  yAxis: {
    type: 'value',
    fontSize: 14,
    scale: true,
    axisLabel: {
      color: '#bbb',
      // fontFamily:'serif',
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#666',
      },
      // symbol: ['none', 'arrow'],
    },
    nameTextStyle: {
      color: '#bbb',
    },
    splitNumber: 2,
    splitLine: {
      lineStyle: {
        color: '#666',
        type: 'dashed',
      },
    },
  },
  xAxis: {
    type: 'value',
    scale: true,
    axisLine: {
      show: true,
      lineStyle: {
        color: '#666',
      },
      // symbol: ['none', 'arrow'],
    },
    nameTextStyle: {
      color: '#bbb',
    },
    splitLine: {
      lineStyle: {
        color: '#666',
        type: 'dashed',
      },
    },
    axisLabel: {
      show: true,
      showMinLabel: true,
      showMaxLabel: true,
      // rotate: 45,
      fontSize: 14,
      // interval:99,
      color: '#bbb',
      fontFamily: 'Helvetica',
      formatter: function (val: any) {
        return parseInt(val);
      },
    },
  },
};

export default options;

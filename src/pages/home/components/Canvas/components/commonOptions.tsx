const options = {
    color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            // Use axis to trigger tooltip
            // type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
        }
    },
    legend: {
        top: '2%',
        left: '3%',
        itemWidth: 16,
        itemHeight: 5,
        textStyle: {
            color: '#666',
            fontSize: 10,
            // fontFamily:'serif',
        },
    },
    grid: {
        left: '3%',
        right: '60px',
        bottom: '2%',
        containLabel: true
    },
    yAxis: {
        type: 'value',
        fontSize: 14,
        scale: true,
        axisLabel: {
            color: '#666'
            // fontFamily:'serif',
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#666',
            },
            // symbol: ['none', 'arrow'],
        },
        splitNumber: 2,
        splitLine: {
            lineStyle: {
                color: '#666',
                type: 'dashed'
            }
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
        splitLine: {
            lineStyle: {
                color: '#666',
                type: 'dashed'
            }
        },
        axisLabel: {
            show: true,
            showMinLabel: true,
            showMaxLabel: true,
            // rotate: 45,
            fontSize: 14,
            // interval:99,
            color: '#666',
            fontFamily: 'Helvetica',
            formatter: function (val: any) {
                return parseInt(val);
            }
        },
    },
}

export default options;
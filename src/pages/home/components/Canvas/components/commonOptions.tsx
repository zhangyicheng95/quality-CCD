const options = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
        }
    },
    legend: {
        top: '2%',
        left: '2%',
        itemWidth: 13,
        itemHeight: 3,
        textStyle: {
            color: '#666'
            // fontFamily:'serif',
        },
    },
    grid: {
        left: '3%',
        right: '10%',
        bottom: '2%',
        containLabel: true
    },
    yAxis: {
        type: 'value',
        fontSize: 14,
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
        splitNumber: 10,
        splitLine: {
            lineStyle: {
                color: '#666',
                type: 'dashed'
            }
        },
    },
    xAxis: {
        type: 'value',
        axisLine: {
            show: true,
            lineStyle: {
                color: '#666',
            },
            // symbol: ['none', 'arrow'],
        },
        splitNumber: 20,
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
            // formatter: function (val: any) {
            //     return parseInt(val) ? moment(parseInt(val)).format(`YYYY-MM-DD HH:mm`) : val;
            // }
        },
    },
}

export default options;
import React, { Fragment, memo, useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import options from './commonOptions';
import * as _ from 'lodash';
import { message, Modal } from 'antd';
import { ExpandOutlined } from '@ant-design/icons';
import ImgCharts from './ImgCharts';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}
let timer: string | number | NodeJS.Timeout | null | undefined = null;
const localData = {
  length: 120,
  defects: [
    {
      position: '上',
      length: 10,
      type: '[漆粒子｜划伤]',
      url: 'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0',
    },
    {
      position: '上',
      length: 20,
      type: '[漆粒子｜划伤]',
      url: 'http://localhost:8866/123.jpg',
    },
    {
      position: '上',
      length: 40,
      type: '[漆粒子｜划伤]',
      url: 'http://localhost:8866/123.jpg',
    },
    {
      position: '下',
      length: 40,
      type: '[漆粒子｜划伤]',
      url: 'http://localhost:8866/123.jpg',
    },
    {
      position: '左',
      length: 40,
      type: '[漆粒子｜划伤]',
      url: 'http://localhost:8866/123.jpg',
    }
  ]
};
const CableCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, setMyChartVisible } = props;
  let { dataValue = {}, dataZoom } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = localData
  }
  const domRef = useRef<any>();
  const myChartRef = useRef<any>();
  const mouseOnBoxRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [visibleData, setVisibleData] = useState<any>(null);

  useEffect(() => {
    if (!domRef.current) {
      return;
    }
    myChartRef.current = echarts.init(domRef.current);

    domRef.current.addEventListener('mouseover', () => {
      mouseOnBoxRef.current = true;
    });
    domRef.current.addEventListener('mouseleave', () => {
      mouseOnBoxRef.current = false;
    });

    return () => {
      domRef?.current?.removeEventListener?.('mouseover', () => {
        mouseOnBoxRef.current = true;
      });
      domRef?.current?.removeEventListener?.('mouseleave', () => {
        mouseOnBoxRef.current = false;
      });
      window.removeEventListener(
        'resize',
        () => {
          myChartRef.current.resize({
            width: domRef.current.clientWidth,
            height: domRef.current.clientHeight,
          });
        },
        false,
      );
      myChartRef.current && myChartRef.current.dispose();
    };
  }, []);
  const init = () => {
    const { defects = [], length } = dataValue;
    if (!defects?.length) {
      return;
    }
    let maxLength = 0;
    let centerData = {
      '上': [],
      '下': [],
      '左': [],
      '右': []
    };
    let resData: any = [];
    (defects || [])?.forEach?.((item: any) => {
      const { position, length, type, url } = item;
      if (length > maxLength) {
        maxLength = length;
      };
      if (!!centerData?.[position]) {
        centerData[position].push({
          value: [position, length],
          position, length, type, url
        });
      } else {
        centerData = Object.assign({}, centerData, {
          [position]: [],
        });
      };
    });
    Object.entries(centerData)?.map((i: any) => {
      resData.push({
        name: i[0],
        value: i[1],
      });
    });
    resData = resData.reverse?.();
    const option = Object.assign({}, options, {
      legend: false,
      tooltip: {
        trigger: 'item',
      },
      grid: Object.assign(
        {},
        options.grid,
        {
          right: 36,
          left: 24,
          bottom: 36,
          top: 12,
        },
      ),
      yAxis: Object.assign({}, options.yAxis, {
        type: 'category',
        name: false,
        color: 'green',
        boundaryGap: false, //direction === 'rows' ? ['5%', '5%'] : false,
        axisLabel: Object.assign({}, options?.xAxis?.axisLabel, {
          formatter: function (val: any) {
            return val;
          },
        }),
        axisLine: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'solid',
            color: 'rgba(144,144,144,.5)',
            width: 4
          }
        },
        axisTick: {
          show: false,
        },
        splitNumber: 3,
        scale: true,
      }),
      dataZoom: [
        Object.assign(
          {
            type: 'slider',
            show: true,
            realtime: true,
            start: !!dataZoom ? ((maxLength - dataZoom) / maxLength) * 100 : 0,
            end: 100,
            showDetai: false,
            moveHandleStyle: {
              opacity: 0,
            },
            orient: 'horizontal',
            bottom: 15,
            left: 80,
            right: 60,
            height: 20,
          }
        ),
        {
          type: 'inside',
        }
      ],
      xAxis: Object.assign({}, options?.xAxis, {
        axisLabel: Object.assign({}, options?.xAxis?.axisLabel, {
          formatter: function (val: any) {
            return val;
          },
        }),
        axisLine: {
          show: false
        },
        boundaryGap: [0, '1%'],
        // splitNumber: 3,
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        type: 'value',
        name: '',
        scale: false,
        max: length,
        min: 0
      }),
      seriesLayoutBy: 'row',
      series: (resData || [])?.map?.((item: any) => {
        const { name, value, type } = item;

        return {
          symbolSize: 8,
          symbol: 'circle', //散点形状设置symbol: circle 圆, rect 方, roundRect 圆角方, triangle 三角, diamond 菱形, pin 气球, arrow 箭头
          name: name,
          // color: color,
          type: 'scatter',
          tooltip: {
            position: 'top'
          },
          sampling: 'lttb',
          itemStyle: { color: 'red' },
          data: _.cloneDeep(value)?.map?.((item: any) => {
            return (_.cloneDeep(item?.value).reverse())?.concat([item.type, item.url]);
          }),
        };
      }),
    });

    myChartRef.current.setOption(option);
    myChartRef.current.resize({
      width: domRef.current.clientWidth,
      height: domRef.current.clientHeight,
    });
    myChartRef.current.on('click', (e: any) => {
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        setVisibleData({
          position: e.data?.[1],
          length: e.data?.[0],
          type: e.data?.[2],
          url: e.data?.[3]
        });
        setVisible(true);
      }, 200);
    });

    window.addEventListener(
      'resize',
      () => {
        myChartRef.current.resize({
          width: domRef.current.clientWidth,
          height: domRef.current.clientHeight,
        });
      },
      false,
    );
  };
  useEffect(() => {
    if (!_.isObject(dataValue)) {
      message.error('线缆图数据格式不正确，请检查');
      console.log('CableCharts:', dataValue);
      return;
    }
    if (!domRef.current) {
      return;
    }
    if (mouseOnBoxRef.current) {
      return;
    }
    setTimeout(() => {
      init();
    }, 200);
  }, [data, mouseOnBoxRef.current]);
  const onCancel = () => {
    setVisibleData(null);
    setVisible(false);
  };

  return (
    <Fragment>
      <div style={{ width: '100%', height: '100%' }} id={`echart-${id}`} ref={domRef} />
      <div className="preview-box flex-box-center">
        <ExpandOutlined
          className="preview-icon"
          onClick={() => {
            if (!!myChartRef.current) {
              const options = myChartRef.current?.getOption?.();
              setMyChartVisible(options);
            }
          }}
        />
      </div>

      {
        // 每个缺陷
        !!visible ? (
          <Modal
            title={`[${visibleData?.position}]-[${visibleData?.length}米]-${visibleData?.type}`}
            width="calc(100vw - 48px)"
            wrapClassName={'full-screen-modal'}
            centered
            footer={null}
            open={!!visible}
            onOk={() => {
              onCancel()
            }}
            onCancel={() => onCancel()}
          >
            <ImgCharts
              id={`${id.split('$$')[0]}$$1$$alertImg`}
              data={{
                dataValue: visibleData?.url || undefined,
                notLocalStorage: true,
                comparison: false,
                magnifier: true,
                magnifierSize: 4,
              }}
            />
          </Modal>
        ) : null
      }
    </Fragment>
  );
};

export default memo(CableCharts);
import TooltipDiv from '@/components/TooltipDiv';
import { message } from 'antd';
import _ from 'lodash';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import styles from '../index.module.less';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}
const localData = [
  {
    name: '序号',
    value: 'value1',
    color: 'red',
  },
  {
    name: '创建时间',
    value: 'value2',
  },
];

const TableCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dataValue = [],
    yName,
    xName = '',
    tableFontSize = 14,
    fontSize = 12,
    reverse,
    interlacing,
    des_bordered,
    headerBackgroundColor,
    valueColor = 'value',
    line_height,
  } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = localData;
  }
  const domRef = useRef<any>(null);
  const [tableScroll, setTableScroll] = useState(false);
  const [tableSize, setTableSize] = useState<any>([]);

  useEffect(() => {

    if (!_.isArray(dataValue)) {
      message.error('双列表格组件数据格式不正确，请检查');
      console.log('TableCharts', dataValue);
      return;
    }
    const height = domRef?.current?.clientHeight;
    const valueLength = dataValue[0]?.value?.length;
    if (height > valueLength * 38) {
      setTableScroll(false);
    } else {
      setTableScroll(true);
    };
    let list = [],
      titleSize = (yName?.length || 0) * tableFontSize + 18,
      valueSize = (xName?.length || 0) * tableFontSize + 18;
    (dataValue || []).forEach((item: any) => {
      const { name, value } = item;
      if ((name?.length * fontSize + 16) > titleSize) {
        titleSize = name?.length * fontSize + 16;
      };
      if ((value?.length * fontSize + 16) > valueSize) {
        valueSize = value?.length * fontSize + 16;
      };
    });
    setTableSize([titleSize, valueSize]);
  }, [dataValue, tableFontSize, fontSize]);
  return (
    <div id={`echart-${id}`} className={styles.tableCharts} ref={domRef} style={{ fontSize }}>
      <div
        className="charts-header-box flex-box"
        style={Object.assign(
          {
            fontSize: tableFontSize,
            minWidth: ((tableSize[0] + tableSize[1]) || 'auto')
          },
          tableScroll ? { width: 'calc(100% - 6px)' } : { width: 'calc(100% - 1px)' },
          headerBackgroundColor === 'transparent'
            ? { backgroundColor: 'transparent' }
            : headerBackgroundColor === 'line1'
              ? {
                backgroundColor: 'transparent',
                backgroundImage:
                  'linear-gradient(to right, rgba(39, 90, 235, 1), rgb(26, 160, 222))',
              }
              : {},
        )}
      >
        {!!yName?.trim?.() ?
          <TooltipDiv title={yName} className="charts-header-item" style={{ minWidth: tableSize[0] }}>
            {yName}
          </TooltipDiv>
          : null}
        {!!xName?.trim?.() ?
          <TooltipDiv title={xName} className="charts-header-item" style={{ minWidth: tableSize[1] }}>
            {xName}
          </TooltipDiv>
          : null}
      </div>
      <div
        className="charts-body-box"
        style={Object.assign({},
          des_bordered
            ? {
              borderWidth: '1px',
            }
            : {}
        )}
      >
        {_.isArray(dataValue)
          ? (!!reverse ? _.cloneDeep(dataValue).reverse() : dataValue)?.map?.(
            (item: any, index: number) => {
              const { name, value, color } = item;
              if (_.isObject(item?.value[0]) && !_.isArray(item?.value[0])) {
                // @ts-ignore
                const { value, color } = item?.value[0];
                const text = _.isArray(value) ? value.join(',') : value;
                return (
                  <div
                    className={`charts-body-tr flex-box charts-body-tr-interlacing-${interlacing}`}
                    key={`echart-${id}-tr-${index}`}
                  >
                    <TooltipDiv
                      className="charts-body-td flex-box-center"
                      style={Object.assign(
                        { minWidth: tableSize[0] },
                        des_bordered ? { borderWidth: '1px' } : {},
                        line_height
                          ? { lineHeight: `${line_height - 4}px`, height: line_height }
                          : {},
                      )}
                    >
                      {name}
                    </TooltipDiv>

                    <TooltipDiv
                      className="charts-body-td flex-box-center"
                      title={text?.length > 10 ? text : ''}
                      style={Object.assign(
                        { minWidth: tableSize[1] },
                        !!color
                          ? valueColor === 'value'
                            ? { color }
                            : { backgroundColor: color, color: '#fff' }
                          : {},
                        des_bordered ? { borderWidth: '1px' } : {},
                        line_height
                          ? { lineHeight: `${line_height - 4}px`, height: line_height }
                          : {},
                      )}
                    >
                      {text}
                    </TooltipDiv>
                  </div>
                );
              }
              const text = _.isArray(value) ? value.join(',') : value;
              return (
                <div
                  className={`charts-body-tr flex-box charts-body-tr-interlacing-${interlacing}`}
                  key={`echart-${id}-tr-${index}`}
                >
                  <div
                    className="charts-body-td flex-box-center"
                    style={Object.assign(
                      { minWidth: tableSize[0] },
                      line_height
                        ? { lineHeight: `${line_height - 4}px`, height: line_height }
                        : {}
                    )}
                  >
                    {name}
                  </div>
                  <TooltipDiv
                    className="charts-body-td flex-box-center"
                    title={text.length > 10 ? text : ''}
                    style={Object.assign(
                      { minWidth: tableSize[1] },
                      !!color
                        ? valueColor === 'value'
                          ? { color }
                          : { backgroundColor: color, color: '#fff' }
                        : {},
                      des_bordered ? { borderWidth: '1px' } : {},
                      line_height
                        ? { lineHeight: `${line_height - 4}px`, height: line_height }
                        : {},
                    )}
                  >
                    {text}
                  </TooltipDiv>
                </div>
              );
            },
          )
          : null}
      </div>
    </div>
  );
};

export default memo(TableCharts);

import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import * as _ from 'lodash';
import styles from '../index.module.less';
import TooltipDiv from '@/components/TooltipDiv';
import { message } from 'antd';
import { useModel } from 'umi';
import { guid } from '@/utils/utils';
import { updateParams } from '@/services/api';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const Table3Charts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dataValue = [],
    tableFontSize = 14,
    fontSize = 12,
    reverse,
    tableSize = [],
    interlacing,
    des_bordered,
    headerBackgroundColor,
    valueColor = 'value',
    line_height,
  } = data;
  const ifCanEdit = useMemo(() => {
    return location.hash?.indexOf('edit') > -1;
  }, [location.hash]);
  if (process.env.NODE_ENV === 'development') {
    reverse = true;
    dataValue = [
      {
        tab: 'tab1',
        children: [
          {
            name: '序号1',
            value: [
              { value: 'value1', color: 'red' },
              { value: 'value2', color: 'red' },
              { value: 'value1', color: 'red' },
            ],
            color: 'red',
          },
          {
            name: '创建时间1',
            value: [
              { value: 'value1', color: 'red' },
              { value: 'value2', color: 'red' },
              { value: 'value1', color: 'red' },
            ],
          },
        ],
      },
      {
        tab: 'tab2',
        children: [
          {
            name: '序号2',
            value: [
              { value: 'value2', color: 'red' },
              { value: 'value2', color: 'red' },
              { value: 'value2', color: 'red' },
            ],
            color: 'red2',
          },
          {
            name: '创建时间2',
            value: [
              { value: 'value1222', color: 'red' },
              { value: 'value2222', color: 'red' },
              { value: 'value1222', color: 'red' },
            ],
          },
        ],
      },
      {
        tab: 'tab3',
        children: [
          {
            name: '序号3',
            value: [
              { value: 'value3', color: 'red' },
              { value: 'value3', color: 'red' },
              { value: 'value3', color: 'red' },
            ],
            color: 'red',
          },
          {
            name: '创建时间3',
            value: [
              { value: 'value3', color: 'red' },
              { value: 'value3', color: 'red' },
              { value: 'value3', color: 'red' },
            ],
          },
        ],
      },
    ];
  }
  const { initialState = {}, setInitialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  const { flowData } = params;
  const { nodes } = flowData;
  const domRef = useRef<any>(null);
  const [tabSelected, setTabSelected] = useState(0);
  const [tableSizeSelf, setTableSizeSelf] = useState(tableSize);

  useEffect(() => {
    if (!_.isArray(dataValue)) {
      message.error('tab切换表格组件数据格式不正确，请检查');
      console.log('Table3Charts:', dataValue);
      return;
    }
  }, [dataValue]);

  const onMoveIconMouseDown = (ev: any, index: number) => {
    const { target } = ev;
    const parent = target.parentNode;
    const { clientWidth } = parent;
    let width = 0;
    if (!domRef.current) return;
    domRef.current.onmousemove = (e: any) => {
      width = Math.abs(clientWidth - (ev.pageX - e.pageX));
      parent.style.width = width + 'px';
      parent.style.minWidth = width + 'px';
    };
    domRef.current.onmouseup = (e: any) => {
      const chartsBox: any = document.getElementById(`echart-${id}`);
      const { clientWidth } = chartsBox;
      const tableSizes = _.isArray(tableSize) ? _.cloneDeep(tableSize) : [];

      if (!!tableSizes?.length) {
        tableSizes[index] = (width / clientWidth) * 100 + '%';
      } else {
        dataValue.forEach?.((item: any, ind: number) => {
          if (ind === index) {
            tableSizes[index] = (width / clientWidth) * 100 + '%';
          } else {
            tableSizes[ind] = !!tableSizes[ind] ? tableSizes[ind] : 0;
          }
        });
      }
      setTableSizeSelf(tableSizes);

      const updateParam = {
        ...params,
        contentData: {
          ...params?.contentData,
          content: params?.contentData?.content?.map?.((item: any) => {
            if (item.id === id) {
              return Object.assign({}, item, {
                tableSize: tableSizes,
              });
            }
            return item;
          }),
        },
      };
      setInitialState((preInitialState: any) => ({
        ...preInitialState,
        params: updateParam,
      }));
      updateParams({
        id: params.id,
        data: updateParam,
      }).then((res: any) => {
        if (res && res.code === 'SUCCESS') {
          // setInitialState((preInitialState: any) => ({
          //     ...preInitialState,
          //     params: res?.data
          // }));
        } else {
          message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
        }
      });
      domRef.current.onmousemove = (e: any) => {
        // 释放鼠标
      };
    };
  };
  return (
    <div id={`echart-${id}`} className={styles.table3Charts} ref={domRef} style={{ fontSize }}>
      <div className="flex-box charts-tab-box">
        {dataValue?.map?.((item: any, index: number) => {
          const { tab } = item;
          return (
            <div
              className={`charts-tab-item ${tabSelected === index ? 'charts-tab-item-selected' : ''}`}
              key={`tab-${index}`}
              onClick={() => {
                setTabSelected(index);
              }}
            >
              {tab}
            </div>
          );
        })}
      </div>
      <div
        className="charts-header-box flex-box"
        style={Object.assign(
          {},
          headerBackgroundColor === 'transparent' ? { backgroundColor: 'transparent' } : {},
        )}
      >
        {_.isArray(dataValue[tabSelected]?.children) &&
          (dataValue[tabSelected]?.children || [])?.map?.((item: any, index: number) => {
            const { name } = item;
            return (
              <div
                className="charts-header-item flex-box"
                key={`echart-${id}-tr-th-${index}`}
                style={Object.assign(
                  { fontSize: tableFontSize },
                  !!tableSizeSelf?.[index]
                    ? {
                      width: tableSizeSelf?.[index],
                      minWidth: tableSizeSelf?.[index],
                      maxWidth: tableSizeSelf?.[index],
                    }
                    : {},
                )}
              >
                <TooltipDiv placement="top" title={name} className="charts-header-item-title">
                  {name}
                </TooltipDiv>
                {index + 1 === dataValue[tabSelected]?.children?.length ? null : (
                  <div
                    id={`charts-header-item-move-${index}`}
                    className="charts-header-item-border"
                    style={ifCanEdit ? { width: 10 } : {}}
                    onMouseDown={(e: any) => {
                      if (location.hash?.indexOf('edit') > -1) {
                        onMoveIconMouseDown(e, index);
                      }
                    }}
                  />
                )}
              </div>
            );
          })}
      </div>
      <div
        className="charts-body-box flex-box"
        style={
          des_bordered
            ? {
              borderWidth: '1px',
            }
            : {}
        }
      >
        {_.isArray(dataValue[tabSelected]?.children)
          ? (dataValue[tabSelected]?.children || [])?.map?.((item: any, index: number) => {
            const { value = [], color } = item;
            if (!_.isArray(value)) {
              const node = nodes.filter((i: any) => i.id === id.split('$$')[0])?.[0] || {};
              message.error(`${node.name}（${node.id}）推送信息错误，请检查`, 5);
              return null;
            }
            return (
              <div
                className={`charts-body-tr`}
                key={`echart-${id}-tr-${index}`}
                style={Object.assign(
                  !!tableSizeSelf?.[index]
                    ? {
                      width: tableSizeSelf?.[index],
                      minWidth: tableSizeSelf?.[index],
                      maxWidth: tableSizeSelf?.[index],
                    }
                    : {},
                  !!color
                    ? valueColor === 'value'
                      ? { color }
                      : { backgroundColor: color, color: '#fff' }
                    : {},
                )}
              >
                {(!!reverse ? _.cloneDeep(value).reverse() : value)?.map?.(
                  (val: any, sIndex: number) => {
                    if (_.isObject(val)) {
                      // @ts-ignore
                      const { value, color } = val;
                      return (
                        <div
                          key={`echart-${id}-tr-td-${sIndex}-${value}`}
                          className={`flex-box charts-body-td charts-body-td-interlacing-${interlacing}`}
                        >
                          <TooltipDiv
                            className={`charts-body-td-title`}
                            title={value?.length > 15 ? value : ''}
                            style={Object.assign(
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
                            placement={'top'}
                            onClick={
                              value?.indexOf?.('http://') > -1
                                ? () => {
                                  window.open(value, '_blank');
                                }
                                : null
                            }
                          >
                            {value?.indexOf?.('http://') > -1 ? '查看' : value}
                          </TooltipDiv>
                          {!des_bordered ||
                            index + 1 === dataValue[tabSelected]?.children?.length ? null : (
                            <div
                              className="charts-body-item-border"
                              style={line_height ? { height: line_height } : {}}
                            />
                          )}
                        </div>
                      );
                    }
                    return (
                      <div
                        key={`echart-${id}-tr-td-${sIndex}-${val}`}
                        className={`flex-box charts-body-td charts-body-td-interlacing-${interlacing}`}
                      >
                        <TooltipDiv
                          className={`charts-body-td-title`}
                          title={val?.length > 15 ? val : ''}
                          style={Object.assign(
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
                          placement={'top'}
                          onClick={
                            val?.indexOf?.('http://') > -1
                              ? () => {
                                window.open(val, '_blank');
                              }
                              : null
                          }
                        >
                          {val?.indexOf?.('http://') > -1 ? '查看' : val}
                        </TooltipDiv>
                        {!des_bordered ||
                          index + 1 === dataValue[tabSelected]?.children?.length ? null : (
                          <div
                            className="charts-body-item-border"
                            style={line_height ? { height: line_height } : {}}
                          />
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            );
          })
          : null}
      </div>
    </div>
  );
};

export default memo(Table3Charts);

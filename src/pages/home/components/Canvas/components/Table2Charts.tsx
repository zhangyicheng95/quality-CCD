import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as _ from 'lodash';
import styles from '../index.module.less';
import TooltipDiv from '@/components/TooltipDiv';
import { Button, message } from 'antd';
import { useModel } from 'umi';
import { ifHasChinese } from '@/utils/utils';
import { updateParams } from '@/services/api';
import { UndoOutlined } from '@ant-design/icons';
import moment from 'moment';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const Table2Charts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dataValue = [],
    fontSize,
    reverse,
    tableSize = [],
    interlacing,
    des_bordered,
    headerBackgroundColor,
    valueColor = 'value',
    line_height,
    bodyPaddingSize,
  } = data;
  const ifCanEdit = useMemo(() => {
    return location.hash?.indexOf('edit') > -1;
  }, [location.hash]);
  const { initialState, setInitialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  const { flowData } = params;
  const { nodes } = flowData;
  const domRef = useRef<any>(null);
  const [boxSizeSelf, setBoxSizeSelf] = useState<any>(0);
  const [tableSizeSelf, setTableSizeSelf] = useState<any>([]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      dataValue = [
        {
          name: '结果',
          value: [
            { value: 'OK' },
            { value: 1 },
            { value: 1 },
            { value: 1 },
            { value: 1 },
            { value: 1 },
            { value: 1 },
            { value: 1 },
            { value: 1 },
          ],
        },
        {
          name: '生产号',
          value: [
            { value: '2882381' },
            { value: '2882383' },
            { value: '2882384' },
            { value: '2882387' },
            { value: '2882389' },
            { value: '2882392' },
            { value: '2882394' },
            { value: '2882396' },
            { value: '2882399' },
          ],
        },
        {
          name: '点位名称',
          value: [
            { value: '前门音响' },
            { value: '左前门把手' },
            { value: '后门' },
            { value: '前门音响' },
            { value: '左前门把手' },
            { value: '前门音响' },
            { value: '后门' },
            { value: '左前门把手' },
            { value: '后门' },
          ],
        },
        {
          name: '生产号',
          value: [
            { value: '2882381' },
            { value: '2882383' },
            { value: '2882384' },
            { value: '2882387' },
            { value: '2882389' },
            { value: '2882392' },
            { value: '2882394' },
            { value: '2882396' },
            { value: '2882399' },
          ],
        },
        {
          name: '点位名称',
          value: [
            { value: '前门音响' },
            { value: '左前门把手' },
            { value: '后门' },
            { value: '前门音响' },
            { value: '左前门把手' },
            { value: '前门音响' },
            { value: '后门' },
            { value: '左前门把手' },
            { value: '后门' },
          ],
        },
        {
          name: '生产号',
          value: [
            { value: '2882381' },
            { value: '2882383' },
            { value: '2882384' },
            { value: '2882387' },
            { value: '2882389' },
            { value: '2882392' },
            { value: '2882394' },
            { value: '2882396' },
            { value: '2882399' },
          ],
        },
        {
          name: '点位名称',
          value: [
            { value: '前门音响' },
            { value: '左前门把手' },
            { value: '后门' },
            { value: '前门音响' },
            { value: '左前门把手' },
            { value: '前门音响' },
            { value: '后门' },
            { value: '左前门把手' },
            { value: '后门' },
          ],
        },
        {
          name: '生产号',
          value: [
            { value: '2882381' },
            { value: '2882383' },
            { value: '2882384' },
            { value: '2882387' },
            { value: '2882389' },
            { value: '2882392' },
            { value: '2882394' },
            { value: '2882396' },
            { value: '2882399' },
          ],
        },
        {
          name: '点位名称',
          value: [
            { value: '前门音响' },
            { value: '左前门把手' },
            { value: '后门' },
            { value: '前门音响' },
            { value: '左前门把手' },
            { value: '前门音响' },
            { value: '后门' },
            { value: '左前门把手' },
            { value: '后门' },
          ],
        },
        {
          name: '检测时间',
          value: [
            {
              value: moment(
                new Date(new Date(new Date().toLocaleDateString()).getTime() + 1 * 60 * 1000),
              ).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
              value: moment(
                new Date(new Date(new Date().toLocaleDateString()).getTime() + 30 * 60 * 1000),
              ).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
              value: moment(
                new Date(new Date(new Date().toLocaleDateString()).getTime() + 2 * 52 * 60 * 1000),
              ).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
              value: moment(
                new Date(new Date(new Date().toLocaleDateString()).getTime() + 3 * 51 * 60 * 1000),
              ).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
              value: moment(
                new Date(new Date(new Date().toLocaleDateString()).getTime() + 4 * 51 * 60 * 1000),
              ).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
              value: moment(
                new Date(new Date(new Date().toLocaleDateString()).getTime() + 5 * 51 * 60 * 1000),
              ).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
              value: moment(
                new Date(new Date(new Date().toLocaleDateString()).getTime() + 6 * 53 * 60 * 1000),
              ).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
              value: moment(
                new Date(new Date(new Date().toLocaleDateString()).getTime() + 7 * 54 * 60 * 1000),
              ).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
              value: moment(
                new Date(new Date(new Date().toLocaleDateString()).getTime() + 8 * 50 * 60 * 1000),
              ).format('YYYY-MM-DD HH:mm:ss'),
            },
          ],
        },
        {
          name: '缺陷类型',
          value: [
            { value: '错装' },
            { value: '配合不良' },
            { value: '配合不良' },
            { value: '错装' },
            { value: '配合不良' },
            { value: '错装' },
            { value: '配合不良' },
            { value: '配合不良' },
            { value: '错装' },
          ],
        },
      ];
    }
    if (!_.isArray(dataValue)) {
      message.error('通用表格组件数据格式不正确，请检查');
      console.log('Table2Charts:', dataValue);
      return;
    }
    let list: any = [];
    let boxSize = 0;
    (dataValue || [])?.forEach((item: any, index: number) => {
      const { name, value } = item;
      const text = !_.isUndefined(value?.[0]?.value) ? value?.[0]?.value + '' : value?.[0] + '';
      let isNum = false;
      try {
        const number = JSON.parse(text);
        if ((number + '')?.length > name.length) {
          isNum = true;
        }
      } catch (err) {
        if (!ifHasChinese(text)) {
          isNum = true;
        } else {
          isNum = false;
        }
      }
      const number =
        Math.max(text?.length, name.length) *
          fontSize *
          (isNum || name?.indexOf('时间') > -1 ? 0.57 : 1) +
        18;
      list[index] = number;
      boxSize += number;
    });
    setTableSizeSelf((prev: any) => {
      return (!!prev.length ? prev : list).map((item: any, index: number) => {
        return {
          ...item,
          minWidth: list[index],
        };
      });
    });
    setBoxSizeSelf(Math.max(boxSize, domRef.current?.clientWidth));
  }, [dataValue, fontSize, domRef?.current?.clientWidth]);
  const updateCanvas = (tableSizes: any) => {
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
  };
  const onMoveIconMouseDown = (ev: any, index: number) => {
    const { target } = ev;
    const parent = target.parentNode;
    const { clientWidth } = parent;
    let width = 0;
    if (!domRef.current) return;
    domRef.current.onmousemove = (e: any) => {
      width = Math.min(Math.abs(clientWidth - (ev.pageX - e.pageX)), 0.9);
      parent.style.width = width + 'px';
      parent.style.minWidth = width + 'px';
    };
    domRef.current.onmouseup = (e: any) => {
      const chartsBox: any = document.getElementById(`echart-${id}`);
      const { clientWidth } = chartsBox;
      const tableSizes = _.isArray(tableSize) ? _.cloneDeep(tableSize) : [];

      if (!!tableSizes?.length) {
        tableSizes[index] = Math.max((width / clientWidth) * 100, 10) + '%';
      } else {
        dataValue.forEach((item: any, ind: number) => {
          if (ind === index) {
            tableSizes[index] = Math.max((width / clientWidth) * 100, 10) + '%';
          } else {
            tableSizes[ind] = !!tableSizes[ind] ? tableSizes[ind] : 0;
          }
        });
      }
      setTableSizeSelf(tableSizes);

      updateCanvas(tableSizes);
      domRef.current.onmousemove = (e: any) => {
        // 释放鼠标
      };
    };
  };

  return (
    <div id={`echart-${id}`} className={styles.table2Charts} ref={domRef} style={{ fontSize }}>
      <div
        className="charts-header-box flex-box"
        style={Object.assign(
          { width: boxSizeSelf },
          headerBackgroundColor === 'transparent'
            ? { backgroundColor: 'transparent' }
            : headerBackgroundColor === 'line1'
            ? {
                backgroundColor: 'transparent',
                backgroundImage:
                  'linear-gradient(to right, rgba(39,90,235,0.8), rgba(140,210,220,1))',
              }
            : {},
          { left: bodyPaddingSize },
        )}
      >
        {_.isArray(dataValue) &&
          (dataValue || [])?.map?.((item: any, index: number) => {
            const { name } = item;
            return (
              <div
                className="charts-header-item flex-box"
                key={`echart-${id}-tr-th-${index}`}
                style={Object.assign(
                  !!tableSizeSelf?.[index]
                    ? {
                        width: tableSizeSelf?.[index]?.width,
                        minWidth: tableSizeSelf?.[index]?.minWidth,
                        maxWidth: '50%',
                      }
                    : {},
                )}
              >
                <TooltipDiv title={name} className="charts-header-item-title">
                  {name}
                </TooltipDiv>
                {index + 1 === dataValue?.length ? null : (
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
        {ifCanEdit ? (
          <Button
            type="link"
            icon={<UndoOutlined />}
            className="reset-table-size"
            onClick={() => {
              setTableSizeSelf([]);
              updateCanvas([]);
            }}
          />
        ) : null}
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
        {_.isArray(dataValue)
          ? (dataValue || [])?.map?.((item: any, index: number) => {
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
                          width: tableSizeSelf?.[index]?.width,
                          minWidth: tableSizeSelf?.[index]?.minWidth,
                          maxWidth: '50%',
                        }
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
                            {!des_bordered || index + 1 === dataValue?.length ? null : (
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
                          {!des_bordered || index + 1 === dataValue?.length ? null : (
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

export default Table2Charts;

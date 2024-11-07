import React, { Fragment, memo, useEffect, useMemo, useRef, useState } from 'react';
import * as _ from 'lodash';
import styles from '../index.module.less';
import TooltipDiv from '@/components/TooltipDiv';
import { message } from 'antd';
import { useModel } from 'umi';
import { findChineseNum, ifHasChinese, imageExists } from '@/utils/utils';
import moment from 'moment';
import { DownloadOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const localData1 = [
  {
    name: '结果',
    value: [
      { value: 1 },
      { value: 'OK' },
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
const localData = [
  {
    name: '今日检测总数',
    value: [
      { value: 'http://123.png' },
    ],
  },
  {
    name: '今日OK数',
    value: [
      { value: 'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0' },
    ],
  },
  {
    name: '今日检测总数',
    value: [
      { value: `${(11 / 12 * 100).toFixed(2)}%` },
    ],
  },]

const Table2Charts: React.FC<Props> = (props: any) => {
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
    bodyPaddingSize,
    des_layout,
    imgs_width,
    imgs_height
  } = data;
  const { initialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  const { flowData } = params;
  const { nodes } = flowData;
  const domRef = useRef<any>(null);
  const [tableSizeSelf, setTableSizeSelf] = useState<any>([]);
  if (process.env.NODE_ENV === 'development') {
    dataValue = localData;
  }
  useEffect(() => {
    // if (process.env.NODE_ENV === 'development') {
    //   dataValue = localData;
    // }
    if (!_.isArray(dataValue)) {
      if (dataValue.action === '0') {
        shotDownLoad();
        return;
      }
      message.error('通用表格组件数据格式不正确，请检查');
      console.log('Table2Charts:', dataValue);
      return;
    }
    let list: any = [];
    if (des_layout === 'horizontal') {
      const horizontalLength = dataValue?.[0]?.value?.length;
      let nameListLength = 0;
      let numberList: any = [];
      (dataValue || [])?.forEach?.((item: any, index: number) => {
        const { name, value } = item;
        list[0] = (list[0] || []).concat(name);

        if (name.length > nameListLength) {
          nameListLength = name.length;
        }
        for (let i = 0; i < horizontalLength; i++) {
          list[index + 1] = (list[index + 1] || []).concat(value?.[i]);

          const text = !_.isUndefined(value?.[i]?.value) ? value?.[i]?.value + '' : value?.[i] + '';
          let isNum = false;
          try {
            JSON.parse(text);
            isNum = true;
          } catch (err) {
            if (!ifHasChinese(text)) {
              isNum = true;
            } else {
              isNum = false;
            }
          }
          const number = (text?.indexOf('http://') > -1 ? 2 : text?.length) * fontSize * (isNum ? 0.57 : 1) + 18;
          if (number > (numberList[i] || 0)) {
            numberList[i] = number;
          }
        }
      });
      numberList.unshift(nameListLength * fontSize + 18);

      setTableSizeSelf((prev: any) => {
        return (!!prev.length ? prev : numberList).map((item: any, index: number) => {
          return {
            ...item,
            minWidth: numberList[index],
          };
        });
      });
    } else {
      (dataValue || [])?.forEach?.((item: any, index: number) => {
        const { name, value } = item;
        let text = '';
        let isNum = false;
        let number = 0;
        (value || [])?.forEach?.((val: any) => {
          text = !_.isUndefined(val?.value) ? val?.value + '' : val + '';
          if (text?.indexOf?.('http') > -1) {
            text = '查看';
          }
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
          const trustLengthNum = (Math.max(text?.length, name.length) - findChineseNum('' + text)) * fontSize * 0.59
            +
            findChineseNum('' + text) * fontSize * 1
            + 32;
          if (trustLengthNum > number) {
            number = trustLengthNum;
          }
        });

        list[index] = number;
      });
      setTableSizeSelf((prev: any) => {
        return (!!prev.length ? prev : list).map((item: any, index: number) => {
          return {
            ...item,
            minWidth: list[index],
          };
        });
      });
    }
  }, [dataValue, fontSize, domRef?.current?.clientWidth, window.screen.width]);
  // 截图下载
  const shotDownLoad = () => {
    html2canvas(domRef.current, {
      backgroundColor: 'rgba(144,144,144,.5)',
      scale: 1,
      useCORS: true, // 是否尝试使⽤CORS从服务器加载图像
      allowTaint: false, // 是否允许跨域图像。会污染画布，导致⽆法使⽤canvas.toDataURL ⽅法
    }).then((canvas: any) => {
      let imageDataURL = canvas.toDataURL('image/png', { quality: 1, });
      var link = document.createElement('a');
      link.href = imageDataURL;
      link.download = `output.png`;
      link.click();
    });
  };
  // 打开图片外部链接
  const openLink = (link: string) => {
    imageExists(link, (res: boolean) => {
      if (res) {
        window.open(link, '_blank');
      } else {
        console.log('图片不存在');
        window.open(link?.replace(imgs_width, imgs_height), '_blank');
      }
    });
  };

  return (
    <div id={`echart-${id}`} className={styles.table2Charts} ref={domRef} style={{ fontSize }}>
      {des_layout === 'horizontal' ? (
        <div className="charts-body-box charts-horizontal">
          {(dataValue || [])?.map?.((item: any, index: number) => {
            const { name, value } = item;
            return (
              <div
                className={`flex-box charts-body-tr charts-body-tr-interlacing-${interlacing}`}
                key={`echart-${id}-tr-${index}`}
                style={{ overflow: 'visible' }}
              >
                <div
                  className="charts-body-td flex-box-center"
                  style={Object.assign(
                    { fontSize: tableFontSize },
                    !!tableSizeSelf?.[0]
                      ? {
                        minWidth: tableSizeSelf?.[0]?.minWidth,
                        maxWidth: '50%',
                      }
                      : {},
                    line_height ? { lineHeight: `${line_height - 4}px`, height: line_height } : {},
                    des_bordered
                      ? {
                        borderWidth: '1px',
                      }
                      : {},
                  )}
                >
                  {name}
                </div>
                {value?.map?.((val: any, sIndex: number) => {
                  if (_.isObject(val)) {
                    // @ts-ignore
                    const { value, color } = val;
                    return (
                      <div
                        key={`echart-${id}-tr-td-${sIndex}-${value}`}
                        className={`flex-box charts-body-td`}
                        style={Object.assign(
                          !!tableSizeSelf?.[sIndex + 1]
                            ? {
                              minWidth: tableSizeSelf?.[sIndex + 1]?.minWidth,
                              maxWidth: '50%',
                            }
                            : {},
                        )}
                      >
                        <TooltipDiv
                          className={`charts-body-td-title`}
                          title={value}
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
                          onClick={() => openLink(value)}
                        >
                          {(value?.indexOf?.('http://') > -1 || value?.indexOf?.('https://') > -1) ? '查看' : value}
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
                      className={`flex-box charts-body-td `}
                      style={Object.assign(
                        !!tableSizeSelf?.[sIndex + 1]
                          ? {
                            minWidth: tableSizeSelf?.[sIndex + 1]?.minWidth,
                            maxWidth: '50%',
                          }
                          : {},
                      )}
                    >
                      <TooltipDiv
                        className={`charts-body-td-title`}
                        title={val}
                        style={Object.assign(
                          des_bordered ? { borderWidth: '1px' } : {},
                          line_height
                            ? { lineHeight: `${line_height - 4}px`, height: line_height }
                            : {},
                        )}
                        placement={'top'}
                        onClick={() => openLink(val)}
                      >
                        {(val?.indexOf?.('http://') > -1 || val?.indexOf?.('https://') > -1) ? '查看' : val}
                      </TooltipDiv>
                      {!des_bordered || index + 1 === dataValue?.length ? null : (
                        <div
                          className="charts-body-item-border"
                          style={line_height ? { height: line_height } : {}}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : (
        <Fragment>
          <div
            className="charts-header-box flex-box"
            style={Object.assign(
              {
                fontSize: tableFontSize,
                minWidth: tableSizeSelf?.reduce((pre: any, cen: any) => {
                  const { minWidth } = cen;
                  return pre + minWidth;
                }, 0)
              },
              headerBackgroundColor === 'transparent'
                ? { backgroundColor: 'transparent' }
                : headerBackgroundColor === 'line1'
                  ? {
                    backgroundColor: 'transparent',
                    backgroundImage:
                      'linear-gradient(to right, rgba(39, 90, 235, 1), rgb(26, 160, 222))',
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
                      // headerBackgroundColor === 'transparent'
                      //   ? { backgroundColor: 'transparent' }
                      //   : headerBackgroundColor === 'line1'
                      //     ? {
                      //       backgroundColor: 'transparent',
                      //       backgroundImage:
                      //         'linear-gradient(to right, rgba(39, 90, 235, 1), rgb(26, 160, 222))',
                      //       opacity: 0.7
                      //     }
                      //     : {}
                    )}
                  >
                    <TooltipDiv title={name} placement="top" className="charts-header-item-title">
                      {name}
                    </TooltipDiv>
                  </div>
                );
              })}
          </div>
          <div
            className="charts-body-box flex-box"
            style={Object.assign({},
              des_bordered
                ? {
                  borderWidth: '1px',
                }
                : {},
            )}
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
                                onClick={() => openLink(value)}
                              >
                                {(value?.indexOf?.('http://') > -1 || value?.indexOf?.('https://') > -1) ? '查看' : value}
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
                              onClick={() => openLink(val)}
                            >
                              {(val?.indexOf?.('http://') > -1 || val?.indexOf?.('https://') > -1) ? '查看' : val}
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
        </Fragment>
      )}
      {/* <div className="download-btn">
        <DownloadOutlined
          className="img-box-btn-item"
          onClick={() => {
            shotDownLoad();
          }}
        />
      </div> */}
    </div>
  );
};

export default memo(Table2Charts);

import React, { Fragment, useEffect, useState } from 'react';
import styles from './index.module.less';
import {
  Image,
  Button,
  message,
  Modal,
  Badge,
  Cascader,
  Form,
  Popover,
  Menu,
  Tooltip,
  Popconfirm,
  Skeleton,
  Select,
} from 'antd';
import _ from 'lodash';
import {
  getFlowStatusService,
  getParams,
  startFlowService,
  stopFlowService,
  touchFlowService,
  updateParams,
} from '@/services/api';
import GridLayout from '@/components/GridLayout';
import {
  AndroidOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { ifCanEdit } from '@/common/constants/globalConstants';
import { guid } from '@/utils/utils';
import { connect, useHistory } from 'umi';
import socketErrorListen from '@/services/socketError';
import socketLogListen from '@/services/socketLog';
import socketDataListen from '@/services/socketData';
import socketStateListen from '@/services/socketState';
import TooltipDiv from '@/components/TooltipDiv';
import LineCharts from '@/pages/home/components/Canvas/components/LineCharts';
import PointCharts from '@/pages/home/components/Canvas/components/PointCharts';
import BarCharts from '@/pages/home/components/Canvas/components/BarCharts';
import PieCharts from '@/pages/home/components/Canvas/components/PieCharts';
import TableCharts from '@/pages/home/components/Canvas/components/TableCharts';

let timer: string | number | NodeJS.Timer | null | undefined = null;
let updateTimer: string | number | NodeJS.Timer | null | undefined = null;
const Home: React.FC<any> = (props: any) => {
  const history = useHistory();
  const { dispatch, started, taskDataConnect, snapshot, activeTab, } = props;
  const { logStr, historyData, gridContentList, footerData, errorData } = snapshot;
  // console.log('home', ++i);
  const [form] = Form.useForm();
  const { validateFields } = form;
  // @ts-ignore
  const { type } = window.QUALITY_CCD_CONFIG;
  const ipString: any = localStorage.getItem('ipString') || '';
  const [loading, setLoading] = useState(false);
  const [addWindowVisible, setAddWindowVisible] = useState(false);
  const [editWindowData, setEditWindowData] = useState<any>({});
  const [gridHomeList, setGridHomeList] = useState<any>([]);
  const [contentList, setContentList] = useState([]);
  const [contentLayout, setContentLayout] = useState([]);
  const [paramData, setParamData] = useState<any>({});
  const [nodeList, setNodeList] = useState<any>([]);
  const gridList = [
    <div key={'slider-1'}>
      <div className="btn-box background-ubv">
        <div
          className={`common-card-title-box flex-box drag-btn ${started ? (taskDataConnect ? 'success-message' : 'error-message') : ''
            }`}
        >
          <div className="flex-box common-card-title">
            当前状态：
            {started ? (
              taskDataConnect ? (
                <Tooltip title={'服务已连接'} placement={'bottom'}>
                  <Badge status="processing" className="status-icon" />
                </Tooltip>
              ) : (
                <Tooltip title={'socket未连接'} placement={'bottom'}>
                  <Badge status="error" className="status-icon" />
                </Tooltip>
              )
            ) : loading ? (
              <Tooltip title={'启动中'} placement={'bottom'}>
                <LoadingOutlined style={{ fontSize: 15 }} />
              </Tooltip>
            ) : (
              <Tooltip title={'未启动'} placement={'bottom'}>
                <Badge status="default" className="status-icon" />
              </Tooltip>
            )}
          </div>
        </div>
        {
          ifCanEdit ?
            <Fragment>
              <Popover
                placement="right"
                title={'添加窗口'}
                trigger="click"
                content={
                  <Menu
                    items={[
                      { label: '添加监控窗口', key: 'add', onClick: () => setAddWindowVisible(true) },
                      {
                        label: '显示首页窗口',
                        key: 'home-content',
                        children: [
                          {
                            label: '显示基本信息',
                            key: 'slider-2',
                            disabled: gridHomeList.filter((i: any) => i.i === 'slider-2')[0]?.w !== 0,
                            onClick: () =>
                              setGridHomeList((prev: any) => {
                                return prev.map((item: any) => {
                                  if (item.i === 'slider-2') {
                                    return {
                                      ...item,
                                      w: 2,
                                      h: 4,
                                      minW: 2,
                                      minH: 4,
                                    };
                                  }
                                  return item;
                                })
                              })
                          },
                          {
                            label: '显示实时信息',
                            key: 'slider-3',
                            disabled: gridHomeList.filter((i: any) => i.i === 'slider-3')[0]?.w !== 0,
                            onClick: () =>
                              setGridHomeList((prev: any) => {
                                return prev.map((item: any) => {
                                  if (item.i === 'slider-3') {
                                    return {
                                      ...item,
                                      w: 2,
                                      h: 4,
                                      minW: 2,
                                      minH: 4,
                                    };
                                  }
                                  return item;
                                })
                              })
                          },
                          {
                            label: '显示日志信息',
                            key: 'footer-1',
                            disabled: gridHomeList.filter((i: any) => i.i === 'footer-1')[0]?.w !== 0,
                            onClick: () =>
                              setGridHomeList((prev: any) => {
                                return prev.map((item: any) => {
                                  if (item.i === 'footer-1') {
                                    return {
                                      ...item,
                                      w: 7,
                                      h: 4,
                                      minW: 2,
                                      minH: 4,
                                    };
                                  }
                                  return item;
                                })
                              })
                          },
                          {
                            label: '显示错误信息',
                            key: 'footer-2',
                            disabled: gridHomeList.filter((i: any) => i.i === 'footer-2')[0]?.w !== 0,
                            onClick: () =>
                              setGridHomeList((prev: any) => {
                                return prev.map((item: any) => {
                                  if (item.i === 'footer-2') {
                                    return {
                                      ...item,
                                      w: 3,
                                      h: 4,
                                      minW: 2,
                                      minH: 4,
                                    };
                                  }
                                  return item;
                                })
                              })
                          },
                          // {
                          //   label: '显示节点状态信息',
                          //   key: 'footer-3',
                          //   disabled: gridHomeList.filter((i: any) => i.i === 'footer-3')[0]?.w !== 0,
                          //   onClick: () =>
                          //     setGridHomeList((prev: any) => {
                          //       return prev.map((item: any) => {
                          //         if (item.i === 'footer-3') {
                          //           return {
                          //             ...item,
                          //             y: 12,
                          //             w: 12,
                          //             h: 2,
                          //             minW: 2,
                          //             minH: 2,
                          //           };
                          //         }
                          //         return item;
                          //       })
                          //     })
                          // },
                        ],
                      },
                    ]}
                  ></Menu>
                }
              >
                <Button
                  className="flex-box btn"
                  icon={<PlusCircleOutlined className="btn-icon" />}
                  type="text"
                >
                  添加窗口
                </Button>
              </Popover>
              <Button
                className="flex-box btn"
                icon={<SafetyOutlined className="btn-icon" />}
                type="link"
                onClick={() => {
                  history.push({ pathname: `/home` });
                  window.location.reload();
                }}
              >
                保存并返回
              </Button>
            </Fragment>
            :
            <Fragment>
              <Button
                className="flex-box btn"
                icon={
                  started ? (
                    <div style={{ height: 30, width: 30, marginRight: 8 }}>
                      <div className="k-loader" />
                    </div>
                  ) : (
                    <PlayCircleOutlined className="btn-icon" />
                  )
                }
                type="link"
                onClick={() => start()}
                disabled={started}
                loading={!started && loading}
              >
                {started ? '检测中' : '启动检测'}
              </Button>
              <Button
                className="flex-box btn"
                danger
                icon={<PauseCircleOutlined className="btn-icon" />}
                type="text"
                onClick={() => end()}
                disabled={!started}
                loading={started && loading}
              >
                停止检测
              </Button>
              {process.env.NODE_ENV === 'development' ? (
                <Button
                  className="flex-box btn"
                  icon={<AndroidOutlined className="btn-icon" />}
                  type="link"
                  onClick={() => setInterval(() => touchFlowService(), 100)}
                  disabled={!started}
                  loading={started && loading}
                >
                  自助触发
                </Button>
              ) : null}
            </Fragment>
        }
      </div>
    </div>,
    <div key={'slider-2'}>
      <div className="info-box background-ubv">
        <div className="common-card-title-box flex-box drag-btn">
          <div className="flex-box common-card-title">基本信息</div>
          {
            ifCanEdit ?
              <Popconfirm
                title="确认删除 基本信息 窗口吗?"
                onConfirm={() => {
                  setGridHomeList((prev: any) => {
                    return prev.map((item: any) => {
                      if (item.i === 'slider-2') {
                        return {
                          ...item,
                          w: 0,
                          h: 0,
                          minW: 0,
                          minH: 0,
                        };
                      }
                      return item;
                    })
                  });
                }}
                okText="确认"
                cancelText="取消"
              >
                <div style={{ cursor: 'pointer', fontSize: 14 }}>删除</div>
              </Popconfirm>
              : null
          }
        </div>
        <div className="info-box-content">
          <div className="info-item">
            <div>产线信息：</div>
            {paramData?.commonInfo?.productionInfo}
          </div>
          <div className="info-item">
            <div>工位信息：</div>
            {paramData?.commonInfo?.stationInfo}
          </div>
          <div className="info-item">
            <div>功能信息：</div>
            {paramData?.commonInfo?.useInfo}
          </div>
          {/* {
          Object.entries({ orderId: 'xxxxxxxxx-xxx' }).map((item: any, index: number) => {
            return <TooltipDiv title={item[1]} className="info-item" key={item[0]}>
              订单号：{item[1]}
            </TooltipDiv>
          })
        } */}
        </div>
      </div>
    </div>,
    <div key={'slider-3'}>
      <div className="info-box message-box background-ubv">
        <div className="common-card-title-box flex-box drag-btn success-message">
          <div className="flex-box common-card-title">实时信息</div>
          {
            ifCanEdit ?
              <Popconfirm
                title="确认删除 实时信息 窗口吗?"
                onConfirm={() => {
                  setGridHomeList((prev: any) => {
                    return prev.map((item: any) => {
                      if (item.i === 'slider-3') {
                        return {
                          ...item,
                          w: 0,
                          h: 0,
                          minW: 0,
                          minH: 0,
                        };
                      }
                      return item;
                    })
                  });
                }}
                okText="确认"
                cancelText="取消"
              >
                <div style={{ cursor: 'pointer', fontSize: 14 }}>删除</div>
              </Popconfirm>
              : null
          }
        </div>
        <div className="info-box-content">
          {/* {
          Object.entries(historyData).map((item: any, index: number) => {
            return <div className="message-item" key={index} onClick={() => {
              // setHistoryImg(item[1]);
              // setHistoryImgTitle(item[0]);
            }}>
              {item[0]}
            </div>
          })
        } */}
        </div>
      </div>
    </div>,
    // <div key={'content'}>
    //   <Spin spinning={loading}>
    //     <div className="info-box background-ubv">
    //       <div className="common-card-title-box flex-box drag-btn success-message" style={{ borderColor: '#13c2c2' }}>
    //         <div className="flex-box common-card-title">结果信息</div>
    //       </div>
    //       <div className="home-content flex-box">
    //         {!_.isEmpty(paramData) ? (
    //           type === 'tbj' ? (
    //             <TBJ
    //               gridContentList={gridContentList}
    //               setGridContentList={(result: any) => {
    //                 dispatch({
    //                   type: 'home/set',
    //                   payload: {
    //                     gridContentList: result,
    //                   },
    //                 });
    //               }}
    //               paramData={paramData}
    //               setParamData={setParamData}
    //               setEditWindowData={setEditWindowData}
    //               setAddWindowVisible={setAddWindowVisible}
    //               setActiveTab={setActiveTab}
    //             />
    //           ) : type === 'dgh' ? (
    //             <DGH />
    //           ) : type === 'dpj' ? (
    //             <DPJ />
    //           ) : type === 'mfd' ? (
    //             <MFD />
    //           ) : type === 'fc' ? (
    //             <FC />
    //           ) : (
    //             <Common
    //               paramData={paramData}
    //               setParamData={setParamData}
    //               setEditWindowData={setEditWindowData}
    //               setAddWindowVisible={setAddWindowVisible}
    //             />
    //           )
    //         ) : null}
    //       </div>
    //     </div>
    //   </Spin>
    // </div>,
    <div key={'footer-1'}>
      <div className="log-content background-ubv">
        <div className="common-card-title-box flex-box drag-btn warning-message">
          <div className="flex-box common-card-title">日志信息</div>
          {
            ifCanEdit ?
              <Popconfirm
                title="确认删除 日志信息 窗口吗?"
                onConfirm={() => {
                  setGridHomeList((prev: any) => {
                    return prev.map((item: any) => {
                      if (item.i === 'footer-1') {
                        return {
                          ...item,
                          w: 0,
                          h: 0,
                          minW: 0,
                          minH: 0,
                        };
                      }
                      return item;
                    })
                  });
                }}
                okText="确认"
                cancelText="取消"
              >
                <div style={{ cursor: 'pointer', fontSize: 14 }}>删除</div>
              </Popconfirm>
              : null
          }
        </div>
        <div
          className="content-item-span"
          dangerouslySetInnerHTML={{
            __html: logStr,
          }}
        />
      </div>
    </div>,
    <div key={'footer-2'}>
      <div className="log-content background-ubv">
        <div className="common-card-title-box flex-box drag-btn error-message">
          <div className="flex-box common-card-title">错误信息</div>
          {
            ifCanEdit ?
              <Popconfirm
                title="确认删除 错误信息 窗口吗?"
                onConfirm={() => {
                  setGridHomeList((prev: any) => {
                    return prev.map((item: any) => {
                      if (item.i === 'footer-2') {
                        return {
                          ...item,
                          w: 0,
                          h: 0,
                          minW: 0,
                          minH: 0,
                        };
                      }
                      return item;
                    })
                  });
                }}
                okText="确认"
                cancelText="取消"
              >
                <div style={{ cursor: 'pointer', fontSize: 14 }}>删除</div>
              </Popconfirm>
              : null
          }
        </div>
        <div className="content-item-span">
          {/* <BasicScrollBar data={errorData}> */}
          {errorData.map((log: any, index: number) => {
            const { level, color, node_name, nid, message, time } = log;
            return (
              <div className="log-item flex-box-start" key={index}>
                <div className="log-item-content">
                  <div className="content-item">
                    <span>{time}&nbsp;</span>
                    &nbsp;
                    <div
                      className="content-item-span"
                      style={{ color }}
                      dangerouslySetInnerHTML={{
                        __html: `节点${node_name || ''}（${nid || ''}）发生错误：${message}`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {/* </BasicScrollBar> */}
        </div>
      </div>
    </div>,
    // <div key={'footer-3'}>
    //   <div className="log-content background-ubv">
    //     <div
    //       className={`common-card-title-box flex-box drag-btn ${started ? 'success-message' : ''}`}
    //     >
    //       <div className="flex-box common-card-title">节点状态信息</div>
    // {
    //   ifCanEdit ?
    // <Popconfirm
    //   title="确认删除 错误信息 窗口吗?"
    //   onConfirm={() => {
    //     setGridHomeList((prev: any) => {
    //       return prev.map((item: any) => {
    //         if (item.i === 'footer-3') {
    //           return {
    //             ...item,
    //             w: 0,
    //             h: 0,
    //             minW: 0,
    //             minH: 0,
    //           };
    //         }
    //         return item;
    //       })
    //     });
    //   }}
    //   okText="确认"
    //   cancelText="取消"
    // >
    //   <div style={{ cursor: 'pointer', fontSize: 14 }}>删除</div>
    // </Popconfirm>
    //       :null
    // }
    //     </div>
    //     <div className="flex-box footer-scroll">
    //       {Object.entries(footerData).map((item: any, index: number) => {
    //         const { Status } = item[1];
    //         return (
    //           <div
    //             className={`footer-item-box ${Status === 'running' ? 'success' : 'error'}`}
    //             key={`footer-3-${index}`}
    //           >
    //             {`${(!!gridContentList[item[0]] && gridContentList[item[0]]?.nid) ||
    //               item[0] ||
    //               '未知节点'
    //               }（${_.toUpper(item[1].Status)}）`}
    //           </div>
    //         );
    //       })}
    //     </div>
    //   </div>
    // </div>,
  ];
  // 保存布局状态
  const saveGridFunc = (data: any) => {
    let home: any = [],
      content: any = {};
    data.forEach((item: any) => {
      if (['slider-1', 'slider-2', 'slider-3', 'content', 'footer-1', 'footer-2'].includes(item.i)) {
        home = home.concat({
          ...item,
          maxW: 12,
          minW: 1,
          maxH: 30,
          minH: 1,
        });
      } else {
        content = Object.assign({}, content, !!paramData?.contentData?.content[item.i] ? {
          [item.i]: {
            ...paramData?.contentData?.content[item.i],
            size: {
              ...item,
              maxW: 12,
              minW: 1,
              maxH: 30,
              minH: 1,
            }
          }
        } : {})
      }
    });
    setGridHomeList(home);
    dispatch({
      type: 'home/set',
      payload: {
        gridContentList: content,
      },
    });
    dispatch({ type: 'home/snapshot' });
    if (paramData.id) {
      const params = Object.assign({}, paramData, {
        contentData: Object.assign({}, paramData.contentData, { home }, !_.isEmpty(content) ? { content } : {}),
      });
      setParamData(params);
    }
  };
  // 运行状态
  const getServiceStatus = () => {
    getFlowStatusService(ipString).then((res: any) => {
      if (!!res && _.isObject(res) && !_.isEmpty(res)) {
        dispatch({
          type: 'home/set',
          payload: {
            started: true,
          },
        });
      } else {
        dispatch({
          type: 'home/set',
          payload: {
            started: false,
          },
        });
      }
      setLoading(false);
    });
  };
  // 拉取方案详情
  useEffect(() => {
    if (!ipString) return;
    getParams(ipString || '').then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        const { data = {} } = res;
        const { flowData, contentData = {} } = data;
        const { nodes } = flowData;
        setParamData(data);
        setNodeList(() =>
          nodes.map((node: any) => {
            const { name, alias, id, ports } = node;
            return {
              value: id,
              label: `${alias || name}`,
              children: (ports?.items || [])
                .map((port: any) => {
                  const { group, label = {} } = port;
                  const { name, alias } = label;
                  const value = alias || name;
                  if (group === 'bottom') {
                    return {
                      value: value,
                      label: value,
                      disabled:
                        !_.isEmpty(contentData) &&
                        !!contentData?.content &&
                        contentData?.content[id]?.value[1] === value,
                    };
                  }
                  return null;
                })
                .filter(Boolean),
            };
          }),
        );
        setGridHomeList(
          (!!contentData?.home
            ? contentData?.home
            : [
              { i: 'slider-1', x: 0, y: 0, w: 2, h: 6, minW: 1, maxW: 12, minH: 1, maxH: 30 },
              { i: 'slider-2', x: 0, y: 4, w: 2, h: 9, minW: 1, maxW: 12, minH: 1, maxH: 30 },
              { i: 'slider-3', x: 0, y: 8, w: 2, h: 15, minW: 1, maxW: 12, minH: 1, maxH: 30 },
              // { i: 'content', x: 2, y: 0, w: 0, h: 24, minW: 6, maxW: 12, minH: 1, maxH: 30 },
              { i: 'footer-1', x: 2, y: 24, w: 7, h: 6, minW: 1, maxW: 12, minH: 1, maxH: 30 },
              { i: 'footer-2', x: 9, y: 24, w: 3, h: 6, minW: 1, maxW: 12, minH: 1, maxH: 30 },
            ])
        );
        dispatch({
          type: 'home/set',
          payload: {
            gridContentList: contentData.content,
          },
        });
        dispatch({ type: 'home/snapshot' });
      } else {
        message.error(res?.msg || '接口异常');
      }
    });
  }, []);
  // 轮训获取运行状态
  useEffect(() => {
    if (!ipString || ifCanEdit) return;
    setLoading(true);
    getServiceStatus();
    timer = setInterval(() => {
      getServiceStatus();
    }, 5000);

    return () => {
      timer && clearInterval(timer);
    };
  }, []);
  // 监控窗口动态添加
  useEffect(() => {
    if (!_.isEmpty(gridContentList) && !_.isEmpty(paramData)) {
      let listData: any = [],
        layoutData: any = [];
      Object.entries(gridContentList)
        // .filter((i: any) => !i[1].type)
        .forEach((item: any, index: number) => {
          const key = item[0];
          if (_.isEmpty(item[1])) {
            return;
          }
          let data: any = [];
          for (let i = 0; i < 50; i++) {
            data.push(i);
          };
          const { size, value = [], type } = item[1];
          const parent = paramData?.flowData?.nodes?.filter((i: any) => i.id === value[0]);
          const label = parent[0]?.alias;
          listData = listData.concat(
            <div key={key} className=" drag-item-content-box background-ubv">
              <div className="common-card-title-box flex-box drag-btn success-message">
                <TooltipDiv className="flex-box common-card-title">{`${label} - ${value[1] || ''}`}</TooltipDiv>
                {
                  ifCanEdit ?
                    <div className="flex-box drag-item-btn-box">
                      <div
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setEditWindowData(item[1]);
                          setAddWindowVisible(true);
                        }}
                      >
                        编辑
                      </div>
                      <Popconfirm
                        title="确认删除监控窗口吗?"
                        onConfirm={() => {
                          const result = _.omit(gridContentList, key);
                          const params = Object.assign({}, paramData, {
                            contentData: Object.assign({}, paramData.contentData, { content: result }),
                          });
                          dispatch({
                            type: 'home/set',
                            payload: {
                              gridContentList: result,
                            },
                          });
                          dispatch({ type: 'home/snapshot' });
                          setParamData(params);
                        }}
                        okText="确认"
                        cancelText="取消"
                      >
                        <div style={{ cursor: 'pointer' }}>删除</div>
                      </Popconfirm>
                    </div>
                    : null
                }
              </div>
              <div className="flex-box-center" style={{ height: 'calc(100% - 60px)' }}>
                {
                  type === 'line' ?
                    <LineCharts
                      id={key}
                      data={{
                        upperThreshold: 2.8,
                        lowerThreshold: 0,
                        standard: 2,
                        leftTop: data.map((item: any, index: number) => [index, (index > 20 && index < 30) ? Math.random() * 2 : 1]),
                        leftBottom: data.map((item: any, index: number) => [index, (index > 20 && index < 30) ? Math.random() * 2 : 0.5]),
                        rightTop: data.map((item: any, index: number) => [index, (index > 20 && index < 30) ? Math.random() * 2 : 1.3]),
                        rightBottom: data.map((item: any, index: number) => [index, (index > 20 && index < 30) ? Math.random() * 2 : 1.6]),
                      }}
                    />
                    :
                    type === 'point' ?
                      <PointCharts
                        id={key}
                        data={{
                          normal: {
                            data: [[new Date().getTime(), 10], [new Date().getTime() + 24 * 60 * 60 * 1000, 15]],
                            upperThreshold: 16,
                            lowerThreshold: 7,
                          },
                          abNormal: {
                            data: [[new Date().getTime(), 20], [new Date().getTime() + 24 * 60 * 60 * 1000, 30]],
                            upperThreshold: 32,
                            lowerThreshold: 19,
                          },
                        }}
                      />
                      :
                      type === 'bar' ?
                        <BarCharts
                          id={key}
                          data={{
                            normal: {
                              data: [[new Date().getTime(), 10], [new Date().getTime() + 24 * 60 * 60 * 1000, 15]],
                              upperThreshold: 16,
                              lowerThreshold: 7,
                            },
                            abNormal: {
                              data: [[new Date().getTime(), 20], [new Date().getTime() + 24 * 60 * 60 * 1000, 30]],
                              upperThreshold: 32,
                              lowerThreshold: 19,
                            },
                          }}
                        />
                        :
                        type === 'pie' ?
                          <PieCharts
                            id={key}
                            data={{
                              normal: {
                                data: [[new Date().getTime(), 10], [new Date().getTime() + 24 * 60 * 60 * 1000, 15]],
                                upperThreshold: 16,
                                lowerThreshold: 7,
                              },
                              abNormal: {
                                data: [[new Date().getTime(), 20], [new Date().getTime() + 24 * 60 * 60 * 1000, 30]],
                                upperThreshold: 32,
                                lowerThreshold: 19,
                              },
                            }}
                          />
                          :
                          type === 'table' ?
                            <TableCharts
                              id={key}
                              data={{
                                normal: {
                                  data: [[new Date().getTime(), 10], [new Date().getTime() + 24 * 60 * 60 * 1000, 15]],
                                  upperThreshold: 16,
                                  lowerThreshold: 7,
                                },
                                abNormal: {
                                  data: [[new Date().getTime(), 20], [new Date().getTime() + 24 * 60 * 60 * 1000, 30]],
                                  upperThreshold: 32,
                                  lowerThreshold: 19,
                                },
                              }}
                            />
                            :
                            (
                              _.isString(item[1][value[1]]) && item[1][value[1]].indexOf('http') > -1 ? (
                                <Image
                                  src={item[1][value[1]]}
                                  alt="logo"
                                  style={{ width: '100%', height: 'auto' }}
                                />
                              ) :
                                <Skeleton.Image
                                  active={true}
                                />
                            )
                }
              </div>
            </div>,
          );
          layoutData = layoutData.concat(size);
        });

      setContentList(listData);
      setContentLayout(layoutData);
    } else {
      setContentList([]);
    }
  }, [gridContentList,]);
  // 启动任务
  const start = () => {
    if (!ipString) return;
    setLoading(true);
    startFlowService(ipString || '').then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        message.success('任务启动成功');
        dispatch({
          type: 'home/set',
          payload: {
            started: true,
          },
        });
      } else {
        message.error(res?.msg || '接口异常');
      }
      setLoading(false);
    });
  };
  // 停止任务
  const end = () => {
    if (!ipString) return;
    timer && clearInterval(timer);
    setLoading(true);
    stopFlowService(ipString || '').then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        message.success('任务停止成功');
        dispatch({
          type: 'home/set',
          payload: {
            started: false,
          },
        });
      } else {
        message.error(res?.msg || '接口异常');
      }
      setLoading(false);
      timer = setInterval(() => {
        getServiceStatus();
      }, 5000);
    });
  };
  // 关闭socket
  const onclose = () => {
    if (dispatch) {
      dispatch({ type: 'home/startLoop', payload: false });
      socketErrorListen.close(dispatch);
      socketLogListen.close(dispatch);
      socketDataListen.close(dispatch);
      socketStateListen.close(dispatch);
    }
  };
  // 监听任务启动，开启socket
  useEffect(() => {
    if (started && ipString && dispatch && !ifCanEdit) {
      // dispatch({ type: 'home/set', payload: {started: true} });
      socketErrorListen.listen(dispatch);
      socketLogListen.listen(dispatch);
      socketDataListen.listen(dispatch);
      socketStateListen.listen(dispatch);
    } else {
      onclose();
    }

    return () => {
      // onclose();
    };
  }, [started, dispatch]);
  // 信息变化，走接口更新
  useEffect(() => {
    if (!_.isEmpty(paramData) && !!paramData.id) {
      updateTimer && clearTimeout(updateTimer);
      updateTimer = setTimeout(() => {
        updateParams({
          id: paramData.id,
          data: paramData,
        }).then((res: any) => {
          if (res && res.code === 'SUCCESS') {

          } else {
            message.error(res?.msg || '接口异常');
          }
        });
      }, 500);
    }
  }, [paramData]);
  // 已添加的窗口，可选节点disabled
  useEffect(() => {
    if (nodeList.length) {
      setNodeList((prev: any) =>
        prev.map((item: any) => {
          const { value, children } = item;
          return Object.assign({}, item, {
            children: children.map((child: any) => {
              return Object.assign({}, child, {
                disabled:
                  !_.isEmpty(gridContentList) &&
                  !!gridContentList[value] &&
                  // gridContentList[value]?.type === systemType &&
                  child.value === (gridContentList[value]?.value ? gridContentList[value]?.value[1] : ''),
              });
            }),
          });
          return item;
        }),
      );
    }
  }, [gridContentList]);

  return (
    <div className={`${styles.home} flex-box`}>
      {!_.isEmpty(gridHomeList) ? (
        <GridLayout
          dragName={'.drag-btn'}
          list={gridList.concat(contentList)}
          layout={gridHomeList.concat(contentLayout)}
          onChange={(data: any) => {
            if (!ifCanEdit) return;
            updateTimer && clearTimeout(updateTimer);
            updateTimer = setTimeout(() => {
              saveGridFunc(data);
            }, 500);
          }}
        />
      ) : null}

      {addWindowVisible ? (
        <Modal
          title={`${_.isEmpty(editWindowData) ? '添加' : '编辑'}监控窗口`}
          wrapClassName="history-window-modal"
          centered
          width="50vw"
          open={addWindowVisible}
          // maskClosable={false}
          onOk={() => {
            validateFields()
              .then((values) => {
                values = Object.entries(values).reduce((pre: any, cen: any) => {
                  return Object.assign({}, pre, {
                    [cen[0].split('-')[0]]: cen[1],
                  });
                }, {});
                const { windowSelect, windowSelectType } = values;
                const id = windowSelect[0];
                let result = {};
                if (_.isEmpty(editWindowData)) {
                  result = Object.assign({}, gridContentList, {
                    [id]: {
                      value: windowSelect,
                      size: { i: id, x: 2, y: 0, w: 3, h: 3, minW: 2, maxW: 12, minH: 2, maxH: 32 },
                      type: windowSelectType,
                      tab: activeTab,
                    },
                  });
                } else {
                  result = Object.assign({}, _.omit(gridContentList, editWindowData.value[0]), {
                    [id]: {
                      value: windowSelect,
                      size: Object.assign({}, editWindowData.size, { i: id }),
                      type: windowSelectType,
                      tab: activeTab,
                    },
                  });
                }
                console.log(result);
                if (paramData.id) {
                  const params = Object.assign({}, paramData, {
                    contentData: Object.assign({}, paramData.contentData, { content: result }),
                  });
                  setParamData(params);
                }
                form.resetFields();
                setEditWindowData({});
                dispatch({
                  type: 'home/set',
                  payload: {
                    gridContentList: result,
                  },
                });
                dispatch({ type: 'home/snapshot' });
                setAddWindowVisible(false);
              })
              .catch((err) => {
                const { errorFields } = err;
                _.isArray(errorFields) && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
              });
          }}
          onCancel={() => {
            form.resetFields();
            setEditWindowData({});
            setAddWindowVisible(false);
          }}
          getContainer={false}
          destroyOnClose={true}
        >
          <Form form={form} scrollToFirstError>
            <Form.Item
              name={`windowSelect-${guid()}`}
              label="绑定节点"
              rules={[{ required: true, message: '绑定节点' }]}
              initialValue={editWindowData.value}
            >
              <Cascader
                style={{ width: '100%' }}
                options={nodeList}
              // expandTrigger="hover"
              />
            </Form.Item>
            <Form.Item
              name={`windowSelectType-${guid()}`}
              label="窗口类型"
              rules={[{ required: true, message: '窗口类型' }]}
              initialValue={editWindowData.type || 'img'}
            >
              <Select
                style={{ width: '100%' }}
                options={[
                  {
                    value: 'img',
                    label: '图片窗口',
                  },
                  {
                    value: 'line',
                    label: '折线趋势图窗口',
                  },
                  {
                    value: 'point',
                    label: '散点图窗口',
                  },
                  {
                    value: 'bar',
                    label: '柱状图窗口',
                  },
                  {
                    value: 'pie',
                    label: '饼状图窗口',
                  },
                  {
                    value: 'table',
                    label: '图表窗口',
                  },
                ]}
              // expandTrigger="hover"
              />
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
    </div>
  );
};

// export default Home;

Home.displayName = 'Home';

export default connect(({ home }) => ({
  snapshot: home.snapshot || {},
  started: home.started || false,
  activeTab: home.activeTab || '1',
  taskDataConnect: home.taskDataConnect || false,
}))(Home);

// 告警提示框

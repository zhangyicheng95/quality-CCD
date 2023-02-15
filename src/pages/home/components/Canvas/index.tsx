import React, { Fragment, useEffect, useMemo, useState } from 'react';
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
  Input,
  Tree,
  InputNumber,
} from 'antd';
import * as _ from 'lodash';
import {
  BASE_IP,
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
import { connect, useHistory, useModel } from 'umi';
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
import AlertCharts from '@/pages/home/components/Canvas/components/AlertCharts';
import { useThrottleAndMerge } from "@/utils/useThrottleAndMerge";
import FileManager from '@/components/FileManager';
import Table2Charts from './components/Table2Charts';
import ImgsCharts from './components/ImgsCharts';

let updateTimer: string | number | NodeJS.Timer | null | undefined = null;
const Home: React.FC<any> = (props: any) => {
  const { initialState, setInitialState } = useModel<any>('@@initialState');
  const { params: paramsData } = initialState;
  const history = useHistory();
  const {
    dispatch, started, taskDataConnect, snapshot, activeTab, projectStatus
  } = props;
  const { logStr, gridContentList, footerData, errorData } = snapshot;
  const [form] = Form.useForm();
  const { validateFields, setFieldsValue } = form;
  // @ts-ignore
  const { type } = window.QUALITY_CCD_CONFIG;
  const ipString: any = localStorage.getItem('ipString') || '';
  const [loading, setLoading] = useState(false);
  const [addWindowVisible, setAddWindowVisible] = useState(false);
  const [editWindowData, setEditWindowData] = useState<any>({});
  const [gridHomeList, setGridHomeList] = useState<any>([]);
  const [addContentList, setAddContentList] = useState<any>([]);
  const [contentList, setContentList] = useState([]);
  const [contentLayout, setContentLayout] = useState([]);
  const [paramData, setParamData] = useState<any>({});
  const [nodeList, setNodeList] = useState<any>([]);
  const [windowType, setWindowType] = useState('img');
  const [selectPathVisible, setSelectPathVisible] = useState(false);
  const [selectedPath, setSelectedPath] = useState<any>({ fileType: 'file', value: '' });
  const [footerSelectVisible, setFooterSelectVisible] = useState(false);
  const [footerSelectList, setFooterSelectList] = useState<any>([]);

  const ifCanEdit = useMemo(() => {
    return window.location.hash.indexOf('edit') > -1;
  }, [window.location.hash]);

  const isVision = useMemo(() => {
    // @ts-ignore
    return window.QUALITY_CCD_CONFIG.type === 'vision';
  }, []);

  const gridList = [
    <div key={'slider-1'}>
      <div className="btn-box background-ubv">
        <div className={`common-card-title-box flex-box drag-btn}`}>
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
                      {
                        label: '添加监控窗口', key: 'add', onClick: () => {
                          setAddWindowVisible(true);
                        }
                      },
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
                  onClick={() => touchFlowService()}
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
                <div className='common-btn'>删除</div>
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
        <div className="common-card-title-box flex-box drag-btn">
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
                <div className='common-btn'>删除</div>
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
    //       <div className="common-card-title-box flex-box drag-btn" style={{ borderColor: '#13c2c2' }}>
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
        <div className="common-card-title-box flex-box drag-btn">
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
                <div className='common-btn'>删除</div>
              </Popconfirm>
              : null
          }
        </div>
        <div
          className="content-item-span"
          dangerouslySetInnerHTML={{
            // 此处需要处理
            __html: _.isString(logStr) ? logStr : logStr.join('<br/>'),
          }}
        />
      </div>
    </div>,
    <div key={'footer-2'}>
      <div className="log-content background-ubv">
        <div className="common-card-title-box flex-box drag-btn">
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
                <div className='common-btn'>删除</div>
              </Popconfirm>
              : null
          }
        </div>
        <div className="content-item-span">
          {/* <BasicScrollBar data={errorData}> */}
          {errorData.map((log: any, index: number) => {
            const { color, node_name, nid, message, time } = log;
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
  ];
  // 保存布局状态
  const saveGridFunc = (data: any) => {
    let home: any = [],
      content: any = [];
    console.log(data);
    data.forEach((item: any) => {
      if (['slider-1', 'slider-2', 'slider-3', 'content', 'footer-1', 'footer-2'].includes(item.i)) {
        home = home.concat({
          ...item,
          maxW: 12,
          minW: 1,
          maxH: 30,
          minH: 2,
        });
      } else {
        const preContent = _.isArray(paramData?.contentData?.content) ?
          paramData?.contentData?.content?.filter((i: any) => i.id === item.i)[0]
          :
          paramData?.contentData?.content[item.i];
        content = content.concat({
          ...preContent,
          size: {
            ...item,
            maxW: 12,
            minW: 1,
            maxH: 30,
            minH: 2,
          }
        });
        // Object.assign({}, content, !!paramData?.contentData?.content[item.i] ? {
        //   [item.i]: {
        //     ...paramData?.contentData?.content[item.i],
        //     size: {
        //       ...item,
        //       maxW: 12,
        //       minW: 1,
        //       maxH: 30,
        //       minH: 2,
        //     }
        //   }
        // } : {})
      }
    });
    setGridHomeList(home);
    setAddContentList(content)
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
    const data: any = (projectStatus || [])?.filter((i: any) => i.value === ipString)[0];
    if (_.isObject(data)) {
      dispatch({
        type: 'home/set',
        payload: {
          // @ts-ignore
          started: !!data?.running,
        },
      });
    }
  };
  // 拉取方案详情 TODO
  useEffect(() => {
    if (!ipString || _.isEmpty(paramsData)) return;
    const { flowData, contentData = {} } = paramsData;
    const { home = [], content = {}, footerSelectList } = contentData;
    const { nodes } = flowData;
    const list = nodes.map((node: any) => {
      const { name, alias, id, ports = {} } = node;
      const { items = [] } = ports;
      return {
        key: id,
        value: id,
        title: `${alias || name}`,
        label: `${alias || name}`,
        children: items.filter((i: any) => i.group === 'bottom')
          .map((port: any) => {
            const { label } = port;
            const { name, alias } = label;
            const value = alias || name;
            return {
              value: name,
              label: value,
            };
          }),
      };
    });
    setNodeList(list);
    setFooterSelectList(footerSelectList || []);
    setGridHomeList(
      (!!home?.length
        ? home
        : [
          { i: 'slider-1', x: 0, y: 0, w: 2, h: 4, minW: 1, maxW: 12, minH: 1, maxH: 30 },
          { i: 'slider-2', x: 0, y: 4, w: 2, h: 9, minW: 1, maxW: 12, minH: 1, maxH: 30 },
          { i: 'slider-3', x: 0, y: 13, w: 2, h: 15, minW: 1, maxW: 12, minH: 1, maxH: 30 },
          { i: 'footer-1', x: 2, y: 24, w: 7, h: 6, minW: 1, maxW: 12, minH: 1, maxH: 30 },
          { i: 'footer-2', x: 9, y: 24, w: 3, h: 6, minW: 1, maxW: 12, minH: 1, maxH: 30 },
        ])
    );
    if (_.isArray(content)) {
      dispatch({
        type: 'home/set',
        payload: {
          gridContentList: content.reduce((pre: any, cen: any) => {
            const { id, ...rest } = cen;
            return Object.assign({}, pre, {
              [id?.split('$$')[0]]: rest
            });
          }, {}),
        },
      });
      dispatch({ type: 'home/snapshot' });
      setAddContentList(content);
      setParamData(paramsData);
    } else {
      const result = Object.entries(content).map((item: any) => {
        const { value, type, size } = item[1];
        const id = `${value?.join('$$')}$$${type}`;
        return {
          ...item[1],
          id,
          size: Object.assign({}, size, {
            i: id,
          })
        }
      });
      dispatch({
        type: 'home/set',
        payload: {
          gridContentList: result,
        },
      });
      dispatch({ type: 'home/snapshot' });
      setAddContentList(result);
      const newParams = Object.assign({}, paramsData, {
        contentData: Object.assign({}, contentData, {
          content: result,
        })
      });
      setInitialState((preInitialState: any) => ({
        ...preInitialState,
        params: newParams,
      }));
      setParamData(newParams);
    }

    return () => {
      setAddContentList([]);
      dispatch({
        type: 'home/set',
        payload: {
          gridContentList: {},
        },
      });
      dispatch({ type: 'home/snapshot' });
    }
  }, []);
  // 轮训获取运行状态
  useEffect(() => {
    if (!ipString || ifCanEdit || isVision) return;
    getServiceStatus();
  }, [projectStatus]);
  // 监控窗口动态添加
  useEffect(() => {
    if (!_.isEmpty(addContentList) && !_.isEmpty(paramData)) {
      let listData: any = [],
        layoutData: any = [];
      addContentList.forEach((item: any, index: number) => {
        const { id: key, size, value = [], type, yName, xName, defaultImg, fontSize, reverse, direction } = item;
        const id = key?.split('$$')[0];
        const gridValue = gridContentList[id];
        const dataValue = !!gridValue ? gridValue[value[1]] : undefined;
        const parent = paramData?.flowData?.nodes?.filter((i: any) => i.id === value[0]);
        const { alias, name, ports = {} } = parent[0] || {};
        const { items = [] } = ports;
        const SecLabel = items.filter((i: any) => i.group === 'bottom' && (i?.label?.name === value[1]))[0];

        listData = listData.concat(
          <div key={key} className=" drag-item-content-box background-ubv">
            <div className="common-card-title-box flex-box drag-btn">
              <TooltipDiv className="flex-box common-card-title">
                {`${alias || name}`}
                <span>{`- ${SecLabel?.label?.alias || value[1] || ''}`}</span>
              </TooltipDiv>
              {
                ifCanEdit ?
                  <div className="flex-box drag-item-btn-box">
                    <div
                      className='common-btn'
                      onClick={() => {
                        !!defaultImg && setSelectedPath((prev: any) => ({ ...prev, value: defaultImg }));
                        setEditWindowData(item);
                        setFieldsValue(item);
                        setWindowType(type);
                        setAddWindowVisible(true);
                      }}
                    >
                      编辑
                    </div>
                    <Popconfirm
                      title="确认删除监控窗口吗?"
                      onConfirm={() => {
                        const result = addContentList.filter((item: any) => item.id !== key);
                        const params = Object.assign({}, paramData, {
                          contentData: Object.assign({}, paramData.contentData, { content: result }),
                        });
                        setAddContentList(result);
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
                      <div className='common-btn'>删除</div>
                    </Popconfirm>
                  </div>
                  : null
              }
            </div>
            <div className="flex-box-center" style={{ height: 'calc(100% - 50px)' }}>
              {
                type === 'line' ?
                  <LineCharts
                    id={key}
                    data={{
                      dataValue: dataValue,
                      yName, xName,
                    }}
                  />
                  :
                  type === 'point' ?
                    <PointCharts
                      id={key}
                      data={{
                        dataValue: dataValue,
                        yName, xName,
                      }}
                    />
                    :
                    type === 'bar' ?
                      <BarCharts
                        id={key}
                        data={{
                          dataValue: dataValue,
                          yName, xName, direction
                        }}
                      />
                      :
                      type === 'pie' ?
                        <PieCharts
                          id={key}
                          data={dataValue}
                        />
                        :
                        type === 'table' ?
                          <TableCharts
                            id={key}
                            data={{
                              dataValue: dataValue,
                              yName, xName, fontSize, reverse
                            }}
                          />
                          :
                          type === 'table2' ?
                            <Table2Charts
                              id={key}
                              data={{
                                dataValue: dataValue,
                                fontSize, reverse
                              }}
                            />
                            :
                            type === 'alert' ?
                              <AlertCharts
                                id={key}
                                data={dataValue}
                              />
                              :
                              type === 'imgs' ?
                                <ImgsCharts
                                  id={key}
                                  data={dataValue}
                                />
                                :
                                (
                                  _.isString(dataValue) && dataValue.indexOf('http') > -1 ? (
                                    <Image
                                      src={dataValue}
                                      alt="logo"
                                      style={{ width: '100%', height: 'auto' }}
                                    />
                                  )
                                    :
                                    !!defaultImg ?
                                      <Image
                                        src={`${BASE_IP}file${(defaultImg.indexOf('\\') === 0 || defaultImg.indexOf('/') === 0) ? '' : '\\'}${defaultImg}`}
                                        alt="logo"
                                        style={{ width: '100%', height: 'auto' }}
                                      />
                                      :
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
  }, [gridContentList, addContentList]);
  // 启动任务
  const start = () => {
    if (!ipString) return;
    setLoading(true);
    startFlowService(ipString || '').then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        message.success('任务启动成功');
        // dispatch({
        //   type: 'home/set',
        //   payload: {
        //     started: true,
        //   },
        // });
      } else {
        message.error(res?.msg || res?.message || '接口异常');
      }
      setLoading(false);
    });
  };
  // 停止任务
  const end = () => {
    if (!ipString) return;
    setLoading(true);
    stopFlowService(ipString || '').then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        message.success('任务停止成功');
        // dispatch({
        //   type: 'home/set',
        //   payload: {
        //     started: false,
        //   },
        // });
      } else {
        message.error(res?.msg || res?.message || '接口异常');
      }
      setLoading(false);
    });
  };
  // 关闭

  const onclose = () => {
    if (dispatch) {
      dispatch({ type: 'home/startLoop', payload: false });
      socketErrorListen.close(dispatch);
      socketLogListen.close(dispatch);
      socketDataListen.close(dispatch);
      socketStateListen.close(dispatch);
    }
  };

  /**
   * 处理日志信息
   */
  const logThrottleAndMerge = useThrottleAndMerge((logs) => {
    // const logContent = logs.map((item: any) => item.data);
    // setLogStr((cur: any) => {
    //   const newLogs = [...logContent, ...cur];
    //   return newLogs.slice(0, 50);
    // });
  }, 300);

  /**
   * 处理错误信息
   */
  const errorThrottleAndMerge = useThrottleAndMerge((errors) => {
    // console.log('errors', errors, errors.filter((item: any) => isJSON(item.data)))
    // try {
    //   const errorList: any = [];
    //   errors.filter((item: any) => isJSON(item.data))?.forEach((msg: any) => {
    //     const result = JSON.parse(msg.data);
    //     const level = _.toLower(result.level);
    //     errorList.push({
    //       ...result,
    //       level: level,
    //       message: _.isArray(result?.message) ? result.message.join(',') : result.message,
    //       time: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
    //       color:
    //         level === 'warning'
    //           ? logColors.warning
    //           : level === 'error'
    //             ? logColors.error
    //             : logColors.critical,
    //     });
    //
    //     setErrorData((cur: any[]) => {
    //       const newErrors = [...errorList, ...cur];
    //       return newErrors.slice(0, 50);
    //     });
    //   })
    //
    // } catch (err) {
    //   // console.log(err);
    // }
  }, 300);


  // 监听任务启动，开启socket
  useEffect(() => {
    if ((started && ipString && dispatch && !ifCanEdit) || isVision) {
      // dispatch({ type: 'home/set', payload: {started: true} });
      const logModal = gridHomeList.filter((item: any) => item.i === 'footer-1')[0],
        errorModal = gridHomeList.filter((item: any) => item.i === 'footer-2')[0];
      // 没有日志窗口，就不开启日志的socket
      if (!!logModal && logModal?.w) {
        socketLogListen.listen(dispatch, logThrottleAndMerge);
      }
      // 没有错误信息窗口，就不开启错误信息的socket
      if (!!errorModal && errorModal?.w) {
        socketErrorListen.listen(dispatch, errorThrottleAndMerge);
      }
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
            message.error(res?.msg || res?.message || '接口异常');
          }
        });
      }, 500);
    }
  }, [paramData]);
  // 添加监控窗口
  const addWindow = () => {
    validateFields()
      .then((values) => {
        const { value, type, yName, xName, fontSize, defaultImg, reverse, direction } = values;
        const id = `${value?.join('$$')}$$${type}`;
        if (_.isEmpty(editWindowData) && addContentList.filter((i: any) => i.id === id).length) {
          message.error('已存在，请求改 “模块，节点，类型” 中的任一项');
          return;
        }
        let result = [];
        if (_.isEmpty(editWindowData)) {
          result = addContentList.concat({
            id,
            value,
            size: { i: id, x: 2, y: 0, w: 3, h: 3, minW: 2, maxW: 12, minH: 4, maxH: 32 },
            type,
            tab: activeTab,
            yName, xName, defaultImg, fontSize, reverse, direction
          });
        } else {
          result = (addContentList || []).map((item: any) => {
            if (item.id === `${editWindowData?.value?.join('$$')}$$${editWindowData.type}`) {
              return {
                id,
                value,
                size: Object.assign({}, editWindowData.size, { i: id }),
                type,
                tab: activeTab,
                yName, xName, defaultImg, fontSize, reverse, direction
              };
            };
            return item;
          })
        }
        console.log(result);
        setAddContentList(result);
        if (paramData.id) {
          const params = Object.assign({}, paramData, {
            contentData: Object.assign({}, paramData.contentData, { content: result }),
          });
          setParamData(params);
        }
        form.resetFields();
        setEditWindowData({});
        // dispatch({
        //   type: 'home/set',
        //   payload: {
        //     gridContentList: result,
        //   },
        // });
        // dispatch({ type: 'home/snapshot' });
        onCancel();
      })
      .catch((err) => {
        const { errorFields } = err;
        _.isArray(errorFields) && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
      });
  };
  // 关闭添加弹框
  const onCancel = () => {
    form.resetFields();
    setEditWindowData({});
    setSelectedPath({ fileType: 'file', value: '' });
    setFieldsValue({ value: [], type: 'img', yName: undefined, xName: undefined, fontSize: 24, reverse: false, direction: 'column' });
    setWindowType('img');
    setAddWindowVisible(false);
    setFooterSelectVisible(false);
  };

  return (
    <div className={`${styles.home}`}>
      <div className="home-body">
        {!_.isEmpty(gridHomeList) ? (
          <GridLayout
            dragName={'.common-card-title'}
            list={gridList.concat(contentList)}
            layout={gridHomeList.concat(contentLayout)}
            onChange={(data: any) => {
              saveGridFunc(data);
            }}
          />
        ) : null}
      </div>
      <div className="flex-box home-footer">
        {
          useMemo(() => {
            return started ?
              (
                !!footerData && (Object.entries(footerData) || []).map((item: any, index: number) => {
                  const { Status } = item[1];
                  if (!footerSelectList.includes(item[0])) {
                    return null;
                  }
                  return <div
                    key={item[0]}
                    className={`home-footer-item-box ${Status === 'running' ? 'success' : 'error'}`}
                    onClick={() => {
                      ifCanEdit && setFooterSelectVisible(true);
                    }}
                  >
                    {`${nodeList.filter((i: any) => i.value === item[0])[0]?.label}: ${Status === 'running' ? '正常' : '异常'}`}
                  </div>
                })
              )
              :
              <div className="home-footer-item-box success" onClick={() => {
                ifCanEdit && setFooterSelectVisible(true);
              }}>
                未启动
              </div>
          }, [started, footerData, footerSelectList])
        }
      </div>

      {
        footerSelectVisible ?
          <Modal
            title={'选择底部展示的状态信息'}
            wrapClassName="history-window-modal"
            centered
            width="50vw"
            open={footerSelectVisible}
            // maskClosable={false}
            onOk={() => {
              if (paramData.id) {
                const params = Object.assign({}, paramData, {
                  contentData: Object.assign({}, paramData.contentData, { footerSelectList }),
                });
                setParamData(params);
              }
              onCancel();
            }}
            onCancel={() => onCancel()}
            getContainer={false}
            destroyOnClose={true}
          >
            <Tree
              checkable
              defaultExpandAll
              showLine
              onCheck={(checkedKeysValue: any) => {
                setFooterSelectList(_.pull(checkedKeysValue, 'footer_001'));
              }}
              checkedKeys={footerSelectList}
              treeData={[{
                key: 'footer_001',
                value: 'footer_001',
                title: '节点状态列表',
                label: '节点状态列表',
                children: nodeList.map((item: any) => _.omit(item, 'children'))
              }]}
            />
          </Modal>
          : null
      }

      {addWindowVisible ? (
        <Modal
          title={`${_.isEmpty(editWindowData) ? '添加' : '编辑'}监控窗口`}
          wrapClassName="history-window-modal"
          centered
          width="50vw"
          open={addWindowVisible}
          // maskClosable={false}
          onOk={() => addWindow()}
          onCancel={() => onCancel()}
          getContainer={false}
          destroyOnClose={true}
        >
          <Form form={form} scrollToFirstError initialValues={editWindowData}>
            <Form.Item
              name={'value'}
              label="绑定节点"
              rules={[{ required: true, message: '绑定节点' }]}
            >
              <Cascader
                style={{ width: '100%' }}
                options={nodeList}
              />
            </Form.Item>
            <Form.Item
              name={'type'}
              label="窗口类型"
              rules={[{ required: true, message: '窗口类型' }]}
            >
              <Select
                style={{ width: '100%' }}
                options={[
                  {
                    value: 'img',
                    label: '图片窗口',
                  },
                  {
                    value: 'imgs',
                    label: '图片列表窗口',
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
                    label: '双列表格窗口',
                  },
                  {
                    value: 'table2',
                    label: '通用表格窗口',
                  },
                  {
                    value: 'alert',
                    label: '状态窗口',
                  },
                ]}
                onChange={val => {
                  setWindowType(val);
                }}
              />
            </Form.Item>
            {
              (['img'].includes(windowType) && !isVision) ?
                <Form.Item
                  name={'defaultImg'}
                  label="默认图片"
                  rules={[{ required: false, message: '默认图片' }]}
                >
                  <div className="flex-box">
                    <TooltipDiv style={{ paddingRight: 10 }}>
                      {selectedPath.value}
                    </TooltipDiv>
                    <Button
                      onClick={() => {
                        setFieldsValue({ defaultImg: undefined });
                        setSelectPathVisible(true);
                      }}
                    >
                      选择文件
                    </Button>
                  </div>
                </Form.Item>
                : null
            }
            {
              ['point', 'bar', 'line', 'table'].includes(windowType) ?
                <Fragment>
                  <Form.Item
                    name={`yName`}
                    label={windowType === "table" ? "表格key名" : "y 轴名称"}
                    rules={[{ required: true, message: 'y轴名称' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={`xName`}
                    label={windowType === "table" ? "表格value名" : "x 轴名称"}
                    rules={[{ required: true, message: 'x轴名称' }]}
                  >
                    <Input />
                  </Form.Item>
                </Fragment>
                : null
            }
            {
              ['bar'].includes(windowType) ?
                <Form.Item
                  name={`direction`}
                  label={'柱状图方向'}
                  rules={[{ required: false, message: '柱状图方向' }]}
                >
                  <Select
                    style={{ width: '100%' }}
                    options={[
                      {
                        value: 'rows',
                        label: '横向',
                      },
                      {
                        value: 'column',
                        label: '纵向',
                      }
                    ]}
                  />
                </Form.Item>
                : null
            }
            {
              ['table2', 'table'].includes(windowType) ?
                <Fragment>
                  <Form.Item
                    name={`fontSize`}
                    label={'字体大小'}
                    rules={[{ required: true, message: '字体大小' }]}
                    initialValue={24}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    name={`reverse`}
                    label={'数据倒叙'}
                    rules={[{ required: true, message: '数据倒叙' }]}
                    initialValue={false}
                  >
                    <Select
                      style={{ width: '100%' }}
                      options={[
                        {
                          value: false,
                          label: '正序显示',
                        },
                        {
                          value: true,
                          label: '倒叙显示',
                        }
                      ]}
                    />
                  </Form.Item>
                </Fragment>
                : null
            }
          </Form>
        </Modal>
      ) : null}

      {
        selectPathVisible ?
          <FileManager
            fileType={selectedPath.fileType}
            data={selectedPath}
            onOk={(val: any) => {
              setFieldsValue({ defaultImg: val?.value });
              setSelectedPath(val);
              setSelectPathVisible(false);
            }}
            onCancel={() => {
              setSelectPathVisible(false);
              setSelectedPath({});
            }}
          />
          : null
      }
    </div>
  );
};

// export default Home;

Home.displayName = 'Home';

export default connect(({ home, themeStore }) => ({
  snapshot: home.snapshot || {},
  started: home.started || false,
  activeTab: home.activeTab || '1',
  taskDataConnect: home.taskDataConnect || false,
  projectStatus: themeStore.projectStatus,
}))(Home);

// 告警提示框

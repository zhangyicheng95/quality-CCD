import React, { Fragment, useEffect, useMemo, useState } from 'react';
import styles from './index.module.less';
import {
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
  Select,
  Input,
  Tree,
  InputNumber,
  Switch,
  Col,
  Row,
  Descriptions,
} from 'antd';
import * as _ from 'lodash';
import {
  BASE_IP,
  btnFetch,
  startFlowService,
  stopFlowService,
  touchFlowService,
  updateParams,
} from '@/services/api';
import GridLayout from '@/components/GridLayout';
import {
  AndroidOutlined,
  CloseOutlined,
  CompressOutlined,
  DeleteOutlined,
  LoadingOutlined,
  MinusOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SafetyOutlined,
  UpOutlined,
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
import ButtonCharts from './components/ButtonCharts';
import ChartPreviewModal from './components/ChartPreviewModal';
import ProgressCharts from './components/ProgressCharts';
import ImgCharts from './components/ImgCharts';
import { windowTypeList, } from '@/common/constants/globalConstants';
import LogPreviewModal from './components/LogPreviewModal';
import { guid } from '@/utils/utils';
import DescriptionCharts from './components/DescriptionCharts';

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
  const [addItemsVisible, setAddItemsVisible] = useState(false);
  const [myChartVisible, setMyChartVisible] = useState<any>(null);
  const [logDataVisible, setLogDataVisible] = useState('');
  const [basicInfoData, setBasicInfoData] = useState<any>([]);

  const ifCanEdit = useMemo(() => {
    return window.location.hash.indexOf('edit') > -1;
  }, [window.location.hash, paramData]);

  const isVision = useMemo(() => {
    // @ts-ignore
    return window.QUALITY_CCD_CONFIG.type === 'vision';
  }, []);
  useEffect(() => {
    if (_.isArray(paramData?.commonInfo?.data)) {
      setBasicInfoData(paramData?.commonInfo?.data);
    } else if (_.isObject(paramData?.commonInfo)) {
      const result = Object.entries(paramData?.commonInfo)?.map((res: any, index: number) => {
        return {
          id: guid(),
          name: res[0] === 'productionInfo' ? '产线信息' : res[0] === 'stationInfo' ? '工位信息' : res[0] === 'useInfo' ? '功能信息' : res[0],
          value: res[1]
        }
      });
      setBasicInfoData(result);
    }
  }, [paramData?.commonInfo]);
  // 基础组件
  const gridList = useMemo(() => ([
    <div key={'slider-1'}>
      <div className="btn-box background-ubv">
        <div className={`common-card-title-box flex-box drag-btn}`}>
          <div className="flex-box common-card-title">
            当前状态：
            {
              isVision ?
                <Tooltip title={'服务已连接'} placement={'bottom'}>
                  <Badge status="processing" className="status-icon" />
                </Tooltip>
                :
                (started ? (
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
                ))
            }
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
                            disabled: (
                              gridHomeList?.filter((i: any) => i.i === 'slider-2')[0]?.w !== 0 &&
                              gridHomeList?.filter((i: any) => i.i === 'slider-2')[0]?.h !== 0
                            ),
                            onClick: () =>
                              setGridHomeList((prev: any) => {
                                return prev?.map((item: any) => {
                                  if (item.i === 'slider-2') {
                                    return {
                                      ...item,
                                      w: 9,
                                      h: 4,
                                      minW: 1,
                                      minH: 2,
                                    };
                                  }
                                  return item;
                                })
                              })
                          },
                          {
                            label: '显示实时信息',
                            key: 'slider-3',
                            disabled: (
                              gridHomeList?.filter((i: any) => i.i === 'slider-3')[0]?.w !== 0 &&
                              gridHomeList?.filter((i: any) => i.i === 'slider-3')[0]?.h !== 0
                            ),
                            onClick: () =>
                              setGridHomeList((prev: any) => {
                                return prev?.map((item: any) => {
                                  if (item.i === 'slider-3') {
                                    return {
                                      ...item,
                                      w: 9,
                                      h: 4,
                                      minW: 1,
                                      minH: 2,
                                    };
                                  }
                                  return item;
                                })
                              })
                          },
                          {
                            label: '显示方案列表',
                            key: 'slider-4',
                            disabled: (
                              gridHomeList?.filter((i: any) => i.i === 'slider-4')[0]?.w !== 0 &&
                              gridHomeList?.filter((i: any) => i.i === 'slider-4')[0]?.h !== 0
                            ),
                            onClick: () =>
                              setGridHomeList((prev: any) => {
                                return prev?.map((item: any) => {
                                  if (item.i === 'slider-4') {
                                    return {
                                      ...item,
                                      w: 9,
                                      h: 4,
                                      minW: 1,
                                      minH: 1,
                                    };
                                  }
                                  return item;
                                })
                              })
                          },
                          {
                            label: '显示日志信息',
                            key: 'footer-1',
                            disabled: (
                              gridHomeList?.filter((i: any) => i.i === 'footer-1')[0]?.w !== 0 &&
                              gridHomeList?.filter((i: any) => i.i === 'footer-1')[0]?.h !== 0
                            ),
                            onClick: () =>
                              setGridHomeList((prev: any) => {
                                return prev?.map((item: any) => {
                                  if (item.i === 'footer-1') {
                                    return {
                                      ...item,
                                      w: 9,
                                      h: 4,
                                      minW: 1,
                                      minH: 2,
                                    };
                                  }
                                  return item;
                                })
                              })
                          },
                          {
                            label: '显示错误信息',
                            key: 'footer-2',
                            disabled: (
                              gridHomeList?.filter((i: any) => i.i === 'footer-2')[0]?.w !== 0 &&
                              gridHomeList?.filter((i: any) => i.i === 'footer-2')[0]?.h !== 0
                            ),
                            onClick: () =>
                              setGridHomeList((prev: any) => {
                                return prev?.map((item: any) => {
                                  if (item.i === 'footer-2') {
                                    return {
                                      ...item,
                                      w: 9,
                                      h: 4,
                                      minW: 1,
                                      minH: 2,
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
                  updateParams({
                    id: paramData.id,
                    data: paramData,
                  }).then((res: any) => {
                    if (res && res.code === 'SUCCESS') {
                      history.push({ pathname: `/home` });
                      window.location.reload();
                    } else {
                      message.error(res?.msg || res?.message || '接口异常');
                    }
                  });
                }}
              >
                保存并返回
              </Button>
            </Fragment>
            :
            isVision ?
              <Button
                className="flex-box btn"
                icon={
                  <div style={{ height: 30, width: 30, marginRight: 8 }}>
                    <div className="k-loader" />
                  </div>
                }
                type="link"
                disabled
              >
                {'检测中'}
              </Button>
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
      <div className="info-box message-box drag-item-content-box background-ubv">
        {
          (ifCanEdit || paramData?.contentData?.contentHeader?.['slider-2']) ?
            <div className="common-card-title-box flex-box drag-btn">
              <div className="flex-box common-card-title">基本信息</div>
              {
                ifCanEdit ?
                  <div className="flex-box drag-item-btn-box">
                    <Switch
                      size="small"
                      checkedChildren="显示头"
                      unCheckedChildren="隐藏头"
                      defaultChecked={paramData?.contentData?.contentHeader?.['slider-2']}
                      onChange={(e) => {
                        setParamData((prev: any) => {
                          return Object.assign({}, prev, {
                            contentData: Object.assign({}, prev?.contentData, {
                              contentHeader: e ?
                                Object.assign({}, prev?.contentData?.contentHeader, { ['slider-2']: e })
                                :
                                _.omit(prev?.contentData?.contentHeader, 'slider-2')
                            })
                          })
                        });
                      }}
                    />
                    <Popconfirm
                      title="确认删除 基本信息 窗口吗?"
                      onConfirm={() => {
                        const home = gridHomeList?.map((item: any) => {
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
                        });
                        setParamData((prev: any) => {
                          return Object.assign({}, prev, {
                            contentData: Object.assign({}, prev?.contentData, { home })
                          })
                        });
                        setGridHomeList(home);
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
            : null
        }
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
        </div>
      </div>
    </div>,
    <div key={'slider-3'}>
      <div className="info-box message-box drag-item-content-box background-ubv">
        {
          (ifCanEdit || paramData?.contentData?.contentHeader?.['slider-3']) ?
            <div className="common-card-title-box flex-box drag-btn">
              <div className="flex-box common-card-title">实时信息</div>
              {
                ifCanEdit ?
                  <div className="flex-box drag-item-btn-box">
                    <Switch
                      size="small"
                      checkedChildren="显示头"
                      unCheckedChildren="隐藏头"
                      defaultChecked={paramData?.contentData?.contentHeader?.['slider-3']}
                      onChange={(e) => {
                        setParamData((prev: any) => {
                          return Object.assign({}, prev, {
                            contentData: Object.assign({}, prev?.contentData, {
                              contentHeader: e ?
                                Object.assign({}, prev?.contentData?.contentHeader, { ['slider-3']: e })
                                :
                                _.omit(prev?.contentData?.contentHeader, 'slider-3')
                            })
                          })
                        })
                      }}
                    />
                    <Popconfirm
                      title="确认删除 实时信息 窗口吗?"
                      onConfirm={() => {
                        const home = gridHomeList?.map((item: any) => {
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
                        });
                        setParamData((prev: any) => {
                          return Object.assign({}, prev, {
                            contentData: Object.assign({}, prev?.contentData, { home })
                          })
                        });
                        setGridHomeList(home);
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
            : null
        }
        <div className="info-box-content">
          {/* {
          Object.entries(historyData)?.map((item: any, index: number) => {
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
    <div key={'slider-4'}>
      <div className="info-box message-box drag-item-content-box background-ubv">
        {
          (ifCanEdit || paramData?.contentData?.contentHeader?.['slider-4']) ?
            <div className="common-card-title-box flex-box drag-btn">
              <div className="flex-box common-card-title">方案列表</div>
              {
                ifCanEdit ?
                  <div className="flex-box drag-item-btn-box">
                    <Switch
                      size="small"
                      checkedChildren="显示头"
                      unCheckedChildren="隐藏头"
                      defaultChecked={paramData?.contentData?.contentHeader?.['slider-4']}
                      onChange={(e) => {
                        setParamData((prev: any) => {
                          return Object.assign({}, prev, {
                            contentData: Object.assign({}, prev?.contentData, {
                              contentHeader: e ?
                                Object.assign({}, prev?.contentData?.contentHeader, { ['slider-4']: e })
                                :
                                _.omit(prev?.contentData?.contentHeader, 'slider-4')
                            })
                          })
                        })
                      }}
                    />
                    <Popconfirm
                      title="确认删除 方案列表 窗口吗?"
                      onConfirm={() => {
                        const home = gridHomeList?.map((item: any) => {
                          if (item.i === 'slider-4') {
                            return {
                              ...item,
                              w: 0,
                              h: 0,
                              minW: 0,
                              minH: 0,
                            };
                          }
                          return item;
                        });
                        setParamData((prev: any) => {
                          return Object.assign({}, prev, {
                            contentData: Object.assign({}, prev?.contentData, { home })
                          })
                        });
                        setGridHomeList(home);
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
            : null
        }
        <div className={`info-box-content tabs-box`} style={(ifCanEdit || paramData?.contentData?.contentHeader?.['slider-4']) ? {} : {
          display: 'flex', alignItems: 'center', padding: '0 8px'
        }}>
          <div
            className={`flex-box-center tabs-box-item-box ${gridHomeList?.filter((i: any) => i.i === 'slider-4')[0]?.w >= 20 ? 'tabs-box-item-box-rows' : ''}`}
            onClick={() => {
              setAddItemsVisible(true);
            }}
          >
            +
          </div>
          {
            JSON.parse(localStorage.getItem('ipList') || "[]")?.map((item: any, index: number) => {
              const { label, key } = item;
              return <div
                className={`flex-box tabs-box-item-box ${localStorage.getItem('ipString') === key ? 'active' : ''} ${gridHomeList?.filter((i: any) => i.i === 'slider-4')[0]?.w >= 3 ? 'tabs-box-item-box-rows' : ''}`}
                key={`tabs-${key}`}
              >
                <div onClick={() => {
                  localStorage.setItem('ipString', key);
                  window.location.reload();
                }} className="tabs-box-item-title">
                  {
                    projectStatus?.filter((i: any) => i.value === item.key)[0]?.running ?
                      <div className="flex-box" style={{ gap: 8 }}>
                        <Badge color={'green'} />
                        {label}
                      </div>
                      :
                      label
                  }
                </div>
                <CloseOutlined onClick={() => {
                  let newActiveKey: string = localStorage.getItem('ipString') || '';
                  let lastIndex = -1;
                  JSON.parse(localStorage.getItem('ipList') || "[]")?.forEach((item: any, i: any) => {
                    if (item.key === key) {
                      lastIndex = i - 1;
                    }
                  });
                  const newPanes = JSON.parse(localStorage.getItem('ipList') || "[]")?.filter((item: any) => item.key !== key);
                  if (newPanes.length && newActiveKey === key) {
                    if (lastIndex >= 0) {
                      newActiveKey = newPanes[lastIndex]?.key;
                    } else {
                      newActiveKey = newPanes[0].key;
                    }
                  }
                  localStorage.setItem('ipString', newActiveKey);
                  localStorage.setItem('ipList', JSON.stringify(newPanes));
                  window.location.reload();
                }} className="tabs-box-item-close" />
              </div>
            })
          }
        </div>
      </div>
    </div>,
    <div key={'footer-1'}>
      <div className="log-content message-box drag-item-content-box background-ubv">
        {
          (ifCanEdit || paramData?.contentData?.contentHeader?.['footer-1']) ?
            <div className="common-card-title-box flex-box drag-btn">
              <div className="flex-box common-card-title">日志信息</div>
              {
                ifCanEdit ?
                  <div className="flex-box drag-item-btn-box">
                    <Switch
                      size="small"
                      checkedChildren="显示头"
                      unCheckedChildren="隐藏头"
                      defaultChecked={paramData?.contentData?.contentHeader?.['footer-1']}
                      onChange={(e) => {
                        setParamData((prev: any) => {
                          return Object.assign({}, prev, {
                            contentData: Object.assign({}, prev?.contentData, {
                              contentHeader: e ?
                                Object.assign({}, prev?.contentData?.contentHeader, { ['footer-1']: e })
                                :
                                _.omit(prev?.contentData?.contentHeader, 'footer-1')
                            })
                          })
                        })
                      }}
                    />
                    <Popconfirm
                      title="确认删除 日志信息 窗口吗?"
                      onConfirm={() => {
                        const home = gridHomeList?.map((item: any) => {
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
                        });
                        setParamData((prev: any) => {
                          return Object.assign({}, prev, {
                            contentData: Object.assign({}, prev?.contentData, { home })
                          })
                        });
                        setGridHomeList(home);
                      }}
                      okText="确认"
                      cancelText="取消"
                    >
                      <div className='common-btn'>删除</div>
                    </Popconfirm>
                  </div>
                  :
                  null
              }
            </div>
            : null
        }
        <div className="card-body-box">
          <div
            className="content-item-span"
            dangerouslySetInnerHTML={{
              // 此处需要处理
              __html: _.isString(logStr) ? logStr : logStr.join('<br/>'),
            }}
          />
          <div className="preview-box flex-box-center">
            <CompressOutlined className='preview-icon' onClick={() => {
              setLogDataVisible('log');
            }} />
          </div>
        </div>
      </div>
    </div>,
    <div key={'footer-2'}>
      <div className="log-content message-box drag-item-content-box background-ubv">
        {
          (ifCanEdit || paramData?.contentData?.contentHeader?.['footer-2']) ?
            <div className="common-card-title-box flex-box drag-btn">
              <div className="flex-box common-card-title">错误信息</div>
              {
                ifCanEdit ?
                  <div className="flex-box drag-item-btn-box">
                    <Switch
                      size="small"
                      checkedChildren="显示头"
                      unCheckedChildren="隐藏头"
                      defaultChecked={paramData?.contentData?.contentHeader?.['footer-2']}
                      onChange={(e) => {
                        setParamData((prev: any) => {
                          return Object.assign({}, prev, {
                            contentData: Object.assign({}, prev?.contentData, {
                              contentHeader: e ?
                                Object.assign({}, prev?.contentData?.contentHeader, { ['footer-2']: e })
                                :
                                _.omit(prev?.contentData?.contentHeader, 'footer-2')
                            })
                          })
                        })
                      }}
                    />
                    <Popconfirm
                      title="确认删除 错误信息 窗口吗?"
                      onConfirm={() => {
                        const home = gridHomeList?.map((item: any) => {
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
                        });
                        setParamData((prev: any) => {
                          return Object.assign({}, prev, {
                            contentData: Object.assign({}, prev?.contentData, { home })
                          })
                        });
                        setGridHomeList(home);
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
            : null
        }
        <div className="content-item-span card-body-box">
          {/* <BasicScrollBar data={errorData}> */}
          {errorData?.map((log: any, index: number) => {
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
                        __html: `节点${node_name || ''}（${nid || ''}）${message}`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {/* </BasicScrollBar> */}
          <div className="preview-box flex-box-center">
            <CompressOutlined className='preview-icon' onClick={() => {
              setLogDataVisible('error');
            }} />
          </div>
        </div>
      </div>
    </div>,
  ]), [
    isVision, started, taskDataConnect, loading, paramData,
    logStr, footerData, errorData
  ]);
  // 保存布局状态
  const saveGridFunc = (data: any) => {
    let home: any = [],
      content: any = [];

    data?.forEach((item: any) => {
      if (['slider-1', 'slider-2', 'slider-3', 'slider-4', 'content', 'footer-1', 'footer-2'].includes(item.i)) {
        home = home.concat({
          ...item,
          minW: 1,
          minH: 1,
          maxW: 100,
          maxH: 100
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
            minW: 1,
            minH: 2,
            maxW: 100,
            maxH: 100
          }
        });
        // Object.assign({}, content, !!paramData?.contentData?.content[item.i] ? {
        //   [item.i]: {
        //     ...paramData?.contentData?.content[item.i],
        //     size: {
        //       ...item,
        //       maxW: 100,
        //       minW: 1,
        //       maxH: 100,
        //       minH: 2,
        //     }
        //   }
        // } : {})
      }
    });
    setGridHomeList(home);
    setAddContentList(content);
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
    const { home = [
      { "i": "slider-1", "x": 0, "y": 0, "w": 7, "h": 8, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 },
      { "i": "slider-2", "x": 0, "y": 8, "w": 7, "h": 18, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 },
      { "i": "slider-3", "x": 0, "y": 0, "w": 0, "h": 0, "minW": 0, "maxW": 100, "minH": 0, "maxH": 100 },
      { "i": "slider-4", "x": 7, "y": 0, "w": 89, "h": 3, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 },
      { "i": "footer-1", "x": 7, "y": 0, "w": 0, "h": 0, "minW": 0, "maxW": 100, "minH": 0, "maxH": 100 },
      { "i": "footer-2", "x": 0, "y": 26, "w": 7, "h": 17, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 }
    ], content = {}, footerSelectList, contentHeader = {} } = contentData;
    const { nodes } = flowData;
    const list = nodes?.map((node: any) => {
      const { name, alias, id, ports = {} } = node;
      const { items = [] } = ports;
      return {
        key: id,
        value: id,
        title: `${alias || name}`,
        label: `${alias || name}`,
        children: items?.filter((i: any) => i.group === 'bottom')
          ?.map((port: any) => {
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
    setGridHomeList(home);
    let newParams = paramsData;
    if (!_.isObject(contentHeader) || _.isEmpty(contentHeader)) {
      const header = {};
      home?.forEach((item: any) => header[item.i] = item.i !== 'slider-4');
      if (_.isArray(content)) {
        content?.forEach((item: any) => header[item.id] = true);
      } else {
        Object.entries(content)?.forEach((item: any) => {
          const { value, type } = item[1];
          const id = `${value?.join('$$')}$$${type}`;
          header[id] = true;
        });
      };

      newParams = Object.assign({}, paramsData, {
        contentData: Object.assign({}, contentData, {
          contentHeader: header,
        })
      });
    };
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
      setParamData(newParams);
    } else {
      const result = Object.entries(content)?.map((item: any) => {
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
      const resultParams = Object.assign({}, newParams, {
        contentData: Object.assign({}, contentData, {
          content: result,
        })
      });
      setInitialState((preInitialState: any) => ({
        ...preInitialState,
        params: resultParams,
      }));
      setParamData(resultParams);
    };

    return () => {
      setAddContentList([]);
      dispatch({
        type: 'home/set',
        payload: {
          gridContentList: {},
        },
      });
      dispatch({ type: 'home/snapshot' });
    };
  }, [paramsData]);
  // 轮训获取运行状态
  useEffect(() => {
    if (!ipString || ifCanEdit || isVision) return;
    getServiceStatus();
  }, [projectStatus]);
  // 监控窗口动态添加
  useEffect(() => {
    if (!_.isEmpty(addContentList) && !_.isEmpty(paramData)) {
      const newGridContentList = !!localStorage.getItem(`localGridContentList-${paramData.id}`) ?
        JSON.parse(localStorage.getItem(`localGridContentList-${paramData.id}`) || "{}")
        : {};
      let listData: any = [],
        layoutData: any = [],
        resultData: any = {};
      addContentList?.forEach((item: any, index: number) => {
        const {
          id: key, size, value = [], type, yName, xName, defaultImg, fontSize,
          reverse, direction, symbol, fetchType, fetchParams, align,
          backgroundColor = 'default', barColor = 'default', progressType = 'line',
          progressSize = 8, progressSteps = 5, windowControl,
          des_bordered, des_column, des_layout, des_size, ifLocalStorage,
          basicInfoData = [{ id: guid(), name: '', value: '' }]
        } = item;
        const id = key?.split('$$')[0];
        const gridValue = gridContentList[id] || {};
        const newGridValue = newGridContentList[id] || {};
        // socket有数据就渲染新的，没有就渲染localStorage缓存的
        const dataValue = gridValue[value[1]] || newGridValue[value[1]] || undefined;
        const parent = paramData?.flowData?.nodes?.filter((i: any) => i.id === value[0]);
        const { alias, name, ports = {} } = parent[0] || {};
        const { items = [] } = ports;
        const SecLabel = items?.filter((i: any) => i.group === 'bottom' && (i?.label?.name === value[1]))[0];

        listData = listData.concat(
          <div key={key} className={` drag-item-content-box ${backgroundColor === 'default' ? "background-ubv" : ""}`}>
            {
              (ifCanEdit || paramData?.contentData?.contentHeader?.[key]) ?
                <div className="common-card-title-box flex-box drag-btn">
                  <TooltipDiv className="flex-box common-card-title">
                    {`${alias || name}`}
                    <span className='title-span'>{`- ${SecLabel?.label?.alias || value[1] || ''}`}</span>
                  </TooltipDiv>
                  {
                    ifCanEdit ?
                      <div className="flex-box drag-item-btn-box">
                        <Switch
                          size="small"
                          checkedChildren="显示头"
                          unCheckedChildren="隐藏头"
                          defaultChecked={paramData?.contentData?.contentHeader?.[key]}
                          onChange={(e) => {
                            setParamData((prev: any) => {
                              return Object.assign({}, prev, {
                                contentData: Object.assign({}, prev?.contentData, {
                                  contentHeader: e ?
                                    Object.assign({}, prev?.contentData?.contentHeader, { [key]: e })
                                    :
                                    _.omit(prev?.contentData?.contentHeader, key)
                                })
                              })
                            })
                          }}
                        />
                        <div
                          className='common-btn'
                          onClick={() => {
                            !!defaultImg && setSelectedPath((prev: any) => ({ ...prev, value: defaultImg }));
                            setBasicInfoData(basicInfoData);
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
                            const result = addContentList?.filter((item: any) => item.id !== key);
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
                :
                null
            }
            <div className="card-body-box">
              <div className="flex-box-center"
                style={paramData?.contentData?.contentHeader?.[key] ? { height: 'calc(100% - 14px)' } : { height: '100%' }}
              >
                {
                  type === 'line' ?
                    <LineCharts
                      id={key}
                      setMyChartVisible={setMyChartVisible}
                      data={{
                        dataValue: dataValue || [],
                        yName, xName,
                      }}
                    />
                    :
                    type === 'point' ?
                      <PointCharts
                        id={key}
                        setMyChartVisible={setMyChartVisible}
                        data={{
                          dataValue: dataValue || [],
                          yName, xName, direction, symbol
                        }}
                      />
                      :
                      type === 'bar' ?
                        <BarCharts
                          id={key}
                          setMyChartVisible={setMyChartVisible}
                          data={{
                            dataValue: dataValue || [],
                            yName, xName, direction, align, barColor
                          }}
                        />
                        :
                        type === 'pie' ?
                          <PieCharts
                            id={key}
                            setMyChartVisible={setMyChartVisible}
                            data={dataValue || []}
                          />
                          :
                          type === 'table' ?
                            <TableCharts
                              id={key}
                              data={{
                                dataValue: dataValue || [],
                                yName, xName, fontSize, reverse
                              }}
                            />
                            :
                            type === 'table2' ?
                              <Table2Charts
                                id={key}
                                data={{
                                  dataValue: dataValue || [],
                                  fontSize, reverse
                                }}
                              />
                              :
                              type === 'alert' ?
                                <AlertCharts
                                  id={key}
                                  data={dataValue || []}
                                />
                                :
                                type === 'imgs' ?
                                  <ImgsCharts
                                    id={key}
                                    data={dataValue || []}
                                  />
                                  :
                                  type === 'progress' ?
                                    <ProgressCharts
                                      id={key}
                                      data={{
                                        dataValue: dataValue || 0, barColor, progressType, progressSize, progressSteps
                                      }}
                                    />
                                    :
                                    type === 'description' ?
                                      <DescriptionCharts
                                        id={key}
                                        data={{
                                          dataValue: dataValue || [],
                                          basicInfoData,
                                          des_bordered, des_column, des_layout, des_size,
                                        }}
                                      />
                                      :
                                      type === 'button' ?
                                        <Button
                                          type={'primary'}
                                          id={key}
                                          onClick={() => {
                                            btnFetch(fetchType, xName, JSON.parse(fetchParams));
                                          }}
                                        >
                                          {yName}
                                        </Button>
                                        :
                                        type === 'buttonInp' ?
                                          <ButtonCharts
                                            id={key}
                                            data={{
                                              yName, xName, fetchType
                                            }}
                                          />
                                          :
                                          (
                                            _.isString(dataValue) && dataValue.indexOf('http') > -1 ? (
                                              <ImgCharts
                                                id={key}
                                                data={{
                                                  dataValue, windowControl,
                                                  setContentList
                                                }}
                                              />
                                            )
                                              :
                                              <ImgCharts
                                                id={key}
                                                data={{
                                                  dataValue: !!defaultImg ? `${BASE_IP}file${(defaultImg.indexOf('\\') === 0 || defaultImg.indexOf('/') === 0) ? '' : '\\'}${defaultImg}` : '',
                                                  windowControl,
                                                  setContentList
                                                }}
                                              />
                                          )
                }
              </div>
            </div>
          </div>,
        );
        layoutData = layoutData.concat(size);
        if (ifLocalStorage || !_.isBoolean(ifLocalStorage)) {
          resultData[id] = !!dataValue ? {
            ...item,
            [value[1]]: dataValue
          } : item;
        }
      });
      localStorage.setItem(`localGridContentList-${paramData.id}`, JSON.stringify(resultData));

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
    // const logContent = logs?.map((item: any) => item.data);
    // setLogStr((cur: any) => {
    //   const newLogs = [...logContent, ...cur];
    //   return newLogs.slice(0, 50);
    // });
  }, 300);
  /**
   * 处理错误信息
   */
  const errorThrottleAndMerge = useThrottleAndMerge((errors) => {
    // console.log('errors', errors, errors?.filter((item: any) => isJSON(item.data)))
    // try {
    //   const errorList: any = [];
    //   errors?.filter((item: any) => isJSON(item.data))?.forEach((msg: any) => {
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
      const logModal = gridHomeList?.filter((item: any) => item.i === 'footer-1')[0],
        errorModal = gridHomeList?.filter((item: any) => item.i === 'footer-2')[0];
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
  // useEffect(() => {
  //   if (!_.isEmpty(paramData) && !!paramData.id && ifCanEdit) {
  //     updateTimer && clearTimeout(updateTimer);
  //     updateTimer = setTimeout(() => {
  //       updateParams({
  //         id: paramData.id,
  //         data: paramData,
  //       }).then((res: any) => {
  //         if (res && res.code === 'SUCCESS') {

  //         } else {
  //           message.error(res?.msg || res?.message || '接口异常');
  //         }
  //       });
  //     }, 500);
  //   }
  // }, [paramData]);
  // 添加监控窗口
  const addWindow = () => {
    validateFields()
      .then((values) => {
        const {
          value, type, yName, xName, fontSize, defaultImg, reverse, direction, symbol,
          fetchType, fetchParams, align, backgroundColor, barColor,
          progressType, progressSize, progressSteps, windowControl,
          des_bordered, des_column, des_layout, des_size, ifLocalStorage,
        } = values;
        if (['button', 'buttonInp'].includes(type) && !!fetchParams) {
          try {
            JSON.parse(fetchParams);
          } catch (e) {
            console.log(e, fetchParams)
            message.error('传递参数 格式不正确');
            return;
          }
        };
        const id = `${value?.join('$$')}$$${type}`;
        if (_.isEmpty(editWindowData) && addContentList?.filter((i: any) => i.id === id).length) {
          message.error('已存在，请求改 “模块，节点，类型” 中的任一项');
          return;
        }
        let result = [];
        if (_.isEmpty(editWindowData)) {
          result = addContentList.concat({
            id,
            value,
            size: { i: id, x: 8, y: 0, w: 10, h: 4, minW: 1, maxW: 100, minH: 2, maxH: 100 },
            type,
            tab: activeTab,
            yName, xName, defaultImg, fontSize, reverse, direction, symbol,
            fetchType, fetchParams, align, backgroundColor, barColor,
            progressType, progressSize, progressSteps, windowControl,
            des_bordered, des_column, des_layout, des_size, ifLocalStorage,
            basicInfoData,
          });
        } else {
          result = (addContentList || [])?.map((item: any) => {
            if (item.id === `${editWindowData?.value?.join('$$')}$$${editWindowData.type}`) {
              return {
                id,
                value,
                size: Object.assign({}, editWindowData.size, { i: id }),
                type,
                tab: activeTab,
                yName, xName, defaultImg, fontSize, reverse, direction, symbol,
                fetchType, fetchParams, align, backgroundColor, barColor,
                progressType, progressSize, progressSteps, windowControl,
                des_bordered, des_column, des_layout, des_size, ifLocalStorage,
                basicInfoData,
              };
            };
            return item;
          })
        }
        setAddContentList(result);
        if (paramsData.id) {
          const params = Object.assign({}, paramsData, {
            contentData: Object.assign({}, paramsData.contentData, { content: result }),
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
    setFieldsValue({
      value: [], type: 'img', yName: undefined, xName: undefined, fontSize: 24, reverse: false,
      direction: 'column', symbol: 'rect', fetchType: undefined, fetchParams: undefined,
      align: 'left', backgroundColor: 'default', barColor: 'default', progressType: 'line',
      progressSize: 8, progressSteps: 5, windowControl: undefined, ifLocalStorage: false
    });
    setWindowType('img');
    setAddWindowVisible(false);
    setFooterSelectVisible(false);
  };

  const homeDom = useMemo(() => {
    return document.getElementById('dashboardContent');
  }, [document.getElementById('dashboardContent')]);
  const homePageIcon = useMemo(() => {
    const length = Math.ceil((homeDom?.scrollHeight || 0) / (homeDom?.clientHeight || 1));
    let arr: any = [];
    for (let i = 0; i < length; i++) {
      arr = arr.concat(i + 1)
    }
    return arr;
  }, [homeDom]);

  return (
    <div className={`${styles.home}`}>
      <div className="home-body">
        {
          useMemo(() => {
            return !_.isEmpty(gridHomeList) ? (
              <GridLayout
                dragName={ifCanEdit ? '.common-card-title' : ''}
                list={gridList.concat(contentList)}
                layout={gridHomeList.concat(contentLayout)}
                onChange={(data: any) => {
                  saveGridFunc(data);
                }}
              />
            ) : null
          }, [gridHomeList, contentLayout, gridList, contentList])
        }
      </div>
      <div className="flex-box home-footer">
        {
          useMemo(() => {
            return started ?
              (
                !!footerData && (Object.entries(footerData) || [])?.map((item: any, index: number) => {
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
                    {`${nodeList?.filter((i: any) => i.value === item[0])[0]?.label}: ${Status === 'running' ? '正常' : '异常'}`}
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
      <div className="home-affix-box">
        {
          homePageIcon.map((item: any, index: number) => {
            return <div className="flex-box-center home-page-affix"
              onClick={(e) => {
                homeDom?.scrollTo({ top: (homeDom?.clientHeight || 1) * index });
              }}
            >
              {index + 1}
            </div>
          })
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
                children: nodeList?.map((item: any) => _.omit(item, 'children'))
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
          <Form form={form} scrollToFirstError>
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
                options={windowTypeList}
                onChange={val => {
                  setWindowType(val);
                }}
              />
            </Form.Item>
            <Form.Item
              name={`backgroundColor`}
              label={'窗口背景色'}
              initialValue={"default"}
              rules={[{ required: false, message: '窗口背景色' }]}
            >
              <Select
                style={{ width: '100%' }}
                options={[
                  {
                    value: 'default',
                    label: '默认',
                  },
                  {
                    value: 'transparent',
                    label: '透明色',
                  }
                ]}
              />
            </Form.Item>
            {
              (['img'].includes(windowType) && !isVision) ?
                <Fragment>
                  <Form.Item
                    name={`windowControl`}
                    label={'窗口控制'}
                    tooltip={"控制其他窗口的显示与隐藏"}
                    rules={[{ required: false, message: '窗口控制' }]}
                  >
                    <Select
                      style={{ width: '100%' }}
                      allowClear
                      options={contentList.map((dom: any) => {
                        const { key, props } = dom;
                        const { children } = props;
                        const keySp = key?.split("$$");
                        const name = `${children?.[0]?.props?.children?.[0]?.props?.children?.[0]} - ${windowTypeList?.filter((i: any) => i.value === keySp?.[2])?.[0]?.label}`
                        return {
                          value: key,
                          label: name,
                          disabled: key === editWindowData?.id
                        }
                      })}
                    />
                  </Form.Item>
                  <Form.Item
                    name={'defaultImg'}
                    label="默认图片"
                    rules={[{ required: false, message: '默认图片' }]}
                  >
                    <div className="flex-box">
                      <TooltipDiv style={{ paddingRight: 10 }}>
                        {selectedPath.value}
                      </TooltipDiv>
                      {
                        !selectedPath.value ?
                          <Button
                            onClick={() => {
                              setFieldsValue({ defaultImg: undefined });
                              setSelectPathVisible(true);
                            }}
                          >
                            选择文件
                          </Button>
                          :
                          <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                              setFieldsValue({ defaultImg: undefined });
                              setSelectedPath({ fileType: 'file', value: '' });
                            }}
                          />
                      }
                    </div>
                  </Form.Item>
                </Fragment>
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
                    <Input size='large' />
                  </Form.Item>
                  <Form.Item
                    name={`xName`}
                    label={windowType === "table" ? "表格value名" : "x 轴名称"}
                    rules={[{ required: true, message: 'x轴名称' }]}
                  >
                    <Input size='large' />
                  </Form.Item>
                </Fragment>
                : null
            }
            {
              ['point', 'bar'].includes(windowType) ?
                <Form.Item
                  name={`direction`}
                  label={'图形方向'}
                  rules={[{ required: false, message: '图形方向' }]}
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
              ['bar'].includes(windowType) ?
                <Fragment>
                  <Form.Item
                    name={`align`}
                    label={'对齐方向'}
                    initialValue={"left"}
                    rules={[{ required: false, message: '对齐方向' }]}
                  >
                    <Select
                      style={{ width: '100%' }}
                      options={[
                        {
                          value: 'left',
                          label: '左对齐',
                        },
                        {
                          value: 'right',
                          label: '右对齐',
                        }
                      ]}
                    />
                  </Form.Item>
                </Fragment>
                : null
            }
            {
              ['bar', 'progress'].includes(windowType) ?
                <Form.Item
                  name={`barColor`}
                  label={'图形颜色'}
                  initialValue={"default"}
                  rules={[{ required: false, message: '图形颜色' }]}
                >
                  <Select
                    style={{ width: '100%' }}
                    mode={['bar'].includes(windowType) ? 'multiple' : undefined}
                    options={[['default', '默认'], ['#73c0de', '蓝色'],
                    ['#5470c6', '深蓝'], ['#91cc75', '绿色'],
                    ['#3ba272', '深绿'], ['#fac858', '黄色'],
                    ['#ee6666', '红色'], ['#fc8452', '橘红'],
                    ['#9a60b4', '紫色'], ['#ea7ccc', '粉色'],
                    ['#000', '黑色'], ['#fff', '白色']]
                      .map((item: any, index: number) => {
                        return {
                          value: item[0],
                          label: index === 0 ? item[1] : <div className='flex-box'>
                            <div className='item-label-icon' style={{ backgroundColor: item[0] }} />
                            {item[1]}
                          </div>
                        }
                      })
                    }
                    onChange={(value) => {
                      if (value.includes('default')) {
                        setFieldsValue({
                          barColor: 'default'
                        });
                      }
                    }}
                  />
                </Form.Item>
                : null
            }
            {
              ['progress'].includes(windowType) ?
                <Fragment>
                  <Form.Item
                    name={`progressType`}
                    label={'进度条形状'}
                    initialValue={"line"}
                    rules={[{ required: false, message: '进度条形状' }]}
                  >
                    <Select
                      style={{ width: '100%' }}
                      options={[
                        {
                          value: 'line',
                          label: '直线'
                        },
                        {
                          value: 'circle',
                          label: '环形'
                        },
                        {
                          value: 'dashboard',
                          label: '仪表盘'
                        }
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    name={`progressSize`}
                    label={'进度条高度'}
                    initialValue={8}
                    rules={[{ required: false, message: '进度条高度' }]}
                  >
                    <InputNumber min={2} max={99} step={1} />
                  </Form.Item>
                  {
                    form.getFieldValue('progressType') === 'line' ?
                      <Form.Item
                        name={`progressSteps`}
                        label={'进度格数'}
                        initialValue={5}
                        rules={[{ required: false, message: '进度格数' }]}
                      >
                        <InputNumber min={0} max={99} step={1} />
                      </Form.Item>
                      :
                      null
                  }
                </Fragment>
                : null
            }
            {
              ['point'].includes(windowType) ?
                <Form.Item
                  name={`symbol`}
                  label={'散点形状'}
                  rules={[{ required: true, message: '散点形状' }]}
                  initialValue={'rect'}
                >
                  <Select
                    style={{ width: '100%' }}
                    options={[
                      {
                        value: 'circle',
                        label: '圆点',
                      },
                      {
                        value: 'rect',
                        label: '正方形',
                      },
                      {
                        value: 'roundRect',
                        label: '圆角正方形',
                      },
                      {
                        value: 'triangle',
                        label: '三角形',
                      },
                      {
                        value: 'diamond',
                        label: '菱形',
                      },
                      {
                        value: 'pin',
                        label: '小气球',
                      },
                      {
                        value: 'arrow',
                        label: '箭头',
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
            {
              ['button', 'buttonInp'].includes(windowType) ?
                <Fragment>
                  <Form.Item
                    name={`yName`}
                    label={"按钮名称"}
                    rules={[{ required: true, message: '按钮名称' }]}
                  >
                    <Input size='large' />
                  </Form.Item>
                  <Form.Item
                    name={`fetchType`}
                    label={"http类型"}
                    rules={[{ required: true, message: 'http类型' }]}
                  >
                    <Select
                      style={{ width: '100%' }}
                      options={['get', 'post', 'put', 'delete'].map((item: any) => ({ value: item, label: _.toUpper(item) }))}
                    />
                  </Form.Item>
                  <Form.Item
                    name={`xName`}
                    label={"接口地址"}
                    rules={[{ required: true, message: '接口地址' }]}
                  >
                    <Input size='large' />
                  </Form.Item>
                  {
                    ['button'].includes(windowType) ?
                      <Form.Item
                        name={`fetchParams`}
                        label={"传递参数"}
                        rules={[{ required: false, message: '传递参数' }]}
                      >
                        <Input.TextArea
                          size='large'
                          autoSize={{ minRows: 1, maxRows: 5 }}
                        />
                      </Form.Item>
                      : null
                  }
                </Fragment>
                : null
            }
            {
              ['description'].includes(windowType) ?
                <Fragment>
                  <Form.Item
                    label="静态数据"
                  >
                    {
                      _.isArray(basicInfoData) ?
                        basicInfoData.map((item: any, index: number) => {
                          if (!item || _.isEmpty(item)) return null;

                          const { id, name, value } = item;
                          return <Row
                            key={`commonInfo-${id || index}`}
                            gutter={8}
                            style={{ marginBottom: 8, height: '27px', }}
                          >
                            <Col flex={1}>
                              <Input
                                placeholder='key'
                                value={name}
                                onChange={e => {
                                  const val = e?.target?.value;
                                  setBasicInfoData((prev: any) => {
                                    return prev.map((info: any) => {
                                      if (info.id === id) {
                                        return { ...info, name: val }
                                      }
                                      return info;
                                    })
                                  });
                                }}
                              />
                            </Col>
                            <Col flex={2}>
                              <Input
                                placeholder='value'
                                value={value}
                                onChange={e => {
                                  const val = e?.target?.value;
                                  setBasicInfoData((prev: any) => {
                                    return prev.map((info: any) => {
                                      if (info.id === id) {
                                        return { ...info, value: val }
                                      }
                                      return info;
                                    })
                                  });
                                }}
                              />
                            </Col>
                            <Col style={{ height: '100%' }}>
                              <Button
                                style={{ height: '100%' }}
                                icon={<MinusOutlined />}
                                onClick={() => {
                                  setBasicInfoData((prev: any) => {
                                    return prev.filter((i: any) => i.id !== id)?.length ?
                                      prev.filter((i: any) => i.id !== id) :
                                      [{ id: guid(), name: '', value: '' }]
                                  })
                                }}
                              />
                            </Col>
                          </Row>
                        })
                        :
                        null
                    }
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setBasicInfoData((prev: any) => prev.concat({ id: guid(), name: '', value: '' }))
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="des_bordered"
                    label="是否展示边框"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    name="des_column"
                    label="列数"
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    name="des_layout"
                    label="布局方向"
                  >
                    <Select
                      options={[
                        { label: '横向', value: 'horizontal' },
                        { label: '纵向', value: 'vertical' }
                      ]}
                    />
                  </Form.Item>
                  {
                    !!form.getFieldValue('des_bordered') ?
                      <Form.Item
                        name="des_size"
                        label="布局大小"
                      >
                        <Select
                          options={[
                            { label: '自适应', value: 'default' },
                            { label: '中', value: 'middle' },
                            { label: '小', value: 'small' }
                          ]}
                        />
                      </Form.Item>
                      : null
                  }
                </Fragment>
                : null
            }
            <Form.Item
              name="ifLocalStorage"
              label="是否开启缓存"
              initialValue={true}
              valuePropName="checked"
              style={{ marginBottom: 8 }}
            >
              <Switch />
            </Form.Item>
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
      {
        addItemsVisible ?
          <Modal
            title={`添加方案窗口`}
            wrapClassName="history-window-modal"
            centered
            width="50vw"
            open={addItemsVisible}
            // maskClosable={false}
            onOk={() => {
              validateFields().then(values => {
                const { value } = values;
                const { label, key } = value;
                const newActiveKey = key + '';
                const newPanes = [...JSON.parse(localStorage.getItem('ipList') || "[]")];
                newPanes.push({ label: label, children: null, key: newActiveKey });
                // localStorage.setItem('ipString', newActiveKey);
                localStorage.setItem('ipList', JSON.stringify(newPanes));
                // window.location.reload();
                setAddItemsVisible(false)
              });
            }}
            onCancel={() => setAddItemsVisible(false)}
            getContainer={false}
            destroyOnClose={true}
          >
            <Form form={form} scrollToFirstError>
              <Form.Item
                name={'value'}
                label="绑定方案"
                rules={[{ required: true, message: '绑定方案' }]}
              >
                <Select
                  style={{ width: '100%' }}
                  size="large"
                  labelInValue
                  options={projectStatus}
                  placeholder="方案ID"
                />
              </Form.Item>

            </Form>
          </Modal>
          : null
      }
      {
        (_.isObject(myChartVisible) && !_.isEmpty(myChartVisible)) ?
          <ChartPreviewModal
            option={myChartVisible}
            onCancel={() => setMyChartVisible(null)}
          />
          : null
      }
      {
        !!logDataVisible ?
          <LogPreviewModal
            type={logDataVisible}
            onCancel={() => setLogDataVisible('')}
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

import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
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
  Image,
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
  DragOutlined,
  LoadingOutlined,
  MinusOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SafetyOutlined,
  SaveOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { connect, useHistory, useModel } from 'umi';
import { ChromePicker, } from 'react-color';
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
import Table2Charts from '@/pages/home/components/Canvas/components/Table2Charts';
import ImgsCharts from '@/pages/home/components/Canvas/components/ImgsCharts';
import ButtonCharts from '@/pages/home/components/Canvas/components/ButtonCharts';
import ImgCharts from '@/pages/home/components/Canvas/components/ImgCharts';
import ProgressCharts from '@/pages/home/components/Canvas/components/ProgressCharts';
import DescriptionCharts from '@/pages/home/components/Canvas/components/DescriptionCharts';
import ThreeCharts from '@/pages/home/components/Canvas/components/ThreeCharts';
import OperationCharts from '@/pages/home/components/Canvas/components/OperationCharts';
import StatisticCharts from '@/pages/home/components/Canvas/components/StatisticCharts';
import Operation2Charts from '@/pages/home/components/Canvas/components/Operation2Charts';
import ButtonPWCharts from '@/pages/home/components/Canvas/components/ButtonPWCharts';

import ChartPreviewModal from '@/pages/home/components/Canvas/components/ChartPreviewModal';
import LogPreviewModal from '@/pages/home/components/Canvas/components/LogPreviewModal';

import { useThrottleAndMerge } from "@/utils/useThrottleAndMerge";
import FileManager from '@/components/FileManager';
import {
  basicWindowList, simulatedCoatingList, windowTypeList,
} from '@/common/constants/globalConstants';
import { getuid, guid } from '@/utils/utils';
import moment from 'moment';
import leftIcon from '@/assets/imgs/left-icon.svg';
import dirIcon from '@/assets/imgs/dir-icon.svg';
import NodeDetailWrapper from '@/components/NodeDetailWrapper';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DropSortableItem from "@/components/DragComponents/DropSortableItem";
import DragSortableItem from "@/components/DragComponents/DragSortableItem";

var clickTime = 0;

const Home: React.FC<any> = (props: any) => {
  const { initialState, setInitialState } = useModel<any>('@@initialState');
  const { params: paramsData } = initialState;
  const history = useHistory();
  const {
    dispatch, started, taskDataConnect, snapshot, activeTab, projectStatus
  } = props;
  const { logStr, gridContentList, footerData, errorData } = snapshot;
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const { validateFields, setFieldsValue, getFieldValue } = form;
  // @ts-ignore
  const { type } = window.QUALITY_CCD_CONFIG;
  const ipString: any = localStorage.getItem('ipString') || '';
  const updateTimer = useRef<any>();
  const [loading, setLoading] = useState(false);
  const [fontColor, setFontColor] = useState('#fff');
  const [addWindowVisible, setAddWindowVisible] = useState(false);
  const [editWindowData, setEditWindowData] = useState<any>({});
  const [gridHomeList, setGridHomeList] = useState<any>([]);
  const [addContentList, setAddContentList] = useState<any>([]);
  const [contentList, setContentList] = useState([]);
  const [contentLayout, setContentLayout] = useState([]);
  const [paramData, setParamData] = useState<any>({});
  const [nodeList, setNodeList] = useState<any>([]);
  const [selectedNodeConfig, setSelectedNodeConfig] = useState<any>([]);
  const [windowType, setWindowType] = useState('img');
  const [selectPathVisible, setSelectPathVisible] = useState(false);
  const [selectedPath, setSelectedPath] = useState<any>({ fileType: 'file', value: '' });
  const [footerSelectVisible, setFooterSelectVisible] = useState(false);
  const [footerSelectList, setFooterSelectList] = useState<any>([]);
  const [addItemsVisible, setAddItemsVisible] = useState(false);
  const [myChartVisible, setMyChartVisible] = useState<any>(null);
  const [logDataVisible, setLogDataVisible] = useState('');
  const [homeSettingVisible, setHomeSettingVisible] = useState('');
  const [homeSettingData, setHomeSettingData] = useState({
    "slider-1": { des_column: 1, ifShowHeader: false },
    "slider-4": { fontSize: 20, ifShowHeader: false },
    "footer-1": { fontSize: 14, ifShowHeader: false },
    "footer-2": { fontSize: 20, ifShowHeader: false },
  });
  const [basicInfoData, setBasicInfoData] = useState<any>([]);
  const [pageIconPosition, setPageIconPosition] = useState<any>({
    position: { bottom: 16, right: 16 },
    direction: 'column'
  });
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [leftPanelData, setLeftPanelData] = useState<any>([
    {
      key: 'main',
      title: '监控窗口',
      open: true,
      children: windowTypeList
    },
    {
      key: 'basic',
      title: '基础窗口',
      open: true,
      children: basicWindowList
    },
    {
      key: 'coating',
      title: '背景涂层',
      open: true,
      children: simulatedCoatingList
    }
  ]);

  const ifCanEdit = useMemo(() => {
    return window.location.hash.indexOf('edit') > -1;
  }, [window.location.hash, paramData]);

  const isVision = useMemo(() => {
    // @ts-ignore
    return window.QUALITY_CCD_CONFIG.type === 'vision';
  }, []);
  // 迁移描述信息组件
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
      <div className="btn-box drag-item-content-box background-ubv">
        {
          homeSettingData['slider-1']?.ifShowHeader ?
            <div className={`common-card-title-box flex-box `}>
              <div className="flex-box common-card-title">
                当前状态：
                {
                  isVision ?
                    <Tooltip title={'服务已连接'} placement={'bottom'}>
                      <Badge status="success" className="status-icon" />
                    </Tooltip>
                    :
                    (started ? (
                      taskDataConnect ? (
                        <Tooltip title={'服务已连接'} placement={'bottom'}>
                          <Badge status="success" className="status-icon" />
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
            : null
        }
        <div className={`btn-box-bottom flex-box`} style={{
          ...homeSettingData['slider-1']?.ifShowHeader ?
            { height: 'calc(100% - 28px)' } : { height: '100%' }
        }}>

          <Button
            className="flex-box btn"
            style={{ width: `${100 / (homeSettingData?.['slider-1']?.des_column || 1)}%` }}
            icon={
              started ? (
                <div className="btn-icon btn-self-icon flex-box-center success" >
                </div>
              ) : (
                <PlayCircleOutlined className="btn-icon" />
              )
            }
            type="link"
            onClick={() => start()}
            disabled={started || ifCanEdit}
            loading={!started && loading}
          >
            {started ? '检测' : '启动'}
          </Button>
          <Button
            className="flex-box btn"
            style={{ width: `${100 / (homeSettingData?.['slider-1']?.des_column || 1)}%` }}
            danger
            icon={<div className="btn-icon btn-self-icon flex-box-center" >
              <div className={`btn-self-icon-rect ${started ? 'active' : 'disabled'}`} />
            </div>}
            type="text"
            onClick={() => end()}
            disabled={!started || ifCanEdit}
            loading={started && loading}
          >
            停止
          </Button>
          <Button
            className="flex-box btn"
            style={{ width: `${100 / (homeSettingData?.['slider-1']?.des_column || 1)}%` }}
            danger
            icon={<ReloadOutlined className="btn-icon" />}
            type="text"
            onClick={() => reStart()}
            disabled={!started}
            loading={started && loading}
          >
            重启
          </Button>
          {process.env.NODE_ENV === 'development' ?
            <Button
              className="flex-box btn"
              style={{ width: `${100 / (homeSettingData?.['slider-1']?.des_column || 1)}%` }}
              icon={<AndroidOutlined className="btn-icon" />}
              type="link"
              onClick={() => {
                dispatch({
                  type: 'home/set',
                  payload: {
                    gridContentList: [
                      { "id": "96c525f8-fada-4512-8b44-7e8995278e63$$filepath$$three", "value": ["96c525f8-fada-4512-8b44-7e8995278e63", "filepath"], "filepath": { "name": "models/output.ply", "value": [{}, {}] }, "size": { "i": "96c525f8-fada-4512-8b44-7e8995278e63$$filepath$$three", "x": 7, "y": 3, "w": 36, "h": 35, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 }, "type": "three", "tab": "1", "fontSize": 12, "backgroundColor": "default", "ifLocalStorage": true, "comparison": false, "interlacing": false, "modelRotate": false, "modelScale": false },
                      { "id": "d3b8e17c-3ad2-4e78-a8e9-b3153490bcbb$$frame$$img", "value": ["d3b8e17c-3ad2-4e78-a8e9-b3153490bcbb", "frame"], "size": { "i": "d3b8e17c-3ad2-4e78-a8e9-b3153490bcbb$$frame$$img", "x": 43, "y": 3, "w": 30, "h": 35, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 }, "type": "img", "tab": "1", "fontSize": 12, "backgroundColor": "default", "ifLocalStorage": true, "magnifier": false },
                      { "id": "d3b8e17c-3ad2-4e78-a8e9-b3153490bcbb$$cam_name$$pie", "value": ["d3b8e17c-3ad2-4e78-a8e9-b3153490bcbb", "cam_name"], "size": { "i": "d3b8e17c-3ad2-4e78-a8e9-b3153490bcbb$$cam_name$$pie", "x": 73, "y": 3, "w": 23, "h": 35, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 }, "type": "pie", "tab": "1", "fontSize": 12, "backgroundColor": "default", "ifLocalStorage": true }
                    ],
                  },
                });
                // touchFlowService()
              }}
              disabled={!started && process.env.NODE_ENV !== 'development' || ifCanEdit}
              loading={started && loading}
            >
              自助
            </Button>
            : null
          }
        </div>
        {
          ifCanEdit ?
            <div className="flex-box-center drag-item-content-mask common-card-title" onClick={() => {
              var now = new Date().getTime();
              if (now - clickTime < 300) { // 设置判断条件为300毫秒
                // 双击事件触发的操作
                setFieldsValue({ des_column: homeSettingData?.['slider-1']?.des_column || 1 });
                setHomeSettingVisible('slider-1');
              }
              clickTime = now;
            }}>
              {/* <DragOutlined className='drag-item-content-mask-icon' /> */}
              {
                !!homeSettingVisible ?
                  <Popconfirm
                    title="确认删除监控窗口吗?"
                    onConfirm={() => {
                      const home = gridHomeList?.map((item: any) => {
                        if (item.i === 'slider-1') {
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
                    <DeleteOutlined className='drag-item-content-mask-icon' />
                  </Popconfirm>
                  : null
              }
            </div>
            : null
        }
      </div>
    </div>,
    <div key={'slider-4'}>
      <div className="info-box message-box drag-item-content-box background-ubv">
        {
          homeSettingData['slider-4']?.ifShowHeader ?
            <div className="common-card-title-box flex-box ">
              <div className="flex-box common-card-title">方案列表</div>
            </div>
            : null
        }
        <div className={`info-box-content tabs-box`} style={{
          ...homeSettingData?.['slider-4'],
          ...{ display: 'flex', alignItems: 'center', padding: '0 8px' }
        }}>
          {
            !!paramData?.contentData?.ipList?.length ?
              <Fragment>
                <Button
                  type="text"
                  disabled={loading}
                  loading={loading}
                  className={`flex-box-center tabs-box-item-box ${gridHomeList?.filter((i: any) => i.i === 'slider-4')[0]?.w >= 20 ? 'tabs-box-item-box-rows' : ''}`}
                  onClick={() => {
                    startProjects(paramData?.contentData?.ipList?.[0], paramData?.contentData?.ipList, 0, projectStatus);
                  }}
                >
                  一键启动
                </Button>
                <Button
                  type="text"
                  disabled={loading}
                  loading={loading}
                  className={`flex-box-center tabs-box-item-box ${gridHomeList?.filter((i: any) => i.i === 'slider-4')[0]?.w >= 20 ? 'tabs-box-item-box-rows' : ''}`}
                  onClick={() => {
                    endProjects(paramData?.contentData?.ipList?.[0], paramData?.contentData?.ipList, 0, projectStatus);
                  }}
                >
                  一键停止
                </Button>
              </Fragment>
              : null
          }
          <div
            className={`flex-box-center tabs-box-item-box ${gridHomeList?.filter((i: any) => i.i === 'slider-4')[0]?.w >= 20 ? 'tabs-box-item-box-rows' : ''}`}
            onClick={() => {
              setAddItemsVisible(true);
            }}
          >
            +
          </div>
          {
            (paramData?.contentData?.ipList || [])?.map((item: any, index: number) => {
              const { label, key } = item;
              const statusItem = projectStatus?.filter((i: any) => i.value === key)?.[0] || {};
              return <div
                className={`flex-box tabs-box-item-box ${localStorage.getItem('ipString') === key ? 'active' : ''} ${gridHomeList?.filter((i: any) => i.i === 'slider-4')[0]?.w >= 3 ? 'tabs-box-item-box-rows' : ''}`}
                key={`tabs-${key}`}
              >
                <div onClick={() => {
                  if (localStorage.getItem('ipString') !== key) {
                    !!key && localStorage.setItem('ipString', key);
                    !!statusItem?.realIp && localStorage.setItem('ipUrl-realtime', statusItem?.realIp);
                    window.location.reload();
                  }
                }} className="tabs-box-item-title">
                  {
                    !!statusItem?.running ?
                      <div className="flex-box" style={{ gap: 8 }}>
                        <Badge color={'green'} />
                        {label}
                      </div>
                      :
                      label
                  }
                </div>
                {
                  (localStorage.getItem('ipString') === key) ?
                    null
                    :
                    <CloseOutlined onClick={() => {
                      let newActiveKey: string = localStorage.getItem('ipString') || '';
                      let lastIndex = -1;
                      (paramData?.contentData?.ipList || [])?.forEach((item: any, i: any) => {
                        if (item.key === key) {
                          lastIndex = i - 1;
                        }
                      });
                      const newPanes = (paramData?.contentData?.ipList || [])?.filter((item: any) => item.key !== key);
                      if (newPanes.length && newActiveKey === key) {
                        if (lastIndex >= 0) {
                          newActiveKey = newPanes[lastIndex]?.key;
                        } else {
                          newActiveKey = newPanes[0].key;
                        }
                      }
                      localStorage.setItem('ipString', newActiveKey);
                      updateParams({
                        id: paramData.id,
                        data: {
                          ...paramData,
                          contentData: {
                            ...paramData?.contentData,
                            ipList: newPanes
                          }
                        },
                      }).then((res: any) => {
                        if (res && res.code === 'SUCCESS') {
                          setInitialState((preInitialState: any) => ({
                            ...preInitialState,
                            params: res.data
                          }));
                        } else {
                          message.error(res?.msg || res?.message || '接口异常');
                        }
                      });
                    }} className="tabs-box-item-close" />
                }
              </div>
            })
          }
        </div>
        {
          ifCanEdit ?
            <div className="flex-box-center drag-item-content-mask common-card-title" onClick={() => {
              var now = new Date().getTime();
              if (now - clickTime < 300) { // 设置判断条件为300毫秒
                // 双击事件触发的操作
                setFieldsValue({ fontSize: homeSettingData?.['slider-4']?.fontSize || 20 });
                setHomeSettingVisible('slider-4');
              }
              clickTime = now;
            }}>
              {/* <DragOutlined className='drag-item-content-mask-icon' /> */}
              {
                !!homeSettingVisible ?
                  <Popconfirm
                    title="确认删除监控窗口吗?"
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
                    <DeleteOutlined className='drag-item-content-mask-icon' />
                  </Popconfirm>
                  : null
              }
            </div>
            : null
        }
      </div>
    </div>,
    <div key={'footer-1'}>
      <div className="log-content message-box drag-item-content-box background-ubv">
        {
          homeSettingData['footer-1']?.ifShowHeader ?
            <div className="common-card-title-box flex-box ">
              <div className="flex-box common-card-title">日志信息</div>
            </div>
            : null
        }
        <div className="card-body-box">
          <div
            className="content-item-span"
            style={homeSettingData['footer-1']}
            dangerouslySetInnerHTML={{
              // 此处需要处理
              __html: _.isString(logStr) ? logStr : logStr.join('<br />'),
            }}
          />
          <div className="preview-box flex-box-center">
            <CompressOutlined className='preview-icon' onClick={() => {
              setLogDataVisible('log');
            }} />
          </div>
        </div>
        {
          ifCanEdit ?
            <div className="flex-box-center drag-item-content-mask common-card-title" onClick={() => {
              var now = new Date().getTime();
              if (now - clickTime < 300) { // 设置判断条件为300毫秒
                // 双击事件触发的操作
                setFieldsValue({ fontSize: homeSettingData?.['footer-1']?.fontSize || 14 });
                setHomeSettingVisible('footer-1');
              }
              clickTime = now;
            }}>
              {/* <DragOutlined className='drag-item-content-mask-icon' /> */}
              {
                !!homeSettingVisible ?
                  <Popconfirm
                    title="确认删除监控窗口吗?"
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
                    <DeleteOutlined className='drag-item-content-mask-icon' />
                  </Popconfirm>
                  : null
              }
            </div>
            : null
        }
      </div>
    </div>,
    <div key={'footer-2'}>
      <div className="log-content message-box drag-item-content-box background-ubv">
        {
          homeSettingData['footer-2']?.ifShowHeader ?
            <div className="common-card-title-box flex-box ">
              <div className="flex-box common-card-title">错误信息</div>
            </div>
            : null
        }
        <div className="card-body-box">
          <div className="content-item-span">
            {errorData?.map((log: any, index: number) => {
              const { color, node_name, nid, message, time } = log;
              return (
                <div className="log-item flex-box-start" key={index}>
                  <div className="log-item-content">
                    <div className="content-item" style={homeSettingData['error']}>
                      <span>{time || moment().format('YYYY-MM-DD HH:mm:ss')}&nbsp;</span>
                      &nbsp;
                      <div
                        className="content-item-span"
                        style={{ color, fontSize: homeSettingData['footer-2']?.fontSize || 'inherit' }}
                        dangerouslySetInnerHTML={{
                          __html: `节点${node_name || ''}（${nid || ''}）${message}`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="preview-box flex-box-center">
            <CompressOutlined className='preview-icon' onClick={() => {
              setLogDataVisible('error');
            }} />
          </div>
        </div>
        {
          ifCanEdit ?
            <div className="flex-box-center drag-item-content-mask common-card-title" onClick={() => {
              var now = new Date().getTime();
              if (now - clickTime < 300) { // 设置判断条件为300毫秒
                // 双击事件触发的操作
                setFieldsValue({ fontSize: homeSettingData?.['error']?.fontSize || 20 });
                setHomeSettingVisible('footer-2');
              }
              clickTime = now;
            }}>
              {/* <DragOutlined className='drag-item-content-mask-icon' /> */}
              {
                !!homeSettingVisible ?
                  <Popconfirm
                    title="确认删除监控窗口吗?"
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
                    <DeleteOutlined className='drag-item-content-mask-icon' />
                  </Popconfirm>
                  : null
              }
            </div>
            : null
        }
      </div>
    </div>,
  ]), [
    isVision, started, taskDataConnect, loading, paramData, projectStatus,
    logStr, footerData, errorData, pageIconPosition, homeSettingData, homeSettingVisible,
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
          minH: 2,
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
    const { flowData = {}, contentData = {}, selfStart = false, } = paramsData;
    const {
      home = [
        { "i": "slider-1", "x": 0, "y": 0, "w": 7, "h": 8, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 },
        { "i": "slider-2", "x": 0, "y": 8, "w": 0, "h": 0, "minW": 0, "maxW": 100, "minH": 0, "maxH": 100 },
        { "i": "slider-3", "x": 0, "y": 0, "w": 0, "h": 0, "minW": 0, "maxW": 100, "minH": 0, "maxH": 100 },
        { "i": "slider-4", "x": 7, "y": 0, "w": 0, "h": 0, "minW": 0, "maxW": 100, "minH": 0, "maxH": 100 },
        { "i": "footer-1", "x": 7, "y": 8, "w": 89, "h": 20, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 },
        { "i": "footer-2", "x": 7, "y": 0, "w": 89, "h": 8, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 }
      ],
      content = {}, footerSelectList, contentHeader = {}, pageIconPosition, contentSize,
      homeSetting = {
        "footer-1": { fontSize: 14 },
        "footer-2": { fontSize: 20 },
      }
    } = contentData;
    const { nodes = [] } = flowData;
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
    setHomeSettingData(homeSetting);
    setPageIconPosition(pageIconPosition || {});
    let newParams = paramsData;
    if (!_.isObject(contentHeader) || _.isEmpty(contentHeader)) {
      const header = {};
      // 默认显示/隐藏header
      home?.forEach((item: any) => header[item.i] = (item.i !== 'slider-4' && item.i !== 'slider-1'));
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
          gridContentList: content.map((item: any) => ({ ...item, key: item.id?.split('$$')?.[0] })),
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
          }),
          key: id.split('$$')?.[0],
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
    if (ifCanEdit) {
      form2.setFieldsValue({
        canvasWidth: contentSize?.width,
        canvasHeight: contentSize?.height,
      });
    };

    if (selfStart) {
      // 开机自启动-延时15秒启动
      if (updateTimer.current) {
        clearTimeout(updateTimer.current);
      }
      updateTimer.current = setTimeout(() => {
        start();
      }, 15000);
    }

    return () => {
      setAddContentList([]);
      dispatch({
        type: 'home/set',
        payload: {
          gridContentList: [],
        },
      });
      dispatch({ type: 'home/snapshot' });
      if (updateTimer.current) {
        clearTimeout(updateTimer.current);
      }
    };
  }, [paramsData]);
  // 检测错误信息，如果有数据，代表有异常，自动重启
  useEffect(() => {
    const { errorSelfStart = false } = paramsData;
    if (!!started && !!errorSelfStart && !!errorData && !!errorData.length) {
      console.log('异常重启');
      message.warning('异常报错，自动重启');
      // dispatch({
      //   type: 'home/set',
      //   payload: {
      //     errorData: []
      //   },
      // });
      // 异常自重启-延时10秒启动
      if (updateTimer.current) {
        clearTimeout(updateTimer.current);
      };
      updateTimer.current = setTimeout(() => {
        reStart();
      }, 10000);
    }
  }, [started, errorData]);
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
        : [];
      if (!_.isArray(newGridContentList)) {
        localStorage.removeItem(`localGridContentList-${paramData.id}`);
        window.location.reload();
      }
      let listData: any = [],
        layoutData: any = [],
        resultData: any = [];
      addContentList?.forEach((item: any, index: number) => {
        const {
          id: key, size, value = [], type, yName, xName, defaultImg, fontSize,
          reverse, direction, symbol, fetchType, fetchParams, align,
          backgroundColor = 'default', barColor = 'default', progressType = 'line',
          progressSize = 8, progressSteps = 5, windowControl,
          des_bordered, des_column, des_layout, des_size, ifLocalStorage,
          CCDName, imgs_width, imgs_height, tableSize, magnifier, comparison, operationList,
          dataZoom, fontColor, interlacing, modelRotate, modelScale, modelRotateScreenshot,
          password, passwordHelp, ifShowHeader,
          basicInfoData = [{ id: guid(), name: '', value: '' }],
        } = item;
        // const id = key?.split('$$')[0];
        const gridValue = gridContentList?.filter((i: any) => i?.id === key)?.[0];
        const newGridValue = newGridContentList?.filter((i: any) => i?.id === key)?.[0];
        // socket有数据就渲染新的，没有就渲染localStorage缓存的
        const dataValue = gridValue?.[value[1]] || newGridValue?.[value[1]] || undefined;
        const parent = paramData?.flowData?.nodes?.filter((i: any) => i.id === value[0]);
        const { alias, name, ports = {} } = parent[0] || {};
        const { items = [] } = ports;
        const SecLabel = items?.filter((i: any) => i.group === 'bottom' && (i?.label?.name === value[1]))[0];

        listData = listData.concat(
          <div key={key} className={` drag-item-content-box ${backgroundColor === 'default' ? "background-ubv" : ""}`}>
            {
              ifShowHeader ?
                <div className="common-card-title-box flex-box ">
                  <TooltipDiv className="flex-box common-card-title">
                    {`${CCDName || alias || name || '无效的节点'}`}
                    <span className='title-span'>{`- ${SecLabel?.label?.alias || value[1] || ''}`}</span>
                  </TooltipDiv>
                </div>
                :
                null
            }
            <div className="card-body-box"
              style={ifShowHeader ? { height: 'calc(100% - 28px)' } : { height: '100%' }}
            >
              <div className="flex-box-center" style={{ height: '100%' }}>
                {
                  type === 'line' ?
                    <LineCharts
                      id={key}
                      setMyChartVisible={setMyChartVisible}
                      data={{
                        dataValue: dataValue || [],
                        yName, xName, dataZoom,
                      }}
                    />
                    :
                    type === 'point' ?
                      <PointCharts
                        id={key}
                        setMyChartVisible={setMyChartVisible}
                        data={{
                          dataValue: dataValue || [],
                          yName, xName, direction, symbol, dataZoom
                        }}
                      />
                      :
                      type === 'bar' ?
                        <BarCharts
                          id={key}
                          setMyChartVisible={setMyChartVisible}
                          data={{
                            dataValue: dataValue || [],
                            yName, xName, direction, align, barColor,
                          }}
                        />
                        :
                        type === 'pie' ?
                          <PieCharts
                            id={key}
                            setMyChartVisible={setMyChartVisible}
                            data={{
                              dataValue: dataValue || [],
                              fontSize
                            }}
                          />
                          :
                          type === 'table' ?
                            <TableCharts
                              id={key}
                              data={{
                                dataValue: dataValue || [],
                                yName, xName, fontSize, reverse, tableSize, interlacing,
                                des_bordered
                              }}
                            />
                            :
                            type === 'table2' ?
                              <Table2Charts
                                id={key}
                                data={{
                                  dataValue: dataValue || [],
                                  fontSize, reverse, tableSize, interlacing, des_bordered
                                }}
                              />
                              :
                              type === 'three' ?
                                <ThreeCharts
                                  id={key}
                                  data={{
                                    dataValue: dataValue || { name: "", value: [] },
                                    modelRotate, modelScale, modelRotateScreenshot,
                                    fontSize, fetchType, xName,
                                  }}
                                />
                                :
                                type === 'alert' ?
                                  <AlertCharts
                                    id={key}
                                    data={{
                                      dataValue: dataValue || [],
                                      fontSize
                                    }}
                                  />
                                  :
                                  type === 'imgs' ?
                                    <ImgsCharts
                                      id={key}
                                      data={{
                                        dataValue: dataValue || [],
                                        imgs_width, imgs_height
                                      }}
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
                                            basicInfoData, fontSize,
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
                                            type === 'buttonPassword' ?
                                              <ButtonPWCharts
                                                id={key}
                                                data={{
                                                  yName, xName, fetchType, password, passwordHelp,
                                                  fetchParams
                                                }}
                                              />
                                              :
                                              type === 'operation' ?
                                                <OperationCharts
                                                  id={key}
                                                  data={{
                                                    operationList,
                                                    dataValue,
                                                    fontSize
                                                  }}
                                                />
                                                :
                                                type === 'operation2' ?
                                                  <Operation2Charts
                                                    id={key}
                                                    data={{
                                                      operationList,
                                                      dataValue,
                                                      fontSize,
                                                      xName
                                                    }}
                                                  />
                                                  :
                                                  type === 'statistic' ?
                                                    <StatisticCharts
                                                      id={key}
                                                      data={{
                                                        dataValue, fontSize,
                                                        yName, fontColor, direction
                                                      }}
                                                    />
                                                    :
                                                    <ImgCharts
                                                      id={key}
                                                      data={{
                                                        defaultImg: !!defaultImg ? `${BASE_IP}file${(defaultImg.indexOf('\\') === 0 || defaultImg.indexOf('/') === 0) ? '' : '\\'}${defaultImg}` : '',
                                                        dataValue, windowControl,
                                                        setContentList, magnifier, comparison
                                                      }}
                                                    />
                }
              </div>
            </div>
            {
              ifCanEdit ?
                <div className="flex-box-center drag-item-content-mask common-card-title" onClick={() => {
                  var now = new Date().getTime();
                  if (now - clickTime < 300) { // 设置判断条件为300毫秒
                    // 双击事件触发的操作
                    !!defaultImg && setSelectedPath((prev: any) => ({ ...prev, value: defaultImg }));
                    setBasicInfoData(basicInfoData);
                    setEditWindowData(item);
                    setFieldsValue(Object.assign({}, item, !fontSize ? { fontSize: 12 } : {}));
                    if (!!fontColor && !!fontColor?.rgb) {
                      setFontColor(fontColor.rgb);
                    }
                    setWindowType(type);
                    if (type === 'operation') {
                      const res = paramsData?.flowData?.nodes.filter((i: any) => i.id === value[0])?.[0];
                      if (!!res) {
                        const { config = {} } = res;
                        if (!!config?.initParams && _.isObject(config?.initParams)) {
                          setSelectedNodeConfig(() => Object.entries(config.initParams)?.map((item: any) => {
                            return {
                              label: item[1]?.alias,
                              value: item[0],
                            }
                          }));
                        }
                      }
                    } else if (type === 'operation2') {
                      const res = paramsData?.flowData?.nodes.filter((i: any) => i.id === value[0])?.[0];
                      if (!!res) {
                        const { config = {} } = res;
                        if (!!config?.execParams && _.isObject(config?.execParams)) {
                          setSelectedNodeConfig(() => Object.entries(config.execParams)?.map((item: any) => {
                            return {
                              label: item[1]?.alias,
                              value: item[0],
                            }
                          }));
                        } else if (!!config?.initParams && _.isObject(config?.initParams)) {
                          setSelectedNodeConfig(() => Object.entries(config.initParams)?.map((item: any) => {
                            return {
                              label: item[1]?.alias,
                              value: item[0],
                            }
                          }));
                        }
                      }
                    }
                    setAddWindowVisible(true);
                  }
                  clickTime = now;
                }}>
                  {/* <DragOutlined className='drag-item-content-mask-icon' /> */}
                  {
                    addWindowVisible ?
                      <Popconfirm
                        title="确认删除监控窗口吗?"
                        onConfirm={() => {
                          const result = addContentList?.filter((item: any) => item.id !== key);
                          setAddContentList(result);
                          dispatch({
                            type: 'home/set',
                            payload: {
                              gridContentList: result,
                            },
                          });
                          dispatch({ type: 'home/snapshot' });
                          setParamData((prev: any) => Object.assign({}, prev, {
                            contentData: Object.assign({}, prev.contentData, { content: result }),
                          }));
                        }}
                        okText="确认"
                        cancelText="取消"
                      >
                        <DeleteOutlined className='drag-item-content-mask-icon' />
                      </Popconfirm>
                      : null
                  }
                </div>
                : null
            }
          </div>,
        );
        layoutData = layoutData.concat(size);
        if (ifLocalStorage || !_.isBoolean(ifLocalStorage)) {
          resultData = resultData.concat(
            !!dataValue ? {
              ...item,
              [value[1]]: dataValue
            } : item
          );
        }
      });
      localStorage.setItem(`localGridContentList-${paramData.id}`, JSON.stringify(resultData));

      setContentList(listData);
      setContentLayout(layoutData);
    } else {
      setContentList([]);
    }
  }, [gridContentList, addContentList, addWindowVisible]);
  // 批量启动任务
  const startProjects = (item: any, list: any, index: number, projectStatus: any) => {
    const data = projectStatus?.filter((i: any) => i.value === item.key)?.[0] || {};
    const { value, realIp, label, running } = data;
    if (!running) {
      setLoading(true);
      startFlowService(value || '', realIp).then((res: any) => {
        if (res && res.code === 'SUCCESS') {
          dispatch({
            type: 'home/set',
            payload: {
              started: true,
            },
          });
        } else {
          message.error(`${label} ${res?.msg || res?.message || '启动失败'}`);
        }
        if (index + 1 === list?.length) {
          setLoading(false);
        } else {
          setTimeout(() => {
            startProjects(list[index + 1], list, index + 1, projectStatus);
          }, 1000);
        }
      });
    } else {
      if (index + 1 === list?.length) {
        setLoading(false);
      } else {
        setTimeout(() => {
          startProjects(list[index + 1], list, index + 1, projectStatus);
        }, 1000);
      }
    }
  };
  // 批量停止任务
  const endProjects = (item: any, list: any, index: number, projectStatus: any) => {
    const data = projectStatus?.filter((i: any) => i.value === item.key)?.[0] || {};
    const { value, realIp, label, running } = data;
    if (running) {
      setLoading(true);
      stopFlowService(value || '', realIp).then((res: any) => {
        if (res && res.code === 'SUCCESS') {
          dispatch({
            type: 'home/set',
            payload: {
              started: false,
            },
          });
        } else {
          message.error(`${label} ${res?.msg || res?.message || '停止失败'}`);
        }
        if (index + 1 === list?.length) {
          setLoading(false);
        } else {
          endProjects(list[index + 1], list, index + 1, projectStatus);
        }
      });
    }
  };
  // 启动任务
  const start = () => {
    if (!ipString) return;
    setLoading(true);
    const params = Object.assign({}, _.omit(paramsData, 'edges'), {
      flowData: Object.assign({}, paramsData?.flowData, {
        edges: (paramsData?.flowData?.edges || []).filter((edge: any) => {
          return (paramsData?.flowData?.nodes || []).filter((node: any) => node.id === edge?.source?.cell || node.id === edge?.target?.cell).length;
        }),
      })
    });
    updateParams({
      id: params.id,
      data: params
    }).then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        startFlowService(ipString || '', '', params).then((res: any) => {
          if (res && res.code === 'SUCCESS') {
            message.success('任务启动成功');
            dispatch({
              type: 'home/set',
              payload: {
                started: true,
              },
            });
          } else {
            message.error(res?.msg || res?.message || '接口异常');
          }
          setLoading(false);
        });
      } else {
        message.error(res?.msg || res?.message || '接口异常');
        setLoading(false);
      }
    });
  };
  // 停止任务
  const end = () => {
    if (!ipString) return;
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
        message.error(res?.msg || res?.message || '接口异常');
      }
      setLoading(false);
    });
  };
  // 重启任务
  const reStart = () => {
    if (!ipString) return;
    setLoading(true);
    stopFlowService(ipString || '').then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        setTimeout(() => {
          start();
        }, 2000);
      } else {
        message.error(res?.msg || res?.message || '接口异常');
      }
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
  // 添加监控窗口
  const addWindow = (values?: any) => {
    const {
      value, type, size, yName, xName, fontSize, defaultImg, reverse, direction, symbol,
      fetchType, fetchParams, align, backgroundColor, barColor,
      progressType, progressSize, progressSteps, windowControl,
      des_bordered, des_column, des_layout, des_size, ifLocalStorage,
      CCDName, imgs_width, imgs_height, magnifier, comparison = false, operationList, dataZoom,
      fontColor, interlacing = false, modelRotate = false, modelScale = false, modelRotateScreenshot = false,
      password = '', passwordHelp = '', ifShowHeader = false,
    } = values;
    if (['button', 'buttonInp'].includes(type) && !!fetchParams) {
      try {
        JSON.parse(fetchParams);
      } catch (e) {
        message.error('传递参数 格式不正确');
        return;
      }
    };
    const id = `${value?.join('$$')}$$${type}`;
    if (_.isEmpty(editWindowData) && addContentList?.filter((i: any) => i.id === id).length) {
      message.error('已存在，请求改 “模块，节点，类型” 中的任一项');
      return;
    }
    let result: any = [];
    if (_.isEmpty(editWindowData)) {
      result = addContentList.concat(Object.assign({}, {
        id,
        value,
        size: { i: id, x: 16, y: 0, w: 10, h: 4, minW: 1, maxW: 100, minH: 2, maxH: 100, ...size },
        type,
        tab: activeTab,
        yName, xName, defaultImg, fontSize, reverse, direction, symbol,
        fetchType, fetchParams, align, backgroundColor, barColor,
        progressType, progressSize, progressSteps, windowControl,
        des_bordered, des_column, des_layout, des_size, ifLocalStorage,
        CCDName, imgs_width, imgs_height, magnifier, comparison, operationList, dataZoom,
        fontColor, interlacing, modelRotate, modelScale, modelRotateScreenshot,
        password, passwordHelp, ifShowHeader
      }, ['description'].includes(windowType) ? { basicInfoData } : {}));
    } else {
      result = (addContentList || [])?.map((item: any) => {
        if (item.id === `${editWindowData?.value?.join('$$')}$$${editWindowData.type}`) {
          return Object.assign({}, {
            id,
            value,
            size: Object.assign({}, editWindowData.size, { i: id }),
            type,
            tab: activeTab,
            yName, xName, defaultImg, fontSize, reverse, direction, symbol,
            fetchType, fetchParams, align, backgroundColor, barColor,
            progressType, progressSize, progressSteps, windowControl,
            des_bordered, des_column, des_layout, des_size, ifLocalStorage,
            CCDName, imgs_width, imgs_height, magnifier, comparison, operationList, dataZoom,
            fontColor, interlacing, modelRotate, modelScale, modelRotateScreenshot,
            password, passwordHelp, ifShowHeader
          }, ['description'].includes(windowType) ? { basicInfoData } : {});
        };
        return item;
      })
    };
    setAddContentList(result);
    if (paramsData.id) {
      setParamData((prev: any) => Object.assign({}, prev, {
        contentData: Object.assign({}, prev.contentData, { content: result }),
      }));
    };
    form.resetFields();
    setEditWindowData({});
    onCancel();
  };
  // 关闭添加弹框
  const onCancel = () => {
    form.resetFields();
    setEditWindowData({});
    setSelectedPath({ fileType: 'file', value: '' });
    setFieldsValue({
      value: [], type: 'img', yName: undefined, xName: undefined, fontSize: undefined, reverse: false,
      direction: 'column', symbol: 'rect', fetchType: undefined, fetchParams: undefined,
      align: 'left', backgroundColor: 'default', barColor: 'default', progressType: 'line',
      progressSize: 8, progressSteps: 5, windowControl: undefined, ifLocalStorage: undefined,
      CCDName: undefined, magnifier: false, comparison: false, operationList: [], dataZoom: 0,
      fontColor: undefined, interlacing: false, modelRotate: false, modelScale: false, modelRotateScreenshot: false,
      password: undefined, passwordHelp: undefined, ifShowHeader: false,
    });
    setWindowType('img');
    setAddWindowVisible(false);
    setFooterSelectVisible(false);
    setHomeSettingVisible('');
  };

  const homeDom: any = useMemo(() => {
    return document.getElementById('dashboardContent');
  }, [document.getElementById('dashboardContent')]);
  const homePageIcon = useMemo(() => {
    const length = Math.ceil((homeDom?.scrollHeight || 0) / (homeDom?.clientHeight || 1));
    let arr: any = [];
    for (let i = 0; i < length; i++) {
      arr = arr.concat(i + 1)
    }
    return arr;
  }, [homeDom?.clientHeight, homeDom?.clientWidth]);
  useEffect(() => {
    if (ifCanEdit) {
      // 1.获取元素
      var oBox: any = document.getElementById("home-affixs");
      var pBox: any = document.getElementById("home-affix-box");
      let top = 0,
        left = 0,
        bottom = 16,
        right = 16;
      // 2.鼠标按下事件
      oBox.onmousedown = function (ev: any) {
        // 获取鼠标相对于盒子的坐标
        // 3.鼠标移动
        document.onmousemove = function (ev: any) {
          var ev = ev || window.event;
          var x3 = ev.pageX - (window.innerWidth - paramData?.contentData?.contentSize?.width);
          var y3 = ev.pageY;
          if (pageIconPosition?.direction === 'column') {
            top = y3;
            left = x3 + 12;
          } else {
            top = y3 - 108;
            left = x3 + (homePageIcon.length * 40 + 16) / 2 - 4;
          }
          bottom = homeDom?.clientHeight - top;
          right = homeDom?.clientWidth - left;
          pBox.style.bottom = bottom + "px";
          pBox.style.right = right + "px"
        }
      }
      // 4.鼠标松开事件
      oBox.onmouseup = function (ev: any) {
        var ev = ev || window.event;
        // 获取鼠标相对于盒子的坐标
        var x2 = ev.offsetX;
        var y2 = ev.offsetY;
        if (x2 <= 0 || y2 <= 0) return;
        setPageIconPosition((prev: any) => ({ ...prev, position: { bottom, right } }));
        document.onmousemove = function () {
          // 释放鼠标
        }
      }
    };
  }, [ifCanEdit, homeDom, pageIconPosition.direction, paramData?.contentData?.contentSize?.width])

  return (
    <div className={`${styles.home}`}>
      <div className="flex-box home-body">
        <DndProvider backend={HTML5Backend}>
          {
            ifCanEdit ?
              <div className="left-panel" style={leftPanelVisible ? {} : { left: '-260px' }}>
                <div
                  className="flex-box-center left-panel-switch-button"
                  style={leftPanelVisible ? {} : { right: '-54px', transform: 'rotate(180deg)' }}
                  onClick={() => {
                    setLeftPanelVisible((prev: any) => !prev);
                  }}
                >
                  <img src={leftIcon} alt="icon" />
                </div>
                <div className="left-panel-body">
                  <div className="flex-box-justify-between left-panel-search">
                    全部
                    <span>
                      Plugins
                    </span>
                  </div>
                  <div className="left-panel-list">
                    {
                      (leftPanelData || [])?.map((panel: any, sIndex: number) => {
                        const { title, key, open, children } = panel;
                        return <div className="left-panel-item-box" key={`left-panel-item-box-${key}-${sIndex}`}>
                          <div className="flex-box left-panel-list-title" onClick={() => {
                            setLeftPanelData((prev: any) => {
                              return prev.map((pre: any) => {
                                if (pre.key === key) {
                                  return { ...pre, open: !open }
                                };
                                return pre;
                              })
                            });
                          }}>
                            <img src={leftIcon} alt="icon" className='arrow' style={open ? {} : { transform: 'rotate(180deg)' }} />
                            <img src={dirIcon} alt="icon" className='dir' />
                            {title}
                          </div>
                          {
                            open ?
                              (children || []).map((item: any, index: number) => {
                                const { value, label, icon } = item;
                                return <div key={`panel-${value}-${index}`}>
                                  {
                                    // @ts-ignore
                                    <DragSortableItem index={JSON.stringify({ ...item, key })} >
                                      <div className="flex-box left-panel-item">
                                        <div className="left-panel-item-icon">
                                          <Image src={icon} alt="logo" />
                                        </div>
                                        <div className="left-panel-item-title">
                                          {label}
                                        </div>
                                      </div>
                                    </DragSortableItem>
                                  }
                                </div>
                              })
                              : null
                          }
                        </div>
                      })
                    }
                  </div>
                </div>
              </div>
              : null
          }
          <div className="flex-box right-canvas">
            {
              // @ts-ignore
              <DropSortableItem moveCard={(dragIndex: any, hoverIndex: any, e: any) => {
                const item = JSON.parse(dragIndex);
                const { key, value, label, icon } = item;
                if ((!paramData?.contentData?.contentSize?.width || !paramData?.contentData?.contentSize?.height)) {
                  message.error("请先设置画布尺寸");
                  return;
                }
                const { width, height } = paramData?.contentData?.contentSize;
                // 画布与实际屏幕的宽度差值
                const diffWidth = (window.screen.width - width) / 2;
                // 计算实际的x,y坐标
                const x = (e.x - diffWidth) / width * 96;
                const y = e.y / height * (height / 300 * 12);
                if (key === 'main') {
                  // 添加监控窗口
                  const uuid32 = nodeList?.[0]?.key || getuid();
                  const port = nodeList?.[0]?.children?.[0]?.value;
                  addWindow({ value: [uuid32, port], type: value, size: { x, y } });
                } else if (key === 'basic') {
                  // 添加基础窗口
                  setGridHomeList((prev: any) => {
                    return prev?.map((item: any) => {
                      if (item.i === value) {
                        return {
                          ...item,
                          x, y,
                          w: 9,
                          h: 4,
                          minW: 1,
                          minH: 2,
                        };
                      }
                      return item;
                    })
                  })
                } else if (key === 'coating') {
                  // 添加涂层
                  if (paramsData.id) {
                    setParamData((prev: any) => Object.assign({}, prev, {
                      contentData: Object.assign({}, prev.contentData, {
                        contentBackground: prev?.contentData?.contentBackground === icon ? '' : icon
                      }),
                    }));
                  };
                }
              }} >
                <div className="flex-box right-canvas">
                  {
                    ifCanEdit ?
                      <div
                        className="flex-box-justify-between right-canvas-toolbar"
                        style={leftPanelVisible ? { paddingLeft: 276 } : {}}
                      >
                        <Tooltip placement="bottom" title="保存数据">
                          <Button
                            icon={<SaveOutlined className="toolbar-btn-icon" />}
                            className="toolbar-btn"
                            type="primary"
                            onClick={() => {
                              updateParams({
                                id: paramData.id,
                                data: {
                                  ...paramData,
                                  contentData: {
                                    ...paramData?.contentData,
                                    pageIconPosition,
                                    homeSetting: homeSettingData
                                  }
                                },
                              }).then((res: any) => {
                                if (res && res.code === 'SUCCESS') {
                                  history.push({ pathname: `/home` });
                                  window.location.reload();
                                } else {
                                  message.error(res?.msg || res?.message || '接口异常');
                                }
                              });
                            }}
                          />
                        </Tooltip>
                        <div className="flex-box right-canvas-toolbar-center">
                          画布尺寸:
                          <Form form={form2} scrollToFirstError style={{
                            display: 'inherit', alignItems: 'inherit', gap: 'inherit'
                          }}>
                            <Form.Item
                              name={`canvasWidth`}
                              label={""}
                              rules={[{ required: false, message: '画布宽度' }]}
                              style={{ marginBottom: 0 }}
                            >
                              <InputNumber
                                className="right-canvas-toolbar-center-input"
                              />
                            </Form.Item>
                            x
                            <Form.Item
                              name={`canvasHeight`}
                              label={""}
                              rules={[{ required: false, message: '画布高度' }]}
                              style={{ marginBottom: 0 }}
                            >
                              <InputNumber
                                className="right-canvas-toolbar-center-input"
                              />
                            </Form.Item>
                          </Form>
                          <Button onClick={() => {
                            form2.validateFields()
                              .then((values) => {
                                const { canvasWidth = '', canvasHeight = '' } = values;
                                updateParams({
                                  id: paramData.id,
                                  data: {
                                    ...paramData,
                                    contentData: {
                                      ...paramData?.contentData,
                                      home: gridHomeList,
                                      pageIconPosition,
                                      homeSetting: homeSettingData,
                                      contentSize: Object.assign({}, paramData?.contentData?.contentSize, { width: Number(canvasWidth), height: Number(canvasHeight) })
                                    }
                                  },
                                }).then((res: any) => {
                                  if (res && res.code === 'SUCCESS') {
                                    window.location.reload();
                                  } else {
                                    message.error(res?.msg || res?.message || '接口异常');
                                  }
                                });
                              });
                          }}>修改</Button>
                        </div>
                        <div></div>
                      </div>
                      : null
                  }
                  {
                    useMemo(() => {
                      return (!paramData?.contentData?.contentSize?.width || !paramData?.contentData?.contentSize?.height) ?
                        null
                        :
                        <div
                          className="flex-box right-canvas-body"
                          style={Object.assign({},
                            !!paramData?.contentData?.contentBackground ?
                              { backgroundImage: `url(${paramData?.contentData?.contentBackground})` } : {},
                            paramData?.contentData?.contentSize?.width ?
                              {
                                width: `${paramData?.contentData?.contentSize?.width}px`,
                              } : {},
                            paramData?.contentData?.contentSize?.height ?
                              {
                                height: `${paramData?.contentData?.contentSize?.height - 75}px`
                              } : {},
                          )}
                        >
                          <div className="right-canvas-body-grid">
                            {
                              !_.isEmpty(gridHomeList) ?
                                <GridLayout
                                  dragName={ifCanEdit ? '.common-card-title' : ''}
                                  list={gridList.concat(contentList)}
                                  layout={gridHomeList.concat(contentLayout)}
                                  onChange={(data: any) => {
                                    saveGridFunc(data);
                                  }}
                                />
                                : null
                            }
                          </div>
                        </div>
                    }, [
                      gridHomeList, contentLayout, gridList, contentList,
                      paramData?.contentData?.contentBackground,
                      paramData?.contentData?.contentSize,
                    ])
                  }
                  <div className="flex-box-center right-canvas-bottom-powerby">
                    &copy;技术支持: 三一重工股份有限公司-盛景智能科技（嘉兴）有限公司-UBVision团队
                  </div>
                </div>
              </DropSortableItem>
            }
          </div>
        </DndProvider>
        <NodeDetailWrapper
          className="config-panel"
          style={(addWindowVisible || !!homeSettingVisible) ? {} : { right: '-450px' }}
          title={'插件配置 PluginConfig '}
          onSave={() => {
            form.validateFields()
              .then((values) => {
                if (addWindowVisible) {
                  addWindow(values);
                } else if (!!homeSettingVisible) {
                  setHomeSettingData((prev: any) => ({ ...prev, [homeSettingVisible]: { ...prev?.[homeSettingVisible], ...values } }));
                  setHomeSettingVisible('');
                  form.resetFields();
                }
              })
              .catch((err) => {
                const { errorFields } = err;
                _.isArray(errorFields) && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
              });
          }}
          onCancel={onCancel}
        >
          {
            addWindowVisible ?
              <Form form={form} scrollToFirstError>
                <Form.Item
                  name={`CCDName`}
                  label={"监控窗口名称"}
                  rules={[{ required: false, message: '监控窗口名称' }]}
                >
                  <Input size='large' />
                </Form.Item>
                <Form.Item
                  name={'value'}
                  label="绑定节点"
                  rules={[{ required: true, message: '绑定节点' }]}
                >
                  <Cascader
                    style={{ width: '100%' }}
                    options={nodeList}
                    onChange={(val) => {
                      if (!val[0]) {
                        message.error('该节点缺少节点ID，请联系管理员');
                        return;
                      }
                      const res = paramsData?.flowData?.nodes.filter((i: any) => i.id === val[0])?.[0];
                      if (!!res) {
                        setFieldsValue({ operationList: [] });
                        const { config = {} } = res;
                        const params = ['operation'].includes(windowType) ?
                          config?.initParams :
                          ['operation2'].includes(windowType) ?
                            (!_.isEmpty(config?.execParams) ? config?.execParams : config?.initParams) :
                            null;
                        if (!!params && _.isObject(params)) {
                          setSelectedNodeConfig(() => Object.entries(params)?.map((item: any) => {
                            return {
                              label: item[1]?.alias,
                              value: item[0],
                            }
                          }));
                        } else {
                          setSelectedNodeConfig([]);
                        }
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name={'type'}
                  label="窗口类型"
                  initialValue={'img'}
                  rules={[{ required: true, message: '窗口类型' }]}
                >
                  <Select
                    style={{ width: '100%' }}
                    options={windowTypeList}
                    onChange={val => {
                      const res = paramsData?.flowData?.nodes.filter((i: any) => i.id === getFieldValue('value')?.[0])?.[0];
                      if (!!res) {
                        setFieldsValue({ operationList: [] });
                        const { config = {} } = res;
                        const params = (val === 'operation') ?
                          config?.initParams :
                          (val === 'operation2') ?
                            (!_.isEmpty(config?.execParams) ? config?.execParams : config?.initParams) :
                            null;
                        if (!!params && _.isObject(params)) {
                          setSelectedNodeConfig(() => Object.entries(params)?.map((item: any) => {
                            return {
                              label: item[1]?.alias,
                              value: item[0],
                            }
                          }));
                        } else {
                          setSelectedNodeConfig([]);
                        }
                      }
                      setWindowType(val);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="ifShowHeader"
                  label="显示头部"
                  initialValue={false}
                  valuePropName="checked"
                >
                  <Switch />
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
                      <Form.Item
                        name="magnifier"
                        label="开启放大镜"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      <Form.Item
                        name="comparison"
                        label="开启对比图"
                        valuePropName="checked"
                      >
                        <Switch />
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
                      {
                        ['table'].includes(windowType) ?
                          null
                          :
                          <Form.Item
                            name={`dataZoom`}
                            label={'展示最新的'}
                            rules={[{ required: false, message: '展示最新的' }]}
                            initialValue={0}
                          >
                            <InputNumber min={0} />
                          </Form.Item>
                      }
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
                    <Fragment>
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
                    </Fragment>
                    : null
                }
                {
                  ['table2', 'table'].includes(windowType) ?
                    <Fragment>
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
                      <Form.Item
                        name="interlacing"
                        label="隔行换色"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      <Form.Item
                        name="des_bordered"
                        label="是否展示边框"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                    </Fragment>
                    : null
                }
                {
                  ['imgs'].includes(windowType) ?
                    <Fragment>
                      <Form.Item
                        name={`imgs_width`}
                        label={'小图的宽'}
                        rules={[{ required: true, message: '小图的宽' }]}
                        initialValue={150}
                      >
                        <InputNumber />
                      </Form.Item>
                      <Form.Item
                        name={`imgs_height`}
                        label={'小图的高'}
                        rules={[{ required: true, message: '小图的高' }]}
                        initialValue={150}
                      >
                        <InputNumber />
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
                  ['buttonPassword'].includes(windowType) ?
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
                      <Form.Item
                        name={`password`}
                        label={"设置密码"}
                        rules={[{ required: true, message: '设置密码' }]}
                      >
                        <Input size='large' />
                      </Form.Item>
                      <Form.Item
                        name={`passwordHelp`}
                        label={"密码提示"}
                        rules={[{ required: false, message: '密码提示' }]}
                      >
                        <Input size='large' />
                      </Form.Item>
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
                      <Form.Item
                        name="des_bordered"
                        label="是否展示边框"
                        valuePropName="checked"
                      >
                        <Switch />
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
                {
                  ['three'].includes(windowType) ?
                    <Fragment>
                      <Form.Item
                        name="modelRotate"
                        label="开启模型旋转"
                        initialValue={false}
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      <Form.Item
                        name="modelScale"
                        label="开启模型缩放"
                        initialValue={false}
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      <Form.Item
                        name="modelRotateScreenshot"
                        label="开启自动旋转截图"
                        initialValue={false}
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      {
                        !!form.getFieldValue('modelRotateScreenshot') ?
                          <Fragment>
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
                          </Fragment>
                          : null
                      }
                    </Fragment>
                    : null
                }
                {
                  ['operation', 'operation2'].includes(windowType) ?
                    <Fragment>
                      <Form.Item
                        name={`operationList`}
                        label={"操作项"}
                        rules={[{ required: true, message: '操作项' }]}
                      >
                        <Select
                          style={{ width: '100%' }}
                          mode="multiple"
                          options={selectedNodeConfig}
                        />
                      </Form.Item>
                      {
                        ['operation2'].includes(windowType) ?
                          <Form.Item
                            name={`xName`}
                            label={"接口地址"}
                            rules={[{ required: true, message: '接口地址' }]}
                          >
                            <Input size='large' />
                          </Form.Item>
                          : null
                      }
                    </Fragment>
                    : null
                }
                {
                  ['statistic'].includes(windowType) ?
                    <Fragment>
                      <Form.Item
                        name={`yName`}
                        label={"标题名称"}
                        rules={[{ required: true, message: '标题名称' }]}
                      >
                        <Input size='large' />
                      </Form.Item>
                      <Form.Item
                        name={`direction`}
                        label={'对齐方向'}
                        initialValue={'center'}
                        rules={[{ required: true, message: '对齐方向' }]}
                      >
                        <Select
                          style={{ width: '100%' }}
                          options={[
                            {
                              value: 'flex-start',
                              label: '左对齐',
                            },
                            {
                              value: 'center',
                              label: '居中',
                            },
                            {
                              value: 'flex-end',
                              label: '右对齐',
                            }
                          ]}
                        />
                      </Form.Item>
                      <Form.Item
                        name={`fontColor`}
                        label={'内容颜色'}
                        rules={[{ required: false, message: '内容颜色' }]}
                      >
                        <ChromePicker
                          color={fontColor}
                          onChange={(value: any) => {
                            const { rgb } = value;
                            setFontColor(rgb);
                          }}
                        />
                      </Form.Item>
                    </Fragment>
                    : null
                }
                <Form.Item
                  name={'fontSize'}
                  label="字号"
                  initialValue={24}
                  rules={[{ required: true, message: '字号' }]}
                >
                  <InputNumber
                    min={12}
                    placeholder="12"
                  />
                </Form.Item>
                <Form.Item
                  name="ifLocalStorage"
                  label="开启缓存"
                  initialValue={true}
                  valuePropName="checked"
                  style={{ marginBottom: 0 }}
                >
                  <Switch />
                </Form.Item>
              </Form>
              :
              !!homeSettingVisible ?
                <Form form={form} scrollToFirstError initialValues={homeSettingData[homeSettingVisible]}>
                  {
                    homeSettingVisible === 'slider-1' ?
                      <Form.Item
                        name="des_column"
                        label="列数"
                      >
                        <InputNumber />
                      </Form.Item>
                      :
                      <Form.Item
                        name={'fontSize'}
                        label="字号"
                        rules={[{ required: true, message: '字号' }]}
                      >
                        <InputNumber
                          min={12}
                        />
                      </Form.Item>
                  }
                  <Form.Item
                    name="ifShowHeader"
                    label="显示头部"
                    initialValue={false}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Form>
                : null
          }
        </NodeDetailWrapper>
      </div>
      <div className="flex-box home-footer">
        {
          started ?
            <div className="home-footer-item-box success">
              检测中
            </div>
            :
            <div className="home-footer-item-box success" onClick={() => {
              ifCanEdit && setFooterSelectVisible(true);
            }}>
              未启动
            </div>
        }
        {
          useMemo(() => {
            return !!footerData && (Object.entries(footerData) || [])?.map((item: any, index: number) => {
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
          }, [started, footerData, footerSelectList])
        }
      </div>
      <div
        className={`home-affix-box flex-box`}
        id={`home-affix-box`}
        style={{
          flexDirection: pageIconPosition?.direction || 'column',
          bottom: pageIconPosition?.position?.bottom > 0 ? pageIconPosition?.position?.bottom : 0,
          right: pageIconPosition?.position?.right > 0 ? pageIconPosition?.position?.right : 0
        }}
      >
        {
          ifCanEdit ?
            <SwapOutlined className='home-page-affix-direction' onClick={(e) => {
              setPageIconPosition((prev: any) => ({ ...prev, direction: prev.direction === 'column' ? 'row' : 'column' }))
            }} />
            : null
        }
        <div
          className={`flex-box`}
          id={`home-affixs`}
          style={{
            flexDirection: pageIconPosition?.direction,
          }}
        >
          {
            homePageIcon.map((item: any, index: number) => {
              return <div className="flex-box-center home-page-affix" key={`page-icon-${index}`}
                onClick={(e) => {
                  if (ifCanEdit) return;
                  homeDom?.scrollTo({ top: (homeDom?.clientHeight || 1) * index });
                }}
              >
                {index + 1}
              </div>
            })
          }
        </div>
      </div>
      {
        // footer节点显示选择
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
      {
        // 资源选择器
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
        // 监控列表-添加监控方案
        !!addItemsVisible ?
          <Modal
            title={`添加方案窗口`}
            wrapClassName="history-window-modal"
            centered
            width="50vw"
            open={!!addItemsVisible}
            // maskClosable={false}
            onOk={() => {
              validateFields().then(values => {
                const { value } = values;
                updateParams({
                  id: paramData.id,
                  data: {
                    ...paramData,
                    contentData: {
                      ...paramData?.contentData,
                      ipList: value
                    }
                  },
                }).then((res: any) => {
                  if (res && res.code === 'SUCCESS') {
                    setInitialState((preInitialState: any) => ({
                      ...preInitialState,
                      params: res.data
                    }));
                  } else {
                    message.error(res?.msg || res?.message || '接口异常');
                  }
                });
                setAddItemsVisible(false);
                form.resetFields();
              });
            }}
            onCancel={() => {
              setAddItemsVisible(false);
              form.resetFields();
            }}
            getContainer={false}
            destroyOnClose={true}
          >
            <Form form={form} scrollToFirstError>
              <Form.Item
                name={'value'}
                label="绑定方案"
                rules={[{ required: true, message: '绑定方案' }]}
                initialValue={paramData?.contentData?.ipList}
              >
                <Select
                  style={{ width: '100%' }}
                  size="large"
                  mode="multiple"
                  labelInValue
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  options={(projectStatus || [])?.map((item: any) => {
                    return {
                      ...item,
                      // disabled: (paramData?.contentData?.ipList.map((i: any) => i.key) || []).includes(item.value),
                    }
                  })}
                  placeholder="方案ID"
                />
              </Form.Item>

            </Form>
          </Modal>
          : null
      }
      {
        // 图表放大预览
        (_.isObject(myChartVisible) && !_.isEmpty(myChartVisible)) ?
          <ChartPreviewModal
            option={myChartVisible}
            onCancel={() => setMyChartVisible(null)}
          />
          : null
      }
      {
        // 日志放大预览
        !!logDataVisible ?
          <LogPreviewModal
            type={logDataVisible}
            onCancel={() => setLogDataVisible('')}
          />
          : null
      }
    </div >
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

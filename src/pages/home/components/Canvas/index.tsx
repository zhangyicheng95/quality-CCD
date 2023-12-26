import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.module.less';
import {
  Button, message, Modal, Badge, Cascader, Form, Tooltip, Popconfirm,
  Select, Input, Tree, InputNumber, Switch, Image,
} from 'antd';
import * as _ from 'lodash';
import {
  BASE_IP, btnFetch, startFlowService,
  stopFlowService, touchFlowService, updateParams,
} from '@/services/api';
import GridLayout from '@/components/GridLayout';
import {
  AndroidOutlined, CloseOutlined, CompressOutlined, DeleteOutlined,
  LoadingOutlined, MinusOutlined, PlayCircleOutlined, PlusOutlined, ReloadOutlined,
  SaveOutlined, SettingOutlined, SwapOutlined,
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
  basicWindowList, windowTypeList,
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
import Table3Charts from './components/Table3Charts';
import TreeCharts from './components/TreeCharts';
import Table4Charts from './components/Table4Charts';
import TableEditCharts from './components/TableEditCharts';
import PlatFormCharts from './components/PlatFormCharts';
import ModalCharts from './components/ModalCharts';
import ImgButtonCharts from './components/ImgButtonCharts';

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
  const [colorSelector, setColorSelector] = useState<any>({
    fontColor: '#FFFFFF',
    backgroundColor: 'default',
    overallBackgroundColor: '',
  });
  const [addWindowVisible, setAddWindowVisible] = useState('');
  const [overallVisible, setOverallVisible] = useState(false);
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
    "slider-4": { fontSize: 20, ifShowHeader: false, show_start_end: false },
    "footer-1": { fontSize: 14, ifShowHeader: false, logSize: 50 },
    "footer-2": { fontSize: 20, ifShowHeader: false, logSize: 50 },
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
    // {
    //   key: 'coating',
    //   title: '背景涂层',
    //   open: true,
    //   children: simulatedCoatingList
    // }
  ]);
  const [tabNum, setTabNum] = useState(0);

  const ifCanEdit = useMemo(() => {
    return location.hash.indexOf('edit') > -1;
  }, [location.hash, paramData]);

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
          {
            process.env.NODE_ENV === 'development' ?
              <Button
                className="flex-box btn"
                style={{ width: `${100 / (homeSettingData?.['slider-1']?.des_column || 1)}%` }}
                icon={<AndroidOutlined className="btn-icon" />}
                type="link"
                onClick={() => {
                  // dispatch({
                  //   type: 'home/set',
                  //   payload: {
                  //     gridContentList: [
                  //       { "id": "96c525f8-fada-4512-8b44-7e8995278e63$$filepath$$three", "value": ["96c525f8-fada-4512-8b44-7e8995278e63", "filepath"], "filepath": { "name": "models/output.ply", "value": [{}, {}] }, "size": { "i": "96c525f8-fada-4512-8b44-7e8995278e63$$filepath$$three", "x": 7, "y": 3, "w": 36, "h": 35, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 }, "type": "three", "tab": "1", "fontSize": 12, "backgroundColor": "default", "ifLocalStorage": true, "comparison": false, "interlacing": false, "modelRotate": false, "modelScale": false },
                  //       { "id": "d3b8e17c-3ad2-4e78-a8e9-b3153490bcbb$$frame$$img", "value": ["d3b8e17c-3ad2-4e78-a8e9-b3153490bcbb", "frame"], "size": { "i": "d3b8e17c-3ad2-4e78-a8e9-b3153490bcbb$$frame$$img", "x": 43, "y": 3, "w": 30, "h": 35, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 }, "type": "img", "tab": "1", "fontSize": 12, "backgroundColor": "default", "ifLocalStorage": true, "magnifier": false },
                  //       { "id": "d3b8e17c-3ad2-4e78-a8e9-b3153490bcbb$$cam_name$$pie", "value": ["d3b8e17c-3ad2-4e78-a8e9-b3153490bcbb", "cam_name"], "size": { "i": "d3b8e17c-3ad2-4e78-a8e9-b3153490bcbb$$cam_name$$pie", "x": 73, "y": 3, "w": 23, "h": 35, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 }, "type": "pie", "tab": "1", "fontSize": 12, "backgroundColor": "default", "ifLocalStorage": true }
                  //     ],
                  //   },
                  // });
                  touchFlowService()
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
            <div className="flex-box-center drag-item-content-mask common-card-title" onDoubleClick={() => {
              // 双击事件触发的操作
              if (!!addWindowVisible || !!homeSettingVisible) {
                setAddWindowVisible("");
                setHomeSettingVisible("");
              }
              setFieldsValue({ des_column: homeSettingData?.['slider-1']?.des_column || 1 });
              setHomeSettingVisible('slider-1');
            }}>
              {/* <DragOutlined className='drag-item-content-mask-icon' /> */}
              {
                !!homeSettingVisible ?
                  <Popconfirm
                    title="确认删除监控窗口吗?"
                    onConfirm={() => deleteBasic('slider-1')}
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
            (!!paramData?.contentData?.ipList?.length && !!homeSettingData?.['slider-4']?.show_start_end) ?
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
                  (localStorage.getItem('ipString') === key || !ifCanEdit) ?
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
            <div className="flex-box-center drag-item-content-mask common-card-title" onDoubleClick={() => {
              // 双击事件触发的操作
              if (!!addWindowVisible || !!homeSettingVisible) {
                setAddWindowVisible("");
                setHomeSettingVisible("");
              }
              setFieldsValue({ fontSize: homeSettingData?.['slider-4']?.fontSize || 20 });
              setHomeSettingVisible('slider-4');
            }}>
              {/* <DragOutlined className='drag-item-content-mask-icon' /> */}
              {
                !!homeSettingVisible ?
                  <Popconfirm
                    title="确认删除监控窗口吗?"
                    onConfirm={() => deleteBasic('slider-4')}
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
              __html: _.isString(logStr) ? logStr : logStr?.slice(homeSettingData['footer-1']?.logSize || 50).join('<br />'),
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
            <div className="flex-box-center drag-item-content-mask common-card-title" onDoubleClick={() => {
              // 双击事件触发的操作
              if (!!addWindowVisible || !!homeSettingVisible) {
                setAddWindowVisible("");
                setHomeSettingVisible("");
              }
              setFieldsValue({ fontSize: homeSettingData?.['footer-1']?.fontSize || 14 });
              setHomeSettingVisible('footer-1');
            }}>
              {/* <DragOutlined className='drag-item-content-mask-icon' /> */}
              {
                !!homeSettingVisible ?
                  <Popconfirm
                    title="确认删除监控窗口吗?"
                    onConfirm={() => deleteBasic('footer-1')}
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
            {errorData?.slice(homeSettingData['footer-2']?.logSize || 50)?.map((log: any, index: number) => {
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
            <div className="flex-box-center drag-item-content-mask common-card-title" onDoubleClick={() => {
              // 双击事件触发的操作
              if (!!addWindowVisible || !!homeSettingVisible) {
                setAddWindowVisible("");
                setHomeSettingVisible("");
              }
              setFieldsValue({ fontSize: homeSettingData?.['error']?.fontSize || 20 });
              setHomeSettingVisible('footer-2');
            }}>
              {/* <DragOutlined className='drag-item-content-mask-icon' /> */}
              {
                !!homeSettingVisible ?
                  <Popconfirm
                    title="确认删除监控窗口吗?"
                    onConfirm={() => deleteBasic('footer-2')}
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
  // 删除基础组件
  const deleteBasic = (type: string) => {
    const home = gridHomeList?.map((item: any) => {
      if (item.i === type) {
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
    setHomeSettingVisible('');
  };
  // 保存布局状态
  const saveGridFunc = (data: any) => {
    let home: any = [],
      content: any = [];

    data?.forEach((item: any) => {
      if (['slider-1', 'slider-2', 'slider-3', 'slider-4', 'content', 'footer-1', 'footer-2'].includes(item.i)) {
        home = home.concat(Object.assign({}, item, {
          maxW: 100,
          maxH: 100
        },
          item.w > 0 ? {
            minW: 1,
            minH: 2,
          } : {
            minW: 0,
            minH: 0,
          })
        );
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
        { "i": "slider-1", "x": 0, "y": 0, "w": 9, "h": 8, "minW": 1, "maxW": 100, "minH": 2, "maxH": 100 },
        { "i": "slider-2", "x": 0, "y": 8, "w": 0, "h": 0, "minW": 0, "maxW": 100, "minH": 0, "maxH": 100 },
        { "i": "slider-3", "x": 0, "y": 0, "w": 0, "h": 0, "minW": 0, "maxW": 100, "minH": 0, "maxH": 100 },
        { "i": "slider-4", "x": 7, "y": 0, "w": 0, "h": 0, "minW": 0, "maxW": 100, "minH": 0, "maxH": 100 },
        { "i": "footer-1", "x": 7, "y": 8, "w": 0, "h": 0, "minW": 0, "maxW": 100, "minH": 0, "maxH": 100 },
        { "i": "footer-2", "x": 7, "y": 0, "w": 0, "h": 0, "minW": 0, "maxW": 100, "minH": 0, "maxH": 100 }
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
    if (!contentSize?.width || !contentSize?.height) {
      newParams = Object.assign({}, newParams, {
        contentData: Object.assign({}, newParams?.contentData, {
          contentSize: { width: 1600, height: 900 },
        })
      });
    }
    // if (!_.isBoolean(contentData?.autoSize)) {
    //   newParams = Object.assign({}, newParams, {
    //     contentData: Object.assign({}, newParams?.contentData, {
    //       autoSize: true,
    //     })
    //   });
    // }
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
          autoSize: _.isBoolean(contentData?.autoSize) ? contentData?.autoSize : true,
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
      setInitialState((preInitialState: any) => ({
        ...preInitialState,
        params: newParams,
      }));
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
          autoSize: _.isBoolean(contentData?.autoSize) ? contentData?.autoSize : true,
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
        canvasWidth: newParams?.contentData?.contentSize?.width,
        canvasHeight: newParams?.contentData?.contentSize?.height,
      });
    };

    // if (selfStart) {
    //   // 开机自启动-延时15秒启动
    //   if (updateTimer.current) {
    //     clearTimeout(updateTimer.current);
    //   }
    //   updateTimer.current = setTimeout(() => {
    //     start();
    //   }, 15000);
    // }

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
  // useEffect(() => {
  //   const { errorSelfStart = false } = paramsData;
  //   if (!!started && !!errorSelfStart && !!errorData && !!errorData.length) {
  //     console.log('异常重启');
  //     message.warning('异常报错，自动重启');
  //     // dispatch({
  //     //   type: 'home/set',
  //     //   payload: {
  //     //     errorData: []
  //     //   },
  //     // });
  //     // 异常自重启-延时10秒启动
  //     if (updateTimer.current) {
  //       clearTimeout(updateTimer.current);
  //     };
  //     updateTimer.current = setTimeout(() => {
  //       reStart();
  //     }, 10000);
  //   }
  // }, [started, errorData]);
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
          reverse, direction, symbol, fetchType, ifFetch, fetchParams, align,
          backgroundColor = 'default', barColor = 'default', progressType = 'line',
          progressSize = 8, progressSteps = 5, windowControl,
          des_bordered, des_column, des_layout, des_size, ifLocalStorage,
          CCDName, imgs_width, imgs_height, tableSize, magnifier, comparison, operationList,
          dataZoom, fontColor, interlacing, modelRotate, modelScale, modelRotateScreenshot,
          password, passwordHelp, ifShowHeader, ifShowColorList, headerBackgroundColor,
          basicInfoData = [{ id: guid(), name: '', value: '' }], ifNeedClear, operationLock,
          ifUpdateProject, magnifierSize, listType, valueColor, markNumber,
          markNumberLeft, markNumberTop, blockType, blockTypeLines, modelUpload,
          xColumns, yColumns, platFormOptions, ifFetchParams
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
          <div
            key={key}
            className={`drag-item-content-box ${backgroundColor === 'default' ? "background-ubv" : ""}`}
          // style={(!!backgroundColor && !!backgroundColor?.rgb) ? { backgroundColor: `rgba(${backgroundColor.rgb.r},${backgroundColor.rgb.g},${backgroundColor.rgb.b},${backgroundColor.rgb.a})` } : {}}
          >
            {
              ifShowHeader ?
                <div className="common-card-title-box flex-box">
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
                                des_bordered, headerBackgroundColor, valueColor
                              }}
                            />
                            :
                            type === 'table2' ?
                              <Table2Charts
                                id={key}
                                data={{
                                  dataValue: dataValue || [],
                                  fontSize, reverse, tableSize, interlacing, des_bordered,
                                  headerBackgroundColor, valueColor
                                }}
                              />
                              :
                              type === 'table3' ?
                                <Table3Charts
                                  id={key}
                                  data={{
                                    dataValue: dataValue || [],
                                    fontSize, reverse, tableSize, interlacing, des_bordered,
                                    headerBackgroundColor, valueColor
                                  }}
                                />
                                :
                                type === 'table4' ?
                                  <Table4Charts
                                    id={key}
                                    data={{
                                      dataValue: dataValue || [],
                                      fontSize, reverse, tableSize, interlacing, des_bordered,
                                      headerBackgroundColor, valueColor
                                    }}
                                  />
                                  :
                                  type === 'table5' ?
                                    <TableEditCharts
                                      id={key}
                                      data={{
                                        dataValue: dataValue || [],
                                        fontSize, xColumns, yColumns, yName, des_bordered,
                                      }}
                                    />
                                    :
                                    type === 'tree' ?
                                      <TreeCharts
                                        id={key}
                                        data={{
                                          dataValue: dataValue || [],
                                          fontSize,
                                        }}
                                      />
                                      :
                                      type === 'three' ?
                                        <ThreeCharts
                                          id={key}
                                          data={{
                                            dataValue: dataValue || { name: "", value: [] },
                                            modelRotate, modelScale, modelRotateScreenshot,
                                            fontSize, fetchType, xName, ifShowColorList,
                                            modelUpload,
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
                                                      let params = '';
                                                      if (!_.isUndefined(value) && !_.isNull(value) && (_.isString(value) && !!value)) {
                                                        try {
                                                          params = JSON.parse(value)
                                                        } catch (e) {
                                                          console.log('按钮传递参数格式不对:', e);
                                                          params = '';
                                                        }
                                                      }
                                                      btnFetch(fetchType, xName, params);
                                                    }}
                                                  >
                                                    {yName || '按钮'}
                                                  </Button>
                                                  :
                                                  type === 'buttonInp' ?
                                                    <ButtonCharts
                                                      id={key}
                                                      data={{
                                                        yName, xName, fetchType, ifNeedClear
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
                                                              operationList, dataValue,
                                                              fontSize, xName,
                                                              operationLock, ifUpdateProject,
                                                              listType, blockType, blockTypeLines
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
                                                            type === 'platForm' ?
                                                              <PlatFormCharts
                                                                id={key}
                                                                data={{
                                                                  dataValue, fontSize, fetchType, xName,
                                                                  ifFetch, platFormOptions
                                                                }}
                                                              />
                                                              :
                                                              type === 'modal' ?
                                                                <ModalCharts
                                                                  id={key}
                                                                  data={{
                                                                    dataValue, fontSize, yName, fetchType, xName, ifFetch,
                                                                    ifFetchParams,
                                                                  }}
                                                                />
                                                                :
                                                                type === 'imgButton' ?
                                                                  <ImgButtonCharts
                                                                    id={key}
                                                                    data={{
                                                                      dataValue, fontSize, windowControl,
                                                                      addContentList, xColumns, fetchType, xName,
                                                                    }}
                                                                  />
                                                                  :
                                                                  <ImgCharts
                                                                    id={key}
                                                                    data={{
                                                                      defaultImg: !!defaultImg ? `${BASE_IP}file${(defaultImg.indexOf('\\') === 0 || defaultImg.indexOf('/') === 0) ? '' : '\\'}${defaultImg}` : '',
                                                                      dataValue, markNumber, markNumberLeft, markNumberTop,
                                                                      magnifier, comparison, magnifierSize, ifShowHeader
                                                                    }}
                                                                  />
                }
              </div>
            </div>
            {
              ifCanEdit ?
                <div
                  style={type === 'table2' ? { height: 'calc(100% - 38px)', marginTop: 38 } : {}}
                  className="flex-box-center drag-item-content-mask common-card-title"
                  onDoubleClick={() => {
                    console.log(item);
                    // 双击事件触发的操作
                    if (!!addWindowVisible || !!homeSettingVisible) {
                      setAddWindowVisible("");
                      setHomeSettingVisible("");
                    }
                    !!defaultImg && setSelectedPath((prev: any) => ({ ...prev, value: defaultImg }));
                    setBasicInfoData(basicInfoData);
                    setEditWindowData(Object.assign({}, item,
                      !!item?.xColumns?.length ? {} : type === 'table5' ? {
                        xColumns: [
                          { id: '28dj46vh', xName: '模组,参数名称,Q1,Q2,Q3,Q4,Q5,Q6,Q7,Q8,Q9,Q10,Q11,Q12,Q13,Q14,Q15,Q16,Q17,Q18,Q19,Q20' },
                          { id: 'sjci46d8', xName: ",,电阻(0.7-1.2),电阻(1.2-1.7),电阻(0.3-0.7),电阻(1.7-2.1),崩边,脏污,色差,孔洞,B线痕,BTTV,翘曲,B厚薄,C线痕,CTTV,电阻率,尺寸不良,隐裂" },
                        ]
                      } : {},
                      !!item?.yColumns?.length ? {} : type === 'table5' ? {
                        yColumns: [
                          { id: 's9d8c7v6', yName: "尺寸,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3D,,,,,,,,,,,,侧边,,,,,,隐裂,,,,,,脏污,,,,,,电阻率,,,," },
                          { "id": "a74eda0c", "yName": "边长(水平竖直中边长)", "type": "range", "xName": "edge_length" }, { "id": "6d9265db", "yName": "倒角长度", "type": "range", "xName": "chamfer_length" }, { "id": "ec099de0", "yName": "倒角投影", "type": "range", "xName": "chamfer_projection" }, { "id": "46f94883", "yName": "倒角对角线", "type": "range", "xName": "chamfer_diagonal" }, { "id": "1e463929", "yName": "缺角最大长度", "type": "range", "xName": "notch_max_length" }, { "id": "95fd2d22", "yName": "缺角最大深度", "type": "range", "xName": "notch_max_depth" }, { "id": "6f1c9952", "yName": "缺角个数", "type": "range", "xName": "notch_num" }, { "id": "738ab362", "yName": "最小垂直度", "type": "range", "xName": "perpendicularity_min" }, { "id": "157ab87a", "yName": "最大垂直度", "type": "range", "xName": "perpendicularity_max" }, { "id": "5715f99b", "yName": "边长（最大最小边长）", "type": "range", "xName": "edge_length_max_min" }, { "id": "75a80b1d", "yName": "平均厚度", "type": "range", "xName": "thickness_average" }, { "id": "4d33c94f", "yName": "厚度偏差", "type": "range", "xName": "ttv" }, { "id": "71e07ccd", "yName": "线痕最大值", "type": "range", "xName": "line_mark" }, { "id": "93edb8c9", "yName": "翘曲度", "type": "range", "xName": "warp" }, { "id": "bdb41a29", "yName": "崩边个数", "type": "range", "xName": "chip_num" }, { "id": "128d6a86", "yName": "硅落个数", "type": "range", "xName": "silicon_drop_num" }, { "id": "7142b5ef", "yName": "有无隐裂", "type": "bool", "xName": "hidden_crack" }, { "id": "e4650f5f", "yName": "有无硬质点", "type": "bool", "xName": "hard_point" }, { "id": "661eee10", "yName": "有无孔洞_隐裂", "type": "bool", "xName": "hidden_crack_hole" }, { "id": "8cbbea83", "yName": "有无脏污", "type": "bool", "xName": "dirty" }, { "id": "152502b5", "yName": "有无色差", "type": "bool", "xName": "color_diff" }, { "id": "7453d1de", "yName": "有无硅落", "type": "bool", "xName": "silicon_drop" }, { "id": "6f686c2c", "yName": "电阻率平均值", "type": "range", "xName": "resistivity" }, { "id": "9d764a6b", "yName": "PN型", "type": "bool", "xName": "PN" }
                        ]
                      } : {}
                    ));
                    setFieldsValue(Object.assign(
                      {},
                      item,
                      !fontSize ? { fontSize: 12 } : {},
                      (!!backgroundColor && !!backgroundColor?.rgb) ? { backgroundColor: backgroundColor } : {},
                      type === 'platForm' ? {
                        platFormOptions: !!platFormOptions ? platFormOptions : JSON.stringify({
                          "左上水平隔膜": {
                            "灰度差": { "name": "灰度差", "alias": "灰度差", "require": true, "default": 15, "value": 15, "type": "int", "description": "边界变化的灰度差", "widget": { "type": "InputNumber", "max": 255, "min": 0, "step": 1 } }, "灰度合并像素": { "name": "灰度合并像素", "alias": "灰度合并像素", "require": true, "default": 2, "value": 2, "type": "int", "description": "边界变化的灰度合并像素", "widget": { "type": "InputNumber", "max": 5, "min": 1, "step": 1 } }, "亮度变化方向": { "name": "亮度变化方向", "alias": "亮度变化方向", "require": true, "default": 2, "value": 2, "type": "List[string]", "description": "边界找线亮度变化方向, 1为亮到暗, 2为暗到亮", "widget": { "type": "Select", "options": [{ "label": "1-亮到暗", "value": 1 }, { "label": "2-暗到亮", "value": 2 }] } }, "直线度": { "name": "直线度", "alias": "直线度", "require": true, "default": 3, "value": 3, "type": "int", "description": "直线度要求，值越小，线越直", "widget": { "type": "InputNumber", "max": 100, "min": 1, "step": 1 } }, "降噪滤波核": { "name": "降噪滤波核", "alias": "降噪滤波核", "require": true, "default": 5, "value": 5, "type": "int", "description": "去噪滤波核大小", "widget": { "type": "InputNumber", "max": 21, "min": 1, "step": 1 } }, "找线方向下采样倍数": { "name": "找线方向下采样倍数", "alias": "找线方向下采样倍数", "require": true, "default": 8, "value": 8, "type": "int", "description": "区域下采样倍数，提高计算速度", "widget": { "type": "InputNumber", "max": 16, "min": 2, "step": 2 } }, "垂直找线方向下采样倍数": { "name": "垂直找线方向下采样倍数", "alias": "垂直找线方向下采样倍数", "require": true, "default": 2, "value": 2, "type": "int", "description": "区域下采样倍数，提高计算速度", "widget": { "type": "InputNumber", "max": 16, "min": 2, "step": 2 } }, "搜索框个数": { "name": "搜索框个数", "alias": "搜索框个数", "require": true, "default": 15, "value": 15, "type": "int", "description": "搜索框个数", "widget": { "type": "InputNumber", "max": 1000, "min": 3, "step": 1 } }, "搜索框宽度": { "name": "搜索框宽度", "alias": "搜索框宽度", "require": true, "default": 6, "value": 6, "type": "int", "description": "搜索框宽度", "widget": { "type": "InputNumber", "max": 1000, "min": 3, "step": 1 } }, "找线方法": { "name": "找线方法", "alias": "找线方法", "require": true, "default": "卡尺找线", "value": "卡尺找线", "type": "List[string]", "description": "找线方法，1-卡尺找线，2-EDLines找线", "widget": { "type": "Select", "options": [{ "label": "卡尺找线", "value": "卡尺找线" }, { "label": "EDLine找线", "value": "EDLine找线" }] } }
                          }
                        })
                      } : {}
                    ));

                    setColorSelector((prev: any) => ({
                      ...prev,
                      ...((!!fontColor && !!fontColor?.rgb) ? { fontColor: fontColor.rgb } : {}),
                      ...((!!backgroundColor && !!backgroundColor?.rgb) ? { backgroundColor: backgroundColor?.rgb } : {})
                    }));

                    setWindowType(type);
                    if (type === 'operation2') {
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
                    } else {
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
                    }
                    setAddWindowVisible(key);
                  }}
                >
                  {/* <DragOutlined className='drag-item-content-mask-icon' /> */}
                  {
                    (addWindowVisible === key) ?
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
                          setAddWindowVisible("");
                          setHomeSettingVisible("");
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
        layoutData = layoutData.concat((type === 'modal' && !ifCanEdit) ? { ...size, w: 0, minW: 0, h: 0, minH: 0 } : size);

        if (!!ifLocalStorage) {
          resultData = resultData.concat(
            !!dataValue ? {
              ...item,
              [value[1]]: type === 'three' ? _.omit(dataValue, 'action') : dataValue
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
      const logModal = gridHomeList?.filter((item: any) => item.i === 'footer-1')[0];
      // 没有日志窗口，就不开启日志的socket
      if (!!logModal && logModal?.w) {
        socketLogListen.listen(dispatch, logThrottleAndMerge);
      }
      socketErrorListen.listen(dispatch, errorThrottleAndMerge);
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
      fetchType, ifFetch, fetchParams, align, backgroundColor, barColor,
      progressType, progressSize, progressSteps, windowControl,
      des_bordered, des_column, des_layout, des_size, ifLocalStorage,
      CCDName, imgs_width, imgs_height, magnifier, comparison = false, operationList, dataZoom,
      fontColor, interlacing = false, modelRotate = false, modelScale = false, modelRotateScreenshot = false,
      password = '', passwordHelp = '', ifShowHeader = false, ifShowColorList = false,
      headerBackgroundColor = 'default', ifNeedClear, operationLock, ifUpdateProject,
      magnifierSize, logSize, listType, valueColor, markNumber = false, markNumberLeft, markNumberTop,
      blockType, blockTypeLines, modelUpload, xColumns, yColumns, platFormOptions, ifFetchParams
    } = values;
    if (['button', 'buttonInp', 'buttonPassword'].includes(type) && !!fetchParams) {
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
        fetchType, ifFetch, fetchParams, align, backgroundColor, barColor,
        progressType, progressSize, progressSteps, windowControl,
        des_bordered, des_column, des_layout, des_size, ifLocalStorage,
        CCDName, imgs_width, imgs_height, magnifier, comparison, operationList, dataZoom,
        fontColor, interlacing, modelRotate, modelScale, modelRotateScreenshot,
        password, passwordHelp, ifShowHeader, ifShowColorList, headerBackgroundColor,
        ifNeedClear, operationLock, ifUpdateProject, magnifierSize, logSize, listType,
        valueColor, markNumber, markNumberLeft, markNumberTop, blockType, blockTypeLines,
        modelUpload, xColumns, yColumns, platFormOptions, ifFetchParams
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
            fetchType, ifFetch, fetchParams, align, backgroundColor, barColor,
            progressType, progressSize, progressSteps, windowControl,
            des_bordered, des_column, des_layout, des_size, ifLocalStorage,
            CCDName, imgs_width, imgs_height, magnifier, comparison, operationList, dataZoom,
            fontColor, interlacing, modelRotate, modelScale, modelRotateScreenshot,
            password, passwordHelp, ifShowHeader, ifShowColorList, headerBackgroundColor,
            ifNeedClear, operationLock, ifUpdateProject, magnifierSize, logSize, listType,
            valueColor, markNumber, markNumberLeft, markNumberTop, blockType, blockTypeLines,
            modelUpload, xColumns, yColumns, platFormOptions, ifFetchParams
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
      direction: 'column', symbol: 'rect', fetchType: undefined, ifFetch: false, fetchParams: undefined,
      align: 'left', backgroundColor: 'default', barColor: 'default', progressType: 'line',
      progressSize: 8, progressSteps: 5, windowControl: undefined, ifLocalStorage: undefined,
      CCDName: undefined, magnifier: false, comparison: false, operationList: [], dataZoom: 0,
      fontColor: undefined, interlacing: false, modelRotate: false, modelScale: false, modelRotateScreenshot: false,
      password: undefined, passwordHelp: undefined, ifShowHeader: false, ifShowColorList: false,
      headerBackgroundColor: 'default', ifNeedClear: false, operationLock: false, ifUpdateProject: false,
      magnifierSize: 4, logSize: 50, listType: 'line', markNumber: false, markNumberLeft: 1, markNumberTop: 1,
      blockType: 'normal', blockTypeLines: 2, modelUpload: false, xColumns: undefined, yColumns: undefined,
      platFormOptions: undefined, ifFetchParams: false
    });
    setWindowType('img');
    setAddWindowVisible('');
    setFooterSelectVisible(false);
    setOverallVisible(false);
    setHomeSettingVisible('');
  };

  const homeDom: any = useMemo(() => {
    return document.getElementById('dashboardContent');
  }, [document.getElementById('dashboardContent')]);
  const homePageIcon = useMemo(() => {
    const length = Math.ceil((homeDom?.scrollHeight || 0) / (document.querySelector('.home-body')?.clientHeight || 1));
    let arr: any = [];
    for (let i = 0; i < length; i++) {
      arr = arr.concat(i + 1)
    }
    return arr;
  }, [homeDom?.clientHeight, homeDom?.clientWidth]);
  useEffect(() => {
    setFieldsValue({
      xColumns: editWindowData.xColumns,
      yColumns: editWindowData.yColumns
    })
  }, [editWindowData.xColumns, editWindowData.yColumns]);

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
                let { width, height } = paramData?.contentData?.contentSize;
                if (!!paramData?.contentData?.autoSize || !_.isBoolean(paramData?.contentData?.autoSize)) {
                  width = window.screen.width;
                  height = window.screen.height;
                }
                // 画布与实际屏幕的宽度差值
                const diffWidth = (window.screen.width - width) / 2;
                // 计算实际的x,y坐标
                const x = (e.x * 1.1 - diffWidth) / width * 96 * (tabNum + 1);
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
                        style={leftPanelVisible ? { paddingLeft: 276 } : { paddingLeft: 60 }}
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
                          <Tooltip placement="bottom" title="全局设置">
                            <Button
                              className="toolbar-btn"
                              icon={<SettingOutlined className="toolbar-btn-icon" />}
                              onClick={() => {
                                setColorSelector((prev: any) => {
                                  return {
                                    ...prev,
                                    overallBackgroundColor: paramData?.contentData?.overallBackgroundColor?.rgb || 'default'
                                  }
                                });
                                setBasicInfoData(paramData?.contentData?.tabList || [{ id: guid(), name: '' }]);
                                form.setFieldsValue({
                                  overallBackgroundColor: paramData?.contentData?.overallBackgroundColor?.rgb || 'default',
                                  autoSize: _.isBoolean(paramData?.contentData?.autoSize) ? paramData?.contentData?.autoSize : true,
                                });
                                setAddWindowVisible('');
                                setHomeSettingVisible('');
                                setOverallVisible(true);
                              }}
                            />
                          </Tooltip>
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
                            (!paramData?.contentData?.autoSize && paramData?.contentData?.contentSize?.width) ?
                              {
                                width: `${paramData?.contentData?.contentSize?.width}px`,
                                minWidth: `${paramData?.contentData?.contentSize?.width}px`,
                                maxWidth: `${paramData?.contentData?.contentSize?.width}px`,
                              } : {},
                            (!paramData?.contentData?.autoSize && paramData?.contentData?.contentSize?.height) ?
                              {
                                height: `${paramData?.contentData?.contentSize?.height - 93}px`,
                                minHeight: `${paramData?.contentData?.contentSize?.height - 93}px`,
                                maxHeight: `${paramData?.contentData?.contentSize?.height - 93}px`
                              } : {},
                            (paramData?.contentData?.overallBackgroundColor && paramData?.contentData?.overallBackgroundColor?.rgb) ?
                              {
                                backgroundColor: `rgba(${paramData?.contentData?.overallBackgroundColor.rgb.r},${paramData?.contentData?.overallBackgroundColor.rgb.g},${paramData?.contentData?.overallBackgroundColor.rgb.b},${paramData?.contentData?.overallBackgroundColor.rgb.a})`
                              } : {},
                            (!!paramData?.contentData?.autoSize || !_.isBoolean(paramData?.contentData?.autoSize)) ?
                              { width: '100%', maxWidth: '100%', height: '100%', maxHeight: '100%' } : {},
                          )}
                        >
                          <div className="right-canvas-body-grid">
                            {
                              paramData?.contentData?.tabList?.length > 1 ?
                                <div className="flex-box right-canvas-body-grid-tab">
                                  {
                                    (paramData?.contentData?.tabList || []).map((tab: any, index: number) => {
                                      const { name, id } = tab;
                                      return <div
                                        className={`right-canvas-body-grid-tab-item ${tabNum === index ? 'right-canvas-body-grid-tab-selected' : ''}`}
                                        key={id}
                                        onClick={() => {
                                          setTabNum(index);
                                        }}
                                      >
                                        {name}
                                      </div>
                                    })
                                  }
                                </div>
                                : null
                            }
                            <div className="right-canvas-body-grid-body" style={Object.assign({},
                              paramData?.contentData?.tabList?.length > 1 ? { height: 'calc(100% - 50px)' } : {},
                              (!paramData?.contentData?.autoSize && paramData?.contentData?.contentSize?.width) ?
                                {
                                  width: `${(paramData?.contentData?.tabList?.length || 1) * paramData?.contentData?.contentSize?.width}px`,
                                  minWidth: `${(paramData?.contentData?.tabList?.length || 1) * paramData?.contentData?.contentSize?.width}px`,
                                  maxWidth: `${(paramData?.contentData?.tabList?.length || 1) * paramData?.contentData?.contentSize?.width}px`,
                                } : {},
                              (!!paramData?.contentData?.autoSize || !_.isBoolean(paramData?.contentData?.autoSize)) ?
                                {
                                  width: `${(paramData?.contentData?.tabList?.length || 1) * 100}%`,
                                  maxWidth: `${(paramData?.contentData?.tabList?.length || 1) * 100}%`,
                                  height: '100%', maxHeight: '100%'
                                } : {},
                              { marginLeft: `${-1 * tabNum * 100}%` }
                            )}>
                              {
                                !_.isEmpty(gridHomeList) ?
                                  <GridLayout
                                    dragName={ifCanEdit ? '.common-card-title' : ''}
                                    list={gridList.concat(contentList)}
                                    layout={gridHomeList.concat(contentLayout)}
                                    tabLength={paramData?.contentData?.tabList?.length || 1}
                                    onChange={(data: any) => {
                                      saveGridFunc(data);
                                    }}
                                  />
                                  : null
                              }
                            </div>
                          </div>
                        </div>
                    }, [
                      gridHomeList, contentLayout, gridList, contentList,
                      paramData?.contentData?.contentBackground,
                      paramData?.contentData?.contentSize, tabNum,
                      paramData?.contentData?.tabList?.length,
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
          style={(!!addWindowVisible || !!homeSettingVisible || !!overallVisible) ? {} : { right: '-450px' }}
          title={'插件配置 PluginConfig '}
          onSave={() => {
            form.validateFields()
              .then((values) => {
                if (!!addWindowVisible) {
                  addWindow(values);
                } else if (!!homeSettingVisible) {
                  setHomeSettingData((prev: any) => ({ ...prev, [homeSettingVisible]: { ...prev?.[homeSettingVisible], ...values } }));
                } else if (!!overallVisible) {
                  const { canvasWidth = '', canvasHeight = '' } = values;
                  updateParams({
                    id: paramData.id,
                    data: {
                      ...paramData,
                      contentData: {
                        ...paramData?.contentData,
                        ...values,
                        tabList: basicInfoData,
                        home: gridHomeList,
                        pageIconPosition,
                        homeSetting: homeSettingData,
                        contentSize: Object.assign({}, paramData?.contentData?.contentSize, { width: Number(canvasWidth), height: Number(canvasHeight) })
                      }
                    },
                  }).then((res: any) => {
                    if (res && res.code === 'SUCCESS') {
                      // setParamData((prev: any) => {
                      //   return {
                      //     ...prev,
                      //     contentData: Object.assign({}, prev.contentData, values, {
                      //       tabList: basicInfoData
                      //     })
                      //   }
                      // });
                      window.location.reload();
                    } else {
                      message.error(res?.msg || res?.message || '接口异常');
                    }
                  });
                }
                onCancel();
              })
              .catch((err) => {
                const { errorFields } = err;
                _.isArray(errorFields) && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
              });
          }}
          onCancel={onCancel}
        >
          {
            !!addWindowVisible ?
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
                    showSearch
                    onChange={(val) => {
                      if (!val[0]) {
                        message.error('该节点缺少节点ID，请联系管理员');
                        return;
                      }
                      const res = paramsData?.flowData?.nodes.filter((i: any) => i.id === val[0])?.[0];
                      if (!!res) {
                        setFieldsValue({ operationList: [] });
                        const { config = {} } = res;
                        const params = ['operation', 'platForm', 'table5'].includes(windowType) ?
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
                    disabled
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
                  {/* <ChromePicker
                    color={colorSelector?.backgroundColor}
                    onChange={(value: any) => {
                      const { rgb } = value;
                      setColorSelector((prev: any) => {
                        return {
                          ...prev,
                          backgroundColor: rgb
                        }
                      });
                    }}
                  /> */}
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
                        name="magnifierSize"
                        label="放大镜倍数"
                      >
                        <InputNumber
                          min={1}
                          placeholder="放大镜倍数"
                        />
                      </Form.Item>
                      <Form.Item
                        name="comparison"
                        label="开启对比图"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      <Form.Item
                        name="markNumber"
                        label="显示图示"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      {
                        !!form.getFieldValue('markNumber') ?
                          <Fragment>
                            <Form.Item
                              name="markNumberTop"
                              label="顶部图示长度"
                              rules={[{ required: true, message: '顶部图示长度' }]}
                            >
                              <InputNumber
                                min={1}
                                placeholder="顶部图示长度"
                              />
                            </Form.Item>
                            <Form.Item
                              name="markNumberLeft"
                              label="左侧图示长度"
                              rules={[{ required: true, message: '左侧图示长度' }]}
                            >
                              <InputNumber
                                min={1}
                                placeholder="左侧图示长度"
                              />
                            </Form.Item>
                          </Fragment>
                          : null
                      }
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
                  ['table3', 'table2', 'table'].includes(windowType) ?
                    <Fragment>
                      <Form.Item
                        name={`reverse`}
                        label={'数据倒序'}
                        rules={[{ required: true, message: '数据倒序' }]}
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
                              label: '倒序显示',
                            }
                          ]}
                        />
                      </Form.Item>
                      <Form.Item
                        name={`headerBackgroundColor`}
                        label={'头部背景色'}
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
                      <Form.Item
                        name={`valueColor`}
                        label={'颜色渲染'}
                        initialValue={"value"}
                        rules={[{ required: false, message: '颜色渲染' }]}
                      >
                        <Select
                          style={{ width: '100%' }}
                          options={[
                            {
                              value: 'value',
                              label: '数据颜色渲染到文字上',
                            },
                            {
                              value: 'background',
                              label: '数据颜色渲染到背景',
                            }
                          ]}
                        />
                      </Form.Item>
                    </Fragment>
                    : null
                }
                {
                  ['table5'].includes(windowType) ?
                    <Fragment>
                      <Form.Item
                        name={`yName`}
                        label={"绑定参数"}
                        rules={[{ required: true, message: '绑定参数' }]}
                      >
                        <Select
                          style={{ width: '100%' }}
                          options={selectedNodeConfig}
                        />
                      </Form.Item>
                      <Form.Item
                        label="行标题"
                        name="xColumns"
                      >
                        {
                          (editWindowData.xColumns || []).map((item: any, index: number) => {
                            if (!item || _.isEmpty(item)) return null;

                            const { id, xName } = item;
                            return <div
                              key={`xColumns-${id || index}`}
                              className="flex-box"
                              style={{ marginBottom: 8, height: '27px', gap: 8 }}
                            >
                              <div style={{ flex: 1 }}>
                                <Input
                                  placeholder='key'
                                  value={xName}
                                  onChange={e => {
                                    const val = e?.target?.value;
                                    setEditWindowData((prev: any) => {
                                      return {
                                        ...prev,
                                        xColumns: (prev.xColumns || []).map((i: any) => {
                                          if (i.id === id) {
                                            return {
                                              ...i,
                                              xName: val || '',
                                            };
                                          };
                                          return i;
                                        })
                                      }
                                    });
                                  }}
                                />
                              </div>
                              {
                                index > 1 ?
                                  <div style={{ height: '100%' }}>
                                    <Button
                                      style={{ height: '100%' }}
                                      icon={<MinusOutlined />}
                                      onClick={() => {
                                        setEditWindowData((prev: any) => {
                                          return {
                                            ...prev,
                                            xColumns: (prev.xColumns || []).filter((i: any) => i.id !== id)?.length ?
                                              (prev.xColumns || []).filter((i: any) => i.id !== id) :
                                              [{ id: guid(), xName: '', }]
                                          }
                                        });
                                      }}
                                    />
                                  </div>
                                  : null
                              }
                            </div>
                          })
                        }
                        {
                          editWindowData.xColumns?.length < 2 ?
                            <Button
                              icon={<PlusOutlined />}
                              onClick={() => {
                                setEditWindowData((prev: any) => {
                                  return {
                                    ...prev,
                                    xColumns: (prev.xColumns || []).concat({ id: guid(), xName: '', })
                                  }
                                });
                              }}
                            />
                            : null
                        }
                      </Form.Item>
                      <Form.Item
                        label="列标题"
                        name="yColumns"
                      >
                        {
                          (editWindowData.yColumns || []).map((item: any, index: number) => {
                            if (!item || _.isEmpty(item)) return null;

                            const { id, xName, yName, type } = item;
                            return <div
                              key={`yColumns-${id || index}`}
                              className="flex-box"
                              style={{ marginBottom: 8, height: '27px', gap: 8 }}
                            >
                              <div style={{ flex: 1 }}>
                                <Input
                                  placeholder='label'
                                  value={yName}
                                  onChange={e => {
                                    const val = e?.target?.value;
                                    setEditWindowData((prev: any) => {
                                      return {
                                        ...prev,
                                        yColumns: (prev.yColumns || []).map((i: any) => {
                                          if (i.id === id) {
                                            return {
                                              ...i,
                                              yName: val || '',
                                            };
                                          };
                                          return i;
                                        })
                                      }
                                    });
                                  }}
                                />
                              </div>
                              {
                                index > 0 ?
                                  <Fragment>
                                    <div style={{ flex: 1 }}>
                                      <Input
                                        placeholder='name'
                                        value={xName}
                                        onChange={e => {
                                          const val = e?.target?.value;
                                          setEditWindowData((prev: any) => {
                                            return {
                                              ...prev,
                                              yColumns: (prev.yColumns || []).map((i: any) => {
                                                if (i.id === id) {
                                                  return {
                                                    ...i,
                                                    xName: val || '',
                                                  };
                                                };
                                                return i;
                                              })
                                            }
                                          });
                                        }}
                                      />
                                    </div>
                                    <div style={{ width: 100 }}>
                                      <Select
                                        placeholder='value'
                                        value={type}
                                        options={[
                                          { key: 'range', value: 'range', label: '范围' },
                                          { key: 'bool', value: 'bool', label: '匹配' }
                                        ]}
                                        onChange={val => {
                                          setEditWindowData((prev: any) => {
                                            return {
                                              ...prev,
                                              yColumns: (prev.yColumns || []).map((i: any) => {
                                                if (i.id === id) {
                                                  return {
                                                    ...i,
                                                    type: val,
                                                  };
                                                };
                                                return i;
                                              })
                                            }
                                          });
                                        }}
                                      />
                                    </div>
                                    <div style={{ height: '100%' }}>
                                      <Button
                                        style={{ height: '100%' }}
                                        icon={<MinusOutlined />}
                                        onClick={() => {
                                          setEditWindowData((prev: any) => {
                                            return {
                                              ...prev,
                                              yColumns: (prev.yColumns || []).filter((i: any) => i.id !== id)?.length ?
                                                (prev.yColumns || []).filter((i: any) => i.id !== id) :
                                                [{ id: guid(), yName: '', xName: '', type: 'range' }]
                                            }
                                          });
                                        }}
                                      />
                                    </div>
                                  </Fragment>
                                  : null
                              }
                            </div>
                          })
                        }
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => {
                            setEditWindowData((prev: any) => {
                              return {
                                ...prev,
                                yColumns: (prev.yColumns || []).concat({ id: guid(), yName: '', xName: '', type: 'range' })
                              }
                            });
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
                        initialValue='按钮'
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
                        name="ifNeedClear"
                        label="手动清空按钮"
                        valuePropName="checked"
                      >
                        <Switch />
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
                        <Input.Password visibilityToggle={false} allowClear size='large' />
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
                              return <div
                                key={`commonInfo-${id || index}`}
                                className="flex-box"
                                style={{ marginBottom: 8, height: '27px', gap: 8 }}
                              >
                                <div style={{ flex: 1 }}>
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
                                </div>
                                <div style={{ flex: 1 }}>
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
                                </div>
                                <div style={{ height: '100%' }}>
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
                                </div>
                              </div>
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
                        name="ifShowColorList"
                        label="展示颜色对比条"
                        initialValue={false}
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
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
                      <Form.Item
                        name="modelUpload"
                        label="手动上传模型"
                        initialValue={false}
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      {
                        (!!form.getFieldValue('modelRotateScreenshot') || !!form.getFieldValue('modelUpload')) ?
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
                          <Fragment>
                            <Form.Item
                              name={`listType`}
                              label={'布局方式'}
                              initialValue={'line'}
                              rules={[{ required: true, message: '布局方式' }]}
                            >
                              <Select
                                style={{ width: '100%' }}
                                options={[
                                  {
                                    value: 'line',
                                    label: '线形布局',
                                  },
                                  {
                                    value: 'block',
                                    label: '块状布局',
                                  }
                                ]}
                              />
                            </Form.Item>
                            {
                              getFieldValue('listType') === 'block' ?
                                <Form.Item
                                  name={`blockType`}
                                  label={'块状布局'}
                                  initialValue={'normal'}
                                  rules={[{ required: true, message: '块状布局' }]}
                                >
                                  <Select
                                    style={{ width: '100%' }}
                                    options={[
                                      {
                                        value: 'normal',
                                        label: '默认',
                                      },
                                      {
                                        value: 'waterfall',
                                        label: '瀑布流',
                                      }
                                    ]}
                                  />
                                </Form.Item>
                                : null
                            }
                            {
                              getFieldValue('blockType') === 'waterfall' ?
                                <Form.Item
                                  name={'blockTypeLines'}
                                  label="瀑布流列数"
                                  initialValue={2}
                                  rules={[{ required: true, message: '瀑布流列数' }]}
                                >
                                  <InputNumber
                                    min={2}
                                    placeholder="瀑布流列数"
                                  />
                                </Form.Item>
                                : null
                            }
                            <Form.Item
                              name={`xName`}
                              label={"接口地址"}
                              rules={[{ required: true, message: '接口地址' }]}
                            >
                              <Input size='large' />
                            </Form.Item>
                            <Form.Item
                              name="ifUpdateProject"
                              label="是否同步方案"
                              initialValue={false}
                              valuePropName="checked"
                            >
                              <Switch />
                            </Form.Item>
                            <Form.Item
                              name="operationLock"
                              label="开启状态锁"
                              initialValue={false}
                              valuePropName="checked"
                            >
                              <Switch />
                            </Form.Item>
                          </Fragment>
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
                          color={colorSelector?.fontColor}
                          onChange={(value: any) => {
                            const { rgb } = value;
                            setColorSelector((prev: any) => {
                              return {
                                ...prev,
                                fontColor: rgb
                              }
                            });
                          }}
                        />
                      </Form.Item>
                    </Fragment>
                    : null
                }
                {
                  ['platForm'].includes(windowType) ?
                    <Fragment>
                      <Form.Item
                        name={`fetchType`}
                        label={"http类型"}
                        rules={[{ required: false, message: 'http类型' }]}
                      >
                        <Select
                          style={{ width: '100%' }}
                          placeholder="http类型"
                          options={['get', 'post', 'put', 'delete'].map((item: any) => ({ value: item, label: _.toUpper(item) }))}
                        />
                      </Form.Item>
                      <Form.Item
                        name={`xName`}
                        label={"接口地址"}
                        rules={[{ required: false, message: '接口地址' }]}
                      >
                        <Input placeholder="接口地址" size='large' />
                      </Form.Item>
                      <Form.Item
                        name="platFormOptions"
                        label="可选择对象"
                        initialValue={{
                          "左上水平隔膜": {
                            "灰度差": { "name": "灰度差", "alias": "灰度差", "require": true, "default": 15, "value": 15, "type": "int", "description": "边界变化的灰度差", "widget": { "type": "InputNumber", "max": 255, "min": 0, "step": 1 } }, "灰度合并像素": { "name": "灰度合并像素", "alias": "灰度合并像素", "require": true, "default": 2, "value": 2, "type": "int", "description": "边界变化的灰度合并像素", "widget": { "type": "InputNumber", "max": 5, "min": 1, "step": 1 } }, "亮度变化方向": { "name": "亮度变化方向", "alias": "亮度变化方向", "require": true, "default": 2, "value": 2, "type": "List[string]", "description": "边界找线亮度变化方向, 1为亮到暗, 2为暗到亮", "widget": { "type": "Select", "options": [{ "label": "1-亮到暗", "value": 1 }, { "label": "2-暗到亮", "value": 2 }] } }, "直线度": { "name": "直线度", "alias": "直线度", "require": true, "default": 3, "value": 3, "type": "int", "description": "直线度要求，值越小，线越直", "widget": { "type": "InputNumber", "max": 100, "min": 1, "step": 1 } }, "降噪滤波核": { "name": "降噪滤波核", "alias": "降噪滤波核", "require": true, "default": 5, "value": 5, "type": "int", "description": "去噪滤波核大小", "widget": { "type": "InputNumber", "max": 21, "min": 1, "step": 1 } }, "找线方向下采样倍数": { "name": "找线方向下采样倍数", "alias": "找线方向下采样倍数", "require": true, "default": 8, "value": 8, "type": "int", "description": "区域下采样倍数，提高计算速度", "widget": { "type": "InputNumber", "max": 16, "min": 2, "step": 2 } }, "垂直找线方向下采样倍数": { "name": "垂直找线方向下采样倍数", "alias": "垂直找线方向下采样倍数", "require": true, "default": 2, "value": 2, "type": "int", "description": "区域下采样倍数，提高计算速度", "widget": { "type": "InputNumber", "max": 16, "min": 2, "step": 2 } }, "搜索框个数": { "name": "搜索框个数", "alias": "搜索框个数", "require": true, "default": 15, "value": 15, "type": "int", "description": "搜索框个数", "widget": { "type": "InputNumber", "max": 1000, "min": 3, "step": 1 } }, "搜索框宽度": { "name": "搜索框宽度", "alias": "搜索框宽度", "require": true, "default": 6, "value": 6, "type": "int", "description": "搜索框宽度", "widget": { "type": "InputNumber", "max": 1000, "min": 3, "step": 1 } }, "找线方法": { "name": "找线方法", "alias": "找线方法", "require": true, "default": "卡尺找线", "value": "卡尺找线", "type": "List[string]", "description": "找线方法，1-卡尺找线，2-EDLines找线", "widget": { "type": "Select", "options": [{ "label": "卡尺找线", "value": "卡尺找线" }, { "label": "EDLine找线", "value": "EDLine找线" }] } }
                          }
                        }}
                        rules={[{ required: false, message: '可选择对象' }]}
                      >
                        <Input.TextArea
                          autoSize={{ minRows: 5, maxRows: 10 }}
                          placeholder="可选择对象"
                          className="scrollbar-style"
                        />
                      </Form.Item>
                      <Form.Item
                        name="ifFetch"
                        label="是否实时反馈"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                    </Fragment>
                    : null
                }
                {
                  ['modal'].includes(windowType) ?
                    <Fragment>
                      <Form.Item
                        name="ifFetch"
                        label="是否实时反馈"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      <Form.Item
                        name={`fetchType`}
                        label={"http类型"}
                        rules={[{ required: true, message: 'http类型' }]}
                      >
                        <Select
                          style={{ width: '100%' }}
                          placeholder="http类型"
                          options={['get', 'post', 'put', 'delete'].map((item: any) => ({ value: item, label: _.toUpper(item) }))}
                        />
                      </Form.Item>
                      <Form.Item
                        name={`xName`}
                        label={"接口地址"}
                        rules={[{ required: true, message: '接口地址' }]}
                      >
                        <Input placeholder="接口地址" size='large' />
                      </Form.Item>
                      <Form.Item
                        name="ifFetchParams"
                        label="反馈参数"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                    </Fragment>
                    : null
                }
                {
                  (['imgButton'].includes(windowType) && !isVision) ?
                    <Fragment>
                      <Form.Item
                        name={`windowControl`}
                        label={'窗口控制'}
                        tooltip={"控制某个图片窗口的缺陷详情"}
                        rules={[{ required: true, message: '窗口控制' }]}
                      >
                        <Select
                          style={{ width: '100%' }}
                          allowClear
                          // @ts-ignore
                          options={contentList.map((dom: any) => {
                            const { key } = dom;
                            const keySp = key?.split("$$");
                            if (keySp[2] === 'img' || keySp[3] === 'img') {
                              const name = `${nodeList?.filter((i: any) => i.key === keySp[0])?.[0]?.label} - ${windowTypeList?.filter((i: any) => i.value === keySp?.[2])?.[0]?.label}`
                              return {
                                value: key,
                                label: name,
                                disabled: key === editWindowData?.id
                              }
                            }
                          }).filter(Boolean)}
                        />
                      </Form.Item>
                      <Form.Item
                        label="缺陷类型"
                        name="xColumns"
                      >
                        {
                          (editWindowData.xColumns || []).map((item: any, index: number) => {
                            if (!item || _.isEmpty(item)) return null;

                            const { id, value, label } = item;
                            return <div
                              key={`xColumns-${id || index}`}
                              className="flex-box"
                              style={{ marginBottom: 8, height: '27px', gap: 8 }}
                            >
                              <div style={{ flex: 1 }}>
                                <Input
                                  placeholder='label'
                                  value={label}
                                  onChange={e => {
                                    const val = e?.target?.value;
                                    setEditWindowData((prev: any) => {
                                      return {
                                        ...prev,
                                        xColumns: (prev.xColumns || []).map((i: any) => {
                                          if (i.id === id) {
                                            return {
                                              ...i,
                                              label: val || '',
                                            };
                                          };
                                          return i;
                                        })
                                      }
                                    });
                                  }}
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <Input
                                  placeholder='value'
                                  value={value}
                                  onChange={e => {
                                    const val = e?.target?.value;
                                    setEditWindowData((prev: any) => {
                                      return {
                                        ...prev,
                                        xColumns: (prev.xColumns || []).map((i: any) => {
                                          if (i.id === id) {
                                            return {
                                              ...i,
                                              value: val || '',
                                            };
                                          };
                                          return i;
                                        })
                                      }
                                    });
                                  }}
                                />
                              </div>
                              <div style={{ height: '100%' }}>
                                <Button
                                  style={{ height: '100%' }}
                                  icon={<MinusOutlined />}
                                  onClick={() => {
                                    setEditWindowData((prev: any) => {
                                      return {
                                        ...prev,
                                        xColumns: (prev.xColumns || []).filter((i: any) => i.id !== id)?.length ?
                                          (prev.xColumns || []).filter((i: any) => i.id !== id) :
                                          [{ id: guid(), label: '', value: '' }]
                                      }
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          })
                        }
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => {
                            setEditWindowData((prev: any) => {
                              return {
                                ...prev,
                                xColumns: (prev.xColumns || []).concat({ id: guid(), label: '', value: '' })
                              }
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        name={`fetchType`}
                        label={"http类型"}
                        rules={[{ required: false, message: 'http类型' }]}
                      >
                        <Select
                          style={{ width: '100%' }}
                          placeholder="http类型"
                          options={['get', 'post', 'put', 'delete'].map((item: any) => ({ value: item, label: _.toUpper(item) }))}
                        />
                      </Form.Item>
                      <Form.Item
                        name={`xName`}
                        label={"接口地址"}
                        rules={[{ required: false, message: '接口地址' }]}
                      >
                        <Input placeholder="接口地址" size='large' />
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
                {
                  !['modal'].includes(windowType) ?
                    <Form.Item
                      name="ifLocalStorage"
                      label="开启缓存"
                      initialValue={!['modal'].includes(windowType)}
                      valuePropName="checked"
                      style={{ marginBottom: 0 }}
                    >
                      <Switch />
                    </Form.Item>
                    : null
                }
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
                  {
                    homeSettingVisible === 'slider-4' ?
                      <Form.Item
                        name="show_start_end"
                        label="应用一键启停"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      :
                      null
                  }
                  {
                    ['footer-1', 'footer-2'].includes(homeSettingVisible) ?
                      <Form.Item
                        name="logSize"
                        label="展示日志行数"
                      >
                        <InputNumber min={1} max={200} />
                      </Form.Item>
                      :
                      null
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
                :
                !!overallVisible ?
                  <Form form={form} scrollToFirstError>
                    <Form.Item
                      name="overallBackgroundColor"
                      label="背景色"
                      initialValue={''}
                    >
                      <ChromePicker
                        color={colorSelector?.overallBackgroundColor}
                        onChange={(value: any) => {
                          const { rgb } = value;
                          setColorSelector((prev: any) => {
                            return {
                              ...prev,
                              overallBackgroundColor: rgb
                            }
                          });
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`autoSize`}
                      label={"自适应屏幕尺寸"}
                      valuePropName="checked"
                      rules={[{ required: false, message: '自适应尺寸' }]}
                    >
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      label="标签页"
                    >
                      {
                        _.isArray(basicInfoData) ?
                          basicInfoData.map((item: any, index: number) => {
                            if (!item || _.isEmpty(item)) return null;

                            const { id, name } = item;
                            return <div
                              key={`commonInfo-${id || index}`}
                              className="flex-box"
                              style={{ marginBottom: 8, height: '27px', gap: 8 }}
                            >
                              <div style={{ flex: 1 }}>
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
                              </div>
                              <div style={{ height: '100%' }}>
                                <Button
                                  style={{ height: '100%' }}
                                  icon={<MinusOutlined />}
                                  onClick={() => {
                                    setBasicInfoData((prev: any) => {
                                      return prev.filter((i: any) => i.id !== id)?.length ?
                                        prev.filter((i: any) => i.id !== id) :
                                        [{ id: guid(), name: '' }]
                                    })
                                  }}
                                />
                              </div>
                            </div>
                          })
                          :
                          null
                      }
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => {
                          setBasicInfoData((prev: any) => prev.concat({ id: guid(), name: '' }))
                        }}
                      />
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

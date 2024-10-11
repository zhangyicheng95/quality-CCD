import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.module.less';
import {
  Button,
  message,
  Modal,
  Badge,
  Cascader,
  Form,
  Tooltip,
  Popconfirm,
  Select,
  Input,
  Tree,
  InputNumber,
  Switch,
  Image,
  Divider,
  Checkbox,
  Dropdown,
  Menu,
  DatePicker,
} from 'antd';
import * as _ from 'lodash';
import { BASE_IP, btnFetch, startFlowService, stopFlowService, updateParams } from '@/services/api';
import GridLayout from '@/components/GridLayout';
import {
  ArrowUpOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
  CompressOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  LoadingOutlined,
  MinusOutlined,
  MinusSquareOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  PlusSquareOutlined,
  ReloadOutlined,
  SaveOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { connect, useModel } from 'umi';
import { ChromePicker } from 'react-color';
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
import ButtonInputCharts from '@/pages/home/components/Canvas/components/ButtonInputCharts';
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
import { useThrottleAndMerge } from '@/utils/useThrottleAndMerge';
import FileManager from '@/components/FileManager';
import {
  basicWindowList,
  customWindowList,
  simulatedCoatingList,
  windowTypeList,
} from '@/common/constants/globalConstants';
import { getuid, guid } from '@/utils/utils';
import moment from 'moment';
import leftIcon from '@/assets/imgs/left-icon.svg';
import dirIcon from '@/assets/imgs/dir-icon.svg';
import NodeDetailWrapper from '@/components/NodeDetailWrapper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DropSortableItem from '@/components/DragComponents/DropSortableItem';
import DragSortableItem from '@/components/DragComponents/DragSortableItem';
import Table3Charts from './components/Table3Charts';
import TreeCharts from './components/TreeCharts';
import Table4Charts from './components/Table4Charts';
import TableEditCharts from './components/TableEditCharts';
import PlatFormCharts from './components/PlatFormCharts';
import ModalCharts from './components/ModalCharts';
import ImgButtonCharts from './components/ImgButtonCharts';
import ButtonImagesCharts from './components/ButtonImagesCharts';
import AlertImgCharts from './components/AlertImgCharts';
import ButtonUploadCharts from './components/ButtonUploadCharts';
import IframeCharts from './components/IframeCharts';
import dataHeaderImage from '@/assets/images/header-bg.png';
import dataHeaderImage2 from '@/assets/images/header-bg-2.png';
import dataItemImage1 from '@/assets/images/item-bg-1.png';
import dataItemImage2 from '@/assets/images/item-bg-2.png';
import dataItemImage3 from '@/assets/images/item-bg-3.png';
import dataItemImage4 from '@/assets/images/item-bg-4.png';
import dataItemImage5 from '@/assets/images/item-bg-5.png';
import dataItemImage6 from '@/assets/images/item-bg-6.png';
import dataItemImage7 from '@/assets/images/item-bg-7.png';
import dataItemImageNG from '@/assets/images/item-bg-ng.png';
import dataItemHeaderImage1 from '@/assets/images/item-header-bg-1.png';
import dataItemHeaderImage2 from '@/assets/images/item-header-bg-2.png';
import HeaderCharts from './components/HeaderCharts';
import ChooseFileButton from '@/components/ChooseFileButton';
import ImgContrastCharts from './components/ImgContrastCharts';
import TimeSelectCharts from './components/TimeSelectCharts';
import HeatMapCharts from './components/HeatMapCharts';
import NightingalePieCharts from './components/NightingalePieCharts';
import RankCharts from './components/RankCharts';
import Pie3DCharts from './components/Pie3DCharts';
import FormulaCharts from './components/customComponents/FormulaCharts';
import StatisticsCharts from './components/customComponents/StatisticsCharts';
import ModuleStatusCharts from './components/customComponents/ModuleStatusCharts';
import FastFunctionCharts from './components/customComponents/FastFunctionCharts';
import OutputAreaCharts from './components/customComponents/OutputAreaCharts';
import EquipmentControlCharts from './components/customComponents/EquipmentControlCharts';
import OrderInformationCharts from './components/customComponents/OrderInformationCharts';
import EquipmentInfoCharts from './components/customComponents/EquipmentInfoCharts';
import SegmentSwitchCharts from './components/SegmentSwitchCharts';
import BasicButton from '@/components/BasicButton';
import BodyBoxCharts from './components/BodyBoxCharts';
import RangeDomainCharts from './components/RangeDomainCharts';
import RectRangeCharts from './components/customComponents/RectRangeCharts';
import ModelSwitchCharts from './components/customComponents/ModelSwitchCharts';
import SwitchBoxCharts from './components/SwitchBoxCharts';
import FormCharts from './components/FormCharts';
import NestFormCharts from './components/NestFormCharts';
import TableAntdCharts from './components/TableAntdCharts';
import SegmentSwitch from '@/components/SegmentSwitch';
import IaminationImageCharts from './components/IaminationImageCharts';
import ReJudgmentCharts from './components/ReJudgmentCharts';
import AntdTableFromHttpCharts from './components/AntdTableFromHttpCharts';
import FabricCharts from './components/FabricCharts';
import CableCharts from './components/CableCharts';
import CountDownCharts from './components/CountDownCharts';
import ListSwitchImgCharts from './components/ListSwitchImgCharts';
import ButtonCharts from './components/ButtonCharts';

const leftPanelDataLocal = [
  {
    key: 'main',
    title: '监控窗口',
    open: true,
    children: windowTypeList,
  },
  {
    key: 'basic',
    title: '基础窗口',
    open: true,
    children: basicWindowList,
  },
  {
    key: 'coating',
    title: '背景涂层',
    open: true,
    children: simulatedCoatingList,
  },
  {
    key: 'custom',
    title: '定制窗口',
    open: true,
    children: customWindowList,
  },
];
const Home: React.FC<any> = (props: any) => {
  const { initialState, setInitialState } = useModel<any>('@@initialState');
  const { params: paramsData } = initialState;
  const { dispatch, started, bodyBoxTab, taskDataConnect, snapshot, projectStatus } = props;
  const { logStr, gridContentList, footerData, errorData } = snapshot;
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [formCustom] = Form.useForm();
  const { validateFields, setFieldsValue, getFieldValue } = form;
  const ipString: any = localStorage.getItem('ipString') || '';
  const updateTimer = useRef<any>();
  const logReloadTimer = useRef<any>();
  const editBoxDom = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [colorSelector, setColorSelector] = useState<any>({
    fontColor: '#FFFFFF',
    backgroundColor: 'default',
    overallBackgroundColor: '',
  });
  const [showPanels, setShowPanels] = useState<any>({ common: true, custom: false });
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
    header: {
      fontSize: 20,
      headerTitle: '',
      headerName: '',
      titleAlign: 'center',
      headerTitleFontSize: 16,
      backgroundColor: 'default',
    },
    'slider-1': {
      des_column: 1,
      delay: 0,
      titleAlign: 'horizational',
      iconSize: 40,
      controlList: [],
      ifShowHeader: false,
      backgroundColor: 'default',
    },
    'slider-4': {
      fontSize: 20,
      ifShowHeader: false,
      backgroundColor: 'default',
      show_start_end: false,
      self_stop_other: false,
    },
    'footer-1': { fontSize: 14, ifShowHeader: false, backgroundColor: 'default', logSize: 50 },
    'footer-2': { fontSize: 20, ifShowHeader: false, backgroundColor: 'default', logSize: 50 },
  });
  const [basicInfoData, setBasicInfoData] = useState<any>([]);
  const [pageIconPosition, setPageIconPosition] = useState<any>({
    position: { bottom: 16, right: 16 },
    direction: 'column',
  });
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [leftPanelData, setLeftPanelData] = useState<any>(leftPanelDataLocal || []);
  const [tabNum, setTabNum] = useState(0);
  const [commonSettingList, setCommonSettingList] = useState<any>([]);
  const [formModalEdit, setFormModalEdit] = useState('');
  const [tabPasswordVisible, setTabPasswordVisible] = useState<any>({});

  const ifCanEdit = useMemo(() => {
    return location.hash?.indexOf('edit') > -1;
  }, [location.hash, paramData]);
  // 迁移描述信息组件
  useEffect(() => {
    if (_.isArray(paramData?.commonInfo?.data)) {
      setBasicInfoData(paramData?.commonInfo?.data);
    } else if (_.isObject(paramData?.commonInfo)) {
      const result = Object.entries(paramData?.commonInfo)?.map?.((res: any, index: number) => {
        return {
          id: guid(),
          name:
            res[0] === 'productionInfo'
              ? '产线信息'
              : res[0] === 'stationInfo'
                ? '工位信息'
                : res[0] === 'useInfo'
                  ? '功能信息'
                  : res[0],
          value: res[1],
        };
      });
      setBasicInfoData(result);
    }
  }, [paramData?.commonInfo]);
  // 基础组件
  const gridList = useMemo(
    () => [
      <div key={'header'}>
        <div
          className="header-box drag-item-content-box background-ubv"
          style={Object.assign(
            {},
            { fontSize: homeSettingData['header']?.fontSize },
            homeSettingData['header']?.backgroundColor === 'default'
              ? {}
              : homeSettingData['header']?.backgroundColor === 'transparent'
                ? { backgroundColor: 'transparent' }
                : {
                  backgroundImage: `url(${homeSettingData['header']?.backgroundColor})`,
                  backgroundColor: 'transparent',
                },
          )}
        >
          <div className={`flex-box-justify-between header-box-body`}>
            <HeaderCharts homeSettingData={homeSettingData} started={started} />
          </div>
          {ifCanEdit ? (
            <Dropdown
              overlayClassName="edit-canvas-dropdown"
              overlay={
                <Menu
                  items={[
                    {
                      key: '1',
                      icon: <EditOutlined />,
                      label: '编辑',
                      onClick: () => {
                        // 双击事件触发的操作
                        if (!!addWindowVisible || !!homeSettingVisible) {
                          setAddWindowVisible('');
                          setHomeSettingVisible('');
                          setFieldsValue({});
                        }
                        setTimeout(() => {
                          setFieldsValue(homeSettingData?.['header']);
                          setHomeSettingVisible('header');
                        }, 500);
                      },
                    },
                    {
                      type: 'divider',
                    },
                    {
                      key: '2',
                      icon: <DeleteOutlined />,
                      label: '删除',
                      onClick: () => {
                        deleteBasic('header');
                      },
                    },
                  ]}
                />
              }
              trigger={['contextMenu']}
            >
              <div className="flex-box-center drag-item-content-mask common-card-title"></div>
            </Dropdown>
          ) : null}
        </div>
      </div>,
      <div key={'slider-1'}>
        <div
          className="btn-box drag-item-content-box background-ubv"
          style={
            homeSettingData['slider-1']?.backgroundColor === 'default'
              ? {}
              : homeSettingData['slider-1']?.backgroundColor === 'transparent'
                ? { backgroundColor: 'transparent' }
                : { backgroundImage: `url(${homeSettingData['slider-1']?.backgroundColor})` }
          }
        >
          {homeSettingData['slider-1']?.ifShowHeader ? (
            <div className={`common-card-title-box flex-box `}>
              <div className="flex-box common-card-title">
                当前状态：
                {started ? (
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
                )}
              </div>
            </div>
          ) : null}
          <div
            className={`btn-box-bottom flex-box`}
            style={{
              ...(homeSettingData['slider-1']?.ifShowHeader
                ? { height: 'calc(100% - 28px)' }
                : { height: '100%' }),
              ...(homeSettingData?.['slider-1']?.des_column === 3 ? { overflow: 'hidden' } : {}),
            }}
          >
            <BasicButton
              title={started ? '检测' : '启动'}
              icon={
                started ? (
                  <div className="btn-self-icon flex-box-center success"></div>
                ) : (
                  <PlayCircleOutlined className="success-font" />
                )
              }
              iconSize={homeSettingData['slider-1']?.iconSize || 40}
              direction={homeSettingData['slider-1']?.titleAlign}
              style={{ width: `${100 / (homeSettingData?.['slider-1']?.des_column || 1)}%` }}
              disabled={started || ifCanEdit}
              loading={loading}
              onClick={() => start()}
            />
            <BasicButton
              title={'停止'}
              icon={<PauseCircleOutlined className={started ? 'error-font' : ''} />}
              iconSize={homeSettingData['slider-1']?.iconSize || 40}
              direction={homeSettingData['slider-1']?.titleAlign}
              style={{ width: `${100 / (homeSettingData?.['slider-1']?.des_column || 1)}%` }}
              disabled={!started || ifCanEdit}
              loading={loading}
              onClick={() => end()}
            />
            {/* <BasicButton
              title={'重启'}
              icon={<ReloadOutlined />}
              iconSize={homeSettingData['slider-1']?.iconSize || 40}
              direction={homeSettingData['slider-1']?.titleAlign}
              style={{ width: `${100 / (homeSettingData?.['slider-1']?.des_column || 1)}%` }}
              disabled={!started || ifCanEdit}
              loading={loading}
              onClick={() => reStart()}
            /> */}
          </div>
          {ifCanEdit ? (
            <Dropdown
              overlayClassName="edit-canvas-dropdown"
              overlay={
                <Menu
                  items={[
                    {
                      key: '1',
                      icon: <EditOutlined />,
                      label: '编辑',
                      onClick: () => {
                        // 双击事件触发的操作
                        if (!!addWindowVisible || !!homeSettingVisible) {
                          setAddWindowVisible('');
                          setHomeSettingVisible('');
                          setFieldsValue({});
                        }
                        setTimeout(() => {
                          setFieldsValue(homeSettingData?.['slider-1']);
                          setCommonSettingList(
                            (!!homeSettingData?.['slider-1']?.controlList?.length
                              ? homeSettingData?.['slider-1']?.controlList
                              : [{}]
                            )?.map?.((item: any) => ({ ...item, id: guid() })),
                          );
                          setHomeSettingVisible('slider-1');
                        }, 500);
                      },
                    },
                    {
                      type: 'divider',
                    },
                    {
                      key: '2',
                      icon: <DeleteOutlined />,
                      label: '删除',
                      onClick: () => {
                        deleteBasic('slider-1');
                      },
                    },
                  ]}
                />
              }
              trigger={['contextMenu']}
            >
              <div className="flex-box-center drag-item-content-mask common-card-title"></div>
            </Dropdown>
          ) : null}
        </div>
      </div>,
      <div key={'slider-4'}>
        <div
          className="info-box message-box drag-item-content-box background-ubv"
          style={
            homeSettingData['slider-4']?.backgroundColor === 'default'
              ? {}
              : homeSettingData['slider-4']?.backgroundColor === 'transparent'
                ? { backgroundColor: 'transparent' }
                : { backgroundImage: `url(${homeSettingData['slider-4']?.backgroundColor})` }
          }
        >
          {homeSettingData['slider-4']?.ifShowHeader ? (
            <div className="common-card-title-box flex-box ">
              <div className="flex-box common-card-title">方案列表</div>
            </div>
          ) : null}
          <div
            className={`flex-box info-box-content tabs-box`}
            style={{
              fontSize: homeSettingData['slider-4']?.fontSize || 'inherit',
            }}
          >
            {!!paramData?.contentData?.ipList?.length &&
              !!homeSettingData?.['slider-4']?.show_start_end ? (
              <Fragment>
                <Button
                  type="text"
                  disabled={loading}
                  loading={loading}
                  className={`flex-box-center tabs-box-item-box ${gridHomeList?.filter((i: any) => i.i === 'slider-4')[0]?.w >= 20
                    ? 'tabs-box-item-box-rows'
                    : ''
                    }`}
                  onClick={() => {
                    startProjects(
                      paramData?.contentData?.ipList?.[0],
                      paramData?.contentData?.ipList,
                      0,
                      projectStatus,
                    );
                  }}
                >
                  一键启动
                </Button>
                <Button
                  type="text"
                  disabled={loading}
                  loading={loading}
                  className={`flex-box-center tabs-box-item-box ${gridHomeList?.filter((i: any) => i.i === 'slider-4')[0]?.w >= 20
                    ? 'tabs-box-item-box-rows'
                    : ''
                    }`}
                  onClick={() => {
                    endProjects(
                      paramData?.contentData?.ipList?.[0],
                      paramData?.contentData?.ipList,
                      0,
                      projectStatus,
                    );
                  }}
                >
                  一键停止
                </Button>
              </Fragment>
            ) : null}
            <div
              className={`flex-box-center tabs-box-item-box ${gridHomeList?.filter((i: any) => i.i === 'slider-4')[0]?.w >= 20
                ? 'tabs-box-item-box-rows'
                : ''
                }`}
              onClick={() => {
                setAddItemsVisible(true);
              }}
            >
              +
            </div>
            {(paramData?.contentData?.ipList || [])?.map?.((item: any, index: number) => {
              const { label, key } = item;
              const statusItem = projectStatus?.filter((i: any) => i.value === key)?.[0] || {};
              return (
                <div
                  className={`flex-box tabs-box-item-box ${localStorage.getItem('ipString') === key ? 'active' : ''
                    } ${gridHomeList?.filter((i: any) => i.i === 'slider-4')[0]?.w >= 3
                      ? 'tabs-box-item-box-rows'
                      : ''
                    }`}
                  key={`tabs-${key}`}
                >
                  <div
                    onClick={() => {
                      if (localStorage.getItem('ipString') !== key) {
                        if (!!started && !!homeSettingData?.['slider-4']?.self_stop_other) {
                          setLoading(true);
                          // 先停止当前方案
                          stopFlowService(localStorage.getItem('ipString') || '').then(
                            (res: any) => {
                              if (res && res.code === 'SUCCESS') {
                                // 启动目标方案
                                startFlowService(key).then((res: any) => {
                                  if (res && res.code === 'SUCCESS') {
                                    !!key && localStorage.setItem('ipString', key);
                                    !!statusItem?.realIp &&
                                      localStorage.setItem('ipUrl-realtime', statusItem?.realIp);
                                    window.location.reload();
                                  } else {
                                    message.error(
                                      res?.msg || res?.message || '后台服务异常，请重启服务',
                                    );
                                  }
                                });
                              } else {
                                message.error(
                                  res?.msg || res?.message || '后台服务异常，请重启服务',
                                );
                              }
                              setLoading(false);
                            },
                          );
                        } else {
                          !!key && localStorage.setItem('ipString', key);
                          !!statusItem?.realIp &&
                            localStorage.setItem('ipUrl-realtime', statusItem?.realIp);
                          setTimeout(() => {
                            window.location.reload();
                          }, 300);
                        }
                      }
                    }}
                    className="tabs-box-item-title"
                  >
                    {!!statusItem?.running ? (
                      <div className="flex-box" style={{ gap: 8 }}>
                        <Badge color={'green'} />
                        {label}
                      </div>
                    ) : (
                      label
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {ifCanEdit ? (
            <Dropdown
              overlayClassName="edit-canvas-dropdown"
              overlay={
                <Menu
                  items={[
                    {
                      key: '1',
                      icon: <EditOutlined />,
                      label: '编辑',
                      onClick: () => {
                        // 双击事件触发的操作
                        if (!!addWindowVisible || !!homeSettingVisible) {
                          setAddWindowVisible('');
                          setHomeSettingVisible('');
                          setFieldsValue({});
                        }
                        setTimeout(() => {
                          setFieldsValue(homeSettingData?.['slider-4']);
                          setHomeSettingVisible('slider-4');
                        }, 500);
                      },
                    },
                    {
                      type: 'divider',
                    },
                    {
                      key: '2',
                      icon: <DeleteOutlined />,
                      label: '删除',
                      onClick: () => {
                        deleteBasic('slider-4');
                      },
                    },
                  ]}
                />
              }
              trigger={['contextMenu']}
            >
              <div className="flex-box-center drag-item-content-mask common-card-title"></div>
            </Dropdown>
          ) : null}
        </div>
      </div>,
      <div key={'footer-1'}>
        <div
          className="log-content message-box drag-item-content-box background-ubv"
          style={
            homeSettingData['footer-1']?.backgroundColor === 'default'
              ? {}
              : homeSettingData['footer-1']?.backgroundColor === 'transparent'
                ? { backgroundColor: 'transparent' }
                : { backgroundImage: `url(${homeSettingData['footer-1']?.backgroundColor})` }
          }
        >
          {homeSettingData['footer-1']?.ifShowHeader ? (
            <div className="common-card-title-box flex-box ">
              <div className="flex-box common-card-title">日志信息</div>
            </div>
          ) : null}
          <div className="card-body-box">
            <div
              className="content-item-span"
              style={Object.assign(
                {},
                homeSettingData['footer-1'],
                homeSettingData['footer-1']?.ifShowHeader ? {} : { height: '100%' },
              )}
              dangerouslySetInnerHTML={{
                // 此处需要处理
                __html: _.isString(logStr)
                  ? logStr
                  : logStr
                    ?.slice(logStr?.length - (homeSettingData['footer-1']?.logSize || 50))
                    .join('<br />'),
              }}
            />
            <div className="preview-box flex-box-center">
              <CompressOutlined
                className="preview-icon"
                onClick={() => {
                  setLogDataVisible('log');
                }}
              />
            </div>
          </div>
          {ifCanEdit ? (
            <Dropdown
              overlayClassName="edit-canvas-dropdown"
              overlay={
                <Menu
                  items={[
                    {
                      key: '1',
                      icon: <EditOutlined />,
                      label: '编辑',
                      onClick: () => {
                        // 双击事件触发的操作
                        if (!!addWindowVisible || !!homeSettingVisible) {
                          setAddWindowVisible('');
                          setHomeSettingVisible('');
                          setFieldsValue({});
                        }
                        setTimeout(() => {
                          setFieldsValue(homeSettingData?.['footer-1']);
                          setHomeSettingVisible('footer-1');
                        }, 500);
                      },
                    },
                    {
                      type: 'divider',
                    },
                    {
                      key: '2',
                      icon: <DeleteOutlined />,
                      label: '删除',
                      onClick: () => {
                        deleteBasic('footer-1');
                      },
                    },
                  ]}
                />
              }
              trigger={['contextMenu']}
            >
              <div className="flex-box-center drag-item-content-mask common-card-title"></div>
            </Dropdown>
          ) : null}
        </div>
      </div>,
      <div key={'footer-2'}>
        <div
          className="log-content message-box drag-item-content-box background-ubv"
          style={
            homeSettingData['footer-2']?.backgroundColor === 'default'
              ? {}
              : homeSettingData['footer-2']?.backgroundColor === 'transparent'
                ? { backgroundColor: 'transparent' }
                : { backgroundImage: `url(${homeSettingData['footer-2']?.backgroundColor})` }
          }
        >
          {homeSettingData['footer-2']?.ifShowHeader ? (
            <div className="common-card-title-box flex-box ">
              <div className="flex-box common-card-title">错误信息</div>
            </div>
          ) : null}
          <div className="card-body-box">
            <div className="content-item-span">
              {errorData
                ?.slice(errorData?.length - (homeSettingData['footer-2']?.logSize || 50))
                ?.map?.((log: any, index: number) => {
                  const { color, node_name, nid, message, time } = log;
                  return (
                    <div className="log-item flex-box-start" key={index}>
                      <div className="log-item-content">
                        <div className="content-item" style={homeSettingData['footer-2']}>
                          <span
                            style={{
                              fontSize: homeSettingData['footer-2']?.fontSize + 2 || 'inherit',
                            }}
                          >
                            {time || moment().format('YYYY-MM-DD HH:mm:ss')}&nbsp;
                          </span>
                          &nbsp;
                          <div
                            className="content-item-span"
                            style={{
                              color,
                              fontSize: homeSettingData['footer-2']?.fontSize || 'inherit',
                            }}
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
              <CompressOutlined
                className="preview-icon"
                onClick={() => {
                  setLogDataVisible('error');
                }}
              />
            </div>
          </div>
          {ifCanEdit ? (
            <Dropdown
              overlayClassName="edit-canvas-dropdown"
              overlay={
                <Menu
                  items={[
                    {
                      key: '1',
                      icon: <EditOutlined />,
                      label: '编辑',
                      onClick: () => {
                        // 双击事件触发的操作
                        if (!!addWindowVisible || !!homeSettingVisible) {
                          setAddWindowVisible('');
                          setHomeSettingVisible('');
                          setFieldsValue({});
                        }
                        setTimeout(() => {
                          setFieldsValue(homeSettingData?.['footer-2']);
                          setHomeSettingVisible('footer-2');
                        }, 500);
                      },
                    },
                    {
                      type: 'divider',
                    },
                    {
                      key: '2',
                      icon: <DeleteOutlined />,
                      label: '删除',
                      onClick: () => {
                        deleteBasic('footer-2');
                      },
                    },
                  ]}
                />
              }
              trigger={['contextMenu']}
            >
              <div className="flex-box-center drag-item-content-mask common-card-title"></div>
            </Dropdown>
          ) : null}
        </div>
      </div>,
    ],
    [
      started,
      taskDataConnect,
      loading,
      paramData,
      projectStatus,
      logStr,
      errorData,
      pageIconPosition,
      homeSettingData,
      homeSettingVisible,
    ],
  );
  // 删除基础组件
  const deleteBasic = (type: string) => {
    const home = gridHomeList?.map?.((item: any) => {
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
        contentData: Object.assign({}, prev?.contentData, { home }),
      });
    });
    setGridHomeList(home);
    setHomeSettingVisible('');
  };
  // 保存布局状态
  const saveGridFunc = (data: any) => {
    let home: any = [],
      content: any = [];

    data?.forEach?.((item: any) => {
      if (
        [
          'header',
          'slider-1',
          'slider-2',
          'slider-3',
          'slider-4',
          'content',
          'footer-1',
          'footer-2',
        ].includes(item.i)
      ) {
        home = home.concat(
          Object.assign(
            {},
            item,
            {
              maxW: 100,
              maxH: 200,
            },
            item.w > 0
              ? {
                minW: 1,
                minH: 2,
              }
              : {
                minW: 0,
                minH: 0,
              },
          ),
        );
      } else {
        const preContent = _.isArray(paramData?.contentData?.content)
          ? paramData?.contentData?.content?.filter((i: any) => i.id === item.i)[0]
          : paramData?.contentData?.content[item.i];
        content = content.concat({
          ...preContent,
          size: {
            ...item,
            minW: 1,
            minH: 2,
            maxW: 100,
            maxH: 200,
          },
        });
        // Object.assign({}, content, !!paramData?.contentData?.content[item.i] ? {
        //   [item.i]: {
        //     ...paramData?.contentData?.content[item.i],
        //     size: {
        //       ...item,
        //       maxW: 100,
        //       minW: 1,
        //       maxH: 200,
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
        contentData: Object.assign(
          {},
          paramData.contentData,
          { home },
          !_.isEmpty(content) ? { content } : {},
        ),
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
    const { flowData = {}, contentData = {}, selfStart = false } = paramsData;
    const homeSelf = [
      { i: 'header', x: 0, y: 0, w: 0, h: 0, minW: 0, maxW: 100, minH: 0, maxH: 200 },
      { i: 'slider-1', x: 0, y: 0, w: 9, h: 8, minW: 1, maxW: 100, minH: 2, maxH: 200 },
      { i: 'slider-2', x: 0, y: 8, w: 0, h: 0, minW: 0, maxW: 100, minH: 0, maxH: 200 },
      { i: 'slider-3', x: 0, y: 0, w: 0, h: 0, minW: 0, maxW: 100, minH: 0, maxH: 200 },
      { i: 'slider-4', x: 7, y: 0, w: 0, h: 0, minW: 0, maxW: 100, minH: 0, maxH: 200 },
      { i: 'footer-1', x: 7, y: 8, w: 0, h: 0, minW: 0, maxW: 100, minH: 0, maxH: 200 },
      { i: 'footer-2', x: 7, y: 0, w: 0, h: 0, minW: 0, maxW: 100, minH: 0, maxH: 200 },
    ];
    const {
      home = [],
      content = {},
      footerSelectList,
      contentHeader = {},
      pageIconPosition,
      contentSize,
      homeSetting = {
        'footer-1': { fontSize: 14 },
        'footer-2': { fontSize: 20 },
      },
      gridMargin,
    } = contentData;
    const { nodes = [] } = flowData;
    const list = nodes?.map?.((node: any) => {
      const { name, alias, id, ports = {} } = node;
      const { items = [] } = ports;
      return {
        key: id,
        value: id,
        title: `${alias || name}`,
        label: `${alias || name}`,
        children: items
          ?.filter((i: any) => i.group === 'bottom')
          ?.map?.((port: any) => {
            const { label } = port;
            const { name, alias } = label;
            const value = alias || name;
            return {
              value: name,
              label: value,
              disabled: name === 'value'
            };
          }),
      };
    });
    setNodeList(list);
    setFooterSelectList(footerSelectList || []);
    setGridHomeList(
      homeSelf?.map?.((item: any) => {
        return {
          ...item,
          ...home?.filter((i: any) => i.i === item.i)[0],
        };
      }),
    );
    setHomeSettingData(homeSetting);
    setPageIconPosition(pageIconPosition || {});
    let newParams = paramsData;
    if (!contentSize?.width || !contentSize?.height) {
      newParams = Object.assign({}, newParams, {
        contentData: Object.assign({}, newParams?.contentData, {
          contentSize: { width: 1600, height: 900 },
        }),
      });
    }
    if (!_.isNumber(gridMargin)) {
      newParams = Object.assign({}, newParams, {
        contentData: Object.assign({}, newParams?.contentData, {
          gridMargin: 8,
        }),
      });
    }
    // if (!_.isBoolean(contentData?.autoSize)) {
    //   newParams = Object.assign({}, newParams, {
    //     contentData: Object.assign({}, newParams?.contentData, {
    //       autoSize: true,
    //     })
    //   });
    // }
    // 记录tab切换组件的页数
    if (!!localStorage.getItem(`localGridContent-tab-${newParams.id}`)) {
      setTabNum(Number(localStorage.getItem(`localGridContent-tab-${newParams.id}`)));
    }
    if (!_.isObject(contentHeader) || _.isEmpty(contentHeader)) {
      const header = {};
      // 默认显示/隐藏header
      home?.forEach?.(
        (item: any) => (header[item.i] = item.i !== 'slider-4' && item.i !== 'slider-1'),
      );
      if (_.isArray(content)) {
        content?.forEach?.((item: any) => (header[item.id] = true));
      } else {
        Object.entries(content)?.forEach?.((item: any) => {
          const { value, type } = item[1];
          const id = `${value?.join('$$')}$$${type}`;
          header[id] = true;
        });
      }

      newParams = Object.assign({}, paramsData, {
        contentData: Object.assign({}, contentData, {
          contentHeader: header,
          autoSize: _.isBoolean(contentData?.autoSize) ? contentData?.autoSize : true,
        }),
      });
    }
    if (!!content) {
      if (_.isArray(content)) {
        dispatch({
          type: 'home/set',
          payload: {
            gridContentList: content?.map?.((item: any) => ({
              ...item,
              key: item.id?.split('$$')?.[0],
            })),
          },
        });
        dispatch({ type: 'home/snapshot' });
        setAddContentList(content);
        setParamData(newParams);
        if (!!content?.length) {
          setInitialState((preInitialState: any) => ({
            ...preInitialState,
            params: newParams,
          }));
        }
      } else {
        const result = Object.entries(content || {})?.map?.((item: any) => {
          const { value, type, size } = item[1];
          const id = `${value?.join('$$')}$$${type}`;
          return {
            ...item[1],
            id,
            size: Object.assign({}, size, {
              i: id,
            }),
            key: id.split('$$')?.[0],
          };
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
          }),
        });

        setInitialState((preInitialState: any) => ({
          ...preInitialState,
          params: resultParams,
        }));
        setParamData(resultParams);
      };
      dispatch({
        type: 'home/set',
        payload: {
          params: newParams,
        },
      });
    }
    if (ifCanEdit) {
      form2.setFieldsValue({
        canvasWidth: newParams?.contentData?.contentSize?.width,
        canvasHeight: newParams?.contentData?.contentSize?.height,
      });
    }

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
    if (!ipString || ifCanEdit) return;
    getServiceStatus();
  }, [projectStatus]);
  // 监控窗口动态添加
  useEffect(() => {
    if (!_.isEmpty(addContentList) && !_.isEmpty(paramData)) {
      const newGridContentList = !!localStorage.getItem(`localGridContentList-${paramData.id}`)
        ? JSON.parse(localStorage.getItem(`localGridContentList-${paramData.id}`) || '{}')
        : [];
      if (!_.isArray(newGridContentList)) {
        localStorage.removeItem(`localGridContentList-${paramData.id}`);
        window.location.reload();
      }
      let listData: any = [],
        layoutData: any = [],
        resultData: any = [];
      addContentList?.forEach?.((item: any, index: number) => {
        const {
          id: key,
          size,
          value: __value = [],
          type,
          yName,
          xName,
          defaultImg,
          tableFontSize,
          fontSize,
          reverse,
          direction,
          symbol,
          fetchType,
          httpRotation, httpRotationTime,
          ifFetch,
          fetchParams,
          align,
          hiddenAxis,
          labelInxAxis,
          labelDirection,
          barRadius,
          showBackground,
          showWithLine,
          backgroundColor = 'default',
          barColor = 'default',
          progressType = 'line',
          progressSize = 8,
          progressSteps = 5,
          des_bordered,
          des_column,
          des_layout,
          des_size,
          ifLocalStorage,
          CCDName,
          imgs_width,
          imgs_height,
          tableSize,
          magnifier,
          comparison,
          operationList,
          dataZoom,
          fontColor,
          interlacing,
          modelRotate,
          modelScale,
          modelRotateScreenshot,
          password,
          passwordHelp,
          ifShowHeader,
          ifShowColorList,
          headerBackgroundColor,
          basicInfoData = [{ id: guid(), name: '', value: '' }],
          ifNeedClear,
          ifUpdateProject,
          ifUpdatetoInitParams,
          magnifierSize,
          listType,
          valueColor,
          blockType,
          blockTypeLines,
          modelUpload,
          xColumns,
          yColumns,
          platFormOptions,
          ifFetchParams,
          ifNeedAllow,
          lineNumber,
          columnNumber,
          magnifierWidth,
          magnifierHeight,
          ifPopconfirm,
          showImgList,
          notLocalStorage,
          imgListNum,
          showFooter,
          markNumberLeft,
          markNumberTop,
          line_height,
          staticHeight,
          fileTypes,
          fileFetch,
          titlePaddingSize = 0,
          bodyPaddingSize = 0,
          showLabel,
          titleBackgroundColor,
          titleFontSize = 20,
          valueOnTop = false,
          timeSelectDefault,
          iconSize,
          parentBodyBox,
          parentBodyBoxTab,
        } = item;
        // const id = key?.split('$$')[0];
        const gridValue = gridContentList?.filter((i: any) => i?.id === key)?.[0];
        const newGridValue = newGridContentList?.filter((i: any) => i?.id === key)?.[0];
        // socket有数据就渲染新的，没有就渲染localStorage缓存的
        const dataValue = gridValue?.[__value[1]] || newGridValue?.[__value[1]] || undefined;
        const parent = paramData?.flowData?.nodes?.filter((i: any) => i.id === __value[0]);
        const { alias, name, ports = {} } = parent?.[0] || {};
        const { items = [] } = ports;
        const SecLabel = items?.filter(
          (i: any) => i.group === 'bottom' && i?.label?.name === __value[1],
        )[0];
        if (
          !['modal'].includes(type) &&
          !ifCanEdit &&
          ((size?.x < (tabNum * 96 - 10))
            ||
            (size?.x > ((tabNum + 1) * 96)))
        ) {

        } else {
          listData = listData.concat(
            <div
              key={key}
              className={`drag-item-content-box background-ubv`}
              // @ts-ignore
              style={Object.assign(
                {},
                ['imgButton', 'heatMap'].includes(type)
                  ? { backgroundColor: 'transparent' }
                  : ['default'].includes(backgroundColor)
                    ? {}
                    : backgroundColor === 'border'
                      ? { paddingTop: (titleFontSize / 4) * 3, backgroundColor: 'transparent' }
                      : backgroundColor === 'transparent'
                        ? { backgroundColor: 'transparent' }
                        : backgroundColor === 'black'
                          ? { backgroundColor: 'black' }
                          : {
                            backgroundImage: `url(${type === 'img' &&
                              (dataValue?.status == 'NG' || dataValue?.status?.value == 'NG')
                              ? dataItemImageNG
                              : backgroundColor
                              })`,
                            backgroundColor: 'transparent',
                          },
                (
                  !!parentBodyBox && parentBodyBoxTab != bodyBoxTab
                  // ||
                  // size?.x < tabNum * 96 - 10
                  // ||
                  // (size?.x > ((tabNum + 1) * 96))
                )
                  ? { visibility: 'hidden' } : {},
                (
                  !['modal'].includes(type) &&
                  !ifCanEdit &&
                  ((size?.x < (tabNum * 96 - 10))
                    ||
                    (size?.x > ((tabNum + 1) * 96)))
                ) ? { display: 'none' } : {}
              )}
            >
              {!['default', 'transparent'].includes(backgroundColor) ? (
                <div
                  className={`flex-box data-screen-card-title-box ${['border'].includes(backgroundColor) ? 'data-screen-card-title-box-border' : ''
                    }`}
                  style={Object.assign(
                    {},
                    { fontSize: titleFontSize, padding: titlePaddingSize },
                    ['border'].includes(backgroundColor)
                      ? { padding: 0 }
                      : { backgroundImage: `url(${titleBackgroundColor})` },
                  )}
                >
                  {['border'].includes(backgroundColor) ? (
                    <div
                      className="data-screen-card-title-box-border-bg"
                      style={{ top: (titleFontSize / 4) * 3 }}
                    />
                  ) : null}
                  <div className="data-screen-card-title">{CCDName}</div>
                </div>
              ) : null}
              {ifShowHeader ? (
                <div className="common-card-title-box flex-box">
                  <TooltipDiv className="flex-box common-card-title">
                    {`${CCDName || alias || name || '无效的节点'}`}
                    <span className="title-span">{`- ${SecLabel?.label?.alias || __value[1] || ''
                      }`}</span>
                  </TooltipDiv>
                </div>
              ) : null}
              <div
                className={`card-body-box ${backgroundColor === 'border' ? 'background-ubv' : ''}`}
                style={Object.assign(
                  {},
                  ifShowHeader
                    ? { height: 'calc(100% - 28px)' }
                    : !['default', 'transparent'].includes(backgroundColor)
                      ? { height: `calc(100% - ${(titleFontSize / 2) * 3 + titlePaddingSize * 2}px)` }
                      : { height: '100%' },
                  backgroundColor === 'border'
                    ? {
                      border: '2px solid rgba(144,144,144,0.6)',
                      borderRadius: 6,
                      height: '100%',
                      padding: `${titleFontSize / 2 + bodyPaddingSize
                        }px ${bodyPaddingSize}px ${bodyPaddingSize}px`,
                    }
                    : { padding: bodyPaddingSize },
                )}
              >
                <div className="flex-box-center" style={{ height: '100%' }}>
                  {!parent?.[0] &&
                    type?.indexOf('button') < 0 &&
                    ![
                      'bodyBox',
                      'form',
                      'switchBox',
                      'segmentSwitch',
                      'rangeDomain',
                      'rectRange',
                      'modelSwitch',
                      'iframe',
                      'timeSelect',
                      'httpTable',
                    ].includes(type) ? (
                    '请重新绑定数据节点'
                  ) : type === 'line' ? (
                    <LineCharts
                      id={key}
                      setMyChartVisible={setMyChartVisible}
                      data={{
                        dataValue: dataValue || [],
                        yName,
                        xName,
                        dataZoom,
                      }}
                    />
                  ) : type === 'point' ? (
                    <PointCharts
                      id={key}
                      setMyChartVisible={setMyChartVisible}
                      data={{
                        dataValue: dataValue || [],
                        yName,
                        xName,
                        direction,
                        symbol,
                        dataZoom,
                        ifShowColorList,
                      }}
                    />
                  ) : type === 'bar' ? (
                    <BarCharts
                      id={key}
                      setMyChartVisible={setMyChartVisible}
                      data={{
                        dataValue: dataValue || [],
                        fontSize,
                        yName,
                        xName,
                        direction,
                        align,
                        hiddenAxis,
                        labelInxAxis,
                        labelDirection,
                        barRadius,
                        showBackground,
                        showWithLine,
                        barColor,
                      }}
                    />
                  ) : type === 'pie' ? (
                    <PieCharts
                      id={key}
                      setMyChartVisible={setMyChartVisible}
                      data={{
                        dataValue: dataValue || [],
                        fontSize,
                        yName,
                      }}
                    />
                  ) : type === 'pie3D' ? (
                    <Pie3DCharts
                      id={key}
                      setMyChartVisible={setMyChartVisible}
                      data={{
                        dataValue: dataValue || [],
                        fontSize,
                        xName,
                      }}
                    />
                  ) : type === 'nightingalePie' ? (
                    <NightingalePieCharts
                      id={key}
                      setMyChartVisible={setMyChartVisible}
                      data={{
                        dataValue: dataValue || [],
                        fontSize,
                      }}
                    />
                  ) : type === 'heatMap' ? (
                    <HeatMapCharts
                      id={key}
                      setMyChartVisible={setMyChartVisible}
                      data={{
                        dataValue: dataValue || [],
                        fontSize,
                        backgroundColor,
                      }}
                    />
                  ) : type === 'table' ? (
                    <TableCharts
                      id={key}
                      data={{
                        dataValue: dataValue || [],
                        tableFontSize,
                        yName,
                        xName,
                        fontSize,
                        reverse,
                        tableSize,
                        interlacing,
                        des_bordered,
                        headerBackgroundColor,
                        valueColor,
                        line_height,
                      }}
                    />
                  ) : type === 'table2' ? (
                    <Table2Charts
                      id={key}
                      data={{
                        dataValue: dataValue || [],
                        tableFontSize,
                        fontSize,
                        reverse,
                        tableSize,
                        interlacing,
                        des_bordered,
                        headerBackgroundColor,
                        valueColor,
                        line_height,
                        bodyPaddingSize,
                        des_layout,
                      }}
                    />
                  ) : type === 'table3' ? (
                    <Table3Charts
                      id={key}
                      data={{
                        dataValue: dataValue || [],
                        tableFontSize,
                        fontSize,
                        reverse,
                        tableSize,
                        interlacing,
                        des_bordered,
                        headerBackgroundColor,
                        valueColor,
                        line_height,
                      }}
                    />
                  ) : type === 'table4' ? (
                    <Table4Charts
                      id={key}
                      data={{
                        dataValue: dataValue || [],
                        tableFontSize,
                        fontSize,
                        reverse,
                        tableSize,
                        interlacing,
                        des_bordered,
                        headerBackgroundColor,
                        valueColor,
                        staticHeight,
                      }}
                    />
                  ) : type === 'table5' ? (
                    <TableEditCharts
                      id={key}
                      data={{
                        dataValue: dataValue || [],
                        tableFontSize,
                        fontSize,
                        fetchType,
                        xName,
                        yName,
                        ifFetch,
                      }}
                    />
                  ) : type === 'tableAntd' ? (
                    <TableAntdCharts
                      id={key}
                      data={{
                        dataValue: dataValue || [],
                        tableFontSize,
                        fontSize,
                        fetchType,
                        xName,
                        yName,
                        ifFetch,
                        reverse,
                        interlacing,
                        des_bordered,
                        headerBackgroundColor,
                        valueColor,
                        timeSelectDefault,
                        staticHeight,
                      }}
                    />
                  ) : type === 'rangeDomain' ? (
                    <RangeDomainCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        des_column,
                        line_height,
                        hiddenAxis,
                        labelInxAxis,
                        fetchType,
                        xName,
                        ifFetch,
                        barRadius,
                        timeSelectDefault,
                        parentBodyBoxTab,
                        formCustom,
                      }}
                    />
                  ) : type === 'rectRange' ? (
                    <RectRangeCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        fetchType,
                        xName,
                      }}
                    />
                  ) : type === 'modelSwitch' ? (
                    <ModelSwitchCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        fetchType,
                        xName,
                        parentBodyBoxTab,
                        formCustom,
                        addContentList,
                      }}
                    />
                  ) : type === 'tree' ? (
                    <TreeCharts
                      id={key}
                      data={{
                        dataValue: dataValue || [],
                        fontSize,
                        line_height,
                      }}
                    />
                  ) : type === 'three' ? (
                    <ThreeCharts
                      id={key}
                      data={{
                        dataValue: dataValue || { name: '', value: [] },
                        modelRotate,
                        modelScale,
                        modelRotateScreenshot,
                        fontSize,
                        fetchType,
                        xName,
                        ifShowColorList,
                        modelUpload,
                        yName,
                      }}
                    />
                  ) : type === 'fabric' ? (
                    <FabricCharts
                      id={key}
                      data={{
                        dataValue: dataValue || {},
                        fontSize,
                        fetchType,
                        xName,
                        yName,
                      }}
                    />
                  ) : type === 'alert' ? (
                    <AlertCharts
                      id={key}
                      data={{
                        dataValue: dataValue || [],
                        fontSize,
                        yName,
                      }}
                    />
                  ) : type === 'imgs' ? (
                    <ImgsCharts
                      id={key}
                      data={{
                        dataValue: dataValue || [],
                        imgs_width,
                        imgs_height,
                      }}
                    />
                  ) : type === 'progress' ? (
                    <ProgressCharts
                      id={key}
                      data={{
                        dataValue: dataValue || 0,
                        barColor,
                        progressType,
                        progressSize,
                        progressSteps,
                      }}
                    />
                  ) : type === 'description' ? (
                    <DescriptionCharts
                      id={key}
                      data={{
                        dataValue: dataValue || [],
                        basicInfoData,
                        fontSize,
                        des_bordered,
                        des_column,
                        des_layout,
                        des_size,
                      }}
                    />
                  ) : type === 'rank' ? (
                    <RankCharts
                      id={key}
                      data={{
                        dataValue: dataValue || [],
                        fontSize,
                        yName,
                      }}
                    />
                  ) : type === 'listSwitchImg' ? (
                    <ListSwitchImgCharts
                      id={key}
                      data={{
                        dataValue: dataValue || [],
                        fontSize,
                        yName
                      }}
                    />
                  ) : type === 'bodyBox' ? (
                    <BodyBoxCharts
                      id={key}
                      data={{
                        fontSize,
                        timeSelectDefault,
                        yName,
                        iconSize,
                        fetchParams,
                        direction,
                        addContentList,
                      }}
                    />
                  ) : type === 'form' ? (
                    <FormCharts
                      id={key}
                      data={{
                        dataValue,
                        titleFontSize,
                        fontSize,
                        timeSelectDefault,
                        yName,
                        xName,
                        fetchType,
                        modelUpload,
                        ifNeedAllow,
                        modelRotate,
                        passwordHelp,
                        direction,
                      }}
                    />
                  ) : type === 'nestForm' ? (
                    <NestFormCharts
                      id={key}
                      data={{
                        fontSize,
                        des_column,
                        des_bordered,
                        yName,
                      }}
                    />
                  ) : type === 'laminationImage' ? (
                    <IaminationImageCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        des_column,
                        markNumberLeft,
                        markNumberTop,
                      }}
                    />
                  ) : type === 'reJudgment' ? (
                    <ReJudgmentCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        xName,
                        fetchType,
                      }}
                    />
                  ) : type === 'httpTable' ? (
                    <AntdTableFromHttpCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        xName,
                        fetchType,
                        httpRotation, httpRotationTime,
                      }}
                    />
                  ) : type === 'cable' ? (
                    <CableCharts
                      id={key}
                      setMyChartVisible={setMyChartVisible}
                      data={{
                        dataValue,
                        fontSize,
                        dataZoom
                      }}
                    />
                  ) : type === 'button' ? (
                    <ButtonCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        yName,
                        xName,
                        fetchType,
                        ifNeedAllow,
                        valueColor,
                        des_bordered,
                        fetchParams,
                        line_height
                      }}
                    />
                  ) : type === 'timeSelect' ? (
                    <TimeSelectCharts
                      id={key}
                      data={{
                        fontSize,
                        yName,
                        xName,
                        fetchType,
                        timeSelectDefault,
                        modelRotate,
                      }}
                    />
                  ) : type === 'buttonInp' ? (
                    <ButtonInputCharts
                      id={key}
                      data={{
                        fontSize,
                        yName,
                        xName,
                        fetchType,
                        ifNeedClear,
                        valueColor,
                        des_bordered,
                        fetchParams,
                      }}
                    />
                  ) : type === 'buttonPassword' ? (
                    <ButtonPWCharts
                      id={key}
                      data={{
                        fontSize,
                        yName,
                        xName,
                        fetchType,
                        password,
                        passwordHelp,
                        fetchParams,
                        valueColor,
                        des_bordered,
                      }}
                    />
                  ) : type === 'buttonUpload' ? (
                    <ButtonUploadCharts
                      id={key}
                      data={{
                        fontSize,
                        yName,
                        xName,
                        fetchType,
                        fetchParams,
                        valueColor,
                        ifNeedAllow,
                        des_bordered,
                      }}
                    />
                  ) : type === 'switchBox' ? (
                    <SwitchBoxCharts
                      id={key}
                      data={{
                        dataValue,
                        dispatch,
                        fontSize,
                        yName,
                        timeSelectDefault,
                        des_column,
                        direction,
                        modelRotate,
                      }}
                    />
                  ) : type === 'segmentSwitch' ? (
                    <SegmentSwitchCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        yName,
                        des_layout,
                        des_bordered,
                        timeSelectDefault,
                        xName,
                        fetchType,
                        fetchParams,
                        ifNeedAllow,
                      }}
                    />
                  ) : type === 'operation' ? (
                    <OperationCharts
                      id={key}
                      data={{
                        operationList,
                        dataValue,
                        fontSize,
                        showLabel,
                        ifPopconfirm,
                        des_column,
                        des_bordered,
                        yName,
                        valueOnTop,
                        passwordHelp,
                        password,
                      }}
                    />
                  ) : type === 'operation2' ? (
                    <Operation2Charts
                      id={key}
                      data={{
                        operationList,
                        dataValue,
                        fontSize,
                        xName,
                        ifUpdateProject,
                        ifUpdatetoInitParams,
                        ifFetch,
                        ifPopconfirm,
                        showLabel,
                        des_column,
                        des_bordered,
                        yName,
                        valueOnTop,
                        passwordHelp,
                        password,
                      }}
                    />
                  ) : type === 'statistic' ? (
                    <StatisticCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        yName,
                        fontColor,
                        direction,
                        valueOnTop,
                      }}
                    />
                  ) : type === 'platForm' ? (
                    <PlatFormCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        fetchType,
                        xName,
                        ifFetch,
                        platFormOptions,
                      }}
                    />
                  ) : type === 'modal' ? (
                    <ModalCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        yName,
                        fetchType,
                        xName,
                        ifFetch,
                        ifFetchParams,
                      }}
                    />
                  ) : type === 'buttonImages' ? (
                    <ButtonImagesCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        reverse,
                        modelRotateScreenshot,
                        fetchType,
                        xName,
                      }}
                    />
                  ) : type === 'imgButton' ? (
                    <ImgButtonCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        xColumns,
                        fetchType,
                        xName,
                        yName,
                        markNumberLeft,
                        markNumberTop,
                        fileTypes,
                        fileFetch,
                      }}
                    />
                  ) : type === 'alertImg' ? (
                    <AlertImgCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        lineNumber,
                        columnNumber,
                        magnifier,
                        magnifierSize,
                      }}
                    />
                  ) : type === 'iframe' ? (
                    <IframeCharts
                      id={key}
                      data={{
                        dataValue,
                        xName,
                      }}
                    />
                  ) : type === 'imgContrast' ? (
                    <ImgContrastCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        modelRotateScreenshot,
                      }}
                    />
                  ) : type === 'formula' ? (
                    <FormulaCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        titleFontSize,
                        fetchType,
                        xName,
                        ifNeedAllow,
                      }}
                    />
                  ) : type === 'orderInformation' ? (
                    <OrderInformationCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        titleFontSize,
                        fetchType,
                        xName,
                        ifNeedAllow,
                      }}
                    />
                  ) : type === 'equipment' ? (
                    <EquipmentControlCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        titleFontSize,
                        ifNeedAllow,
                      }}
                    />
                  ) : type === 'paramControl' ? (
                    <StatisticsCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        titleFontSize,
                        fetchType,
                        xName,
                        yName,
                        ifNeedAllow,
                      }}
                    />
                  ) : type === 'connectStatus' ? (
                    <ModuleStatusCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        titleFontSize,
                      }}
                    />
                  ) : type === 'fastFunction' ? (
                    <FastFunctionCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        titleFontSize,
                        fetchType,
                        xName,
                        ifNeedAllow,
                      }}
                    />
                  ) : type === 'outputArea' ? (
                    <OutputAreaCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        titleFontSize,
                        fetchType,
                        xName,
                        ifNeedAllow,
                      }}
                    />
                  ) : type === 'equipmentInfo' ? (
                    <EquipmentInfoCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        xName,
                      }}
                    />
                  ) : type === 'countdown' ? (
                    <CountDownCharts
                      id={key}
                      data={{
                        dataValue,
                        fontSize,
                        fetchType,
                        xName,
                        ifFetchParams,
                        yName,
                      }}
                    />
                  ) : (
                    <ImgCharts
                      id={key}
                      data={{
                        defaultImg: !!defaultImg
                          ? `${BASE_IP}file${defaultImg?.indexOf('\\') === 0 || defaultImg?.indexOf('/') === 0
                            ? ''
                            : '\\'
                          }${defaultImg}`
                          : '',
                        fontSize,
                        dataValue,
                        showImgList,
                        notLocalStorage: _.isBoolean(notLocalStorage) ? !notLocalStorage : false,
                        imgListNum,
                        showFooter,
                        magnifier,
                        magnifierSize,
                        comparison,
                        ifShowHeader,
                        magnifierWidth,
                        magnifierHeight,
                        labelInxAxis,
                      }}
                    />
                  )}
                </div>
              </div>
              {ifCanEdit ? (
                <Dropdown
                  overlayClassName="edit-canvas-dropdown"
                  overlay={
                    <Menu
                      items={[
                        {
                          key: '1',
                          icon: <EditOutlined />,
                          label: '编辑',
                          onClick: () => {
                            // 双击事件触发的操作
                            if (!!addWindowVisible || !!homeSettingVisible) {
                              setAddWindowVisible('');
                              setHomeSettingVisible('');
                              setFieldsValue({});
                            }
                            setTimeout(() => {
                              !!defaultImg &&
                                setSelectedPath((prev: any) => ({ ...prev, value: defaultImg }));
                              setBasicInfoData(basicInfoData);
                              setEditWindowData(
                                Object.assign(
                                  {},
                                  item,
                                  !!item?.xColumns?.length ? {} : {},
                                  !!item?.yColumns?.length ? {} : {},
                                ),
                              );
                              setCommonSettingList(
                                (!!timeSelectDefault?.length ? timeSelectDefault : [{}])?.map?.(
                                  (item: any) => ({
                                    ...item,
                                    id: guid(),
                                  }),
                                ),
                              );
                              setFieldsValue(
                                Object.assign(
                                  {},
                                  item,
                                  !fontSize ? { fontSize: 12 } : {},
                                  !!backgroundColor && !!backgroundColor?.rgb
                                    ? { backgroundColor: backgroundColor }
                                    : {},
                                  type === 'platForm'
                                    ? {
                                      platFormOptions: !!platFormOptions
                                        ? platFormOptions
                                        : JSON.stringify({
                                          左上水平隔膜: {
                                            灰度差: {
                                              name: '灰度差',
                                              alias: '灰度差',
                                              require: true,
                                              default: 15,
                                              value: 15,
                                              type: 'int',
                                              description: '边界变化的灰度差',
                                              widget: {
                                                type: 'InputNumber',
                                                max: 255,
                                                min: 0,
                                                step: 1,
                                              },
                                            },
                                            灰度合并像素: {
                                              name: '灰度合并像素',
                                              alias: '灰度合并像素',
                                              require: true,
                                              default: 2,
                                              value: 2,
                                              type: 'int',
                                              description: '边界变化的灰度合并像素',
                                              widget: {
                                                type: 'InputNumber',
                                                max: 5,
                                                min: 1,
                                                step: 1,
                                              },
                                            },
                                            亮度变化方向: {
                                              name: '亮度变化方向',
                                              alias: '亮度变化方向',
                                              require: true,
                                              default: 2,
                                              value: 2,
                                              type: 'List[string]',
                                              description:
                                                '边界找线亮度变化方向, 1为亮到暗, 2为暗到亮',
                                              widget: {
                                                type: 'Select',
                                                options: [
                                                  { label: '1-亮到暗', value: 1 },
                                                  { label: '2-暗到亮', value: 2 },
                                                ],
                                              },
                                            },
                                            直线度: {
                                              name: '直线度',
                                              alias: '直线度',
                                              require: true,
                                              default: 3,
                                              value: 3,
                                              type: 'int',
                                              description: '直线度要求，值越小，线越直',
                                              widget: {
                                                type: 'InputNumber',
                                                max: 100,
                                                min: 1,
                                                step: 1,
                                              },
                                            },
                                            降噪滤波核: {
                                              name: '降噪滤波核',
                                              alias: '降噪滤波核',
                                              require: true,
                                              default: 5,
                                              value: 5,
                                              type: 'int',
                                              description: '去噪滤波核大小',
                                              widget: {
                                                type: 'InputNumber',
                                                max: 21,
                                                min: 1,
                                                step: 1,
                                              },
                                            },
                                            找线方向下采样倍数: {
                                              name: '找线方向下采样倍数',
                                              alias: '找线方向下采样倍数',
                                              require: true,
                                              default: 8,
                                              value: 8,
                                              type: 'int',
                                              description: '区域下采样倍数，提高计算速度',
                                              widget: {
                                                type: 'InputNumber',
                                                max: 16,
                                                min: 2,
                                                step: 2,
                                              },
                                            },
                                            垂直找线方向下采样倍数: {
                                              name: '垂直找线方向下采样倍数',
                                              alias: '垂直找线方向下采样倍数',
                                              require: true,
                                              default: 2,
                                              value: 2,
                                              type: 'int',
                                              description: '区域下采样倍数，提高计算速度',
                                              widget: {
                                                type: 'InputNumber',
                                                max: 16,
                                                min: 2,
                                                step: 2,
                                              },
                                            },
                                            搜索框个数: {
                                              name: '搜索框个数',
                                              alias: '搜索框个数',
                                              require: true,
                                              default: 15,
                                              value: 15,
                                              type: 'int',
                                              description: '搜索框个数',
                                              widget: {
                                                type: 'InputNumber',
                                                max: 1000,
                                                min: 3,
                                                step: 1,
                                              },
                                            },
                                            搜索框宽度: {
                                              name: '搜索框宽度',
                                              alias: '搜索框宽度',
                                              require: true,
                                              default: 6,
                                              value: 6,
                                              type: 'int',
                                              description: '搜索框宽度',
                                              widget: {
                                                type: 'InputNumber',
                                                max: 1000,
                                                min: 3,
                                                step: 1,
                                              },
                                            },
                                            找线方法: {
                                              name: '找线方法',
                                              alias: '找线方法',
                                              require: true,
                                              default: '卡尺找线',
                                              value: '卡尺找线',
                                              type: 'List[string]',
                                              description: '找线方法，1-卡尺找线，2-EDLines找线',
                                              widget: {
                                                type: 'Select',
                                                options: [
                                                  { label: '卡尺找线', value: '卡尺找线' },
                                                  { label: 'EDLine找线', value: 'EDLine找线' },
                                                ],
                                              },
                                            },
                                          },
                                        }),
                                    }
                                    : {},
                                ),
                              );
                              setShowPanels({
                                common: true,
                                custom: true,
                              });
                              setColorSelector((prev: any) => ({
                                ...prev,
                                ...(!!fontColor && !!fontColor?.rgb
                                  ? { fontColor: fontColor.rgb }
                                  : {}),
                                ...(!!backgroundColor && !!backgroundColor?.rgb
                                  ? { backgroundColor: backgroundColor?.rgb }
                                  : {}),
                              }));

                              setWindowType(type);
                              if (type === 'operation2') {
                                const res = paramsData?.flowData?.nodes.filter(
                                  (i: any) => i.id === __value[0],
                                )?.[0];
                                if (!!res) {
                                  const { config = {} } = res;
                                  if (!!config?.execParams && _.isObject(config?.execParams)) {
                                    setSelectedNodeConfig(() =>
                                      Object.entries(config.execParams)?.map?.((item: any) => {
                                        return {
                                          label: item[1]?.alias,
                                          value: item[0],
                                        };
                                      }),
                                    );
                                  } else if (!!config?.initParams && _.isObject(config?.initParams)) {
                                    setSelectedNodeConfig(() =>
                                      Object.entries(config.initParams)?.map?.((item: any) => {
                                        return {
                                          label: item[1]?.alias,
                                          value: item[0],
                                        };
                                      }),
                                    );
                                  }
                                }
                              } else {
                                const res = paramsData?.flowData?.nodes.filter(
                                  (i: any) => i.id === __value[0],
                                )?.[0];
                                if (!!res) {
                                  const { config = {} } = res;
                                  if (!!config?.initParams && _.isObject(config?.initParams)) {
                                    setSelectedNodeConfig(() =>
                                      Object.entries(config.initParams)?.map?.((item: any) => {
                                        return {
                                          label: item[1]?.alias,
                                          value: item[0],
                                        };
                                      }),
                                    );
                                  }
                                }
                              }
                              setAddWindowVisible(key);
                            }, 500);
                          },
                        },
                        {
                          type: 'divider',
                        },
                        {
                          key: '2',
                          icon: <CopyOutlined />,
                          label: '复制',
                          onClick: () => {
                            // 复制监控窗口
                            const uuid32 = getuid();
                            addWindow({
                              ..._.omit(item, 'id'),
                              value: [uuid32],
                              type,
                              size: {
                                x: size?.x + size.w >= 96 ? size?.x - size.w : size?.x + size.w,
                                y: size.y,
                              },
                            });
                          },
                        },
                        {
                          key: '3',
                          icon: <DeleteOutlined />,
                          label: '删除',
                          onClick: () => {
                            const result = addContentList?.filter((item: any) => item.id !== key);
                            setAddContentList(result);
                            dispatch({
                              type: 'home/set',
                              payload: {
                                gridContentList: result,
                              },
                            });
                            dispatch({ type: 'home/snapshot' });
                            setParamData((prev: any) =>
                              Object.assign({}, prev, {
                                contentData: Object.assign({}, prev.contentData, { content: result }),
                              }),
                            );
                            setAddWindowVisible('');
                            setHomeSettingVisible('');
                          },
                        },
                      ]}
                    />
                  }
                  trigger={['contextMenu']}
                >
                  <div
                    style={Object.assign(
                      {},
                      ['table2', 'table3'].includes(type)
                        ? {
                          height: `calc(100% - 80px - ${bodyPaddingSize}px)`,
                          marginTop: 80 + bodyPaddingSize,
                        }
                        : {},
                      type === 'bodyBox'
                        ? {
                          top: '90%',
                        }
                        : {},
                    )}
                    className="flex-box-center drag-item-content-mask common-card-title"
                  ></div>
                </Dropdown>
              ) : null}
            </div>,
          );
          layoutData = layoutData.concat(
            ['modal'].includes(type) && !ifCanEdit ? { ...size, w: 0, minW: 0, h: 0, minH: 0 } : size,
          );
        }
        if (!!ifLocalStorage) {
          resultData = resultData.concat(
            !!dataValue && !['operation2'].includes(type)
              ? {
                ...item,
                [__value[1]]: ['three', 'buttonImages', 'imgButton', 'button'].includes(type)
                  ? _.omit(dataValue, 'action')
                  : ['fabric', 'modelSwitch', 'reJudgment', 'cable'].includes(type)
                    ? undefined
                    : ['laminationImage'].includes(type) ?
                      {
                        ...(item?.[__value[1]] || {}),
                        ...(dataValue || {})
                      }
                      : dataValue,
              }
              : item,
          );
        }
      });
      try {
        localStorage.setItem(`localGridContentList-${paramData.id}`, JSON.stringify(resultData));
      } catch (err) {
        console.log('缓存报错：', err);
      }
      setContentList(listData);
      setContentLayout(layoutData);
    } else {
      setContentList([]);
    }
  }, [gridContentList, addContentList, addWindowVisible, bodyBoxTab, tabNum]);
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
          setTimeout(() => {
            setLoading(false);
          }, homeSettingData?.['slider-1']?.delay * 1000 || 0);
        } else {
          setTimeout(() => {
            startProjects(list[index + 1], list, index + 1, projectStatus);
          }, 1000);
        }
      });
    } else {
      if (index + 1 === list?.length) {
        setTimeout(() => {
          setLoading(false);
        }, homeSettingData?.['slider-1']?.delay * 1000 || 0);
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
          setTimeout(() => {
            setLoading(false);
          }, homeSettingData?.['slider-1']?.delay * 1000 || 0);
        } else {
          endProjects(list[index + 1], list, index + 1, projectStatus);
        }
      });
    }
  };
  // 启动任务
  const start = () => {
    if (!ipString) {
      return;
    } else {
      setLoading(true);
      const params = Object.assign({}, _.omit(paramsData, 'edges'), {
        flowData: Object.assign({}, paramsData?.flowData, {
          edges: (paramsData?.flowData?.edges || []).filter((edge: any) => {
            return (paramsData?.flowData?.nodes || []).filter(
              (node: any) => node.id === edge?.source?.cell || node.id === edge?.target?.cell,
            ).length;
          }),
        }),
      });
      updateParams({
        id: params.id,
        data: params,
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
              message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
            }
            if (
              !homeSettingData?.['slider-1']?.controlList ||
              homeSettingData?.['slider-1']?.controlList?.length === 0
            ) {
              setTimeout(() => {
                setLoading(false);
              }, homeSettingData?.['slider-1']?.delay * 1000 || 0);
            }
          });
        } else {
          message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
          if (
            !homeSettingData?.['slider-1']?.controlList ||
            homeSettingData?.['slider-1']?.controlList?.length === 0
          ) {
            setTimeout(() => {
              setLoading(false);
            }, homeSettingData?.['slider-1']?.delay * 1000 || 0);
          }
        }
      });
      homeSettingData?.['slider-1']?.controlList?.forEach?.((item: any, index: number) => {
        const { ip, url } = item;
        startFlowService(ip || '', url).then((res: any) => {
          if (res && res.code === 'SUCCESS') {
            message.success('任务启动成功');
          } else {
            message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
          }
          if (index + 1 === homeSettingData?.['slider-1']?.controlList?.length) {
            setTimeout(() => {
              setLoading(false);
            }, (homeSettingData?.['slider-1']?.delay || 0) * 1000 + 2000);
          }
        });
      });
    }
  };
  // 停止任务
  const end = () => {
    return new Promise((resolve: any, reject: any) => {
      if (!ipString) {
        reject(false);
      } else {
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
            message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
          }
          if (
            !homeSettingData?.['slider-1']?.controlList ||
            homeSettingData?.['slider-1']?.controlList?.length === 0
          ) {
            setTimeout(() => {
              setLoading(false);
              resolve(true);
            }, homeSettingData?.['slider-1']?.delay * 1000 || 0);
          }
        });
        homeSettingData?.['slider-1']?.controlList?.forEach?.((item: any, index: number) => {
          const { ip, url } = item;
          stopFlowService(ip || '', url).then((res: any) => {
            if (res && res.code === 'SUCCESS') {
              message.success('任务停止成功');
            } else {
              message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
            }
            if (index + 1 === homeSettingData?.['slider-1']?.controlList?.length) {
              setTimeout(() => {
                resolve(true);
                setLoading(false);
              }, 3000); // (homeSettingData?.['slider-1']?.delay || 0) * 1000 + 2000);
            }
          });
        });
      }
    });
  };
  // 重启任务
  const reStart = () => {
    if (!ipString) return;
    setLoading(true);
    end()
      .then((res) => {
        if (res) {
          setTimeout(() => {
            start();
          }, 3000);
        }
      })
      .catch((err) => console.log(err));
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
    // const logContent = logs?.map?.((item: any) => item.data);
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
    //   errors?.filter((item: any) => isJSON(item.data))?.forEach?.((msg: any) => {
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
    if (started && ipString && dispatch && !ifCanEdit) {
      // dispatch({ type: 'home/set', payload: {started: true} });
      const logModal = gridHomeList?.filter((item: any) => item.i === 'footer-1')[0];
      // 没有日志窗口，就不开启日志的socket
      if (!!logModal && logModal?.w && logModal?.h) {
        socketLogListen.listen(dispatch, logThrottleAndMerge);
      }
      socketErrorListen.listen(dispatch, errorThrottleAndMerge);
      socketDataListen.listen(dispatch);
      socketStateListen.listen(dispatch);

      // 一个小时自动重连日志socket
      if (logReloadTimer.current) {
        clearInterval(logReloadTimer.current);
      }
      logReloadTimer.current = setInterval(() => {
        socketErrorListen.close(dispatch);
        socketLogListen.close(dispatch);
        setTimeout(() => {
          if (!!logModal && logModal?.w && logModal?.h) {
            socketLogListen.listen(dispatch, logThrottleAndMerge);
          }
          socketErrorListen.listen(dispatch, errorThrottleAndMerge);
        }, 1000);
      }, 1000 * 60 * 60);
    } else {
      onclose();
    }

    return () => {
      // onclose();
    };
  }, [started, dispatch]);
  // 添加监控窗口
  const addWindow = (values: any) => {
    const { value, size, type, fetchParams, ...rest } = values;
    if (['button', 'buttonInp', 'buttonPassword', 'buttonUpload'].includes(type) && !!fetchParams) {
      try {
        JSON.parse(fetchParams);
      } catch (e) {
        message.error('传递参数 格式不正确');
        return;
      }
    }
    const id = `${value?.join('$$')}$$${type}`;
    if (_.isEmpty(editWindowData) && addContentList?.filter((i: any) => i.id === id).length) {
      message.error('已存在，请求改 “模块，节点，类型” 中的任一项');
      return;
    }
    let result: any = [];
    if (_.isEmpty(editWindowData)) {
      result = addContentList.concat(
        Object.assign(
          {},
          {
            id,
            value,
            size: {
              i: id,
              x: 16,
              y: 0,
              w: 10,
              h: 8,
              minW: 1,
              maxW: 100,
              minH: 2,
              maxH: 200,
              ...size,
            },
            type,
            fetchParams,
            ...rest,
          },
          ['description'].includes(windowType) ? { basicInfoData } : {},
        ),
      );
    } else {
      result = (addContentList || [])?.map?.((item: any) => {
        if (item.id === `${editWindowData?.value?.join('$$')}$$${editWindowData.type}`) {
          return Object.assign(
            {},
            {
              id,
              value,
              size: Object.assign({}, editWindowData.size, { i: id }),
              type,
              fetchParams,
              ...rest,
            },
            ['description'].includes(windowType) ? { basicInfoData } : {},
          );
        }
        return item;
      });
    }
    setAddContentList(result);
    if (paramsData.id) {
      setParamData((prev: any) =>
        Object.assign({}, prev, {
          contentData: Object.assign({}, prev.contentData, { content: result }),
        }),
      );
    }
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
      value: [],
      type: 'img',
      yName: undefined,
      xName: undefined,
      fontSize: undefined,
      reverse: false,
      direction: 'column',
      symbol: 'rect',
      fetchType: undefined,
      httpRotation: false,
      httpRotationTime: 1000,
      ifFetch: false,
      fetchParams: undefined,
      align: 'left',
      hiddenAxis: false,
      labelInxAxis: false,
      showBackground: false,
      showWithLine: false,
      barRadius: false,
      labelDirection: 'none',
      backgroundColor: 'default',
      barColor: 'default',
      progressType: 'line',
      progressSize: 8,
      progressSteps: 5,
      ifLocalStorage: undefined,
      CCDName: undefined,
      magnifier: false,
      comparison: false,
      operationList: [],
      dataZoom: 0,
      fontColor: undefined,
      tableFontSize: 14,
      interlacing: false,
      modelRotate: false,
      modelScale: false,
      modelRotateScreenshot: false,
      password: undefined,
      passwordHelp: undefined,
      ifShowHeader: false,
      ifShowColorList: false,
      headerBackgroundColor: 'default',
      ifNeedClear: false,
      ifUpdateProject: false,
      ifUpdatetoInitParams: false,
      magnifierSize: 4,
      logSize: 50,
      listType: 'line',
      markNumber: false,
      markNumberLeft: 1,
      markNumberTop: 1,
      blockType: 'normal',
      blockTypeLines: 2,
      modelUpload: false,
      xColumns: undefined,
      yColumns: undefined,
      platFormOptions: undefined,
      ifFetchParams: false,
      ifNeedAllow: false,
      lineNumber: undefined,
      columnNumber: undefined,
      magnifierWidth: undefined,
      magnifierHeight: undefined,
      ifPopconfirm: true,
      showImgList: false,
      notLocalStorage: false,
      imgListNum: 6,
      showFooter: false,
      titlePaddingSize: 0,
      bodyPaddingSize: 0,
      showLabel: true,
      titleBackgroundColor: 'transparent',
      titleFontSize: 20,
      valueOnTop: false,
      timeSelectDefault: 'day',
      iconSize: 24,
    });
    setWindowType('img');
    setAddWindowVisible('');
    setFooterSelectVisible(false);
    setOverallVisible(false);
    setHomeSettingVisible('');
  };
  useEffect(() => {
    setFieldsValue({
      xColumns: editWindowData?.xColumns,
      yColumns: editWindowData.yColumns,
    });
  }, [editWindowData?.xColumns, editWindowData.yColumns]);
  // 分段开关选项
  const onSegmentSwitchChange = (value: any, index: number, type: string) => {
    let list: any = [];
    if (type === 'remove') {
      setCommonSettingList([]);
      list = commonSettingList
        ?.map?.((cen: any, cIndex: number) => {
          if (cen.id === index) {
            return null;
          }
          return cen;
        })
        .filter(Boolean);
      console.log(list);
    } else if (type === 'add') {
      list = (commonSettingList || [])?.concat({});
    } else {
      list = commonSettingList?.map?.((cen: any, cIndex: number) => {
        if (cIndex === index) {
          return {
            ...cen,
            [type]: value,
          };
        }
        return cen;
      });
    }
    setTimeout(() => {
      setCommonSettingList(list?.map?.((item: any) => ({ ...item, id: guid() })));
      form.setFieldsValue({
        timeSelectDefault: list,
      });
    });
  };
  // slider-1控制列表
  const onSliderControlChange = (value: any, index: number, type: string) => {
    let list: any = [];
    if (type === 'remove') {
      setCommonSettingList([]);
      list = commonSettingList
        ?.map?.((cen: any, cIndex: number) => {
          if (cen.id === index) {
            return null;
          }
          return cen;
        })
        .filter(Boolean);
    } else if (type === 'add') {
      list = (commonSettingList || [])?.concat('');
    } else {
      list = commonSettingList?.map?.((cen: any, cIndex: number) => {
        if (cIndex === index) {
          return {
            ...cen,
            [type]: value,
          };
        }
        return cen;
      });
    }
    setTimeout(() => {
      setCommonSettingList(list?.map?.((item: any) => ({ ...item, id: guid() })));
      form.setFieldsValue({
        controlList: list,
      });
    });
  };
  // 盒子窗口
  const onBodyBoxChange = (value: any, index: number, type: string) => {
    let list = [].concat(commonSettingList);
    if (type === 'remove') {
      setCommonSettingList([]);
      list = commonSettingList
        ?.map?.((cen: any, cIndex: number) => {
          if (cen.id === index) {
            return null;
          }
          return cen;
        })
        .filter(Boolean);
    } else if (type === 'add') {
      list = (commonSettingList || [])?.concat({ sort: commonSettingList.length });
    } else if (type === 'up') {
      setCommonSettingList([]);
      list = commonSettingList?.map?.((cen: any, cIndex: number) => {
        if (cIndex === index - 1) {
          return {
            ...cen,
            sort: index,
          };
        } else if (cIndex === index) {
          return {
            ...cen,
            sort: index - 1,
          };
        }
        return cen;
      });
    } else {
      list = commonSettingList?.map?.((cen: any, cIndex: number) => {
        if (cIndex === index) {
          return {
            ...cen,
            [type]: value,
          };
        }
        return cen;
      });
    }
    setTimeout(() => {
      setCommonSettingList(list?.map?.((item: any) => ({ ...item, id: guid() })));
      form.setFieldsValue({
        timeSelectDefault: list,
      });
    });
  };
  // 表单窗口
  const onFormChartsChange = (value: any, index: number, type: string, parent?: string) => {
    let list = [].concat(commonSettingList);
    if (type === 'remove') {
      setCommonSettingList([]);
      list = commonSettingList
        ?.map?.((cen: any, cIndex: number) => {
          if (cen.id === index) {
            return null;
          }
          return cen;
        })
        .filter(Boolean);
    } else if (type === 'add') {
      list = (commonSettingList || [])?.concat({ sort: commonSettingList.length });
    } else if (type === 'addChild') {
      list = (commonSettingList || [])?.concat({ sort: commonSettingList.length, parent });
    } else if (type === 'up') {
      setCommonSettingList([]);
      list = commonSettingList?.map?.((cen: any, cIndex: number) => {
        if (cIndex === index - 1) {
          return {
            ...cen,
            sort: index,
          };
        } else if (cIndex === index) {
          return {
            ...cen,
            sort: index - 1,
          };
        }
        return { sort: cIndex, ...cen };
      });
    } else {
      list = commonSettingList?.map?.((cen: any, cIndex: number) => {
        if (cIndex === index) {
          return {
            ...cen,
            [type]: value,
          };
        }
        return cen;
      });
    }
    setTimeout(() => {
      setCommonSettingList(list?.map?.((item: any) => ({ id: guid(), ...item })));
      form.setFieldsValue({
        timeSelectDefault: list,
      });
    });
  };
  // tab切换
  const onTabChange = (index: number) => {
    localStorage.setItem(`localGridContent-tab-${paramData.id}`, index + '');
    setTabNum(index);
  };

  return (
    <div className={`flex-box-column ${styles.home}`}>
      <div className="flex-box home-body">
        {ifCanEdit ? (
          <DndProvider backend={HTML5Backend}>
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
                <div className="left-panel-search-box">
                  <div className="flex-box-justify-between left-panel-search">
                    全部
                    <span>Plugins</span>
                  </div>
                  <Input.Search
                    onSearch={(val) => {
                      if (!!val) {
                        setLeftPanelData((prev: any) => {
                          return (leftPanelDataLocal || [])?.map?.((box: any) => {
                            return {
                              ...box,
                              children: box?.children?.filter(
                                (child: any) =>
                                  child?.label?.indexOf?.(val) > -1 ||
                                  child?.value?.indexOf?.(val) > -1,
                              ),
                            };
                          });
                        });
                      } else {
                        setLeftPanelData(leftPanelDataLocal);
                      }
                    }}
                  />
                </div>
                <div className="left-panel-list">
                  {(leftPanelData || [])?.map?.((panel: any, sIndex: number) => {
                    const { title, key, open, children } = panel;
                    return (
                      <div
                        className="left-panel-item-box"
                        key={`left-panel-item-box-${key}-${sIndex}`}
                      >
                        <div
                          className="flex-box left-panel-list-title"
                          onClick={() => {
                            setLeftPanelData((prev: any) => {
                              return prev?.map?.((pre: any) => {
                                if (pre.key === key) {
                                  return { ...pre, open: !open };
                                }
                                return pre;
                              });
                            });
                          }}
                        >
                          <img
                            src={leftIcon}
                            alt="icon"
                            className="arrow"
                            style={open ? {} : { transform: 'rotate(180deg)' }}
                          />
                          <img src={dirIcon} alt="icon" className="dir" />
                          {title}
                        </div>
                        {open
                          ? (children || [])?.map?.((item: any, index: number) => {
                            const { value, label, icon } = item;
                            return (
                              <div key={`panel-${value}-${index}`}>
                                {
                                  // @ts-ignore
                                  <DragSortableItem index={JSON.stringify({ ...item, key })}>
                                    <div className="flex-box left-panel-item">
                                      <div className="left-panel-item-icon">
                                        {!!icon ? <Image src={icon} alt="logo" /> : null}
                                      </div>
                                      <div className="left-panel-item-title">{label}</div>
                                    </div>
                                  </DragSortableItem>
                                }
                              </div>
                            );
                          })
                          : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex-box right-canvas">
              {
                // @ts-ignore
                <DropSortableItem
                  // @ts-ignore
                  moveCard={(dragIndex: any, hoverIndex: any, e: any) => {
                    e.y -= 37;
                    const item = JSON.parse(dragIndex);
                    const { key, value, icon } = item;
                    if (
                      !paramData?.contentData?.contentSize?.width ||
                      !paramData?.contentData?.contentSize?.height
                    ) {
                      message.error('请先设置画布尺寸');
                      return;
                    }
                    let { width, height } = paramData?.contentData?.contentSize;
                    if (
                      !!paramData?.contentData?.autoSize ||
                      !_.isBoolean(paramData?.contentData?.autoSize)
                    ) {
                      width = window.screen.width;
                      height = window.screen.height;
                    }
                    height -= paramData?.contentData?.tabList?.length > 1 ? 28 : 0;
                    // 画布与实际屏幕的宽度差值
                    const diffWidth = (window.screen.width - width) / 2;
                    // 计算实际的x,y坐标
                    const x = ((e?.x + tabNum * width - diffWidth) / width) * 96;
                    const y = (e.y * 14) / 300;
                    if (['main', 'custom'].includes(key)) {
                      const parentBodyBox = addContentList?.filter((i: any) => {
                        return (
                          i.type === 'bodyBox' &&
                          x > i.size?.x &&
                          x < i.size?.x + i.size.w &&
                          y > i.size.y &&
                          y < i.size.y + i.size.h
                        );
                      })?.[0]?.id;
                      if (
                        !!addContentList?.filter((i: any) => i.type === 'bodyBox')?.[0] &&
                        value === 'bodyBox'
                      ) {
                        message.error('只能添加一个盒子窗口');
                        return;
                      }
                      // 添加监控窗口
                      const uuid32 = getuid();
                      addWindow(
                        Object.assign(
                          {},
                          {
                            value: [uuid32],
                            type: value,
                            size: { x, y },
                          },
                          !!parentBodyBox
                            ? {
                              parentBodyBox: parentBodyBox,
                              parentBodyBoxTab: bodyBoxTab,
                            }
                            : {},
                        ),
                      );
                    } else if (key === 'basic') {
                      // 添加基础窗口
                      setGridHomeList((prev: any) => {
                        return prev?.map?.((item: any) => {
                          if (item.i === value) {
                            return {
                              ...item,
                              x,
                              y,
                              w: 9,
                              h: 4,
                              minW: 1,
                              minH: 2,
                            };
                          }
                          return item;
                        });
                      });
                    } else if (key === 'coating') {
                      // 添加涂层
                      if (paramsData.id) {
                        setParamData((prev: any) =>
                          Object.assign({}, prev, {
                            contentData: Object.assign({}, prev.contentData, {
                              contentBackground:
                                value === 'blackBg'
                                  ? 'blackBg'
                                  : value === 'grayBg'
                                    ? 'grayBg'
                                    : prev?.contentData?.contentBackground === icon
                                      ? ''
                                      : icon,
                            }),
                          }),
                        );
                      }
                    }
                  }}
                >
                  <div className="flex-box right-canvas">
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
                            const params = {
                              ...paramData,
                              contentData: {
                                ...paramData?.contentData,
                                pageIconPosition,
                                homeSetting: homeSettingData,
                              },
                            };
                            updateParams({
                              id: paramData.id,
                              data: params,
                            }).then((res: any) => {
                              if (res && res.code === 'SUCCESS') {
                                let hash = '';
                                if (location.href?.indexOf('?') > -1) {
                                  hash = location.href.split('?')[1];
                                }
                                if (location.hash?.indexOf('inIframe') > -1) {
                                  window.history.go(-2); //返回上一页
                                } else {
                                  location.href = `${location.href?.split('#/')?.[0]}#/home${!!hash ? `?${hash}` : ''
                                    }`;
                                }
                                window.location.reload();
                              } else {
                                message.error(
                                  res?.msg || res?.message || '后台服务异常，请重启服务',
                                );
                              }
                            });
                          }}
                        />
                      </Tooltip>
                      <div className="flex-box right-canvas-toolbar-center">
                        画布尺寸:
                        <Form
                          form={form2}
                          scrollToFirstError
                          style={{
                            display: 'inherit',
                            alignItems: 'inherit',
                            gap: 'inherit',
                          }}
                        >
                          <Form.Item
                            name={`canvasWidth`}
                            label={''}
                            rules={[{ required: false, message: '画布宽度' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber className="right-canvas-toolbar-center-input" />
                          </Form.Item>
                          x
                          <Form.Item
                            name={`canvasHeight`}
                            label={''}
                            rules={[{ required: false, message: '画布高度' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber className="right-canvas-toolbar-center-input" />
                          </Form.Item>
                        </Form>
                        <Button
                          onClick={() => {
                            form2.validateFields().then((values) => {
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
                                    contentSize: Object.assign(
                                      {},
                                      paramData?.contentData?.contentSize,
                                      {
                                        width: Number(canvasWidth),
                                        height: Number(canvasHeight),
                                      },
                                    ),
                                  },
                                },
                              }).then((res: any) => {
                                if (res && res.code === 'SUCCESS') {
                                  window.location.reload();
                                } else {
                                  message.error(
                                    res?.msg || res?.message || '后台服务异常，请重启服务',
                                  );
                                }
                              });
                            });
                          }}
                        >
                          修改
                        </Button>
                        <Tooltip placement="bottom" title="全局设置">
                          <Button
                            className="toolbar-btn"
                            icon={<SettingOutlined className="toolbar-btn-icon" />}
                            onClick={() => {
                              setColorSelector((prev: any) => {
                                return {
                                  ...prev,
                                  overallBackgroundColor:
                                    paramData?.contentData?.overallBackgroundColor?.rgb ||
                                    'default',
                                };
                              });
                              setBasicInfoData(
                                paramData?.contentData?.tabList || [{ id: guid(), name: '' }],
                              );
                              form.setFieldsValue({
                                overallBackgroundColor:
                                  paramData?.contentData?.overallBackgroundColor?.rgb || 'default',
                                autoSize: _.isBoolean(paramData?.contentData?.autoSize)
                                  ? paramData?.contentData?.autoSize
                                  : true,
                                gridMargin: _.isNumber(paramData?.contentData?.gridMargin)
                                  ? paramData?.contentData?.gridMargin
                                  : 8,
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
                    {useMemo(() => {
                      return !paramData?.contentData?.contentSize?.width ||
                        !paramData?.contentData?.contentSize?.height ? null : (
                        <div
                          className="flex-box right-canvas-body"
                          style={Object.assign(
                            {},
                            !!paramData?.contentData?.contentBackground
                              ? paramData?.contentData?.contentBackground === 'blackBg'
                                ? { backgroundColor: 'black' }
                                : paramData?.contentData?.contentBackground === 'grayBg'
                                  ? { backgroundColor: '#ddd' }
                                  : {
                                    backgroundImage: `url(${paramData?.contentData?.contentBackground})`,
                                  }
                              : {},
                            !paramData?.contentData?.autoSize &&
                              paramData?.contentData?.contentSize?.width
                              ? {
                                width: `${paramData?.contentData?.contentSize?.width}px`,
                                minWidth: `${paramData?.contentData?.contentSize?.width}px`,
                                maxWidth: `${paramData?.contentData?.contentSize?.width}px`,
                              }
                              : {},
                            !paramData?.contentData?.autoSize &&
                              paramData?.contentData?.contentSize?.height
                              ? {
                                height: `${paramData?.contentData?.contentSize?.height - 93}px`,
                                minHeight: `${paramData?.contentData?.contentSize?.height - 93
                                  }px`,
                                maxHeight: `${paramData?.contentData?.contentSize?.height - 93
                                  }px`,
                              }
                              : {},
                            paramData?.contentData?.overallBackgroundColor &&
                              paramData?.contentData?.overallBackgroundColor?.rgb
                              ? {
                                backgroundColor: `rgba(${paramData?.contentData?.overallBackgroundColor.rgb.r},${paramData?.contentData?.overallBackgroundColor.rgb.g},${paramData?.contentData?.overallBackgroundColor.rgb.b},${paramData?.contentData?.overallBackgroundColor.rgb.a})`,
                              }
                              : {},
                            !!paramData?.contentData?.autoSize ||
                              !_.isBoolean(paramData?.contentData?.autoSize)
                              ? {
                                width: '100%',
                                maxWidth: '100%',
                                height: '100%',
                                maxHeight: '100%',
                              }
                              : {},
                          )}
                        >
                          <div className="right-canvas-body-grid">
                            {paramData?.contentData?.tabList?.length > 1 ? (
                              <div className="flex-box right-canvas-body-grid-tab">
                                {(paramData?.contentData?.tabList || [])?.map?.(
                                  (tab: any, index: number) => {
                                    const { name, id } = tab;
                                    return (
                                      <div
                                        className={`right-canvas-body-grid-tab-item ${tabNum == index
                                          ? 'right-canvas-body-grid-tab-selected'
                                          : ''
                                          }`}
                                        key={id}
                                        onClick={() => {
                                          localStorage.setItem(
                                            `localGridContent-tab-${paramData.id}`,
                                            index + '',
                                          );
                                          setTabNum(index);
                                        }}
                                      >
                                        {name}
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            ) : null}
                            <div
                              className="right-canvas-body-grid-body"
                              ref={editBoxDom}
                              style={Object.assign(
                                {},
                                !paramData?.contentData?.autoSize &&
                                  paramData?.contentData?.contentSize?.width
                                  ? {
                                    width: `${(paramData?.contentData?.tabList?.length || 1) *
                                      paramData?.contentData?.contentSize?.width
                                      }px`,
                                    minWidth: `${(paramData?.contentData?.tabList?.length || 1) *
                                      paramData?.contentData?.contentSize?.width
                                      }px`,
                                    maxWidth: `${(paramData?.contentData?.tabList?.length || 1) *
                                      paramData?.contentData?.contentSize?.width
                                      }px`,
                                  }
                                  : {},
                                !!paramData?.contentData?.autoSize ||
                                  !_.isBoolean(paramData?.contentData?.autoSize)
                                  ? {
                                    width: `${(paramData?.contentData?.tabList?.length || 1) * 100
                                      }vw`,
                                    maxWidth: `${(paramData?.contentData?.tabList?.length || 1) * 100
                                      }vw`,
                                    height: '100%',
                                  }
                                  : {},
                                paramData?.contentData?.tabList?.length > 1
                                  ? { height: 'calc(100% - 28px)' }
                                  : {},
                                { marginLeft: `${-1 * tabNum * 100}vw` },
                              )}
                            >
                              {!_.isEmpty(gridHomeList) ? (
                                <GridLayout
                                  dragName={ifCanEdit ? '.common-card-title' : ''}
                                  list={gridList.concat(contentList)}
                                  layout={gridHomeList.concat(contentLayout)}
                                  tabLength={paramData?.contentData?.tabList?.length || 1}
                                  tabNum={tabNum}
                                  margin={
                                    _.isNumber(paramData?.contentData?.gridMargin)
                                      ? [
                                        paramData?.contentData?.gridMargin,
                                        paramData?.contentData?.gridMargin,
                                      ]
                                      : [8, 8]
                                  }
                                  onChange={(data: any) => {
                                    saveGridFunc(data);
                                  }}
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );
                    }, [
                      gridHomeList,
                      contentLayout,
                      gridList,
                      contentList,
                      paramData?.contentData?.contentBackground,
                      paramData?.contentData?.contentSize,
                      tabNum,
                      paramData?.contentData?.tabList?.length,
                      paramData?.contentData?.gridMargin,
                    ])}
                  </div>
                </DropSortableItem>
              }
            </div>
          </DndProvider>
        ) : (
          <div className="flex-box right-canvas">
            {useMemo(() => {
              return !paramData?.contentData?.contentSize?.width ||
                !paramData?.contentData?.contentSize?.height ? null : (
                <div
                  className="flex-box right-canvas-body"
                  style={Object.assign(
                    {},
                    !!paramData?.contentData?.contentBackground
                      ? paramData?.contentData?.contentBackground === 'blackBg'
                        ? { backgroundColor: 'black' }
                        : paramData?.contentData?.contentBackground === 'grayBg'
                          ? { backgroundColor: '#ddd' }
                          : {
                            backgroundImage: `url(${paramData?.contentData?.contentBackground})`,
                          }
                      : {},
                    !paramData?.contentData?.autoSize && paramData?.contentData?.contentSize?.width
                      ? {
                        width: `${paramData?.contentData?.contentSize?.width}px`,
                        minWidth: `${paramData?.contentData?.contentSize?.width}px`,
                        maxWidth: `${paramData?.contentData?.contentSize?.width}px`,
                      }
                      : {},
                    !paramData?.contentData?.autoSize && paramData?.contentData?.contentSize?.height
                      ? {
                        height: `${paramData?.contentData?.contentSize?.height - 93}px`,
                        minHeight: `${paramData?.contentData?.contentSize?.height - 93}px`,
                        maxHeight: `${paramData?.contentData?.contentSize?.height - 93}px`,
                      }
                      : {},
                    paramData?.contentData?.overallBackgroundColor &&
                      paramData?.contentData?.overallBackgroundColor?.rgb
                      ? {
                        backgroundColor: `rgba(${paramData?.contentData?.overallBackgroundColor.rgb.r},${paramData?.contentData?.overallBackgroundColor.rgb.g},${paramData?.contentData?.overallBackgroundColor.rgb.b},${paramData?.contentData?.overallBackgroundColor.rgb.a})`,
                      }
                      : {},
                    !!paramData?.contentData?.autoSize ||
                      !_.isBoolean(paramData?.contentData?.autoSize)
                      ? { width: '100%', maxWidth: '100%', height: '100%', maxHeight: '100%' }
                      : {},
                  )}
                >
                  <div className="right-canvas-body-grid">
                    {paramData?.contentData?.tabList?.length > 1 ? (
                      <div className="flex-box right-canvas-body-grid-tab">
                        {(paramData?.contentData?.tabList || [])?.map?.(
                          (tab: any, index: number) => {
                            const { name, password, id } = tab;
                            return (
                              <div
                                className={`right-canvas-body-grid-tab-item ${tabNum == index ? 'right-canvas-body-grid-tab-selected' : ''}`}
                                key={id}
                                onClick={() => {
                                  if (!!password) {
                                    setTabPasswordVisible({ password, index });
                                  } else {
                                    onTabChange(index);
                                  }
                                }}
                              >
                                {name}
                              </div>
                            );
                          },
                        )}
                      </div>
                    ) : null}
                    <div
                      className="right-canvas-body-grid-body"
                      style={Object.assign(
                        {},
                        !paramData?.contentData?.autoSize &&
                          paramData?.contentData?.contentSize?.width
                          ? {
                            width: `${(paramData?.contentData?.tabList?.length || 1) *
                              paramData?.contentData?.contentSize?.width
                              }px`,
                            minWidth: `${(paramData?.contentData?.tabList?.length || 1) *
                              paramData?.contentData?.contentSize?.width
                              }px`,
                            maxWidth: `${(paramData?.contentData?.tabList?.length || 1) *
                              paramData?.contentData?.contentSize?.width
                              }px`,
                          }
                          : {},
                        !!paramData?.contentData?.autoSize ||
                          !_.isBoolean(paramData?.contentData?.autoSize)
                          ? {
                            width: `${(paramData?.contentData?.tabList?.length || 1) * 100}vw`,
                            maxWidth: `${(paramData?.contentData?.tabList?.length || 1) * 100}vw`,
                            height: '100%',
                          }
                          : {},
                        paramData?.contentData?.tabList?.length > 1
                          ? { height: 'calc(100% - 28px)' }
                          : {},
                        { marginLeft: `${-1 * tabNum * 100}vw` },
                      )}
                    >
                      {!_.isEmpty(gridHomeList) ? (
                        <GridLayout
                          dragName={ifCanEdit ? '.common-card-title' : ''}
                          list={gridList.concat(contentList)}
                          layout={gridHomeList.concat(contentLayout)}
                          tabLength={paramData?.contentData?.tabList?.length || 1}
                          tabNum={tabNum}
                          margin={
                            _.isNumber(paramData?.contentData?.gridMargin)
                              ? [
                                paramData?.contentData?.gridMargin,
                                paramData?.contentData?.gridMargin,
                              ]
                              : [8, 8]
                          }
                          onChange={(data: any) => {
                            saveGridFunc(data);
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            }, [
              gridHomeList,
              contentLayout,
              gridList,
              contentList,
              paramData?.contentData?.contentBackground,
              paramData?.contentData?.contentSize,
              tabNum,
              paramData?.contentData?.tabList?.length,
              paramData?.contentData?.gridMargin,
            ])}
          </div>
        )}
        <NodeDetailWrapper
          className="config-panel"
          style={
            !!addWindowVisible || !!homeSettingVisible || !!overallVisible
              ? {}
              : { right: '-700px' }
          }
          title={'插件配置 PluginConfig '}
          onSave={() => {
            form
              .validateFields()
              .then((values) => {
                if (!!addWindowVisible) {
                  const id = `${values.value.join('$$')}$$${values.type}`;
                  const params = {
                    ..._.omit(_.omit(_.omit(editWindowData, 'id'), 'size'), 'value'),
                    id,
                    size: { ...editWindowData.size, i: id },
                    ...values,
                  };
                  addWindow(params);
                } else if (!!homeSettingVisible) {
                  setHomeSettingData((prev: any) => ({
                    ...prev,
                    [homeSettingVisible]: { ...prev?.[homeSettingVisible], ...values },
                  }));
                } else if (!!overallVisible) {
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
                      },
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
                      message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
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
          {!!addWindowVisible ? (
            <Form form={form} scrollToFirstError>
              <Divider>
                <div
                  className="divider-switch"
                  onClick={() => {
                    return setShowPanels((prev: any) => ({ ...prev, common: !prev?.common }));
                  }}
                >
                  通用配置
                  {showPanels?.common ? <CaretDownOutlined /> : <CaretRightOutlined />}
                </div>
              </Divider>
              <div style={showPanels?.common ? {} : { display: 'none' }}>
                <Form.Item
                  name={`CCDName`}
                  label={'监控窗口名称'}
                  rules={[{ required: false, message: '监控窗口名称' }]}
                >
                  <Input size="large" />
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
                      const res = paramsData?.flowData?.nodes.filter(
                        (i: any) => i.id === val[0],
                      )?.[0];
                      if (!!res) {
                        setFieldsValue({ operationList: [] });
                        const { config = {}, ports = {} } = res;
                        const params = ['operation', 'platForm', 'table5'].includes(windowType)
                          ? config?.initParams
                          : ['operation2'].includes(windowType)
                            ? !_.isEmpty(config?.execParams)
                              ? config?.execParams
                              : config?.initParams
                            : null;
                        if (!!params && _.isObject(params)) {
                          setSelectedNodeConfig(() =>
                            Object.entries(params)?.map?.((item: any) => {
                              return {
                                label: item[1]?.alias,
                                value: item[0],
                              };
                            }),
                          );
                        } else {
                          setSelectedNodeConfig([]);
                        }
                        // 检测绑定的节点是否开启了数据推送，如果没开，直接打开
                        if (val?.length === 2 && ports?.items?.length > 0) {
                          const portList = ports?.items?.map?.((i: any) => {
                            if (i?.label?.name === val[1] && i?.group === 'bottom') {
                              return {
                                ...i,
                                label: {
                                  ...i?.label,
                                  pushData: true
                                }
                              }
                            } else {
                              return i;
                            }
                          });
                          const newParams = {
                            ...paramData,
                            flowData: {
                              ...paramData?.flowData,
                              nodes: (paramData?.flowData?.nodes || [])?.map?.((node: any) => {
                                if (node.id === val[0]) {
                                  return {
                                    ...node,
                                    ports: {
                                      ...node.ports,
                                      items: portList,
                                    }
                                  }
                                } else {
                                  return node;
                                }
                              })
                            }
                          };
                          setInitialState((preInitialState: any) => ({
                            ...preInitialState,
                            params: newParams,
                          }));
                          setParamData(newParams);
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
                    onChange={(val) => {
                      const res = paramsData?.flowData?.nodes.filter(
                        (i: any) => i.id === getFieldValue('value')?.[0],
                      )?.[0];
                      if (!!res) {
                        setFieldsValue({ operationList: [] });
                        const { config = {} } = res;
                        const params =
                          val === 'operation'
                            ? config?.initParams
                            : val === 'operation2'
                              ? !_.isEmpty(config?.execParams)
                                ? config?.execParams
                                : config?.initParams
                              : null;
                        if (!!params && _.isObject(params)) {
                          setSelectedNodeConfig(() =>
                            Object.entries(params)?.map?.((item: any) => {
                              return {
                                label: item[1]?.alias,
                                value: item[0],
                              };
                            }),
                          );
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
                  label={'窗口背景'}
                  initialValue={'default'}
                  rules={[{ required: false, message: '窗口背景' }]}
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
                      },
                      {
                        value: 'black',
                        label: '黑色背景',
                      },
                      {
                        value: dataItemImage1,
                        label: '背景图1',
                      },
                      {
                        value: dataItemImage2,
                        label: '背景图2',
                      },
                      {
                        value: dataItemImage3,
                        label: '背景图3',
                      },
                      {
                        value: dataItemImage4,
                        label: '背景图4',
                      },
                      {
                        value: dataItemImage5,
                        label: '车门内',
                      },
                      {
                        value: dataItemImage6,
                        label: '车门外',
                      },
                      {
                        value: dataItemImage7,
                        label: '数量展示',
                      },
                      {
                        value: 'border',
                        label: '圆角边框',
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name={`titleBackgroundColor`}
                  label={'标题背景'}
                  initialValue={'transparent'}
                  rules={[{ required: false, message: '标题背景' }]}
                >
                  <Select
                    style={{ width: '100%' }}
                    options={[
                      {
                        value: 'transparent',
                        label: '透明色',
                      },
                      {
                        value: dataItemHeaderImage1,
                        label: '背景图1',
                      },
                      {
                        value: dataItemHeaderImage2,
                        label: '背景图2',
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="titleFontSize" label="标题字号">
                  <InputNumber min={12} placeholder="标题字号" />
                </Form.Item>
                <Form.Item
                  name={'titlePaddingSize'}
                  label="标题内边距"
                  initialValue={0}
                  rules={[{ required: false, message: '标题内边距' }]}
                >
                  <InputNumber min={0} />
                </Form.Item>
                <Form.Item
                  name={'bodyPaddingSize'}
                  label="内容内边距"
                  initialValue={0}
                  rules={[{ required: false, message: '内容内边距' }]}
                >
                  <InputNumber min={0} />
                </Form.Item>
                <Form.Item
                  name={'fontSize'}
                  label="字号"
                  initialValue={16}
                  rules={[{ required: true, message: '字号' }]}
                >
                  <InputNumber min={12} />
                </Form.Item>
                {!['modal'].includes(windowType) ? (
                  <Form.Item
                    name="ifLocalStorage"
                    label="开启缓存"
                    initialValue={!['modal'].includes(windowType)}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                ) : null}
              </div>
              <Divider>
                <div
                  className="divider-switch"
                  onClick={() => {
                    return setShowPanels((prev: any) => ({ ...prev, custom: !prev?.custom }));
                  }}
                >
                  私有配置
                  {showPanels?.custom ? <CaretDownOutlined /> : <CaretRightOutlined />}
                </div>
              </Divider>
              <div style={showPanels?.custom ? {} : { display: 'none' }}>
                {['img', 'imgDefects'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={'defaultImg'}
                      label="默认图片"
                      rules={[{ required: false, message: '默认图片' }]}
                    >
                      <div className="flex-box">
                        <TooltipDiv style={{ paddingRight: 10 }}>{selectedPath.value}</TooltipDiv>
                        {!selectedPath.value ? (
                          <ChooseFileButton
                            name={'defaultImg'}
                            onClick={() => {
                              if (!!localStorage.getItem('parentOrigin')) {
                                window?.parent?.postMessage?.(
                                  {
                                    type: 'openFile',
                                    name: 'defaultImg',
                                    suffix: ['jpg', 'png', 'svg'],
                                  },
                                  localStorage.getItem('parentOrigin') || '',
                                );
                              } else {
                                setFieldsValue({ defaultImg: undefined });
                                setSelectPathVisible(true);
                              }
                            }}
                            onOk={(value: any) => {
                              setFieldsValue({ defaultImg: value });
                              setSelectedPath({ value });
                              setSelectPathVisible(false);
                            }}
                          >
                            选择文件
                          </ChooseFileButton>
                        ) : (
                          <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                              setFieldsValue({ defaultImg: undefined });
                              setSelectedPath({ fileType: 'file', value: '' });
                            }}
                          />
                        )}
                      </div>
                    </Form.Item>
                    <Form.Item name="magnifierSize" label="放大镜倍数">
                      <InputNumber min={1} placeholder="放大镜倍数" />
                    </Form.Item>
                    <Form.Item name="magnifierWidth" label="放大镜宽">
                      <InputNumber min={1} placeholder="放大镜宽度" />
                    </Form.Item>
                    <Form.Item name="magnifierHeight" label="放大镜高">
                      <InputNumber min={1} placeholder="放大镜高度" />
                    </Form.Item>
                    <Form.Item name="comparison" label="开启对比图" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      name="notLocalStorage" label="开启图片缓存" valuePropName="checked"
                      initialValue={true}
                    >
                      <Switch />
                    </Form.Item>
                    <Form.Item name="showImgList" label="图片列表" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item name="labelInxAxis" label="拼时间戳" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item name="imgListNum" label="图片列表数量">
                      <InputNumber min={1} placeholder="图片列表数量" />
                    </Form.Item>
                    <Form.Item name="showFooter" label="显示底部描述" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['alertImg'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name="lineNumber"
                      label="行数"
                      initialValue={1}
                      rules={[{ required: true, message: '行数' }]}
                    >
                      <InputNumber min={1} placeholder="" />
                    </Form.Item>
                    <Form.Item
                      name="columnNumber"
                      label="列数"
                      initialValue={1}
                      rules={[{ required: true, message: '列数' }]}
                    >
                      <InputNumber min={1} placeholder="" />
                    </Form.Item>
                    {/* <Form.Item
                        name="magnifier"
                        label="开启放大镜"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item> */}
                    <Form.Item name="magnifierSize" label="放大镜倍数">
                      <InputNumber min={1} placeholder="放大镜倍数" />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['point', 'bar', 'barWithLine', 'line', 'table'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`yName`}
                      label={windowType === 'table' ? '表格key名' : 'y 轴名称'}
                      rules={[{ required: true, message: 'y轴名称' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      name={`xName`}
                      label={windowType === 'table' ? '表格value名' : 'x 轴名称'}
                      rules={[{ required: true, message: 'x轴名称' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    {['table'].includes(windowType) ? null : (
                      <Form.Item
                        name={`dataZoom`}
                        label={'展示最新的'}
                        rules={[{ required: false, message: '展示最新的' }]}
                        initialValue={0}
                      >
                        <InputNumber min={0} />
                      </Form.Item>
                    )}
                  </Fragment>
                ) : null}
                {['point', 'bar'].includes(windowType) ? (
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
                        },
                      ]}
                    />
                  </Form.Item>
                ) : null}
                {['bar'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`align`}
                      label={'对齐方向'}
                      initialValue={'left'}
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
                          },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item name="barRadius" label="柱子圆角" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item name="hiddenAxis" label="隐藏坐标轴" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item name="labelInxAxis" label="标签在内" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item name="showBackground" label="显示背景" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item name="showWithLine" label="显示折线趋势" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item name={`labelDirection`} label={'数值在柱子内'} initialValue={'none'}>
                      <Select
                        style={{ width: '100%' }}
                        options={[
                          {
                            value: 'none',
                            label: '不展示',
                          },
                          {
                            value: 'top',
                            label: '居上',
                          },
                          {
                            value: 'center',
                            label: '居中',
                          },
                          {
                            value: 'bottom',
                            label: '居下',
                          },
                        ]}
                      />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['bar', 'barWithLine', 'progress'].includes(windowType) ? (
                  <Form.Item
                    name={`barColor`}
                    label={'图形颜色'}
                    initialValue={'default'}
                    rules={[{ required: false, message: '图形颜色' }]}
                  >
                    <Select
                      style={{ width: '100%' }}
                      mode={['bar'].includes(windowType) ? 'multiple' : undefined}
                      options={[
                        ['default', '默认'],
                        ['line1', '渐变1'],
                        ['line2', '渐变2'],
                        ['#73c0de', '蓝色'],
                        ['#5470c6', '深蓝'],
                        ['#91cc75', '绿色'],
                        ['#3ba272', '深绿'],
                        ['#fac858', '黄色'],
                        ['#ee6666', '红色'],
                        ['#fc8452', '橘红'],
                        ['#9a60b4', '紫色'],
                        ['#ea7ccc', '粉色'],
                        ['#000', '黑色'],
                        ['#fff', '白色'],
                      ]?.map?.((item: any, index: number) => {
                        return {
                          value: item[0],
                          label:
                            index === 0 ? (
                              item[1]
                            ) : (
                              <div className="flex-box">
                                <div
                                  className="item-label-icon"
                                  style={{ backgroundColor: item[0] }}
                                />
                                {item[1]}
                              </div>
                            ),
                        };
                      })}
                      onChange={(value) => {
                        if (value?.indexOf('default') > 0) {
                          setFieldsValue({
                            barColor: ['default'],
                          });
                        } else if (value?.indexOf('line1') > 0) {
                          setFieldsValue({
                            barColor: ['line1'],
                          });
                        } else if (value?.indexOf('line2') > 0) {
                          setFieldsValue({
                            barColor: ['line2'],
                          });
                        } else {
                          setFieldsValue({
                            barColor: _.pull(value, 'default', 'line1', 'line2'),
                          });
                        }
                      }}
                    />
                  </Form.Item>
                ) : null}
                {['pie'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`yName`}
                      label={'环内文字'}
                      rules={[{ required: false, message: '环内文字' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['progress'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`progressType`}
                      label={'进度条形状'}
                      initialValue={'line'}
                      rules={[{ required: false, message: '进度条形状' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        options={[
                          {
                            value: 'line',
                            label: '直线',
                          },
                          {
                            value: 'circle',
                            label: '环形',
                          },
                          {
                            value: 'dashboard',
                            label: '仪表盘',
                          },
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
                    {form.getFieldValue('progressType') === 'line' ? (
                      <Form.Item
                        name={`progressSteps`}
                        label={'进度格数'}
                        initialValue={5}
                        rules={[{ required: false, message: '进度格数' }]}
                      >
                        <InputNumber min={0} max={99} step={1} />
                      </Form.Item>
                    ) : null}
                  </Fragment>
                ) : null}
                {['point'].includes(windowType) ? (
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
                          },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item
                      name="ifShowColorList"
                      label="时间缩放条"
                      initialValue={false}
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['tableAntd', 'table3', 'table2', 'table'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item name="des_layout" label="布局方向" initialValue={'vertical'}>
                      <Select
                        options={[
                          { label: '横向', value: 'horizontal' },
                          { label: '纵向', value: 'vertical' },
                        ]}
                      />
                    </Form.Item>
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
                          },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`headerBackgroundColor`}
                      label={'头部背景色'}
                      initialValue={'default'}
                      rules={[{ required: false, message: '窗口背景' }]}
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
                          },
                          {
                            value: 'line1',
                            label: '渐变色1',
                          },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item name={`interlacing`} label={'隔行换色'} initialValue={'default'}>
                      <Select
                        style={{ width: '100%' }}
                        options={[
                          {
                            value: 'default',
                            label: '不变色',
                          },
                          {
                            value: '1',
                            label: '灰色',
                          },
                          {
                            value: '2',
                            label: '蓝色渐变',
                          },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item name="des_bordered" label="是否展示边框" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item name="tableFontSize" label="表头字号">
                      <InputNumber min={14} placeholder="表头字号" />
                    </Form.Item>
                    {!['tableAntd'].includes(windowType) ? (
                      <Fragment>
                        <Form.Item
                          name={`valueColor`}
                          label={'颜色渲染'}
                          initialValue={'value'}
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
                              },
                            ]}
                          />
                        </Form.Item>
                        <Form.Item
                          name={`line_height`}
                          label={'内容行高'}
                          rules={[{ required: true, message: '内容行高' }]}
                          initialValue={38}
                        >
                          <InputNumber min={10} />
                        </Form.Item>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <Form.Item
                          name={`fetchType`}
                          label={'http类型'}
                          rules={[{ required: false, message: 'http类型' }]}
                        >
                          <Select
                            style={{ width: '100%' }}
                            options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                              value: item,
                              label: _.toUpper(item),
                            }))}
                          />
                        </Form.Item>
                        <Form.Item
                          name={`xName`}
                          label={'接口地址'}
                          rules={[{ required: false, message: '接口地址' }]}
                        >
                          <Input size="large" />
                        </Form.Item>
                        <Form.Item
                          name={`staticHeight`}
                          label={'表格大小'}
                          rules={[{ required: true, message: '表格大小' }]}
                          initialValue={'small'}
                        >
                          <Select
                            style={{ width: '100%' }}
                            options={[
                              {
                                value: 'small',
                                label: '小',
                              },
                              {
                                value: 'middle',
                                label: '中',
                              },
                              {
                                value: 'default',
                                label: '大',
                              },
                            ]}
                          />
                        </Form.Item>
                        <Form.Item
                          name={`timeSelectDefault`}
                          label={'操作项'}
                          rules={[{ required: false, message: '操作项' }]}
                        >
                          {commonSettingList
                            ?.sort((a: any, b: any) => a.sort - b.sort)
                            ?.map?.((item: any, index: number) => {
                              const { label, value, id } = item;
                              return (
                                <div
                                  className="flex-box"
                                  key={`segmentSwitch-item-${index}`}
                                  style={{ marginBottom: 8, gap: 8 }}
                                >
                                  <div style={{ flex: 1 }}>
                                    <Input
                                      defaultValue={label}
                                      placeholder="label"
                                      style={{ height: 28 }}
                                      onChange={(e) => {
                                        const val = e?.target?.value;
                                        onBodyBoxChange(val, index, 'label');
                                      }}
                                    />
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <Input
                                      defaultValue={value}
                                      placeholder="value"
                                      style={{ height: 28 }}
                                      onChange={(e) => {
                                        const val = e?.target?.value;
                                        onBodyBoxChange(val, index, 'value');
                                      }}
                                    />
                                  </div>
                                  <Button
                                    icon={<MinusSquareOutlined />}
                                    style={{ height: 28 }}
                                    onClick={() => {
                                      onBodyBoxChange('', id, 'remove');
                                    }}
                                  />
                                  <Button
                                    icon={<ArrowUpOutlined />}
                                    style={{ height: 28 }}
                                    disabled={index === 0}
                                    onClick={() => {
                                      onBodyBoxChange('', index, 'up');
                                    }}
                                  />
                                </div>
                              );
                            })}
                          <Button
                            icon={<PlusSquareOutlined />}
                            onClick={() => {
                              onBodyBoxChange('', 0, 'add');
                            }}
                          />
                        </Form.Item>
                      </Fragment>
                    )}
                  </Fragment>
                ) : null}
                {['table4'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`staticHeight`}
                      label={'紧凑行高'}
                      rules={[{ required: true, message: '紧凑行高' }]}
                      valuePropName="checked"
                      initialValue={false}
                    >
                      <Switch />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['table5'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`fetchType`}
                      label={'http类型'}
                      rules={[{ required: false, message: 'http类型' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                          value: item,
                          label: _.toUpper(item),
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`xName`}
                      label={'接口地址'}
                      rules={[{ required: false, message: '接口地址' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      name={`yName`}
                      label={'获取类型'}
                      rules={[{ required: false, message: '获取类型' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item name="ifFetch" label="是否拉取列表" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['rangeDomain'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item name="des_column" label="列数">
                      <InputNumber />
                    </Form.Item>
                    <Form.Item
                      name={`line_height`}
                      label={'内容行高'}
                      rules={[{ required: true, message: '内容行高' }]}
                      initialValue={24}
                    >
                      <InputNumber min={10} />
                    </Form.Item>
                    <Form.Item name="labelInxAxis" label="显示名称" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item name="hiddenAxis" label="显示表头" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      name={`fetchType`}
                      label={'http类型'}
                      rules={[{ required: false, message: 'http类型' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                          value: item,
                          label: _.toUpper(item),
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`xName`}
                      label={'接口地址'}
                      rules={[{ required: false, message: '接口地址' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item name="ifFetch" label="是否实时触发" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item name="barRadius" label="是否可修改" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      name={`timeSelectDefault`}
                      label={'切换按钮'}
                      rules={[{ required: false, message: '切换按钮' }]}
                    >
                      {commonSettingList
                        ?.sort((a: any, b: any) => a.sort - b.sort)
                        ?.map?.((item: any, index: number) => {
                          const { label, value, type, number, id } = item;
                          return (
                            <div
                              className="flex-box"
                              key={`segmentSwitch-item-${index}`}
                              style={{ marginBottom: 8, gap: 8 }}
                            >
                              <div style={{ flex: 1 }}>
                                <Input
                                  defaultValue={label}
                                  placeholder="label"
                                  style={{ height: 28 }}
                                  onChange={(e) => {
                                    const val = e?.target?.value;
                                    onBodyBoxChange(val, index, 'label');
                                  }}
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <Input
                                  defaultValue={value}
                                  placeholder="value"
                                  style={{ height: 28 }}
                                  onChange={(e) => {
                                    const val = e?.target?.value;
                                    onBodyBoxChange(val, index, 'value');
                                  }}
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <Select
                                  defaultValue={type}
                                  style={{ width: '100%', height: 28 }}
                                  options={['string', 'number', 'bool']?.map?.((item: any) => ({
                                    value: item,
                                    label: item,
                                  }))}
                                  onChange={(val) => {
                                    onBodyBoxChange(val, index, 'type');
                                  }}
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                {type === 'bool' ? (
                                  <SegmentSwitch
                                    fontInBody={[
                                      { label: '', value: false, backgroundColor: 'grey' },
                                      {
                                        label: '',
                                        value: true,
                                        backgroundColor: 'rgba(24, 144, 255, 1)',
                                      },
                                    ]}
                                    defaultValue={number}
                                    style={{ height: 28 }}
                                    onChange={(val: boolean) => {
                                      onBodyBoxChange(val, index, 'number');
                                    }}
                                  />
                                ) : type === 'string' ? (
                                  <Input
                                    defaultValue={number}
                                    style={{ height: 28 }}
                                    onChange={(e) => {
                                      const val = e?.target?.value;
                                      onBodyBoxChange(val, index, 'number');
                                    }}
                                  />
                                ) : (
                                  <InputNumber
                                    defaultValue={number}
                                    style={{ height: 28 }}
                                    onChange={(val) => {
                                      onBodyBoxChange(val, index, 'number');
                                    }}
                                  />
                                )}
                              </div>
                              <Button
                                icon={<MinusSquareOutlined />}
                                style={{ height: 28 }}
                                onClick={() => {
                                  onBodyBoxChange('', id, 'remove');
                                }}
                              />
                              <Button
                                icon={<ArrowUpOutlined />}
                                style={{ height: 28 }}
                                disabled={index === 0}
                                onClick={() => {
                                  onBodyBoxChange('', index, 'up');
                                }}
                              />
                            </div>
                          );
                        })}
                      <Button
                        icon={<PlusSquareOutlined />}
                        onClick={() => {
                          onBodyBoxChange('', 0, 'add');
                        }}
                      />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['modelSwitch'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`fetchType`}
                      label={'http类型'}
                      rules={[{ required: false, message: 'http类型' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                          value: item,
                          label: _.toUpper(item),
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`xName`}
                      label={'接口地址'}
                      rules={[{ required: false, message: '接口地址' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['rectRange'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`fetchType`}
                      label={'http类型'}
                      rules={[{ required: false, message: 'http类型' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                          value: item,
                          label: _.toUpper(item),
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`xName`}
                      label={'接口地址'}
                      rules={[{ required: false, message: '接口地址' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['imgs'].includes(windowType) ? (
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
                ) : null}
                {['rank'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`yName`}
                      label={'排序方式'}
                      rules={[{ required: true, message: '排序方式' }]}
                      initialValue={'verse'}
                    >
                      <Select
                        style={{ width: '100%' }}
                        options={[
                          {
                            value: 'verse',
                            label: '正序',
                          },
                          {
                            value: 'reverse',
                            label: '倒序',
                          },
                        ]}
                      />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['bodyBox'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`timeSelectDefault`}
                      label={'切换按钮'}
                      rules={[{ required: true, message: '切换按钮' }]}
                    >
                      {commonSettingList
                        ?.sort((a: any, b: any) => a.sort - b.sort)
                        ?.map?.((item: any, index: number) => {
                          const { label, value, id } = item;
                          return (
                            <div
                              className="flex-box"
                              key={`segmentSwitch-item-${index}`}
                              style={{ marginBottom: 8, gap: 8 }}
                            >
                              <div style={{ flex: 1 }}>
                                <Input
                                  defaultValue={label}
                                  placeholder="label"
                                  style={{ height: 28 }}
                                  onChange={(e) => {
                                    const val = e?.target?.value;
                                    onBodyBoxChange(val, index, 'label');
                                  }}
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <Input
                                  defaultValue={value}
                                  placeholder="value"
                                  style={{ height: 28 }}
                                  onChange={(e) => {
                                    const val = e?.target?.value;
                                    onBodyBoxChange(val, index, 'value');
                                  }}
                                />
                              </div>
                              <Button
                                icon={<MinusSquareOutlined />}
                                style={{ height: 28 }}
                                onClick={() => {
                                  onBodyBoxChange('', id, 'remove');
                                }}
                              />
                              <Button
                                icon={<ArrowUpOutlined />}
                                style={{ height: 28 }}
                                disabled={index === 0}
                                onClick={() => {
                                  onBodyBoxChange('', index, 'up');
                                }}
                              />
                            </div>
                          );
                        })}
                      <Button
                        icon={<PlusSquareOutlined />}
                        onClick={() => {
                          onBodyBoxChange('', 0, 'add');
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      name={'iconSize'}
                      label="图标大小"
                      initialValue={24}
                      rules={[{ required: true, message: '图标大小' }]}
                    >
                      <InputNumber min={12} />
                    </Form.Item>
                    <Form.Item name={'yName'} label="按钮距离左边距" initialValue={0}>
                      <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name={'fetchParams'} label="按钮距离上边距" initialValue={0}>
                      <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="direction" label="按钮之间间距" initialValue={16}>
                      <InputNumber />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {
                  ['alert'].includes(windowType) ? (
                    <Fragment>
                      <Form.Item
                        name={`yName`}
                        label={'显示方式'}
                        initialValue="default"
                        rules={[{ required: false, message: '显示方式' }]}
                      >
                        <Select
                          style={{ width: '100%' }}
                          options={[
                            {
                              value: 'default',
                              label: '默认',
                            },
                            {
                              value: 'point',
                              label: '圆点',
                            },
                          ]}
                        />
                      </Form.Item>
                    </Fragment>
                  ) : null
                }
                {['form'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`yName`}
                      label={'标题名称'}
                      rules={[{ required: false, message: '标题名称' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      name={`fetchType`}
                      label={'http类型'}
                      rules={[{ required: false, message: 'http类型' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                          value: item,
                          label: _.toUpper(item),
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`xName`}
                      label={'接口地址'}
                      rules={[{ required: false, message: '接口地址' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      name="modelUpload"
                      label="首次加载默认获取内容"
                      initialValue={false}
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      name="ifNeedAllow"
                      label="是否需要确认按钮"
                      initialValue={false}
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      name="direction"
                      label="是否需要二次确认"
                      initialValue={false}
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    {/* <Form.Item
                      name="modelRotate"
                      label="是否需要右侧按钮"
                      initialValue={false}
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item> */}
                    <Form.Item
                      name={`passwordHelp`}
                      label={'确认按钮名称'}
                      rules={[{ required: false, message: '确认按钮名称' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      name={`timeSelectDefault`}
                      label={'表单项'}
                      rules={[{ required: false, message: '表单项' }]}
                    >
                      {commonSettingList
                        ?.sort((a: any, b: any) => a.sort - b.sort)
                        ?.map?.((item: any, index: number) => {
                          const {
                            name,
                            alias,
                            type,
                            className = '',
                            id,
                            parent,
                            disabled = false,
                          } = item;
                          if (!!parent) {
                            return null;
                          }
                          return (
                            <div
                              className="flex-box form-time-select-item"
                              key={`segmentSwitch-item-${index}`}
                              style={{ marginBottom: 8, gap: 8 }}
                            >
                              <div style={{ flex: 1 }}>
                                <Input
                                  defaultValue={name}
                                  placeholder="name"
                                  style={{ height: 28 }}
                                  onChange={(e) => {
                                    const val = e?.target?.value;
                                    onFormChartsChange(val, index, 'name');
                                  }}
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <Input
                                  defaultValue={alias}
                                  placeholder="alias"
                                  style={{ height: 28 }}
                                  onChange={(e) => {
                                    const val = e?.target?.value;
                                    onFormChartsChange(val, index, 'alias');
                                  }}
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <Select
                                  defaultValue={type}
                                  placeholder="type"
                                  style={{ width: '100%', height: 28 }}
                                  options={[
                                    {
                                      value: 'Input',
                                      label: '普通输入框',
                                    },
                                    {
                                      value: 'InputNumber',
                                      label: '数字输入框',
                                    },
                                    {
                                      value: 'MultiSelect',
                                      label: '复选框',
                                    },
                                    {
                                      value: 'Select',
                                      label: '单选框',
                                    },
                                    {
                                      value: 'Switch',
                                      label: '开关',
                                    },
                                    {
                                      value: 'Button',
                                      label: '按钮',
                                    },
                                    {
                                      value: 'ModalButton',
                                      label: '弹框按钮',
                                    },
                                    {
                                      value: 'DatePicker',
                                      label: '时间选择器',
                                    },
                                    {
                                      value: 'IpInput',
                                      label: 'ip输入框',
                                    },
                                  ]}
                                  onChange={(val) => {
                                    onFormChartsChange(val, index, 'type');
                                  }}
                                />
                              </div>
                              {type?.indexOf('Button') > -1 ? (
                                <div style={{ flex: 1 }}>
                                  <Select
                                    defaultValue={className}
                                    placeholder="颜色"
                                    style={{ width: '100%', height: 28 }}
                                    options={[
                                      {
                                        value: 'default',
                                        label: '默认',
                                      },
                                      {
                                        value: 'primary',
                                        label: '蓝色',
                                      },
                                      {
                                        value: 'success',
                                        label: '绿色',
                                      },
                                      {
                                        value: 'error',
                                        label: '红色',
                                      },
                                      {
                                        value: 'warning',
                                        label: '黄色',
                                      },
                                    ]}
                                    onChange={(val) => {
                                      onFormChartsChange(val, index, 'className');
                                    }}
                                  />
                                </div>
                              ) : null}
                              {type?.indexOf('ModalButton') > -1 ? (
                                <Button
                                  icon={<FormOutlined />}
                                  style={{ height: 28 }}
                                  onClick={() => {
                                    setFormModalEdit(name);
                                  }}
                                />
                              ) : null}
                              <Checkbox
                                defaultChecked={disabled}
                                onChange={(e) => {
                                  const val = e.target.checked;
                                  onFormChartsChange(val, index, 'disabled');
                                }}
                              >
                                disabled
                              </Checkbox>
                              <Button
                                icon={<MinusSquareOutlined />}
                                style={{ height: 28 }}
                                onClick={() => {
                                  onFormChartsChange('', id, 'remove');
                                }}
                              />
                              <Button
                                icon={<ArrowUpOutlined />}
                                style={{ height: 28 }}
                                disabled={index === 0}
                                onClick={() => {
                                  onFormChartsChange('', index, 'up');
                                }}
                              />
                            </div>
                          );
                        })}
                      <Button
                        icon={<PlusSquareOutlined />}
                        type="primary"
                        onClick={() => {
                          onFormChartsChange('', 0, 'add');
                        }}
                      >
                        新增
                      </Button>
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['nestForm'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item name="des_column" label="列数">
                      <InputNumber />
                    </Form.Item>
                    <Form.Item name="des_bordered" label="是否展示边框" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      name={`yName`}
                      label={'label宽度'}
                      initialValue={150}
                      rules={[{ required: false, message: 'label宽度' }]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {
                  ['laminationImage'].includes(windowType) ? (
                    <Fragment>
                      <Form.Item initialValue={3} name="des_column" label="行数">
                        <InputNumber min={1} placeholder="行数" />
                      </Form.Item>
                      <Form.Item
                        name="markNumberTop"
                        label="顶部图示长度"
                        rules={[{ required: true, message: '顶部图示长度' }]}
                      >
                        <InputNumber min={0} placeholder="顶部图示长度" />
                      </Form.Item>
                      <Form.Item
                        name="markNumberLeft"
                        label="左侧图示长度"
                        rules={[{ required: true, message: '左侧图示长度' }]}
                      >
                        <InputNumber min={0} placeholder="左侧图示长度" />
                      </Form.Item>
                    </Fragment>
                  ) : null
                }
                {
                  ['reJudgment'].includes(windowType) ? (
                    <Fragment>
                      <Form.Item
                        name={`fetchType`}
                        label={'http类型'}
                        rules={[{ required: false, message: 'http类型' }]}
                      >
                        <Select
                          style={{ width: '100%' }}
                          options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                            value: item,
                            label: _.toUpper(item),
                          }))}
                        />
                      </Form.Item>
                      <Form.Item
                        name={`xName`}
                        label={'接口地址'}
                        rules={[{ required: false, message: '接口地址' }]}
                      >
                        <Input size="large" />
                      </Form.Item>
                    </Fragment>
                  ) : null
                }
                {
                  ['httpTable'].includes(windowType) ? (
                    <Fragment>
                      <Form.Item
                        name={`fetchType`}
                        label={'http类型'}
                        rules={[{ required: false, message: 'http类型' }]}
                      >
                        <Select
                          style={{ width: '100%' }}
                          options={['get', 'post', 'put', 'delete', 'wbsocket']
                            ?.map?.((item: any) => ({
                              value: item,
                              label: _.toUpper(item),
                            }))}
                        />
                      </Form.Item>
                      <Form.Item
                        name={`xName`}
                        label={'接口地址'}
                        rules={[{ required: false, message: '接口地址' }]}
                      >
                        <Input size="large" />
                      </Form.Item>
                      <Form.Item
                        name={`httpRotation`}
                        label={'接口轮训'}
                        rules={[{ required: true, message: '接口轮训' }]}
                        valuePropName="checked"
                        initialValue={false}
                      >
                        <Switch />
                      </Form.Item>
                      <Form.Item
                        name={`httpRotationTime`}
                        label={'轮训时间间隔'}
                        initialValue={2000}
                        rules={[{ required: false, message: '轮训时间间隔' }]}
                      >
                        <InputNumber addonAfter="毫秒" />
                      </Form.Item>
                    </Fragment>
                  ) : null
                }
                {
                  ['cable'].includes(windowType) ? (
                    <Fragment>
                      <Form.Item
                        name={`dataZoom`}
                        label={'展示最新的'}
                        rules={[{ required: false, message: '展示最新的' }]}
                        initialValue={0}
                      >
                        <InputNumber min={0} />
                      </Form.Item>
                    </Fragment>
                  ) : null
                }
                {['button', 'buttonInp'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`yName`}
                      label={'按钮名称'}
                      initialValue="按钮"
                      rules={[{ required: true, message: '按钮名称' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      name={`fetchType`}
                      label={'http类型'}
                      rules={[{ required: false, message: 'http类型' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                          value: item,
                          label: _.toUpper(item),
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`xName`}
                      label={'接口地址'}
                      rules={[{ required: false, message: '接口地址' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      name={`fetchParams`}
                      label={'传递参数'}
                      rules={[{ required: false, message: '传递参数' }]}
                    >
                      <Input.TextArea size="large" autoSize={{ minRows: 1, maxRows: 5 }} />
                    </Form.Item>
                    {
                      ['buttonInp'].includes(windowType) ? (
                        <Form.Item name="ifNeedClear" label="手动清空按钮" valuePropName="checked">
                          <Switch />
                        </Form.Item>
                      ) :
                        <Fragment>
                          <Form.Item name="ifNeedAllow" label="二次确认" valuePropName="checked">
                            <Switch />
                          </Form.Item>
                          <Form.Item name="line_height" label="允许按几次" tooltip="0/不填:代表不作限制">
                            <InputNumber min={0} />
                          </Form.Item>
                        </Fragment>
                    }
                  </Fragment>
                ) : null}
                {['buttonPassword'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`yName`}
                      label={'按钮名称'}
                      rules={[{ required: true, message: '按钮名称' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      name={`fetchType`}
                      label={'http类型'}
                      rules={[{ required: false, message: 'http类型' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                          value: item,
                          label: _.toUpper(item),
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`xName`}
                      label={'接口地址'}
                      rules={[{ required: false, message: '接口地址' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      name={`fetchParams`}
                      label={'传递参数'}
                      rules={[{ required: false, message: '传递参数' }]}
                    >
                      <Input.TextArea size="large" autoSize={{ minRows: 1, maxRows: 5 }} />
                    </Form.Item>
                    <Form.Item
                      name={`password`}
                      label={'设置密码'}
                      rules={[{ required: true, message: '设置密码' }]}
                    >
                      <Input.Password visibilityToggle={false} allowClear size="large" />
                    </Form.Item>
                    <Form.Item
                      name={`passwordHelp`}
                      label={'密码提示'}
                      rules={[{ required: false, message: '密码提示' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['buttonUpload'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`yName`}
                      label={'按钮名称'}
                      rules={[{ required: true, message: '按钮名称' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item name="ifNeedAllow" label="前端执行打开路径" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      name={`fetchType`}
                      label={'http类型'}
                      rules={[{ required: false, message: 'http类型' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                          value: item,
                          label: _.toUpper(item),
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`xName`}
                      label={'接口地址'}
                      rules={[{ required: false, message: '接口地址' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      name={`fetchParams`}
                      label={'传递参数'}
                      rules={[{ required: false, message: '传递参数' }]}
                    >
                      <Input.TextArea size="large" autoSize={{ minRows: 1, maxRows: 5 }} />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['button', 'buttonPassword', 'buttonInp', 'buttonUpload'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`valueColor`}
                      label={'按钮颜色'}
                      initialValue={'primary'}
                      rules={[{ required: false, message: '按钮颜色' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        options={[
                          {
                            value: 'primary',
                            label: '默认',
                          },
                          {
                            value: 'link',
                            label: '链接按钮',
                          },
                          {
                            value: 'ghost',
                            label: '透明按钮',
                          },
                          {
                            value: 'rgba(255,107,104,1)',
                            label: '红色',
                          },
                          {
                            value: '#52c41a',
                            label: '绿色',
                          },
                          {
                            value: 'rgba(245,160,49,1)',
                            label: '黄色',
                          },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item name="des_bordered" label="是否自动换行" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['timeSelect'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`yName`}
                      label={'类型'}
                      initialValue={'datePicker'}
                      rules={[{ required: true, message: '类型' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        options={[
                          {
                            value: 'datePicker',
                            label: '日期',
                          },
                          {
                            value: 'datePickerWidthTime',
                            label: '日期+时间',
                          },
                          {
                            value: 'rangePicker',
                            label: '区间',
                          },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`fetchType`}
                      label={'http类型'}
                      rules={[{ required: false, message: 'http类型' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                          value: item,
                          label: _.toUpper(item),
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`xName`}
                      label={'接口地址'}
                      rules={[{ required: false, message: '接口地址' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      name="modelRotate"
                      label="默认初始化"
                      tooltip="每次刷新后，都传递当前时间给http插件"
                      initialValue={false}
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    {form.getFieldValue('yName') === 'rangePicker' ? (
                      <Form.Item
                        name={`timeSelectDefault`}
                        label={'默认时间范围'}
                        initialValue={'day'}
                        rules={[{ required: false, message: '默认时间范围' }]}
                      >
                        <Select
                          style={{ width: '100%' }}
                          options={[
                            {
                              value: 'day',
                              label: '当天',
                            },
                            {
                              value: 'week',
                              label: '过去7天',
                            },
                            {
                              value: 'month',
                              label: '过去一个月',
                            },
                          ]}
                        />
                      </Form.Item>
                    ) : null}
                  </Fragment>
                ) : null}
                {['switchBox'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`yName`}
                      label={'总开关名称'}
                      rules={[{ required: false, message: '名称' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      name="modelRotate"
                      label="开关在前"
                      initialValue={false}
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    <Form.Item name="des_column" label="列数">
                      <InputNumber />
                    </Form.Item>
                    <Form.Item
                      name="direction"
                      tooltip="启动/停止后，loading延迟时间"
                      label="启动延迟(秒)"
                      initialValue={0}
                    >
                      <InputNumber />
                    </Form.Item>
                    <Form.Item
                      name={`timeSelectDefault`}
                      label={'按钮参数'}
                      rules={[{ required: true, message: '按钮参数' }]}
                    >
                      {commonSettingList?.map?.((item: any, index: number) => {
                        const { id, label, ip, projectId } = item;
                        return (
                          <div
                            className="flex-box"
                            key={`segmentSwitch-item-${index}`}
                            style={{ marginBottom: 8 }}
                          >
                            <div style={{ flex: 1 }}>
                              <Input
                                defaultValue={label}
                                placeholder="label"
                                style={{ height: 28 }}
                                onChange={(e) => {
                                  const val = e?.target?.value;
                                  onSegmentSwitchChange(val, index, 'label');
                                }}
                              />
                            </div>
                            <div style={{ flex: 1, padding: '0 8px' }}>
                              <Input
                                defaultValue={ip}
                                placeholder="ip"
                                style={{ height: 28 }}
                                onChange={(e) => {
                                  const val = e?.target?.value;
                                  onSegmentSwitchChange(val, index, 'ip');
                                }}
                              />
                            </div>
                            <div style={{ flex: 1, padding: '0 8px' }}>
                              <Input
                                defaultValue={projectId}
                                placeholder="id"
                                style={{ height: 28 }}
                                onChange={(e) => {
                                  const val = e?.target?.value;
                                  onSegmentSwitchChange(val, index, 'projectId');
                                }}
                              />
                            </div>
                            <div>
                              <Button
                                icon={<MinusSquareOutlined />}
                                style={{ height: 28 }}
                                onClick={() => {
                                  onSegmentSwitchChange('', id, 'remove');
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                      <Button
                        icon={<PlusSquareOutlined />}
                        onClick={() => {
                          onSegmentSwitchChange('', 0, 'add');
                        }}
                      />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['segmentSwitch'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`yName`}
                      label={'名称'}
                      rules={[{ required: false, message: '名称' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      name={`timeSelectDefault`}
                      label={'按钮参数'}
                      rules={[{ required: true, message: '按钮参数' }]}
                    >
                      {commonSettingList?.map?.((item: any, index: number) => {
                        const { label, value, password, color, id } = item;
                        return (
                          <div
                            className="flex-box"
                            key={`segmentSwitch-item-${index}`}
                            style={{ marginBottom: 8 }}
                          >
                            <div style={{ flex: 1 }}>
                              <Input
                                defaultValue={label}
                                placeholder="label"
                                style={{ height: 28 }}
                                onChange={(e) => {
                                  const val = e?.target?.value;
                                  onSegmentSwitchChange(val, index, 'label');
                                }}
                              />
                            </div>
                            <div style={{ flex: 1, padding: '0 8px' }}>
                              <Input
                                defaultValue={value}
                                placeholder="value"
                                style={{ height: 28 }}
                                onChange={(e) => {
                                  const val = e?.target?.value;
                                  onSegmentSwitchChange(val, index, 'value');
                                }}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <Select
                                style={{ width: '100%' }}
                                defaultValue={color}
                                options={[
                                  {
                                    value: 'default-font',
                                    label: '默认',
                                  },
                                  {
                                    value: 'OK-font',
                                    label: '绿色',
                                  },
                                  {
                                    value: 'NG-font',
                                    label: '红色',
                                  },
                                  {
                                    value: 'warning-font',
                                    label: '黄色',
                                  },
                                ]}
                                onChange={(val) => {
                                  onSegmentSwitchChange(val, index, 'color');
                                }}
                              />
                            </div>
                            <div style={{ flex: 1, padding: '0 8px' }}>
                              <Input
                                defaultValue={password}
                                placeholder="password"
                                style={{ height: 28 }}
                                onChange={(e) => {
                                  const val = e?.target?.value;
                                  onSegmentSwitchChange(val, index, 'password');
                                }}
                              />
                            </div>
                            <div>
                              <Button
                                icon={<MinusSquareOutlined />}
                                style={{ height: 28 }}
                                onClick={() => {
                                  onSegmentSwitchChange('', id, 'remove');
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                      <Button
                        icon={<PlusSquareOutlined />}
                        onClick={() => {
                          onSegmentSwitchChange('', 0, 'add');
                        }}
                      />
                    </Form.Item>
                    <Form.Item name="des_layout" label="布局方向">
                      <Select
                        options={[
                          { label: '横向', value: 'horizontal' },
                          { label: '纵向', value: 'vertical' },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item name="des_bordered" label="是否展示边框" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      name={`fetchType`}
                      label={'http类型'}
                      rules={[{ required: false, message: 'http类型' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                          value: item,
                          label: _.toUpper(item),
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`xName`}
                      label={'接口地址'}
                      rules={[{ required: false, message: '接口地址' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      name={`fetchParams`}
                      label={'传递参数的key'}
                      initialValue={'value'}
                      rules={[{ required: false, message: '传递参数的key' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item name="ifNeedAllow" label="是否二次确认" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['description'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item label="静态数据">
                      {_.isArray(basicInfoData)
                        ? basicInfoData?.map?.((item: any, index: number) => {
                          if (!item || _.isEmpty(item)) return null;

                          const { id, name, value } = item;
                          return (
                            <div
                              key={`commonInfo-${id || index}`}
                              className="flex-box"
                              style={{ marginBottom: 8, height: '27px', gap: 8 }}
                            >
                              <div style={{ flex: 1 }}>
                                <Input
                                  placeholder="key"
                                  value={name}
                                  onChange={(e) => {
                                    const val = e?.target?.value;
                                    setBasicInfoData((prev: any) => {
                                      return prev?.map?.((info: any) => {
                                        if (info.id === id) {
                                          return { ...info, name: val };
                                        }
                                        return info;
                                      });
                                    });
                                  }}
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <Input
                                  placeholder="value"
                                  value={value}
                                  onChange={(e) => {
                                    const val = e?.target?.value;
                                    setBasicInfoData((prev: any) => {
                                      return prev?.map?.((info: any) => {
                                        if (info.id === id) {
                                          return { ...info, value: val };
                                        }
                                        return info;
                                      });
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
                                      return prev.filter((i: any) => i.id !== id)?.length
                                        ? prev.filter((i: any) => i.id !== id)
                                        : [{ id: guid(), name: '', value: '' }];
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })
                        : null}
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => {
                          setBasicInfoData((prev: any) =>
                            prev.concat({ id: guid(), name: '', value: '' }),
                          );
                        }}
                      />
                    </Form.Item>
                    <Form.Item name="des_column" label="列数">
                      <InputNumber />
                    </Form.Item>
                    <Form.Item name="des_layout" label="布局方向">
                      <Select
                        options={[
                          { label: '横向', value: 'horizontal' },
                          { label: '纵向', value: 'vertical' },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item name="des_bordered" label="是否展示边框" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    {!!form.getFieldValue('des_bordered') ? (
                      <Form.Item name="des_size" label="布局大小">
                        <Select
                          options={[
                            { label: '自适应', value: 'default' },
                            { label: '中', value: 'middle' },
                            { label: '小', value: 'small' },
                          ]}
                        />
                      </Form.Item>
                    ) : null}
                  </Fragment>
                ) : null}
                {['three'].includes(windowType) ? (
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
                      name="yName"
                      label="默认显示坐标轴"
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
                    {!!form.getFieldValue('modelRotateScreenshot') ||
                      !!form.getFieldValue('modelUpload') ? (
                      <Fragment>
                        <Form.Item
                          name={`fetchType`}
                          label={'http类型'}
                          rules={[{ required: false, message: 'http类型' }]}
                        >
                          <Select
                            style={{ width: '100%' }}
                            options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                              value: item,
                              label: _.toUpper(item),
                            }))}
                          />
                        </Form.Item>
                        <Form.Item
                          name={`xName`}
                          label={'接口地址'}
                          rules={[{ required: false, message: '接口地址' }]}
                        >
                          <Input size="large" />
                        </Form.Item>
                      </Fragment>
                    ) : null}
                  </Fragment>
                ) : null}
                {
                  ['fabric'].includes(windowType) ? (
                    <Fragment>
                      <Form.Item
                        name={`fetchType`}
                        label={'http类型'}
                        rules={[{ required: false, message: 'http类型' }]}
                      >
                        <Select
                          style={{ width: '100%' }}
                          placeholder="http类型"
                          options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                            value: item,
                            label: _.toUpper(item),
                          }))}
                        />
                      </Form.Item>
                      <Form.Item
                        name={`yName`}
                        label={'服务接口地址'}
                        rules={[{ required: false, message: '接口地址' }]}
                      >
                        <Input placeholder="接口地址" size="large" />
                      </Form.Item>
                      <Form.Item
                        name={`xName`}
                        label={'算法接口地址'}
                        rules={[{ required: false, message: '接口地址' }]}
                      >
                        <Input placeholder="接口地址" size="large" />
                      </Form.Item>
                    </Fragment>
                  ) : null
                }
                {['operation', 'operation2'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item name="des_column" label="列数" initialValue={1}>
                      <InputNumber />
                    </Form.Item>
                    <Form.Item name="des_bordered" label="是否展示边框" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      name={`operationList`}
                      label={'操作项'}
                      rules={[{ required: true, message: '操作项' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        mode="multiple"
                        options={selectedNodeConfig}
                        dropdownRender={(allSelectValue) => (
                          <div>
                            <div style={{ padding: '4px 8px 8px 8px', cursor: 'pointer' }}>
                              <Checkbox
                                defaultChecked={
                                  selectedNodeConfig.length ===
                                  form.getFieldValue('operationList')?.length
                                }
                                onChange={(e) => {
                                  if (e.target.checked === true) {
                                    form.setFieldsValue({
                                      operationList: selectedNodeConfig?.map?.(
                                        (item: any) => item.value,
                                      ),
                                    });
                                  } else {
                                    form.setFieldsValue({
                                      operationList: [],
                                    });
                                  }
                                }}
                              >
                                全选
                              </Checkbox>
                            </div>
                            <Divider style={{ margin: '0' }} />
                            {/* Option 标签值 */}
                            {allSelectValue}
                          </div>
                        )}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`yName`}
                      label={'label宽度'}
                      initialValue={150}
                      rules={[{ required: false, message: 'label宽度' }]}
                    >
                      <InputNumber />
                    </Form.Item>
                    <Form.Item
                      name="valueOnTop"
                      label="是否单独控制"
                      tooltip="如果每个属性需要单独控制是否开启，则打开"
                      initialValue={false}
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    {['operation2'].includes(windowType) ? (
                      <Fragment>
                        <Form.Item name="ifFetch" label="是否实时提交" valuePropName="checked">
                          <Switch />
                        </Form.Item>
                        {!!getFieldValue('ifFetch') ? (
                          <Form.Item
                            name={`xName`}
                            label={'接口地址'}
                            rules={[{ required: false, message: '接口地址' }]}
                          >
                            <Input size="large" />
                          </Form.Item>
                        ) : null}
                        <Form.Item
                          name="ifUpdateProject"
                          label="同步方案"
                          tooltip="修改内容保存到方案中，同步到execParams里面"
                          initialValue={false}
                          valuePropName="checked"
                        >
                          <Switch />
                        </Form.Item>
                        <Form.Item
                          name="ifUpdatetoInitParams"
                          label="同步初始化参数"
                          tooltip="同步到initParams里面（必须把上面的“同步方案”打开）"
                          initialValue={false}
                          valuePropName="checked"
                        >
                          <Switch />
                        </Form.Item>
                      </Fragment>
                    ) : null}
                    <Form.Item
                      name="ifPopconfirm"
                      label="是否二次确认"
                      initialValue={true}
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      name="showLabel"
                      label="显示标题"
                      valuePropName="checked"
                      initialValue={true}
                    >
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      name="passwordHelp"
                      label="密码权限"
                      valuePropName="checked"
                      initialValue={false}
                    >
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      name={`password`}
                      label={'密码'}
                      rules={[{ required: false, message: '密码' }]}
                    >
                      <Input.Password visibilityToggle={true} allowClear size="large" />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['statistic'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`yName`}
                      label={'统计名称'}
                      rules={[{ required: false, message: '统计名称' }]}
                    >
                      <Input size="large" />
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
                          },
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
                              fontColor: rgb,
                            };
                          });
                        }}
                      />
                    </Form.Item>
                    <Form.Item name="valueOnTop" label="数值在上" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['platForm'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`fetchType`}
                      label={'http类型'}
                      rules={[{ required: false, message: 'http类型' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        placeholder="http类型"
                        options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                          value: item,
                          label: _.toUpper(item),
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`xName`}
                      label={'接口地址'}
                      rules={[{ required: false, message: '接口地址' }]}
                    >
                      <Input placeholder="接口地址" size="large" />
                    </Form.Item>
                    <Form.Item
                      name="platFormOptions"
                      label="可选择对象"
                      initialValue={{
                        左上水平隔膜: {
                          灰度差: {
                            name: '灰度差',
                            alias: '灰度差',
                            require: true,
                            default: 15,
                            value: 15,
                            type: 'int',
                            description: '边界变化的灰度差',
                            widget: { type: 'InputNumber', max: 255, min: 0, step: 1 },
                          },
                          灰度合并像素: {
                            name: '灰度合并像素',
                            alias: '灰度合并像素',
                            require: true,
                            default: 2,
                            value: 2,
                            type: 'int',
                            description: '边界变化的灰度合并像素',
                            widget: { type: 'InputNumber', max: 5, min: 1, step: 1 },
                          },
                          亮度变化方向: {
                            name: '亮度变化方向',
                            alias: '亮度变化方向',
                            require: true,
                            default: 2,
                            value: 2,
                            type: 'List[string]',
                            description: '边界找线亮度变化方向, 1为亮到暗, 2为暗到亮',
                            widget: {
                              type: 'Select',
                              options: [
                                { label: '1-亮到暗', value: 1 },
                                { label: '2-暗到亮', value: 2 },
                              ],
                            },
                          },
                          直线度: {
                            name: '直线度',
                            alias: '直线度',
                            require: true,
                            default: 3,
                            value: 3,
                            type: 'int',
                            description: '直线度要求，值越小，线越直',
                            widget: { type: 'InputNumber', max: 100, min: 1, step: 1 },
                          },
                          降噪滤波核: {
                            name: '降噪滤波核',
                            alias: '降噪滤波核',
                            require: true,
                            default: 5,
                            value: 5,
                            type: 'int',
                            description: '去噪滤波核大小',
                            widget: { type: 'InputNumber', max: 21, min: 1, step: 1 },
                          },
                          找线方向下采样倍数: {
                            name: '找线方向下采样倍数',
                            alias: '找线方向下采样倍数',
                            require: true,
                            default: 8,
                            value: 8,
                            type: 'int',
                            description: '区域下采样倍数，提高计算速度',
                            widget: { type: 'InputNumber', max: 16, min: 2, step: 2 },
                          },
                          垂直找线方向下采样倍数: {
                            name: '垂直找线方向下采样倍数',
                            alias: '垂直找线方向下采样倍数',
                            require: true,
                            default: 2,
                            value: 2,
                            type: 'int',
                            description: '区域下采样倍数，提高计算速度',
                            widget: { type: 'InputNumber', max: 16, min: 2, step: 2 },
                          },
                          搜索框个数: {
                            name: '搜索框个数',
                            alias: '搜索框个数',
                            require: true,
                            default: 15,
                            value: 15,
                            type: 'int',
                            description: '搜索框个数',
                            widget: { type: 'InputNumber', max: 1000, min: 3, step: 1 },
                          },
                          搜索框宽度: {
                            name: '搜索框宽度',
                            alias: '搜索框宽度',
                            require: true,
                            default: 6,
                            value: 6,
                            type: 'int',
                            description: '搜索框宽度',
                            widget: { type: 'InputNumber', max: 1000, min: 3, step: 1 },
                          },
                          找线方法: {
                            name: '找线方法',
                            alias: '找线方法',
                            require: true,
                            default: '卡尺找线',
                            value: '卡尺找线',
                            type: 'List[string]',
                            description: '找线方法，1-卡尺找线，2-EDLines找线',
                            widget: {
                              type: 'Select',
                              options: [
                                { label: '卡尺找线', value: '卡尺找线' },
                                { label: 'EDLine找线', value: 'EDLine找线' },
                              ],
                            },
                          },
                        },
                      }}
                      rules={[{ required: false, message: '可选择对象' }]}
                    >
                      <Input.TextArea
                        autoSize={{ minRows: 5, maxRows: 10 }}
                        placeholder="可选择对象"
                        className="scrollbar-style"
                      />
                    </Form.Item>
                    <Form.Item name="ifFetch" label="是否实时提交" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['modal'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item name="ifFetch" label="是否实时提交" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      name={`fetchType`}
                      label={'http类型'}
                      rules={[{ required: false, message: 'http类型' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        placeholder="http类型"
                        options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                          value: item,
                          label: _.toUpper(item),
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`xName`}
                      label={'接口地址'}
                      rules={[{ required: false, message: '接口地址' }]}
                    >
                      <Input placeholder="接口地址" size="large" />
                    </Form.Item>
                    <Form.Item name="ifFetchParams" label="反馈参数" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['countdown'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`fetchType`}
                      label={'http类型'}
                      rules={[{ required: false, message: 'http类型' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        placeholder="http类型"
                        options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                          value: item,
                          label: _.toUpper(item),
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`xName`}
                      label={'接口地址'}
                      rules={[{ required: false, message: '接口地址' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item name="ifFetchParams" label="提示词" initialValue={"保养"}>
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item name="yName" label="按钮名称" initialValue={"已保养"}>
                      <Input size="large" />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['imgButton'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name="markNumberTop"
                      label="顶部图示长度"
                      rules={[{ required: true, message: '顶部图示长度' }]}
                    >
                      <InputNumber min={1} placeholder="顶部图示长度" />
                    </Form.Item>
                    <Form.Item
                      name="markNumberLeft"
                      label="左侧图示长度"
                      rules={[{ required: true, message: '左侧图示长度' }]}
                    >
                      <InputNumber min={1} placeholder="左侧图示长度" />
                    </Form.Item>
                    <Form.Item label="缺陷类型" name="xColumns">
                      {(editWindowData?.xColumns || [])?.map?.((item: any, index: number) => {
                        if (!item || _.isEmpty(item)) return null;

                        const { id, value, label } = item;
                        return (
                          <div
                            key={`xColumns-${id || index}`}
                            className="flex-box"
                            style={{ marginBottom: 8, height: '27px', gap: 8 }}
                          >
                            <div style={{ flex: 1 }}>
                              <Input
                                placeholder="label"
                                value={label}
                                onChange={(e) => {
                                  const val = e?.target?.value;
                                  setEditWindowData((prev: any) => {
                                    return {
                                      ...prev,
                                      xColumns: (prev?.xColumns || [])?.map?.((i: any) => {
                                        if (i.id === id) {
                                          return {
                                            ...i,
                                            label: val || '',
                                          };
                                        }
                                        return i;
                                      }),
                                    };
                                  });
                                }}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <Input
                                placeholder="value"
                                value={value}
                                onChange={(e) => {
                                  const val = e?.target?.value;
                                  setEditWindowData((prev: any) => {
                                    return {
                                      ...prev,
                                      xColumns: (prev?.xColumns || [])?.map?.((i: any) => {
                                        if (i.id === id) {
                                          return {
                                            ...i,
                                            value: val || '',
                                          };
                                        }
                                        return i;
                                      }),
                                    };
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
                                      xColumns: (prev?.xColumns || []).filter(
                                        (i: any) => i.id !== id,
                                      )?.length
                                        ? (prev?.xColumns || []).filter((i: any) => i.id !== id)
                                        : [{ id: guid(), label: '', value: '', color: '' }],
                                    };
                                  });
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => {
                          setEditWindowData((prev: any) => {
                            return {
                              ...prev,
                              xColumns: (prev?.xColumns || []).concat({
                                id: guid(),
                                label: '',
                                value: '',
                                color: '',
                              }),
                            };
                          });
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`fetchType`}
                      label={'http类型'}
                      rules={[{ required: true, message: 'http类型' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        placeholder="http类型"
                        options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                          value: item,
                          label: _.toUpper(item),
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`xName`}
                      label={'上传缺陷地址'}
                      rules={[{ required: true, message: '接口地址' }]}
                    >
                      <Input placeholder="接口地址" size="large" />
                    </Form.Item>
                    <Form.Item
                      name={`yName`}
                      label={'获取缺陷地址'}
                      rules={[{ required: true, message: '接口地址' }]}
                    >
                      <Input placeholder="接口地址" size="large" />
                    </Form.Item>
                    <Form.Item
                      name="fileTypes"
                      label="归档类型"
                      initialValue={[
                        '无图',
                        '功率异常',
                        '胶线不良',
                        '接线盒不良',
                        '边框不良',
                        '条码铭牌不清晰',
                      ]}
                      rules={[{ required: true, message: '归档类型' }]}
                    >
                      <Select mode="tags" style={{ width: '100%' }} options={[]} />
                    </Form.Item>
                    <Form.Item
                      name={`fileFetch`}
                      label={'归档地址'}
                      rules={[{ required: true, message: '归档地址' }]}
                    >
                      <Input placeholder="归档地址" size="large" />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['buttonImages'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item name={`reverse`} label={'槽位倒序'} valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      name="modelRotateScreenshot"
                      label="开启自动截图"
                      initialValue={false}
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    {!!form.getFieldValue('modelRotateScreenshot') ||
                      !!form.getFieldValue('modelUpload') ? (
                      <Fragment>
                        <Form.Item
                          name={`fetchType`}
                          label={'http类型'}
                          initialValue="post"
                          rules={[{ required: false, message: 'http类型' }]}
                        >
                          <Select
                            style={{ width: '100%' }}
                            options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                              value: item,
                              label: _.toUpper(item),
                            }))}
                          />
                        </Form.Item>
                        <Form.Item
                          name={`xName`}
                          label={'接口地址'}
                          initialValue={'http://127.0.0.1:8888/upload'}
                          rules={[{ required: false, message: '接口地址' }]}
                        >
                          <Input size="large" />
                        </Form.Item>
                      </Fragment>
                    ) : null}
                  </Fragment>
                ) : null}
                {['imgContrast'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name="modelRotateScreenshot"
                      label="按钮长显示"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['iframe'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`xName`}
                      label={'嵌套地址'}
                      rules={[{ required: true, message: '嵌套地址' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {[
                  'formula',
                  'orderInformation',
                  'equipment',
                  'paramControl',
                  'fastFunction',
                  'outputArea',
                ].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`fetchType`}
                      label={'http类型'}
                      rules={[{ required: false, message: 'http类型' }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        placeholder="http类型"
                        options={['get', 'post', 'put', 'delete', 'wbsocket']
                          ?.map?.((item: any) => ({
                            value: item,
                            label: _.toUpper(item),
                          }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`xName`}
                      label={'接口地址'}
                      rules={[{ required: false, message: '接口地址' }]}
                    >
                      <Input placeholder="接口地址" size="large" />
                    </Form.Item>
                    <Form.Item name="ifNeedAllow" label="是否二次确认" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      name={`httpRotation`}
                      label={'接口轮训'}
                      rules={[{ required: true, message: '接口轮训' }]}
                      valuePropName="checked"
                      initialValue={false}
                    >
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      name={`httpRotationTime`}
                      label={'轮训时间间隔'}
                      initialValue={2000}
                      rules={[{ required: false, message: '轮训时间间隔' }]}
                    >
                      <InputNumber addonAfter="毫秒" />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['paramControl'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`yName`}
                      label={'列数'}
                      rules={[{ required: false, message: '列数' }]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['equipmentInfo'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`xName`}
                      label={'缩放大小'}
                      rules={[{ required: false, message: '缩放大小' }]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Fragment>
                ) : null}
                {['pie3D'].includes(windowType) ? (
                  <Fragment>
                    <Form.Item
                      name={`xName`}
                      label={'缩放大小'}
                      rules={[{ required: false, message: '缩放大小' }]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </Fragment>
                ) : null}
              </div>
            </Form>
          ) : !!homeSettingVisible ? (
            <Form
              form={form}
              scrollToFirstError
              initialValues={homeSettingData[homeSettingVisible]}
            >
              {homeSettingVisible === 'slider-1' ? (
                <Fragment>
                  <Form.Item name="des_column" label="列数">
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    name="delay"
                    tooltip="启动/停止后，loading延迟时间"
                    label="启动延迟(秒)"
                    initialValue={0}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    name={`titleAlign`}
                    label={'对齐方式'}
                    initialValue={'horizational'}
                    rules={[{ required: false, message: '对齐方式' }]}
                  >
                    <Select
                      style={{ width: '100%' }}
                      options={[
                        {
                          value: 'horizational',
                          label: '横向',
                        },
                        {
                          value: 'vertical',
                          label: '纵向',
                        },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    name={'iconSize'}
                    label="图标大小"
                    initialValue={40}
                    rules={[{ required: true, message: '图标大小' }]}
                  >
                    <InputNumber min={12} />
                  </Form.Item>
                  <Form.Item name={'controlList'} label="控制从机">
                    {commonSettingList?.map?.((item: any, index: number) => {
                      const { ip, url, id } = item;
                      return (
                        <div
                          className="flex-box"
                          key={`control-list-${index}`}
                          style={{ marginBottom: 8 }}
                        >
                          <div style={{ flex: 1 }}>
                            <Input
                              defaultValue={url}
                              placeholder="127.0.0.1:8866"
                              style={{ height: 28 }}
                              onChange={(e) => {
                                const val = e?.target?.value;
                                onSliderControlChange(val, index, 'url');
                              }}
                            />
                          </div>
                          <div style={{ flex: 1, padding: '0 8px' }}>
                            <Input
                              defaultValue={ip}
                              placeholder="方案id"
                              style={{ height: 28 }}
                              onChange={(e) => {
                                const val = e?.target?.value;
                                onSliderControlChange(val, index, 'ip');
                              }}
                            />
                          </div>
                          <Button
                            icon={<MinusSquareOutlined />}
                            style={{ height: 28 }}
                            onClick={() => {
                              onSliderControlChange('', id, 'remove');
                            }}
                          />
                        </div>
                      );
                    })}
                    <Button
                      icon={<PlusSquareOutlined />}
                      onClick={() => {
                        onSliderControlChange('', 0, 'add');
                      }}
                    />
                  </Form.Item>
                </Fragment>
              ) : (
                <Form.Item
                  name={'fontSize'}
                  label="字号"
                  rules={[{ required: true, message: '字号' }]}
                >
                  <InputNumber min={12} />
                </Form.Item>
              )}
              {homeSettingVisible === 'slider-4' ? (
                <Fragment>
                  <Form.Item name="show_start_end" label="应用一键启停" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    name="self_stop_other"
                    label="切换停止其他方案"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Fragment>
              ) : null}
              {['footer-1', 'footer-2'].includes(homeSettingVisible) ? (
                <Form.Item name="logSize" label="展示日志行数">
                  <InputNumber min={1} max={200} />
                </Form.Item>
              ) : null}
              <Form.Item
                name="ifShowHeader"
                label="显示头部"
                initialValue={false}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              {['header'].includes(homeSettingVisible) ? (
                <Fragment>
                  <Form.Item name="headerName" label="标题">
                    <Input />
                  </Form.Item>
                  <Form.Item name="headerTitle" label="左侧logo名称">
                    <Input />
                  </Form.Item>
                  <Form.Item name="headerTitleFontSize" label="标题字号">
                    <InputNumber min={12} />
                  </Form.Item>
                  <Form.Item
                    name={`titleAlign`}
                    label={'对齐方式'}
                    initialValue={'center'}
                    rules={[{ required: false, message: '对齐方式' }]}
                  >
                    <Select
                      style={{ width: '100%' }}
                      options={[
                        {
                          value: 'center',
                          label: '居中',
                        },
                        {
                          value: 'flex-start',
                          label: '居上',
                        },
                        {
                          value: 'flex-end',
                          label: '居下',
                        },
                      ]}
                    />
                  </Form.Item>
                </Fragment>
              ) : null}
              <Form.Item
                name={`backgroundColor`}
                label={'窗口背景'}
                initialValue={'default'}
                rules={[{ required: false, message: '窗口背景' }]}
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
                    },
                    ...(homeSettingVisible === 'header'
                      ? [
                        {
                          value: dataHeaderImage,
                          label: '背景图1',
                        },
                        {
                          value: dataHeaderImage2,
                          label: '背景图2',
                        },
                      ]
                      : [
                        {
                          value: dataItemImage1,
                          label: '背景图1',
                        },
                        {
                          value: dataItemImage2,
                          label: '背景图2',
                        },
                        {
                          value: dataItemImage3,
                          label: '背景图3',
                        },
                        {
                          value: dataItemImage4,
                          label: '背景图4',
                        },
                      ]),
                  ]}
                />
              </Form.Item>
            </Form>
          ) : !!overallVisible ? (
            <Form form={form} scrollToFirstError>
              <Form.Item name="overallBackgroundColor" label="背景色" initialValue={''}>
                <ChromePicker
                  color={colorSelector?.overallBackgroundColor}
                  onChange={(value: any) => {
                    const { rgb } = value;
                    setColorSelector((prev: any) => {
                      return {
                        ...prev,
                        overallBackgroundColor: rgb,
                      };
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                name={`autoSize`}
                label={'自适应屏幕尺寸'}
                valuePropName="checked"
                rules={[{ required: false, message: '自适应尺寸' }]}
              >
                <Switch />
              </Form.Item>
              <Form.Item name="gridMargin" label="边距">
                <InputNumber />
              </Form.Item>
              <Form.Item
                label="标签页"
                tooltip="设置密码后，在切换时需要校验，不设置密码则直接切换"
              >
                {_.isArray(basicInfoData)
                  ? basicInfoData?.map?.((item: any, index: number) => {
                    if (!item || _.isEmpty(item)) return null;
                    const { id, name, password } = item;
                    return (
                      <div
                        key={`commonInfo-${id || index}`}
                        className="flex-box"
                        style={{ marginBottom: 8, height: '27px', gap: 8 }}
                      >
                        <div style={{ flex: 1 }}>
                          <Input
                            placeholder="tab页名称"
                            value={name}
                            onChange={(e) => {
                              const val = e?.target?.value;
                              setBasicInfoData((prev: any) => {
                                return prev?.map?.((info: any) => {
                                  if (info.id === id) {
                                    return { ...info, name: val };
                                  }
                                  return info;
                                });
                              });
                            }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <Input
                            placeholder="tab页密码"
                            value={password}
                            onChange={(e) => {
                              const val = e?.target?.value;
                              setBasicInfoData((prev: any) => {
                                return prev?.map?.((info: any) => {
                                  if (info.id === id) {
                                    return { ...info, password: val };
                                  }
                                  return info;
                                });
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
                                return prev.filter((i: any) => i.id !== id)?.length
                                  ? prev.filter((i: any) => i.id !== id)
                                  : [{ id: guid(), name: '' }];
                              });
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                  : null}
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setBasicInfoData((prev: any) => prev.concat({ id: guid(), name: '' }));
                  }}
                />
              </Form.Item>
            </Form>
          ) : null}
        </NodeDetailWrapper>
      </div>
      {
        (!!paramsData?.contentData?.showFooter || !_.isBoolean(paramsData?.contentData?.showFooter)) ?
          <div className="flex-box home-footer">
            {started ? (
              <div className="home-footer-item-box success">检测中</div>
            ) : (
              <div
                className="home-footer-item-box success"
                onClick={() => {
                  ifCanEdit && setFooterSelectVisible(true);
                }}
              >
                未启动
              </div>
            )}
            {(
              _.isBoolean(paramData?.contentData?.showLogo) ? paramData?.contentData?.showLogo : true
            ) ? (
              <div className="home-footer-powerby">&copy;技术支持: UBVision团队</div>
            ) : null}
            {useMemo(() => {
              return (
                <Fragment>
                  {
                    // 节点状态
                    !!footerSelectList?.length &&
                    footerSelectList?.map?.((id: any, index: number) => {
                      const item = footerData?.['state']?.[id] || footerData[id];
                      if (!item) {
                        return null;
                      }
                      const { Status, name } = item;
                      return (
                        <div
                          key={id}
                          className={`home-footer-item-box ${Status === 'running' ? 'success-font' : 'error-font'
                            }`}
                          onClick={() => {
                            ifCanEdit && setFooterSelectVisible(true);
                          }}
                        >
                          {name?.split('|')?.[1] ||
                            nodeList?.filter((i: any) => i.value === id)[0]?.label}
                          {index + 1 === footerSelectList?.length ? null : (
                            <span className="operation-line">|</span>
                          )}
                        </div>
                      );
                    })
                  }
                  {
                    // 内存状态
                    !!footerData?.['ram']
                      ? Object.entries(footerData?.['ram'])?.map?.((item: any) => {
                        const { current, total } = item;
                        return (
                          <div
                            key={item[0]}
                            className={`home-footer-item-box`}
                            onClick={() => {
                              ifCanEdit && setFooterSelectVisible(true);
                            }}
                          >
                            {`${item[0]} : ${current}/${total}`}
                          </div>
                        );
                      })
                      : null
                  }
                  {
                    // 运行时间
                    !!footerData?.['time'] ? footerData?.['time'] : null
                  }
                </Fragment>
              );
            }, [started, footerData, footerSelectList])}
          </div>
          : null
      }
      {
        // footer节点显示选择
        footerSelectVisible ? (
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
            maskClosable={false}
          >
            <Tree
              checkable
              defaultExpandAll
              showLine
              onCheck={(checkedKeysValue: any) => {
                setFooterSelectList(_.pull(checkedKeysValue, 'footer_001'));
              }}
              checkedKeys={footerSelectList}
              treeData={[
                {
                  key: 'footer_001',
                  value: 'footer_001',
                  title: '节点状态列表',
                  label: '节点状态列表',
                  children: nodeList?.map?.((item: any) => _.omit(item, 'children')),
                },
              ]}
            />
          </Modal>
        ) : null
      }
      {
        // 资源选择器
        selectPathVisible ? (
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
        ) : null
      }
      {
        // 监控列表-添加监控方案
        !!addItemsVisible ? (
          <Modal
            title={`添加方案窗口`}
            wrapClassName="history-window-modal"
            centered
            width="50vw"
            open={!!addItemsVisible}
            // maskClosable={false}
            onOk={() => {
              validateFields().then((values) => {
                const { value } = values;
                updateParams({
                  id: paramData.id,
                  data: {
                    ...paramData,
                    contentData: {
                      ...paramData?.contentData,
                      ipList: value,
                    },
                  },
                }).then((res: any) => {
                  if (res && res.code === 'SUCCESS') {
                    setInitialState((preInitialState: any) => ({
                      ...preInitialState,
                      params: res?.data,
                    }));
                  } else {
                    message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
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
            maskClosable={false}
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
                  options={(projectStatus || [])?.map?.((item: any) => {
                    return {
                      ...item,
                      // disabled: (paramData?.contentData?.ipList?.map?.((i: any) => i.key) || []).includes(item.value),
                    };
                  })}
                  placeholder="方案ID"
                />
              </Form.Item>
            </Form>
          </Modal>
        ) : null
      }
      {
        // 图表放大预览
        _.isObject(myChartVisible) && !_.isEmpty(myChartVisible) ? (
          <ChartPreviewModal option={myChartVisible} onCancel={() => setMyChartVisible(null)} />
        ) : null
      }
      {
        // 日志放大预览
        !!logDataVisible ? (
          <LogPreviewModal type={logDataVisible} onCancel={() => setLogDataVisible('')} />
        ) : null
      }
      {
        // 自定义表单-二级窗口
        !!formModalEdit ? (
          <Modal
            title={'自定义表单弹窗'}
            centered
            open={!!formModalEdit}
            onOk={() => {
              setFormModalEdit('');
            }}
            onCancel={() => setFormModalEdit('')}
            maskClosable={false}
          >
            {commonSettingList
              ?.sort((a: any, b: any) => a.sort - b.sort)
              ?.map?.((item: any, index: number) => {
                const { name, alias, type, className = '', id, parent } = item;
                if (formModalEdit === parent) {
                  return (
                    <div
                      className="flex-box form-time-select-item"
                      key={`segmentSwitch-item-${index}`}
                      style={{ marginBottom: 8, gap: 8 }}
                    >
                      <div style={{ flex: 1 }}>
                        <Input
                          defaultValue={name}
                          placeholder="name"
                          style={{ height: 32 }}
                          onChange={(e) => {
                            const val = e?.target?.value;
                            onFormChartsChange(val, index, 'name');
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <Input
                          defaultValue={alias}
                          placeholder="alias"
                          style={{ height: 32 }}
                          onChange={(e) => {
                            const val = e?.target?.value;
                            onFormChartsChange(val, index, 'alias');
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <Select
                          defaultValue={type}
                          placeholder="type"
                          style={{ width: '100%', height: 28 }}
                          options={[
                            {
                              value: 'Input',
                              label: '普通输入框',
                            },
                            {
                              value: 'InputNumber',
                              label: '数字输入框',
                            },
                            {
                              value: 'MultiSelect',
                              label: '复选框',
                            },
                            {
                              value: 'Select',
                              label: '单选框',
                            },
                            {
                              value: 'Switch',
                              label: '开关',
                            },
                            {
                              value: 'Button',
                              label: '按钮',
                            },
                            {
                              value: 'DatePicker',
                              label: '时间选择器',
                            },
                            {
                              value: 'IpInput',
                              label: 'ip输入框',
                            },
                          ]}
                          onChange={(val) => {
                            onFormChartsChange(val, index, 'type');
                          }}
                        />
                      </div>
                      {type?.indexOf('Button') > -1 ? (
                        <div style={{ flex: 1 }}>
                          <Select
                            defaultValue={className}
                            placeholder="颜色"
                            style={{ width: '100%', height: 28 }}
                            options={[
                              {
                                value: 'default',
                                label: '默认',
                              },
                              {
                                value: 'primary',
                                label: '蓝色',
                              },
                              {
                                value: 'success',
                                label: '绿色',
                              },
                              {
                                value: 'error',
                                label: '红色',
                              },
                              {
                                value: 'warning',
                                label: '黄色',
                              },
                            ]}
                            onChange={(val) => {
                              onFormChartsChange(val, index, 'className');
                            }}
                          />
                        </div>
                      ) : null}
                      <Button
                        icon={<MinusSquareOutlined />}
                        style={{ height: 28 }}
                        onClick={() => {
                          onFormChartsChange('', id, 'remove');
                        }}
                      />
                      <Button
                        icon={<ArrowUpOutlined />}
                        style={{ height: 28 }}
                        disabled={index === 0}
                        onClick={() => {
                          onFormChartsChange('', index, 'up');
                        }}
                      />
                    </div>
                  );
                }
                return null;
              })}
            <Button
              icon={<PlusSquareOutlined />}
              type="primary"
              onClick={() => {
                onFormChartsChange('', 0, 'addChild', formModalEdit);
              }}
            >
              新增
            </Button>
          </Modal>
        ) : null
      }
      {
        // tab切换-密码框
        !!Object.keys?.(tabPasswordVisible)?.length ? (
          <Modal
            title={'tab切换密码校验'}
            open={!!Object.keys?.(tabPasswordVisible)?.length}
            onOk={() => {
              validateFields().then((values) => {
                const { pass } = values;
                const { password, index } = tabPasswordVisible;
                if (pass == password) {
                  onTabChange(index);
                  form.resetFields();
                  setTabPasswordVisible({});
                } else {
                  message.error('密码错误');
                }
              });
            }}
            onCancel={() => {
              form.resetFields();
              setTabPasswordVisible({});
            }}
            maskClosable={false}
          >
            <Form form={form} scrollToFirstError>
              <Form.Item
                name={'pass'}
                label={'密码校验'}
                rules={[{ required: true, message: '密码' }]}
              >
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        ) : null
      }
    </div>
  );
};

Home.displayName = 'Home';

export default connect(({ home, themeStore }) => ({
  snapshot: home.snapshot || {},
  started: home.started || false,
  bodyBoxTab: home.bodyBoxTab,
  taskDataConnect: home.taskDataConnect || false,
  projectStatus: themeStore.projectStatus,
}))(Home);

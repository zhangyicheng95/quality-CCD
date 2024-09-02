import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import Moveable from 'react-moveable';
import { getuid, guid } from '@/utils/utils';
import * as _ from 'lodash';
import { connect, useModel } from 'umi';
import TooltipDiv from '@/components/TooltipDiv';
import { Button, message, Modal, Form, Dropdown, Menu, Badge } from 'antd';
import { BASE_IP, btnFetch, startFlowService, stopFlowService, updateParams } from '@/services/api';
import {
  CompressOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
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
import Table3Charts from '@/pages/home/components/Canvas/components/Table3Charts';
import TreeCharts from '@/pages/home/components/Canvas/components/TreeCharts';
import Table4Charts from '@/pages/home/components/Canvas/components/Table4Charts';
import TableEditCharts from '@/pages/home/components/Canvas/components/TableEditCharts';
import PlatFormCharts from '@/pages/home/components/Canvas/components/PlatFormCharts';
import ModalCharts from '@/pages/home/components/Canvas/components/ModalCharts';
import ImgButtonCharts from '@/pages/home/components/Canvas/components/ImgButtonCharts';
import ButtonImagesCharts from '@/pages/home/components/Canvas/components/ButtonImagesCharts';
import AlertImgCharts from '@/pages/home/components/Canvas/components/AlertImgCharts';
import ButtonUploadCharts from '@/pages/home/components/Canvas/components/ButtonUploadCharts';
import IframeCharts from '@/pages/home/components/Canvas/components/IframeCharts';
import dataItemImageNG from '@/assets/images/item-bg-ng.png';
import ImgContrastCharts from '@/pages/home/components/Canvas/components/ImgContrastCharts';
import TimeSelectCharts from '@/pages/home/components/Canvas/components/TimeSelectCharts';
import HeatMapCharts from '@/pages/home/components/Canvas/components/HeatMapCharts';
import NightingalePieCharts from '@/pages/home/components/Canvas/components/NightingalePieCharts';
import RankCharts from '@/pages/home/components/Canvas/components/RankCharts';
import Pie3DCharts from '@/pages/home/components/Canvas/components/Pie3DCharts';
import FormulaCharts from '@/pages/home/components/Canvas/components/customComponents/FormulaCharts';
import StatisticsCharts from '@/pages/home/components/Canvas/components/customComponents/StatisticsCharts';
import ModuleStatusCharts from '@/pages/home/components/Canvas/components/customComponents/ModuleStatusCharts';
import FastFunctionCharts from '@/pages/home/components/Canvas/components/customComponents/FastFunctionCharts';
import OutputAreaCharts from '@/pages/home/components/Canvas/components/customComponents/OutputAreaCharts';
import EquipmentControlCharts from '@/pages/home/components/Canvas/components/customComponents/EquipmentControlCharts';
import OrderInformationCharts from '@/pages/home/components/Canvas/components/customComponents/OrderInformationCharts';
import EquipmentInfoCharts from '@/pages/home/components/Canvas/components/customComponents/EquipmentInfoCharts';
import SegmentSwitchCharts from '@/pages/home/components/Canvas/components/SegmentSwitchCharts';
import BodyBoxCharts from '@/pages/home/components/Canvas/components/BodyBoxCharts';
import RangeDomainCharts from '@/pages/home/components/Canvas/components/RangeDomainCharts';
import RectRangeCharts from '@/pages/home/components/Canvas/components/customComponents/RectRangeCharts';
import ModelSwitchCharts from '@/pages/home/components/Canvas/components/customComponents/ModelSwitchCharts';
import SwitchBoxCharts from '@/pages/home/components/Canvas/components/SwitchBoxCharts';
import FormCharts from '@/pages/home/components/Canvas/components/FormCharts';
import NestFormCharts from '@/pages/home/components/Canvas/components/NestFormCharts';
import TableAntdCharts from '@/pages/home/components/Canvas/components/TableAntdCharts';
import moment from 'moment';
import HeaderCharts from '@/pages/home/components/Canvas/components/HeaderCharts';

interface Props {
  data?: [];
  bounds?: any;
  configForm?: any;
  addWindow?: any;
  removeWindow?: any;
  setDataList?: any;
}

const MoveItem: React.FC<Props> = (props: any) => {
  const {
    data, bounds, configForm, addWindow, removeWindow, setDataList,
    dispatch, snapshot, editCardID, bodyBoxTab, projectStatus, started
  } = props;
  const ifCanEdit = useMemo(() => {
    return location.hash?.indexOf('edit') > -1;
  }, [location.hash]);
  const [formCustom] = Form.useForm();
  const ipString: any = localStorage.getItem('ipString') || '';
  const { initialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  const itemRef = useRef<any>();
  const [snapContainer, setSnapContainer] = useState<any>(null);
  const [myChartVisible, setMyChartVisible] = useState<any>(null);
  const [logDataVisible, setLogDataVisible] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSnapContainer(document.querySelector('.main'));
  }, []);
  // 点击
  const handelClick = (name: string, e: any) => {
    if (ifCanEdit) {
      dispatch({
        type: 'home/set',
        payload: {
          editCardID: name,
        },
      });
    };
    e.preventDefault();
    e.stopPropagation();
  };
  // 拖拽
  function handleDragEnd(e: any) {
    let { width, height, left, top, transform } = e?.target?.style;
    const className = e?.target?.className?.split(` `)?.[1];
    width = Number(width.split('px')?.[0]);
    height = Number(height.split('px')?.[0]);
    left = Number(left.split('px')?.[0]);
    top = Number(top.split('px')?.[0]);
    if (!!transform) {
      const transforms = transform.split('translate(')?.[1]?.split(')')?.[0]?.split(',');
      left += Number(transforms?.[0]?.split('px')?.[0]);
      top += Number(transforms?.[1]?.split('px')?.[0]);
    };
    if (!!itemRef.current) {
      itemRef.current.target.style.cssText = itemRef.current.target.style.cssText.split('transform: translate')?.[0];
    }
    setDataList?.((prev: any) => prev?.map((item: any) => {
      if (item.name === className) {
        return {
          ...item,
          x: left,
          y: top,
          width, height
        }
      }
      return item;
    }));
  }
  // 缩放
  function handleResizeEnd(e: any) {
    const className = e?.target?.className?.split(` `)?.[1];
    let { width, height } = e?.target?.style;
    width = Number(width?.split('px')?.[0] || 0);
    height = Number(height?.split('px')?.[0] || 0);
    setDataList?.((prev: any) => prev?.map((item: any) => {
      if (item.name === className) {
        return {
          ...item,
          width, height
        }
      }
      return item;
    }));
  }
  // 旋转
  function handleRotateEnd(e: any) {
    const className = e?.target?.className?.split(` `)?.[1];
    const { rotate } = e?.target?.style;
    setDataList?.((prev: any) => prev?.map((item: any) => {
      if (item.name === className) {
        return {
          ...item,
          rotate
        }
      }
      return item;
    }));
  }
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
          }, props?.data?.filter((i: any) => i.type === 'slider-1')?.[0]?.delay * 1000 || 0);
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
        }, props?.data?.filter((i: any) => i.type === 'slider-1')?.[0]?.delay * 1000 || 0);
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
          }, props?.data?.filter((i: any) => i.type === 'slider-1')?.[0]?.delay * 1000 || 0);
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
      const param = Object.assign({}, _.omit(params, 'edges'), {
        flowData: Object.assign({}, params?.flowData, {
          edges: (params?.flowData?.edges || []).filter((edge: any) => {
            return (params?.flowData?.nodes || []).filter(
              (node: any) => node.id === edge?.source?.cell || node.id === edge?.target?.cell,
            ).length;
          }),
        }),
      });
      updateParams({
        id: param.id,
        data: param,
      }).then((res: any) => {
        if (res && res.code === 'SUCCESS') {
          startFlowService(ipString || '', '', param).then((res: any) => {
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
              !props?.data?.filter((i: any) => i.type === 'slider-1')?.[0]?.controlList ||
              props?.data?.filter((i: any) => i.type === 'slider-1')?.[0]?.controlList?.length === 0
            ) {
              setTimeout(() => {
                setLoading(false);
              }, props?.data?.filter((i: any) => i.type === 'slider-1')?.[0]?.delay * 1000 || 0);
            }
          });
        } else {
          message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
          if (
            !props?.data?.filter((i: any) => i.type === 'slider-1')?.[0]?.controlList ||
            props?.data?.filter((i: any) => i.type === 'slider-1')?.[0]?.controlList?.length === 0
          ) {
            setTimeout(() => {
              setLoading(false);
            }, props?.data?.filter((i: any) => i.type === 'slider-1')?.[0]?.delay * 1000 || 0);
          }
        }
      });
      props?.data?.filter((i: any) => i.type === 'slider-1')?.[0]?.controlList?.forEach?.((item: any, index: number) => {
        const { ip, url } = item;
        startFlowService(ip || '', url).then((res: any) => {
          if (res && res.code === 'SUCCESS') {
            message.success('任务启动成功');
          } else {
            message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
          }
          if (index + 1 === props?.data?.filter((i: any) => i.type === 'slider-1')?.[0]?.controlList?.length) {
            setTimeout(() => {
              setLoading(false);
            }, (props?.data?.filter((i: any) => i.type === 'slider-1')?.[0]?.delay || 0) * 1000 + 2000);
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
            !props?.data?.filter((i: any) => i.type === 'slider-1')?.[0]?.controlList ||
            props?.data?.filter((i: any) => i.type === 'slider-1')?.[0]?.controlList?.length === 0
          ) {
            setTimeout(() => {
              setLoading(false);
              resolve(true);
            }, props?.data?.filter((i: any) => i.type === 'slider-1')?.[0]?.delay * 1000 || 0);
          }
        });
        props?.data?.filter((i: any) => i.type === 'slider-1')?.[0]?.controlList?.forEach?.((item: any, index: number) => {
          const { ip, url } = item;
          stopFlowService(ip || '', url).then((res: any) => {
            if (res && res.code === 'SUCCESS') {
              message.success('任务停止成功');
            } else {
              message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
            }
            if (index + 1 === props?.data?.filter((i: any) => i.type === 'slider-1')?.[0]?.controlList?.length) {
              setTimeout(() => {
                resolve(true);
                setLoading(false);
              }, 3000); // (props?.data?.filter((i:any)=>i.type === 'slider-1')?.[0]?.delay || 0) * 1000 + 2000);
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
  return (
    <div
      className="main"
      style={{ height: '100%', width: '100%' }}
    // onClick={() => {
    //   dispatch({
    //     type: 'home/set',
    //     payload: {
    //       editCardID: 'commonSetting',
    //     },
    //   });
    // }}
    >
      {(data || [])?.map((item: any, index: number) => {
        const { name, x, y, width, height, type } = item;
        const target = `.${name}`;
        return (
          <Fragment key={index}>
            <div
              className={`move-item ${name}`}
              style={{
                height,
                width,
                left: x,
                top: y,
              }}
              onClick={(e) => handelClick(name, e)}
            >
              <InitItem
                data={data}
                item={item}
                snapshot={snapshot}
                bodyBoxTab={bodyBoxTab}
                dispatch={dispatch}
                formCustom={formCustom}
                configForm={configForm}
                addWindow={addWindow}
                removeWindow={removeWindow}
                setMyChartVisible={setMyChartVisible}
                setLogDataVisible={setLogDataVisible}
                loading={loading}
                setLoading={setLoading}
                startProjects={startProjects}
                endProjects={endProjects}
                projectStatus={projectStatus}
                started={started}
              />
            </div>
            <Moveable
              target={target} // moveable的对象
              draggable={editCardID === name} // 是否可以拖拽
              padding={{ left: 0, top: 0, right: 0, bottom: 0 }} // padding距离
              zoom={editCardID === name ? 0.6 : 0} // 缩放包裹的moveable
              origin={false} // 显示中心点
              throttleDrag={0} // 拖拽阈值 达到这个值才执行拖拽
              onDragEnd={handleDragEnd}
              snappable={true} // 是否初始化磁吸功能
              snapContainer={snapContainer} // 磁吸功能的容器
              bounds={bounds} // 边界点
              resizable={{
                renderDirections: true,
              }} // 是否可以缩放
              edgeDraggable // 是否通过拖动边缘线移动
              throttleResize={0} //  缩放阈值
              renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']} // 变化的点
              edge //resize,scale是否支持通过边框操作
              onResizeEnd={handleResizeEnd}
              rotatable={false}
              //   {
              //   renderDirections: true,
              // }} // 旋转
              throttleRotate={0} // 旋转阈值
              rotationPosition={'top'} // 旋转方向
              onRotateEnd={handleRotateEnd} // 旋转完成
              onRender={(e) => {
                itemRef.current = e;
                e.target.style.cssText += e.cssText;
              }}
            />
          </Fragment>
        );
      })}

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
    </div>
  );
};

const InitItem = (props: any) => {
  const {
    data,
    item,
    setMyChartVisible,
    setLogDataVisible,
    snapshot,
    bodyBoxTab,
    dispatch,
    formCustom,
    configForm,
    addWindow,
    removeWindow,
    loading, setLoading,
    startProjects,
    endProjects,
    projectStatus,
    started,
  } = props;
  const { logStr, gridContentList, footerData, errorData } = snapshot;
  const { initialState, setInitialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  const ifCanEdit = useMemo(() => {
    return location.hash?.indexOf('edit') > -1;
  }, [location.hash]);

  const newGridContentList = !!localStorage.getItem(`localGridContentList-${params.id}`)
    ? JSON.parse(localStorage.getItem(`localGridContentList-${params.id}`) || '{}')
    : [];

  const {
    id: key,
    size,
    value: __value = [],
    type,
    yName,
    xName,
    defaultImg,
    fontSize,
    reverse,
    direction,
    symbol,
    fetchType,
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
  const parent = params?.flowData?.nodes?.filter((i: any) => i.id === __value[0]);
  const { alias, name, ports = {} } = parent?.[0] || {};
  const { items = [] } = ports;
  const SecLabel = items?.filter(
    (i: any) => i.group === 'bottom' && i?.label?.name === __value[1],
  )[0];
  return (
    <div
      key={key}
      className={`log-content drag-item-content-box background-ubv`}
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
                    backgroundImage: `url(${type === 'img' && (dataValue?.status == 'NG' || dataValue?.status?.value == 'NG')
                      ? dataItemImageNG
                      : backgroundColor
                      })`,
                    backgroundColor: 'transparent',
                  },
        !!parentBodyBox && parentBodyBoxTab != bodyBoxTab ? { visibility: 'hidden' } : {},
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
            <span className="title-span">{`- ${SecLabel?.label?.alias || __value[1] || ''}`}</span>
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
              'header',
              'slider-1',
              'slider-4',
              'footer-1',
              'footer-2',
              'bodyBox',
              'form',
              'switchBox',
              'segmentSwitch',
              'rangeDomain',
              'rectRange',
              'modelSwitch',
              'iframe',
              'timeSelect',
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
                addContentList: data,
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
          ) : type === 'alert' ? (
            <AlertCharts
              id={key}
              data={{
                dataValue: dataValue || [],
                fontSize,
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
                addContentList: data,
              }}
            />
          ) : type === 'form' ? (
            <FormCharts
              id={key}
              data={{
                titleFontSize,
                fontSize,
                timeSelectDefault,
                yName,
                xName,
                fetchType,
                modelUpload,
                ifNeedAllow,
                modelRotate,
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
          ) : type === 'button' ? (
            <Button
              type={['primary', 'link', 'ghost'].includes(valueColor) ? valueColor : ''}
              id={key}
              style={Object.assign(
                { fontSize },
                { height: '100%', width: '100%' },
                !['primary', 'link', 'ghost'].includes(valueColor)
                  ? { backgroundColor: valueColor, color: '#fff' }
                  : {},
              )}
              className={`${des_bordered ? 'text-break' : ''}`}
              onClick={() => {
                const func = () => {
                  let params = '';
                  if (
                    !_.isUndefined(fetchParams) &&
                    !_.isNull(fetchParams) &&
                    _.isString(fetchParams) &&
                    !!fetchParams
                  ) {
                    try {
                      params = JSON.parse(fetchParams);
                    } catch (e) {
                      console.log('按钮传递参数格式不对:', e);
                      params = '';
                    }
                  }
                  btnFetch(fetchType, xName, params).then((res: any) => {
                    if (!!res && res.code === 'SUCCESS') {
                      message.success('success');
                    } else {
                      message.error(res?.message || '后台服务异常，请重启服务');
                    }
                  });
                };
                if (ifNeedAllow) {
                  Modal.confirm({
                    title: '提示',
                    icon: <ExclamationCircleOutlined />,
                    content: '确认发送？',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                      func();
                    },
                  });
                } else {
                  func();
                }
              }}
            >
              {yName || '按钮'}
            </Button>
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
            <ButtonCharts
              id={key}
              data={{
                fontSize,
                yName,
                xName,
                fetchType,
                ifNeedClear,
                valueColor,
                des_bordered,
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
              }}
            />
          ) : type === 'equipment' ? (
            <EquipmentControlCharts
              id={key}
              data={{
                dataValue,
                fontSize,
                titleFontSize,
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
          ) : type === 'header' ? (
            <HeaderCharts homeSettingData={item} />
          ) : type === 'slider-1' ? (
            <EquipmentInfoCharts
              id={key}
              data={{
                dataValue,
                fontSize,
                xName,
              }}
            />
          ) : type === 'slide-4' ? (
            <div
              className={`flex-box info-box-content tabs-box`}
              style={{
                fontSize: item?.fontSize || 'inherit',
              }}
            >
              {!!params?.contentData?.ipList?.length &&
                !!item?.show_start_end ? (
                <Fragment>
                  <Button
                    type="text"
                    disabled={loading}
                    loading={loading}
                    className={`flex-box-center tabs-box-item-box tabs-box-item-box-rows}`}
                    onClick={() => {
                      startProjects(
                        params?.contentData?.ipList?.[0],
                        params?.contentData?.ipList,
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
                    className={`flex-box-center tabs-box-item-box tabs-box-item-box-rows`}
                    onClick={() => {
                      endProjects(
                        params?.contentData?.ipList?.[0],
                        params?.contentData?.ipList,
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
                className={`flex-box-center tabs-box-item-box tabs-box-item-box-rows`}
                onClick={() => {
                  // setAddItemsVisible(true);
                }}
              >
                +
              </div>
              {(params?.contentData?.ipList || [])?.map?.((item: any, index: number) => {
                const { label, key } = item;
                const statusItem = projectStatus?.filter((i: any) => i.value === key)?.[0] || {};
                return (
                  <div
                    className={`flex-box tabs-box-item-box ${localStorage.getItem('ipString') === key ? 'active' : ''
                      } tabs-box-item-box-rows`}
                    key={`tabs-${key}`}
                  >
                    <div
                      onClick={() => {
                        if (localStorage.getItem('ipString') !== key) {
                          if (!!started && !!item?.self_stop_other) {
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
                            window.location.reload();
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
          ) : type === 'footer-1' ? (
            <Fragment>
              <div
                className="content-item-span"
                style={Object.assign(
                  {},
                  item['footer-1'],
                  item['footer-1']?.ifShowHeader ? {} : { height: '100%' },
                )}
                dangerouslySetInnerHTML={{
                  // 此处需要处理
                  __html: _.isString(logStr)
                    ? logStr
                    : logStr
                      ?.slice(logStr?.length - (item['footer-1']?.logSize || 50))
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
            </Fragment>
          ) : type === 'footer-2' ? (
            <Fragment>
              <div className="content-item-span">
                {errorData
                  ?.slice(errorData?.length - (item?.logSize || 50))
                  ?.map?.((log: any, index: number) => {
                    const { color, node_name, nid, message, time } = log;
                    return (
                      <div className="log-item flex-box-start" key={index}>
                        <div className="log-item-content">
                          <div className="content-item" style={item}>
                            <span
                              style={{
                                fontSize: item['footer-2']?.fontSize + 2 || 'inherit',
                              }}
                            >
                              {time || moment().format('YYYY-MM-DD HH:mm:ss')}&nbsp;
                            </span>
                            &nbsp;
                            <div
                              className="content-item-span"
                              style={{
                                color,
                                fontSize: item['footer-2']?.fontSize || 'inherit',
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
            </Fragment>
          ) : (
            <ImgCharts
              id={key}
              data={{
                defaultImg: !!defaultImg
                  ? `${BASE_IP}file${defaultImg?.indexOf('\\') === 0 || defaultImg?.indexOf('/') === 0 ? '' : '\\'
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
                ifOnShowTab: true
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
                  key: '2',
                  icon: <CopyOutlined />,
                  label: '复制',
                  onClick: (e: any) => {
                    // 复制监控窗口
                    const uuid32 = getuid();
                    addWindow && addWindow?.({
                      ..._.omit(item, 'id'),
                      value: [uuid32],
                      type,
                      size: {
                        x: size.x + size.w >= 96 ? size.x - size.w : size.x + size.w,
                        y: size.y,
                      },
                    });
                    e?.domEvent?.preventDefault?.();
                    e?.domEvent?.stopPropagation?.();
                  },
                },
                {
                  type: 'divider',
                },
                {
                  key: '3',
                  icon: <DeleteOutlined />,
                  label: '删除',
                  onClick: (e: any) => {
                    removeWindow && removeWindow?.(item?.name);
                    e?.domEvent?.preventDefault?.();
                    e?.domEvent?.stopPropagation?.();
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
                  top: 'auto',
                }
                : {},
            )}
            className="flex-box-center drag-item-content-mask common-card-title"
          ></div>
        </Dropdown>
      ) : null}
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
  editCardID: home.editCardID || '',
  snapshot: home.snapshot || {},
  bodyBoxTab: home.bodyBoxTab,
  taskDataConnect: home.taskDataConnect || false,
  projectStatus: themeStore.projectStatus,
}))(MoveItem);

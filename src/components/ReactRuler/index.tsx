import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import Guides from '@scena/react-guides';
import { connect, useModel } from 'umi';
import styles from './index.less';
import MoveItem from './MoveabledItem/MoveItem';
import NodeDetailWrapper from '../NodeDetailWrapper';
import {
  AppstoreAddOutlined,
  ArrowUpOutlined,
  BlockOutlined,
  DeleteOutlined,
  FileTextOutlined,
  FormOutlined,
  InfoCircleFilled,
  LayoutOutlined,
  LineChartOutlined,
  MinusOutlined,
  MinusSquareOutlined,
  PlusOutlined,
  PlusSquareOutlined,
  SaveOutlined,
  SettingOutlined,
  TableOutlined,
} from '@ant-design/icons';
import * as _ from 'lodash';
import { debounce, getuid, guid } from '@/utils/utils';
import { Button, Cascader, Checkbox, Divider, Form, Image, Input, InputNumber, message, Modal, Select, Skeleton, Switch, Tooltip } from 'antd';
import { customWindowList, windowTypeList } from '@/common/constants/globalConstants';
import dataHeaderImage from '@/assets/images/header-bg.png';
import dataHeaderImage2 from '@/assets/images/header-bg-2.png';
import dataHomeImage from '@/assets/images/home-bg.png';
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
import DragSortableItem from '../DragComponents/DragSortableItem';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DropSortableItem from '../DragComponents/DropSortableItem';
import { updateParams } from '@/services/api';
import { ChromePicker } from 'react-color';
import SegmentSwitch from '../SegmentSwitch';
import TooltipDiv from '../TooltipDiv';
import ChooseFileButton from '../ChooseFileButton';
import MoveableFooter from './MoveableFooter';

interface Props {
  onChange?: any;
}

const localLeftPanelTabs = [
  {
    name: '模版',
    icon: <LayoutOutlined />,
    key: 'model',
    describtion: '使用基础组件组合后的复杂组件',
    children: windowTypeList?.filter((i: any) => i.type === 'model')
  },
  {
    name: '组件',
    icon: <AppstoreAddOutlined />,
    key: 'module',
    describtion: '包含常用基础元素组件',
    children: windowTypeList?.filter((i: any) => i.type === 'module')
  },
  {
    name: '表格',
    icon: <TableOutlined />,
    key: 'table',
    describtion: '包含常用表格组件',
    children: windowTypeList?.filter((i: any) => i.type === 'table')
  },
  {
    name: '表单',
    icon: <FileTextOutlined />,
    key: 'form',
    describtion: '包含常用表单组件',
    children: windowTypeList?.filter((i: any) => i.type === 'form')
  },
  {
    name: '图表',
    icon: <LineChartOutlined />,
    key: 'charts',
    describtion: '包含常用Echarts图表组件',
    children: windowTypeList?.filter((i: any) => i.type === 'charts')
  },
  {
    name: '定制',
    icon: <BlockOutlined />,
    key: 'customModule',
    describtion: '对于某些项目的特殊定制组件',
    children: customWindowList
  },
];

const ReactRuler: React.FC<Props> = (props: any) => {
  let { onChange, dispatch, started, editCardID, bodyBoxTab } = props;
  const { initialState, setInitialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  const [form] = Form.useForm();
  const { validateFields, setFieldsValue, getFieldValue, resetFields } = form;
  const ifCanEdit = useMemo(() => {
    return location.hash?.indexOf('edit') > -1;
  }, [location.hash]);
  const [configForm] = Form.useForm();
  const horizonalGuidesRef = useRef<any>();
  const verticalGuidesRef = useRef<any>();
  const moveBodyRef = useRef<any>();
  const ctrlRef = useRef<any>();
  const [leftPanelTabs, setLeftPanelTabs] = useState(localLeftPanelTabs);
  const [boxSize, setBoxSize] = useState({
    top: 0,
    left: 0,
    right: 1920,
    bottom: 1080,
  });
  const [leftSelected, setLeftSelected] = useState(1);
  const [selectedItem, setSelectedItem] = useState(0);
  const [nodeList, setNodeList] = useState<any>([]);
  const [selectedNodeConfig, setSelectedNodeConfig] = useState<any>([]);
  const [dataList, setDataList] = useState<any>([]);
  const [basicInfoData, setBasicInfoData] = useState<any>([]);
  const [tabNum, setTabNum] = useState(0);
  const [windowType, setWindowType] = useState('img');
  const [selectPathVisible, setSelectPathVisible] = useState(false);
  const [selectedPath, setSelectedPath] = useState<any>({ fileType: 'file', value: '' });
  const [commonSettingList, setCommonSettingList] = useState<any>([]);
  const [formModalEdit, setFormModalEdit] = useState('');
  const [tabPasswordVisible, setTabPasswordVisible] = useState<any>({});
  const [editWindowData, setEditWindowData] = useState<any>({});
  const [colorSelector, setColorSelector] = useState<any>({
    fontColor: '#FFFFFF',
    backgroundColor: 'default',
    overallBackgroundColor: '',
  });

  /** 
   * 1. 初始化绑定事件
   * 2. 点击编辑节点
   **/
  useEffect(() => {
    document.addEventListener('wheel', onWheelScroll);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    if (editCardID === 'commonSetting') {
      setBasicInfoData(
        params?.contentData?.tabList || [{ id: guid(), name: '' }],
      );
    } else if (!!editCardID) {
      const res = dataList?.filter((i: any) => i?.name === editCardID)?.[0] || {};
      setFieldsValue(res);
      setWindowType(res?.type);
      setCommonSettingList(res?.controlList || []);
    } else {
      resetFields();
    }

    return () => {
      document.removeEventListener('wheel', onWheelScroll);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [dataList, editCardID]);
  // 初始化
  useEffect(() => {
    if (_.isEmpty(params)) return;
    const box: any = document.querySelector('#moveableBox');
    const { flowData = {}, contentData = {}, selfStart = false } = params;
    const {
      home = [],
      content = {},
      footerSelectList,
      contentHeader = {},
      pageIconPosition,
      contentSize,
      windowScale,
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
            };
          }),
      };
    });
    setNodeList(list);
    let scale = 1;
    if (location.hash?.indexOf('edit') < 0) {
      scale = window.screen.width / ((box?.clientWidth || 1120) - 802);//windowScale;
    }

    const contentList = !!home?.length ?
      (content || [])?.concat(home)?.map((item: any) => {
        const { type, i, size, maxH, maxW, minH, minW, w, h, x, y, ...rest } = item;
        return {
          ...rest,
          name: `${type || i}_${guid()}`,
          type: type || i,
          ...(!!size
            // 组件窗口
            ? {
              x: size.x,
              y: size.y,
              width: (size.w * window.screen.width) / 96,
              height: size.h * 14,
            }
            // 基础窗口
            : {
              ...homeSetting?.[i],
              x: item.x,
              y: item.y,
              width: (item.w * window.screen.width) / 96,
              height: item.h * 14,
            }),
        };
      })
      :
      (content || [])?.map((item: any) => {
        return {
          ...item,
          x: scale * item.x,
          y: scale * item.y,
          width: scale * item.width,
          height: scale * item.height
        }
      }).filter((i: any) => !!i.width);
    setDataList(contentList);
  }, [params]);
  // 屏幕变化
  const windowResize = () => {
    console.log(123);

    const box: any = document.querySelector('#moveableBox');
    const height = (box?.clientWidth - 2) * window.screen.height / window.screen.width;
    setBoxSize((prev: any) => {
      return {
        ...prev,
        right: box?.clientWidth - 2,
        bottom: height <= box?.clientHeight ? height : box?.clientHeight,
      };
    });
  };
  useEffect(() => {
    windowResize();
    window.addEventListener('resize', debounce(windowResize, 300));

    return () => {
      window.removeEventListener('resize', debounce(windowResize, 300));
    }
  }, []);
  // 滚动
  const onWheelScroll = (e: any) => {
    if (ctrlRef.current) {
      console.log(e);
    }
  };
  // 键盘按下
  const onKeyDown = (e: any) => {
    const { ctrlKey, key } = e;
    if (ctrlKey) {
      ctrlRef.current = true;
    } else if (key === 'Backspace') {
      // 删除节点
      removeWindow();
    } else {
      // console.log(e);
    }
  };
  // 键盘抬起
  const onKeyUp = (e: any) => {
    ctrlRef.current = false;
  };
  // 添加监控窗口
  const addWindow = (values: any) => {
    const { __value, size, type, fetchParams, ...rest } = values;
    if (['button', 'buttonInp', 'buttonPassword', 'buttonUpload'].includes(type) && !!fetchParams) {
      try {
        JSON.parse(fetchParams);
      } catch (e) {
        message.error('传递参数 格式不正确');
        return;
      }
    }
    const id = `${__value?.join('$$')}$$${type}`;
    if (_.isEmpty(editWindowData) && dataList?.filter((i: any) => i.id === id).length) {
      message.error('已存在，请求改 “模块，节点，类型” 中的任一项');
      return;
    }
    const res = {
      id,
      name: `${type}_${guid()}`,
      type,
      fetchParams,
      ...size,
      width: 200,
      height: 100,
      ...rest
    };
    setDataList((prev: any) => (prev || []).concat(res));
    onCancel();
  };
  // 删除监控窗口
  const removeWindow = (editId?: string) => {
    if (!!editId) {
      editCardID = editId;
    }
    if (!!editCardID && !!dataList?.length) {
      setDataList((prev: any) => prev?.filter((i: any) => i.name !== editCardID));
      dispatch({
        type: 'home/set',
        payload: {
          editCardID: '',
        },
      });
    }
  }
  // 分段开关选项
  const onSegmentSwitchChange = (value: any, index: number, type: string) => {
    let list: any = [];
    if (type === 'remove') {
      setCommonSettingList([]);
      list = commonSettingList
        ?.map((cen: any, cIndex: number) => {
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
      list = commonSettingList?.map((cen: any, cIndex: number) => {
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
      setCommonSettingList(list?.map((item: any) => ({ ...item, id: guid() })));
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
        ?.map((cen: any, cIndex: number) => {
          if (cen.id === index) {
            return null;
          }
          return cen;
        })
        .filter(Boolean);
    } else if (type === 'add') {
      list = (commonSettingList || [])?.concat('');
    } else {
      list = commonSettingList?.map((cen: any, cIndex: number) => {
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
      setCommonSettingList(list?.map((item: any) => ({ ...item, id: guid() })));
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
        ?.map((cen: any, cIndex: number) => {
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
      list = commonSettingList?.map((cen: any, cIndex: number) => {
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
      list = commonSettingList?.map((cen: any, cIndex: number) => {
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
      setCommonSettingList(list?.map((item: any) => ({ ...item, id: guid() })));
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
        ?.map((cen: any, cIndex: number) => {
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
      list = commonSettingList?.map((cen: any, cIndex: number) => {
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
      list = commonSettingList?.map((cen: any, cIndex: number) => {
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
      setCommonSettingList(list?.map((item: any) => ({ id: guid(), ...item })));
      form.setFieldsValue({
        timeSelectDefault: list,
      });
    });
  };
  // tab切换
  const onTabChange = (index: number) => {
    localStorage.setItem(`localGridContent-tab-${params.id}`, index + '');
    setTabNum(index);
  };
  // 获取实际画布数据
  const getAllCanvasData = () => {
    const box = moveBodyRef.current?.querySelectorAll('.move-item');
    const list: any = [];
    for (let i = 0; i < box.length; i++) {
      list.push(box[i]);
    }
    const homeLayout = list?.map((item: any) => {
      let { width, height, left, top, transform } = item?.style;
      width = Number(width.split('px')?.[0]);
      height = Number(height.split('px')?.[0]);
      left = Number(left.split('px')?.[0]);
      top = Number(top.split('px')?.[0]);
      if (!!transform) {
        const transforms = transform.split('translate(')?.[1]?.split(')')?.[0]?.split(',');
        left += Number(transforms?.[0]?.split('px')?.[0]);
        top += Number(transforms?.[1]?.split('px')?.[0]);
      }
      return { width, height, left, top, class: item?.className?.split(` `)?.[1] }
    });
    const content = dataList?.map((item: any) => {
      const res = homeLayout?.filter((i: any) => i.class === item.name)?.[0];
      return {
        ...item,
        x: res.left,
        y: res.top,
        width: res.width,
        height: res.height
      }
    });
    return content;
  }
  // 全局保存
  const onSave = () => {
    const scale = window.screen.width / (boxSize.right + boxSize.left);
    const canvasData = getAllCanvasData();
    const param = {
      ...params,
      contentData: {
        ...params?.contentData,
        content: canvasData,
        windowScale: scale
      },
    };;
    updateParams({
      id: params.id,
      data: param,
    }).then((res: any) => {
      // if (process.env.NODE_ENV === 'development') {
      //   window.location.reload();
      //   return;
      // }
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
  }
  // 节点属性保存
  const onConfigSave = () => {
    form
      .validateFields()
      .then((values) => {
        const canvasData = getAllCanvasData();
        let param = Object.assign({}, params);
        if (editCardID === 'commonSetting') {
          param = {
            ...param,
            contentData: {
              ...param?.contentData,
              ...values,
              tabList: basicInfoData,
              content: canvasData
            },
          };
        } else {
          param = {
            ...param,
            contentData: {
              ...param?.contentData,
              content: canvasData?.map((item: any) => {
                if (item.name === editCardID) {
                  return {
                    ...item,
                    ...values
                  }
                };
                return item;
              })
            },
          };
        };
        console.log(param);
        setInitialState((preInitialState: any) => ({
          ...preInitialState,
          params: param,
        }));
        onCancel();
      })
      .catch((err) => {
        const { errorFields } = err;
        _.isArray(errorFields) && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
      });
  }
  // 取消
  const onCancel = () => {
    form.resetFields();
    dispatch({
      type: 'home/set',
      payload: {
        editCardID: '',
      },
    });
  };

  return (
    <div className={`flex-box ${styles.moveableRuler}`}>
      {
        ifCanEdit ?
          <DndProvider backend={HTML5Backend}>
            <div className="left-plugins-panel">
              <div className="left-plugins-panel-search-box">
                <Input.Search
                  onSearch={(val) => {
                    if (!!val) {
                      setLeftPanelTabs((prev: any) => {
                        return (localLeftPanelTabs || [])?.map((box: any) => {
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
                      setLeftPanelTabs(localLeftPanelTabs);
                    }
                  }}
                />
              </div>
              <div className="flex-box-start left-plugins-panel-body">
                <div className="left-plugins-panel-body-tabs-box">
                  {(leftPanelTabs || [])?.map((item: any, index: number) => {
                    const { name, key, icon } = item;
                    return (
                      <div
                        className={`flex-box-center left-plugins-panel-body-tabs-box-item ${leftSelected === index ? 'font-selected' : ''
                          }`}
                        key={`tab-item-${key}`}
                        onClick={() => setLeftSelected(index)}
                      >
                        <div className="left-plugins-panel-body-tabs-box-item-icon">{icon}</div>
                        {name}
                      </div>
                    );
                  })}
                </div>
                <div className="left-plugins-panel-body-body">
                  <div className="flex-box left-plugins-panel-body-body-describtion">
                    <InfoCircleFilled />
                    {leftPanelTabs?.[leftSelected]?.describtion}
                  </div>
                  <div className="left-plugins-panel-body-body-children">
                    {leftPanelTabs?.[leftSelected]?.children?.map((item: any, index: number) => {
                      const { value, label, icon } = item;
                      return <div key={`left-plugins-panel-body-children-item-${index}`}>
                        {
                          // @ts-ignore
                          <DragSortableItem index={JSON.stringify(item)}>
                            <div
                              className="flex-box left-plugins-panel-body-body-children-item"
                            >
                              <div className="left-plugins-panel-body-body-children-item-icon">
                                {!!icon ? <Image src={icon} alt="logo" /> : null}
                              </div>
                              <div className="left-plugins-panel-body-body-children-item-title">{label}</div>
                            </div>
                          </DragSortableItem>
                        }
                      </div>
                    })}
                  </div>
                </div>
              </div>
            </div>
            <DropSortableItem
              // @ts-ignore
              moveCard={(dragIndex: any, hoverIndex: any, e: any) => {
                onCancel();
                const x = e.x;
                const y = e.y - 33;
                const item = JSON.parse(dragIndex);
                const { key, value, icon } = item;
                const width = boxSize.right + boxSize.left;
                const height = boxSize.bottom + boxSize.top;
                const parentBodyBox = dataList?.filter((i: any) => {
                  return (
                    i.type === 'bodyBox' &&
                    x > i.x &&
                    x < i.x + i.width &&
                    y > i.y &&
                    y < i.y + i.height
                  );
                })?.[0]?.id;
                if (
                  !!dataList?.filter((i: any) => i.type === 'bodyBox')?.[0] &&
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
                      __value: [uuid32],
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
              }}
            >
              <div
                id="moveableBox"
                ref={moveBodyRef}
                className="moveable-ruler-left-box"
                onWheel={(e) => {
                  // const deltaX = e.deltaX;
                  // const deltaY = e.deltaY;
                  // const scrollX = horizonalGuidesRef.current.getRulerScrollPos() + deltaX;
                  // const scrollY = verticalGuidesRef.current.getRulerScrollPos() + deltaY;
                  // horizonalGuidesRef.current.scrollGuides(scrollY);
                  // verticalGuidesRef.current.scrollGuides(scrollX);
                  // horizonalGuidesRef.current.scroll(scrollX);
                  // verticalGuidesRef.current.scroll(scrollY);
                }}
              >

                {/* <Guides
          ref={horizonalGuidesRef}
          className="ruler horizontal"
          type="horizontal"
          rulerStyle={{
            left: '30px',
            width: 'calc(100% - 30px)',
            height: '100%',
          }}
          defaultGuides={[boxSize.top, boxSize.bottom]}
          displayDragPos={false}
          displayGuidePos={false}
          useResizeObserver={false}
        />
        <Guides
          ref={verticalGuidesRef}
          className="ruler vertical"
          type="vertical"
          rulerStyle={{
            top: '30px',
            height: 'calc(100% - 30px)',
            width: '100%',
          }}
          defaultGuides={[boxSize.left, boxSize.right]}
          displayDragPos={false}
          displayGuidePos={false}
          useResizeObserver={false}
        /> */}
                <div className="move-body-box">
                  <div className="flex-box-justify-between move-body-box-toolbar">
                    <div></div>
                    <div className="flex-box" style={{ gap: 16 }}>
                      <Button
                        icon={<SettingOutlined className="toolbar-btn-icon" />}
                        className="toolbar-btn"
                        onClick={() => {
                          dispatch({
                            type: 'home/set',
                            payload: {
                              editCardID: 'commonSetting',
                            },
                          });
                        }}
                      >全局设置</Button>
                      <Tooltip placement="bottom" title="保存数据">
                        <Button
                          icon={<SaveOutlined className="toolbar-btn-icon" />}
                          className="toolbar-btn"
                          type="primary"
                          onClick={() => onSave()}
                        />
                      </Tooltip>
                    </div>
                  </div>
                  <div
                    className="move-body-box-content"
                    style={{ width: boxSize.right + boxSize.left, height: boxSize.bottom + boxSize.top - 24 }}
                  >
                    <MoveItem
                      bounds={boxSize}
                      data={dataList}
                      configForm={configForm}
                      addWindow={addWindow}
                      removeWindow={removeWindow}
                      setDataList={setDataList}
                    />
                  </div>
                  <MoveableFooter nodeList={nodeList} />
                </div>
              </div>
            </DropSortableItem>
          </DndProvider>
          :
          <div
            id="moveableBox"
            ref={moveBodyRef}
            className="moveable-ruler-left-box"
            style={{ width: '100%', marginLeft: 0 }}
          >
            <div className="move-body-box">
              <div
                className="move-body-box-content"
                style={{
                  width: boxSize.right + boxSize.left,
                  height: boxSize.bottom + boxSize.top - 24,
                  border: 0
                }}
              >
                <MoveItem
                  bounds={boxSize}
                  data={dataList}
                  configForm={configForm}
                />
              </div>
              <MoveableFooter nodeList={nodeList} />
            </div>
          </div>
      }
      {
        ifCanEdit ?
          <NodeDetailWrapper
            className="right-config-panel"
            onSave={!!editCardID ? onConfigSave : null}
            onCancel={!!editCardID ? onCancel : null}
          >
            {
              !!editCardID ?
                (editCardID === 'commonSetting' ?
                  <div className="right-config-panel-yemian-box">
                    <div className="right-config-panel-yemian-box-title">页面配置</div>
                    <div className="right-config-panel-yemian-box-body">
                      <Form form={form} scrollToFirstError>
                        <Form.Item name="overallBackgroundColor" label="背景色" initialValue={'default'}>
                          <Select
                            style={{ width: '100%' }}
                            options={[
                              {
                                value: 'default',
                                label: '默认',
                              },
                              {
                                value: 'black',
                                label: '黑色',
                              },
                              {
                                value: 'white',
                                label: '白色',
                              },
                              {
                                value: dataHomeImage,
                                label: '背景图',
                              },
                            ]}
                          />
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
                    </div>
                  </div>
                  :
                  <div className="right-config-panel-tab-box">
                    <div className="flex-box right-config-panel-tab-box-title">
                      {['基础', '高级', '交互', '数据']?.map((item: any, index: number) => {
                        return (
                          <div
                            className={`right-config-panel-tab-box-title-item ${selectedItem === index ? 'font-selected' : ''
                              }`}
                            key={`right-config-panel-tab-box-title-item-${index}`}
                            onClick={() => setSelectedItem(index)}
                          >
                            {item}
                          </div>
                        );
                      })}
                      <div
                        className="right-config-panel-tab-box-title-selected"
                        style={{ left: `${selectedItem * 25}%` }}
                      />
                    </div>
                    <div className="right-config-panel-tab-box-body">
                      <Form form={form} scrollToFirstError>
                        {
                          //基础设置
                        }
                        <div style={selectedItem === 0 ? {} : { display: 'none' }}>
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
                            rules={[{ required: false, message: '绑定节点' }]}
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
                                const res = params?.flowData?.nodes.filter(
                                  (i: any) => i.id === val[0],
                                )?.[0];
                                if (!!res) {
                                  setFieldsValue({ operationList: [] });
                                  const { config = {} } = res;
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
                            <Input disabled style={{ width: '100%' }} />
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
                        {
                          //高级设置
                        }
                        <div style={selectedItem === 1 ? {} : { display: 'none' }}>
                          {['img'].includes(windowType) ? (
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
                              <Form.Item name="notLocalStorage" label="开启图片缓存" valuePropName="checked">
                                <Switch />
                              </Form.Item>
                              <Form.Item name="showImgList" label="图片列表" valuePropName="checked">
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
                                rules={[{ required: true, message: '行数' }]}
                              >
                                <InputNumber min={1} placeholder="" />
                              </Form.Item>
                              <Form.Item
                                name="columnNumber"
                                label="列数"
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
                                      ?.map((item: any, index: number) => {
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
                                  ?.map((item: any, index: number) => {
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
                                  ?.map((item: any, index: number) => {
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
                                name="modelRotate"
                                label="是否需要右侧按钮"
                                initialValue={false}
                                valuePropName="checked"
                              >
                                <Switch />
                              </Form.Item>
                              <Form.Item
                                name={`timeSelectDefault`}
                                label={'表单项'}
                                rules={[{ required: false, message: '表单项' }]}
                              >
                                {commonSettingList
                                  ?.sort((a: any, b: any) => a.sort - b.sort)
                                  ?.map((item: any, index: number) => {
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
                              {['button'].includes(windowType) ? (
                                <Fragment>
                                  <Form.Item
                                    name={`fetchParams`}
                                    label={'传递参数'}
                                    rules={[{ required: false, message: '传递参数' }]}
                                  >
                                    <Input.TextArea size="large" autoSize={{ minRows: 1, maxRows: 5 }} />
                                  </Form.Item>
                                  <Form.Item name="ifNeedAllow" label="二次确认" valuePropName="checked">
                                    <Switch />
                                  </Form.Item>
                                </Fragment>
                              ) : (
                                <Form.Item name="ifNeedClear" label="手动清空按钮" valuePropName="checked">
                                  <Switch />
                                </Form.Item>
                              )}
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
                                {commonSettingList?.map((item: any, index: number) => {
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
                                {commonSettingList?.map((item: any, index: number) => {
                                  const { label, value, color, id } = item;
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
                                      <div style={{ flex: 1, padding: '0 8px' }}>
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
                                                operationList: selectedNodeConfig?.map(
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
                                {(editWindowData.xColumns || [])?.map?.((item: any, index: number) => {
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
                                                xColumns: (prev.xColumns || [])?.map?.((i: any) => {
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
                                                xColumns: (prev.xColumns || [])?.map?.((i: any) => {
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
                                                xColumns: (prev.xColumns || []).filter(
                                                  (i: any) => i.id !== id,
                                                )?.length
                                                  ? (prev.xColumns || []).filter((i: any) => i.id !== id)
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
                                        xColumns: (prev.xColumns || []).concat({
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
                          {['slider-1'].includes(windowType) ? (
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
                                {commonSettingList?.map((item: any, index: number) => {
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
                          ) : null}
                          {['slider-4'].includes(windowType) ? (
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
                          {['footer-1', 'footer-2'].includes(windowType) ? (
                            <Fragment>
                              <Form.Item name="logSize" label="展示日志行数">
                                <InputNumber min={1} max={200} />
                              </Form.Item>
                            </Fragment>
                          ) : null}
                          {['header'].includes(windowType) ? (
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
                        </div>
                      </Form>
                    </div>
                  </div>
                )
                :
                <div className="right-config-panel-empty-box">
                  <h1 style={{ fontSize: 32 }}>通用属性设置</h1>
                  <h2 style={{ opacity: 0.5 }}>点击节点/画布，进行属性配置</h2>
                  <Skeleton active />
                </div>
            }
          </NodeDetailWrapper>
          : null
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
              ?.map((item: any, index: number) => {
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

export default connect(({ home }) => ({
  started: home.started || false,
  editCardID: home.editCardID || '',
  bodyBoxTab: home.bodyBoxTab,
}))(ReactRuler);

import { useContext, useEffect, useRef, useState } from 'react';
import { Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { fabric } from 'fabric';
import { GloablStateContext } from '@/context';
import { BorderlessTableOutlined, ClearOutlined, DragOutlined, ExclamationCircleFilled, SaveOutlined } from '@ant-design/icons';
import { CenterV } from '@/components/fabritor/components/Center';
import ToolbarItem from './ToolbarItem';
import ToolbarDivider from '@/components/fabritor/components/ToolbarDivider';
import { BASIC_POINT_RULE_FORMAT, CALIPER_RULE_FORMAT, DRAW_MODE_CURSOR } from '@/common/constants/globalConstants';
import { removeObject } from '@/utils/helper';
import { drawLine } from '@/components/fabritor/editor/objects/line';
import { btnFetch } from '@/services/api';
import { guid } from '@/utils/utils';
import { createTextbox } from '@/components/fabritor/editor/objects/textbox';

export default function Toolbar() {
  const {
    data, isReady, setActiveObject, object, editor,
    fetchType, xName, yName,
  } = useContext<any>(GloablStateContext);
  const timerRef = useRef<any>(null);
  const brushRef = useRef<any>([]);
  const [form] = Form.useForm();
  const [panEnable, setPanEnable] = useState(false);
  const [selectedBtn, setSelectedBtn] = useState('');
  const [selectedCaliperID, setSelectedCaliperID] = useState('');
  const [caliperRule, setCaliperRule] = useState({
    'name': undefined,
    'averaging_depth': undefined,
    'design_value': undefined,
    'high_error_tolerance': undefined,
    'high_warning_tolerance': undefined,
    'low_error_tolerance': undefined,
    'low_warning_tolerance': undefined,
    'measurement_offset': undefined,
    'minimum_points': undefined,
    'output_index': undefined,
  });
  const [ruleVisible, setRuleVisible] = useState(false);
  const [measurementErrorRule, setMeasurementErrorRule] = useState({
    'rule_type': 'rect',
    'design_value': undefined,
    'error_tolerance': undefined,
    'warning_tolerance': undefined,
    'calculation_type': undefined,
    'direction': undefined
  });
  const [measurementErrorVisible, setMeasurementErrorVisible] = useState(false);
  const [basicPointRule, setBasicPointRule] = useState<any>({
    'datum_type': 'three',
    'horization_point_1': 'average',
    'horization_point_2': 'average',
    'vertical_point': 'average',
  });
  const [basicPointVisible, setBasicPointVisible] = useState(false);
  const [detectionValue, setDetectionValue] = useState(false);

  // http传递参数
  const onChange = (type: string, data: any) => {
    return new Promise((resolve, reject) => {
      btnFetch(fetchType, yName, { type, data }).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          resolve(res.data);
          message.success('success');
        } else {
          reject(false);
          message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
        }
      });
    });
  }
  // 根据返回的数据渲染文字
  const handleAddText = async (options: any) => {
    await createTextbox({ ...options, canvas: editor.canvas });
  }
  // 卡尺画完
  const brushEnd = (target: any, type: string) => {
    if (!!timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setSelectedBtn((prev: any) => {
      timerRef.current = setTimeout(() => {
        if (!!target.path && ['average', 'average_half'].includes(prev)) {
          const point = target.path;
          // 如果是平均卡尺，一条线
          // 如果是单边卡尺，两条线
          // 删除画笔，然后按照首尾 添加直线
          removeObject(target, editor.canvas);
          const sub_caliper = `${type}_${selectedCaliperID}`;
          const activeLine: any = drawLine({
            points: [point[0][1], point[0][2], point[point.length - 1][1], point[point.length - 1][2]],
            left: target.left,
            top: target.top,
            stroke: '#0f0',
            strokeWidth: 2,
            canvas: editor.canvas,
            sub_type: `line_${sub_caliper}`,
            caliperRule: Object.assign({}, {
              'name': undefined,
              'averaging_depth': undefined,
              'design_value': undefined,
              'high_error_tolerance': undefined,
              'high_warning_tolerance': undefined,
              'low_error_tolerance': undefined,
              'low_warning_tolerance': undefined,
              'measurement_offset': undefined,
              'minimum_points': undefined,
              'output_index': undefined,
            }, caliperRule)
          });
          brushRef.current.push(activeLine);
          if (
            (type === 'average' && brushRef.current?.length >= 1)
            ||
            (type === 'average_half' && brushRef.current?.length >= 2)
          ) {
            if (type === 'average_half') {

            } else if (type === 'average') {
              saveCanvas();
            }
            // 已经画够了，取消画笔
            cancelBrush();
          }
        }
      }, 100);

      return prev;
    });
  };
  // 清理卡尺
  const cancelBrush = () => {
    console.log('卡尺clear');
    setSelectedBtn('');
    setSelectedCaliperID('');
    brushRef.current = [];
    if (editor?.canvas) {
      editor.canvas.off({ 'object:added': (e: any) => brushEnd(e.target, selectedBtn) });
      editor.canvas.isDrawingMode = false;
    }
  }
  useEffect(() => {
    if (!!isReady && ['average', 'average_half'].includes(selectedBtn)) {
      editor?.canvas.on({ 'object:added': (e: any) => brushEnd(e.target, selectedBtn) });
    }

    return () => {
      editor?.canvas.off({ 'object:added': (e: any) => brushEnd(e.target, selectedBtn) });
    }
  }, [isReady, selectedBtn, caliperRule]);
  // 清理画布
  const clearCanvas = () => {
    Modal.confirm({
      title: "确认清空画布，同时清空历史操作记录？",
      icon: <ExclamationCircleFilled />,
      async onOk() {
        await editor.clearCanvas();
        setActiveObject(editor.sketch);
        editor.fireCustomModifiedEvent();
        saveCanvas();
      }
    });
  };
  // 画布结果格式化
  const formatResult = (list: any) => {
    console.log('原始数据', list);
    try {
      const initItem = (item: any) => {
        if (!item) {
          return null;
        }
        let {
          type, sub_type, path, height, width, text, strokeWidth,
          left, top, scaleX = 1, angle, dpi, sub_name,
          backgroundColor, fill, fontSize, caliperRule, measurementErrorRule,
        } = item;
        if (
          sub_type?.indexOf('line_result') > -1
          ||
          sub_type?.indexOf('image_result') > -1
        ) {
          return null;
        }
        if (left < 0 || top < 0) {
          if (sub_type?.indexOf('line') > -1) {
            left = Math.min(item?.x1, item?.x2);
            top = Math.min(item.y1, item.y2);
          } else if (type === 'path') {
            // 轨迹轮廓点
            left = path[0][1];
            top = path[0][2];
          } else {
            return null;
          }
        }
        const common = {
          type: sub_type, left, top, height: height * scaleX, width: width * scaleX,
          angle, scale: scaleX, sub_name
        }
        // if (sub_type === 'text') {
        //   return {
        //     ...common,
        //     text, backgroundColor, color: fill, fontSize,
        //   }
        // } else 
        if (sub_type === 'image') {
          return {
            ...common,
            url: item.objects?.[0]?.src,
            dpi: dpi,
          }
        } else if (["line", "dash-line", "arrow-line-1", "arrow-line-2"].includes(sub_type)) {
          return {
            type: sub_type,
            left: item.x1 < item.x2 ? item.x1 : item.x2,
            top: item.x1 < item.x2 ? item.y1 : item.y2,
            x1: item.x1,
            y1: item.y1,
            x2: item.x2,
            y2: item.y2,
            angle: 0,
            scale: scaleX,
            ...caliperRule
          }
        } else if (sub_type?.indexOf('line_') > -1) {
          if (!sub_name) {
            throw new Error();
          }
          return {
            type: 'line',
            sub_type: sub_type.split('line_')[1],
            left: item.x1 < item.x2 ? item.x1 : item.x2,
            top: item.x1 < item.x2 ? item.y1 : item.y2,
            x1: item.x1,
            y1: item.y1,
            x2: item.x2,
            y2: item.y2,
            angle: 0,
            sub_name,
            scale: scaleX,
            ...caliperRule
          }
        } else if (sub_type?.indexOf("basic_point") > -1) {
          if (sub_type?.indexOf("basic_point_border") > -1) {
            return null;
          }
          return {
            type: 'point',
            sub_type,
            left: left + width / 2,
            top: top + height / 2,
            angle,
            scale: scaleX,
            ...caliperRule
          };
        } else if (sub_type?.indexOf('point_') > -1) {
          return {
            type: 'point',
            sub_type: sub_type.split('point_')[1],
            left: left + width / 2, top: top + top / 2,
            angle: 0,
            scale: scaleX
          }
        } else if (sub_type === 'outer_point') {
          return {
            type: 'point',
            sub_type,
            left: left + width / 2, top: top + top / 2,
            angle: 0,
            scale: scaleX
          }
        } else if (sub_type === 'point' || (!sub_type && path?.length <= 3)) {
          return {
            type: 'point',
            left: left + width / 2, top: top + top / 2,
            angle: 0,
            scale: scaleX
          }
        } else if (sub_type?.indexOf('_measurementError_') > -1) {
          if (!sub_name) {
            throw new Error();
          }
          const res = sub_type.split('_measurementError_');
          const realItem = editor?.canvas?.getObjects()?.filter((i: any) => i.sub_type === sub_type)?.[0];
          if (res[0] === 'sector') {
            return {
              ...common,
              points: {
                tl: {
                  x: (realItem?.aCoords.tl.x + realItem?.aCoords.tr.x) / 2,
                  y: (realItem?.aCoords.tl.y + realItem?.aCoords.tr.y) / 2,
                },
                tr: realItem?.aCoords.tr,
                bl: {
                  x: (realItem?.aCoords.tl.x + realItem?.aCoords.bl.x) / 2,
                  y: (realItem?.aCoords.tl.y + realItem?.aCoords.bl.y) / 2,
                },
                br: realItem?.aCoords.bl,
              },
              sectorParams: {
                x: realItem?.aCoords?.tl?.x,
                y: realItem?.aCoords?.tl?.y,
                r1: common.width / 2,
                r2: common.width,
                angle1: common.angle,
                angle2: common.angle + 90,
              },
              type: res[0],
              sub_type: `measurementError_${res[1]}`,
              ...realItem?.measurementErrorRule,
            };
          } else {
            return {
              ...common,
              points: realItem?.aCoords,
              type: res[0],
              sub_type: `measurementError_${res[1]}`,
              ...realItem?.measurementErrorRule,
            };
          }
        } else if (sub_type === 'rect') {
          if (!sub_name) {
            throw new Error();
          }
          const realItem = editor?.canvas?.getObjects()?.filter((i: any) => i?.angle === angle && i.sub_type === sub_type && i.top === top)?.[0];
          return {
            ...common,
            points: realItem?.aCoords,
          };
        } else if (sub_type === 'circle') {
          return {
            type: sub_type,
            left: left + width / 2,
            top: top + top / 2,
            radius: width / 2,
            angle,
            scale: scaleX
          }
        } else if (sub_type === "sector") {
          if (!sub_name) {
            throw new Error();
          }
          return {
            ...common,
            path,
          };
        } else if (!sub_type && path?.length > 3) {
          return {
            ...common,
            type: 'pencil',
            path,
            width: strokeWidth,
            height: strokeWidth,
          }
        }
        return null;
      }
      const realCanvas = editor.canvas?.getObjects();
      const result = (list || [])?.reduce((pre: any, cen: any) => {
        const { type, angle, objects } = cen;
        if (type === 'group') {
          const realItemGroup = realCanvas?.filter((i: any) => (i.sub_type === cen.sub_type))?.[0];
          const positions = realItemGroup?.getCoords?.();

          const list = objects?.map((cItem: any, index: number) => {
            const realItem = realItemGroup?.getObjects()?.filter((i: any) => i.sub_type === cItem?.sub_type)?.[0];

            if (!!positions) {
              cItem.left = positions[index]?.x;
              cItem.top = positions[index]?.y;
              cItem.angle = angle;
              const res = initItem(cItem);
              if (!!res) {
                return res;
              }
            }
            return null;
          }).filter(Boolean);
          return pre.concat(list);
        } else {
          if (!!initItem(cen)) {
            return pre.concat(initItem(cen));
          } else {
            return pre;
          }
        }
      }, []);
      console.log('格式化的', result);

      return result || [];
    } catch (err) {
      message.error('请补全工具命名');
      return [];
    }
  };
  // 保存结果
  const saveCanvas = () => {
    const json = editor.canvas2Json();
    const string = {
      ...json,
      objects: json.objects?.filter((i: any) => {
        return (i?.sub_type?.indexOf('line_result') < 0 &&
          i?.sub_type?.indexOf('image_result') < 0 &&
          i?.sub_type?.indexOf('outer_point') < 0)
          ||
          !i?.sub_type
      })
    };
    localStorage.setItem('fabritor_web_json', JSON.stringify(string));
    const result = formatResult(json?.objects);
    if (!!result?.length) {
      btnFetch(fetchType, xName, { data: result }).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          message.success('success');
        } else {
          message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
        }
      });
    }
  };
  // 初始化卡尺
  const initBrush = () => {
    editor.canvas.isDrawingMode = true;
    editor.canvas.freeDrawingCursor = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(DRAW_MODE_CURSOR)}") 4 12, crosshair`;
    const freeDrawingBrush = new fabric.PencilBrush(editor.canvas);
    editor.canvas.freeDrawingBrush = freeDrawingBrush;
    freeDrawingBrush.color = '#0f0';
    freeDrawingBrush.width = 2;
    freeDrawingBrush.shadow = new fabric.Shadow({
      blur: 0,
      offsetX: 0,
      offsetY: 0,
      affectStroke: true,
      color: '#000000',
    });
    const uuid = guid();
    setSelectedCaliperID(uuid);
  };
  // 卡尺规则关闭
  const onRuleCancel = () => {
    setRuleVisible(false);
    setMeasurementErrorVisible(false);
    setBasicPointVisible(false);
    form.resetFields();
  }
  const enablePan = () => {
    const enable = editor.switchEnablePan();
    const objects = editor.canvas?.getObjects();
    objects?.forEach?.((item: any) => {
      if (
        item?.sub_type?.indexOf('image') > -1
        ||
        item?.sub_type?.indexOf('_result') > -1
        ||
        item?.sub_type?.indexOf('outer_point') > -1
      ) {
        item.selectable = false;
        item.hasControls = false;
      }
    });
    setPanEnable(enable);
  };
  // 三基点
  const onBasicPointCanvas = (rule: any) => {
    const ID = guid();
    const common = {
      hasControls: false,
      radius: 1,
      fill: 'red',
      caliperRule: rule,
    };
    const vParams = {
      sub_type: `basic_point_vertical-${ID}`,
    };
    const hParams = {
      sub_type: `basic_point-${ID}`,
    };
    if (rule.datum_type === 'one') {
      const horizationLine = new fabric.Circle({
        ...common,
        left: 280,
        top: 180,
        ...hParams,
        radius: 2,
        fill: 'green',
      });
      editor.canvas?.add?.(horizationLine);
      editor.canvas?.setActiveObject(horizationLine);
    } else {
      const verticalLine = new fabric.Circle({
        ...common,
        left: 220,
        top: 120,
        ...vParams,
        fill: 'green',
      });
      const horizationLine1 = new fabric.Circle({
        ...common,
        left: 220,
        top: 180,
        ...hParams
      });
      const horizationLine2 = new fabric.Circle({
        ...common,
        left: 280,
        top: 180,
        ...hParams
      });
      editor.canvas?.add?.(verticalLine, horizationLine1, horizationLine2);
      editor.canvas?.renderAll();
      const selection = new fabric.ActiveSelection([verticalLine, horizationLine1, horizationLine2], {
        canvas: editor.canvas
      });
      editor.canvas?.setActiveObject(selection);
    }
  };
  // 画圆环弧形
  const addRing = (
    angle1: number, angle2: number, x: number, y: number, r1: number, r2: number, params: any
  ) => {
    let pathRes: any = null;
    let point1 = { x: 0, y: 0 };
    let point2 = { x: 0, y: 0 };
    let point3 = { x: 0, y: 0 };
    let point4 = { x: 0, y: 0 };
    let isBig = 0
    params = {
      ...params,
      sectorParams: {
        x, y,
        angle1, r1,
        angle2, r2
      }
    }
    angle1 = angle1 % 360;
    angle2 = angle2 % 360;
    if (angle2 > 180) {
      isBig = 1
    }
    if (!angle2) {
      point1.x = r1 + x;
      point1.y = y;
      point2.x = r2 + x;
      point2.y = y;
      pathRes = new fabric.Path(`M${point1.x},${point1.y} A${r1},${r1} 0 0,1 ${point1.x - 2 * r1},${point1.y} 
        A${r1},${r1} 0 0,1 ${point1.x},${point1.y} 
        M${point2.x},${point2.y} A${r2},${r2} 0 0,1 ${point2.x - 2 * r2},${point2.y} 
        A${r2},${r2} 0 0,1 ${point2.x},${point2.y}`, {
        stroke: '#0f0',
        fill: 'rgba(0, 255, 0, 0.3)',
        ...params,
      })
    } else {
      point1.x = r1 * Math.cos(angle1 / 180 * Math.PI) + x;
      point1.y = r1 * Math.sin(angle1 / 180 * Math.PI) + y;
      point2.x = r2 * Math.cos(angle1 / 180 * Math.PI) + x;
      point2.y = r2 * Math.sin(angle1 / 180 * Math.PI) + y;
      point3.x = r2 * Math.cos((angle1 + angle2) / 180 * Math.PI) + x;
      point3.y = r2 * Math.sin((angle1 + angle2) / 180 * Math.PI) + y;
      point4.x = r1 * Math.cos((angle1 + angle2) / 180 * Math.PI) + x;
      point4.y = r1 * Math.sin((angle1 + angle2) / 180 * Math.PI) + y;
      pathRes = new fabric.Path(`M${point1.x},${point1.y} L${point2.x},${point2.y} A${r2},${r2} 0 ${isBig},1 ${point3.x},${point3.y} L${point4.x},${point4.y} A${r1},${r1} 0 ${isBig},0 ${point1.x},${point1.y}`, {
        stroke: '#0f0',
        fill: 'rgba(0, 255, 0, 0.3)',
        ...params,
      })
    };
    editor?.canvas?.add?.(pathRes);
  };
  // 区域测量
  const onmeasurementErrorCanvas = (rule: any) => {
    const rParams = {
      sub_type: `${rule?.rule_type}_measurementError_${guid()}`,
      measurementErrorRule: rule,
      strokeWidth: 0,
    };
    if (rule?.rule_type === 'sector') {
      // 扇形
      addRing(0, 90, 200, 200, 30, 60, rParams);
    } else {
      // 矩形
      const rect = new fabric.Rect({
        left: 280,
        top: 180,
        width: 100,
        height: 100,
        fill: 'rgba(0, 255, 0, 0.3)',
        ...rParams,
      });
      editor.canvas?.add?.(rect);
    }
  };

  return (
    <CenterV
      className='fabritor-toolbar'
    >
      {/* <ToolbarItem
        disabled={!canUndo}
        title={"撤销"}
        onClick={() => { editor.fhistory.undo() }}
      >
        <UndoOutlined style={{ fontSize: 20 }} />
      </ToolbarItem>
      <ToolbarItem
        disabled={!canRedo}
        title={'重做'}
        onClick={() => { editor.fhistory.redo() }}
      >
        <RedoOutlined style={{ fontSize: 20 }} />
      </ToolbarItem> */}
      <ToolbarItem
        onClick={() => {
          onChange('startOrStop', false).then(() => setDetectionValue(false));
        }}
        selectable={!detectionValue}
        title={'停止检测'}
      >
        停止检测
      </ToolbarItem>
      <ToolbarItem
        onClick={() => {
          onChange('startOrStop', true).then(() => setDetectionValue(true));
        }}
        selectable={!!detectionValue}
        title={'开始检测'}
      >
        开始检测
      </ToolbarItem>
      <ToolbarDivider />
      <ToolbarItem
        onContextMenu={() => {
          form.setFieldsValue(caliperRule || {});
          setRuleVisible(true);
        }}
        onClick={() => {
          setSelectedBtn(prev => prev === 'average' ? '' : 'average');
          if (selectedBtn === 'average') {
            cancelBrush();
          } else {
            initBrush();
          }
        }}
        selectable={selectedBtn === 'average'}
        title={'平均卡尺'}
      >
        平均卡尺
      </ToolbarItem>
      <ToolbarItem
        onContextMenu={() => {
          form.setFieldsValue(caliperRule || {});
          setRuleVisible(true);
        }}
        onClick={() => {
          setSelectedBtn(prev => prev === 'average_half' ? '' : 'average_half');
          if (selectedBtn === 'average_half') {
            cancelBrush();
          } else {
            initBrush();
          }
        }}
        selectable={selectedBtn === 'average_half'}
        title={'单边卡尺'}
      >
        单边卡尺
      </ToolbarItem>
      <ToolbarItem onClick={() => {
        // 单边卡尺，画完之后，直接传递
        const activeObj = [].concat(editor.canvas.getActiveObject()?._objects || []);
        const activeResult = formatResult(activeObj)?.filter((i: any) => i.sub_type?.indexOf('average_half_') > -1);
        if (activeResult?.length === 2) {
          saveCanvas();
          cancelBrush();
        } else {
          message.warning('请选择两个半卡尺进行Link');
        }
      }} title={'卡尺Link'}>
        卡尺Link
      </ToolbarItem>
      <ToolbarItem onClick={() => {
        saveCanvas();
        cancelBrush();
      }} title={'配准'}>
        配准
      </ToolbarItem>
      <ToolbarItem
        onContextMenu={() => {
          form.setFieldsValue(basicPointRule || {});
          setBasicPointVisible(true);
        }}
        onClick={() => {
          if (!Object.keys(basicPointRule)?.length) {
            setBasicPointVisible(true);
            return;
          }
          onBasicPointCanvas(basicPointRule);
        }}
        title={'三基点定位'}
      >
        三基点定位
      </ToolbarItem>
      <ToolbarItem
        onContextMenu={() => {
          form.setFieldsValue(measurementErrorRule || {});
          setMeasurementErrorVisible(true);
        }}
        onClick={() => {
          onmeasurementErrorCanvas(measurementErrorRule);
        }}
        title={'测量误差'}
      >
        误差测量
      </ToolbarItem>
      <ToolbarDivider />
      <ToolbarItem
        onClick={enablePan}
        title={panEnable ? '选择元素' : '拖拽画布'}
      >
        {
          panEnable ?
            <DragOutlined style={{ fontSize: 22, color: panEnable ? '#000' : '#ccc' }} /> :
            <BorderlessTableOutlined style={{ fontSize: 22, color: panEnable ? '#000' : '#ccc' }} />
        }
      </ToolbarItem>
      <ToolbarItem onClick={saveCanvas} title={'保存数据'}>
        <SaveOutlined style={{ fontSize: 20 }} />
      </ToolbarItem>
      <ToolbarItem onClick={clearCanvas} title={'清空画布'}>
        <ClearOutlined style={{ fontSize: 20 }} />
      </ToolbarItem>

      {
        // 卡尺规则设置
        !!ruleVisible ? (
          <Modal
            title={`卡尺规则设置`}
            centered
            open={!!ruleVisible}
            maskClosable={false}
            onOk={() => {
              form.validateFields().then((values) => {
                setCaliperRule(values);
                onRuleCancel();
              });

            }}
            onCancel={() => onRuleCancel()}
          >
            <Form form={form} scrollToFirstError>
              <Form.Item
                name={'name'}
                label={'卡尺名称'}
                rules={[{ required: false, message: '卡尺名称' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={'design_value'}
                label={CALIPER_RULE_FORMAT['design_value']}
                rules={[{ required: false, message: '设计值' }]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <Form.Item
                name={'measurement_offset'}
                label={CALIPER_RULE_FORMAT['measurement_offset']}
                rules={[{ required: false, message: '测量抵消' }]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <Form.Item
                name={'output_index'}
                label={CALIPER_RULE_FORMAT['output_index']}
                rules={[{ required: false, message: '产出指数' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item
                name={'high_error_tolerance'}
                label={CALIPER_RULE_FORMAT['high_error_tolerance']}
                rules={[{ required: false, message: '告警上限' }]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <Form.Item
                name={'high_warning_tolerance'}
                label={CALIPER_RULE_FORMAT['high_warning_tolerance']}
                rules={[{ required: false, message: '预警上限' }]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <Form.Item
                name={'low_warning_tolerance'}
                label={CALIPER_RULE_FORMAT['low_warning_tolerance']}
                rules={[{ required: false, message: '预警下限' }]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <Form.Item
                name={'low_error_tolerance'}
                label={CALIPER_RULE_FORMAT['low_error_tolerance']}
                rules={[{ required: false, message: '告警下限' }]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <Form.Item
                name={'averaging_depth'}
                label={CALIPER_RULE_FORMAT['averaging_depth']}
                rules={[{ required: false, message: '平均深度' }]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <Form.Item
                name={'minimum_points'}
                label={CALIPER_RULE_FORMAT['minimum_points']}
                rules={[{ required: false, message: '微小点数' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Form>
          </Modal>
        ) : null
      }
      {
        // 误差测量规则设置
        !!measurementErrorVisible ? (
          <Modal
            title={`误差测量规则设置`}
            centered
            open={!!measurementErrorVisible}
            maskClosable={false}
            onOk={() => {
              form.validateFields().then((values) => {
                setMeasurementErrorRule(values);
                onmeasurementErrorCanvas(values);
                onRuleCancel();
              });

            }}
            onCancel={() => onRuleCancel()}
          >
            <Form form={form} scrollToFirstError>
              <Form.Item
                name={'rule_type'}
                label={'框选类型'}
                initialValue={'sector'}
                rules={[{ required: false, message: '框选类型' }]}
              >
                <Select options={[
                  {
                    value: 'rect',
                    label: '矩形',
                  },
                  {
                    value: 'sector',
                    label: '扇形',
                  },
                ]} />
              </Form.Item>
              <Form.Item
                name={'design_value'}
                label={'设计值'}
                rules={[{ required: false, message: '设计值' }]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <Form.Item
                name={'error_tolerance'}
                label={'报警线'}
                rules={[{ required: false, message: '报警线' }]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <Form.Item
                name={'warning_tolerance'}
                label={'预警线'}
                rules={[{ required: false, message: '预警线' }]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <Form.Item
                name={'calculation_type'}
                label={'计算类型'}
                rules={[{ required: false, message: '计算类型' }]}
              >
                <Select options={[
                  {
                    value: 'average',
                    label: '平均',
                  },
                  {
                    value: 'maximun',
                    label: '最大',
                  },
                  {
                    value: 'standard_deviation',
                    label: '标准偏差',
                  },
                ]} />
              </Form.Item>
              <Form.Item
                name={'direction'}
                label={'方向'}
                rules={[{ required: false, message: '方向' }]}
              >
                <Select options={[
                  {
                    value: 'normal',
                    label: '正常',
                  },
                  {
                    value: 'x',
                    label: 'x方向',
                  },
                  {
                    value: 'y',
                    label: 'y方向',
                  },
                ]} />
              </Form.Item>
            </Form>
          </Modal>
        ) : null
      }
      {
        // 三基点规则设置
        !!basicPointVisible ? (
          <Modal
            title={`三基点定位规则设置`}
            centered
            open={!!basicPointVisible}
            maskClosable={false}
            onOk={() => {
              form.validateFields().then((values) => {
                setBasicPointRule(values);
                onBasicPointCanvas(values);
                onRuleCancel();
              });

            }}
            onCancel={() => onRuleCancel()}
          >
            <Form form={form} scrollToFirstError>
              <Form.Item
                name={'datum_type'}
                label={'Datum Type'}
                initialValue={'three'}
                rules={[{ required: false, message: 'Datum Type' }]}
              >
                <Select options={[
                  {
                    value: 'three',
                    label: '三基点',
                  },
                  {
                    value: 'one',
                    label: '单基点',
                  },
                ]} />
              </Form.Item>
              <Form.Item
                name={'vertical_point'}
                label={BASIC_POINT_RULE_FORMAT['vertical_point']}
                initialValue={'average'}
                rules={[{ required: false, message: BASIC_POINT_RULE_FORMAT['vertical_point'] }]}
              >
                <Select options={[
                  {
                    value: 'average',
                    label: '平均卡尺',
                  },
                  {
                    value: 'concave-convex',
                    label: '凹凸卡尺',
                  },
                ]} />
              </Form.Item>
              <Form.Item
                name={'horization_point_1'}
                label={BASIC_POINT_RULE_FORMAT['horization_point_1']}
                initialValue={'average'}
                rules={[{ required: false, message: BASIC_POINT_RULE_FORMAT['horization_point_1'] }]}
              >
                <Select options={[
                  {
                    value: 'average',
                    label: '平均卡尺',
                  },
                  {
                    value: 'concave-convex',
                    label: '凹凸卡尺',
                  },
                ]} />
              </Form.Item>
              <Form.Item
                name={'horization_point_2'}
                label={BASIC_POINT_RULE_FORMAT['horization_point_2']}
                initialValue={'average'}
                rules={[{ required: false, message: BASIC_POINT_RULE_FORMAT['horization_point_2'] }]}
              >
                <Select options={[
                  {
                    value: 'average',
                    label: '平均卡尺',
                  },
                  {
                    value: 'concave-convex',
                    label: '凹凸卡尺',
                  },
                ]} />
              </Form.Item>
            </Form>
          </Modal>
        ) : null
      }
    </CenterV>
  )
}
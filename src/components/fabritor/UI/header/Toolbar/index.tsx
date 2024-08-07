import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { fabric } from 'fabric';
import { GloablStateContext } from '@/context';
import { ClearOutlined, ExclamationCircleFilled, SaveOutlined } from '@ant-design/icons';
import { CenterV } from '@/components/fabritor/components/Center';
import ToolbarItem from './ToolbarItem';
import ToolbarDivider from '@/components/fabritor/components/ToolbarDivider';
import SegmentSwitch from '@/components/SegmentSwitch';
import { DRAW_MODE_CURSOR } from '@/common/constants/globalConstants';
import { groupSelection, removeObject } from '@/utils/helper';
import { drawLine } from '@/components/fabritor/editor/objects/line';
import { getArrowPoint } from '@/utils/fabrictorUtils';
import { btnFetch } from '@/services/api';
import { guid } from '@/utils/utils';
import { createPathFromSvg } from '@/components/fabritor/editor/objects/path';

export default function Toolbar() {
  const {
    data, isReady, setActiveObject, object, editor,
    fetchType, xName, yName,
  } = useContext<any>(GloablStateContext);
  const timerRef = useRef<any>(null);
  const brushRef = useRef<any>([]);
  const [form] = Form.useForm();
  const [selectedBtn, setSelectedBtn] = useState('');
  const [selectedCaliperID, setSelectedCaliperID] = useState('');
  const [caliperRule, setCaliperRule] = useState({});
  const [ruleVisible, setRuleVisible] = useState(false);
  const [measurementErrorRule, setMeasurementErrorRule] = useState({});
  const [measurementErrorVisible, setMeasurementErrorVisible] = useState(false);

  // 初始化卡尺参数值
  useEffect(() => {
    setCaliperRule(data?.caliperRule || {})
    setMeasurementErrorRule(data?.measurementErrorRule || {});
  }, [data?.caliperRule, data?.measurementErrorRule]);
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
          brushRef.current.push(target);
          // 删除画笔，然后按照首尾 添加直线
          removeObject(target, editor.canvas);
          const sub_caliper = `${type}_${selectedCaliperID}`;
          drawLine({
            points: [point[0][1], point[0][2], point[point.length - 1][1], point[point.length - 1][2]],
            left: target.left,
            top: target.top,
            stroke: '#f00',
            strokeWidth: 2,
            canvas: editor.canvas,
            sub_type: `line_${sub_caliper}`,
          });
          if (
            (type === 'average' && brushRef.current?.length >= 1)
            ||
            (type === 'average_half' && brushRef.current?.length >= 2)
          ) {
            if (type === 'average_half') {
              brushRef.current?.forEach((item: any) => {
                // const point = item.path;
                // const res1: any = getArrowPoint([
                //   { x: point[0][1], y: point[0][2] },
                //   {
                //     x: point[point.length - 1][1],
                //     y: point[point.length - 1][2]
                //   }
                // ]);
                // drawLine({
                //   points: res1,
                //   left: Math.min(res1[0], res1[2]),
                //   top: Math.min(res1[1], res1[3]),
                //   stroke: '#f00',
                //   strokeWidth: 2,
                //   strokeDashArray: [8, 8],
                //   canvas: editor.canvas,
                //   sub_type: 'line-fuzhu'
                // });
              });
            } else if (type === 'average') {
              // 平均卡尺，画完之后，直接传递
              const activeObj = editor.canvas.getActiveObject();
              const activeResult = formatResult([].concat(activeObj))?.filter((i: any) => i.type === 'line');
              const json = editor.canvas2Json();
              const jsonResult = formatResult(json.objects);
              const result = {
                file_image: jsonResult?.filter((i: any) => i.type === 'image')?.[0],
                line: activeResult?.map((item: any) => ({ ...item, ...caliperRule })),
              };
              // onChange('average', result);
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
  }, [isReady, selectedBtn]);
  // 清理画布
  const clearCanvas = () => {
    Modal.confirm({
      title: "确认清空画布，同时清空历史操作记录？",
      icon: <ExclamationCircleFilled />,
      async onOk() {
        await editor.clearCanvas();
        setActiveObject(editor.sketch);
        editor.fireCustomModifiedEvent();
      }
    });
  };
  // 画布结果格式化
  const formatResult = (list: any) => {
    console.log('原始数据', list);
    const initItem = (item: any) => {
      if (!item) {
        return null;
      }
      let {
        sub_type, path, height, width, text, strokeWidth,
        left, top, scaleX = 1, angle,
        backgroundColor, fill, fontSize
      } = item;
      if (left < 0 || top < 0) {
        if (sub_type?.indexOf('line') > -1) {
          left = Math.min(item?.x1, item?.x2);
          top = Math.min(item.y1, item.y2);
        } else {
          return null;
        }
      }
      const common = {
        type: sub_type, left, top, height: height * scaleX, width: width * scaleX, angle, scale: scaleX
      }
      if (sub_type === 'text') {
        return {
          ...common,
          text, backgroundColor, color: fill, fontSize,
        }
      } else if (sub_type === 'image') {
        return {
          ...common,
          height: height / scaleX, width: width / scaleX,
          url: item.objects?.[0]?.src,
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
          scale: scaleX,
          ...caliperRule
        }
      } else if (sub_type?.indexOf('point_') > -1) {
        return {
          type: 'point',
          sub_type: sub_type.split('point_')[1],
          left: left + width / 2, top: top + top / 2,
          angle: 0,
          scale: scaleX
        }
      } else if (sub_type === 'outline_point') {
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
        const res = sub_type.split('_measurementError_');
        return {
          ...common,
          type: res[0],
          path,
          sub_type: `measurementError_${res[1]}`,
          ...measurementErrorRule,
        };
      } else if (sub_type === 'rect') {
        return common;
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
          height: strokeWidth
        }
      }
      return null;
    }
    const result = (list || [])?.map((item: any) => {
      const { type } = item;
      return type === 'group' ? {
        ...item,
        children: item.objects?.map((cItem: any) => {
          return initItem(cItem)
        })
      } : initItem(item)
    }).filter(Boolean);
    console.log('格式化的', result);

    return result || [];
  };
  // 保存结果
  const saveCanvas = () => {
    const json = editor.canvas2Json();
    const result = formatResult(json.objects);
    btnFetch(fetchType, xName, { data: result }).then((res: any) => {
      if (!!res && res.code === 'SUCCESS') {

      } else {
        message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
      }
    });
    // message.success('保存画布成功');
    localStorage.setItem('fabritor_web_json', JSON.stringify({ ...json, caliperRule, measurementErrorRule }));
  };
  // 初始化卡尺
  const initBrush = () => {
    editor.canvas.isDrawingMode = true;
    editor.canvas.freeDrawingCursor = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(DRAW_MODE_CURSOR)}") 4 12, crosshair`;
    const freeDrawingBrush = new fabric.PencilBrush(editor.canvas);
    editor.canvas.freeDrawingBrush = freeDrawingBrush;
    freeDrawingBrush.color = '#f00';
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
    form.resetFields();
  }

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
      <SegmentSwitch
        style={{ width: 180, height: 32, fontSize: 16, backgroundColor: 'transparent' }}
        fontInBody={[
          { value: false, label: '连续拉流', backgroundColor: 'rgba(24, 144, 255, 1)' },
          { value: true, label: '单点拉流', backgroundColor: '#88db57' }
        ]}
        onChange={(e: any) => {
          cancelBrush();
          onChange('pull', e);
        }}
      />
      <ToolbarItem
        onContextMenu={() => {
          setCaliperRule(data?.caliperRule || {});
          form.setFieldsValue(data?.caliperRule || {});
          setRuleVisible(true);
        }}
        onClick={() => {
          if (!Object.keys(caliperRule)?.length) {
            setRuleVisible(true);
            return;
          }
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
          setCaliperRule(data?.caliperRule || {});
          form.setFieldsValue(data?.caliperRule || {});
          setRuleVisible(true);
        }}
        onClick={() => {
          if (!Object.keys(caliperRule)?.length) {
            setRuleVisible(true);
            return;
          }
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
        // const activeResult = formatResult(activeObj)?.filter((i: any) => i.type === 'line');
        // const json = editor.canvas2Json();
        // const jsonResult = formatResult(json.objects);
        // const guid1 = guid();
        // const result = {
        //   file_image: jsonResult?.filter((i: any) => i.type === 'image')?.[0],
        //   line: activeResult?.map((item: any) => ({
        //     ...item,
        //     sub_type: `average_half_${guid1}`,
        //     ...caliperRule
        //   })),
        // };
        // onChange('average_half', result);
      }} title={'卡尺Link'}>
        卡尺Link
      </ToolbarItem>
      <ToolbarItem onClick={() => {
        cancelBrush();
        const activeObj = [].concat(editor.canvas.getActiveObject()?._objects || []);
        const uuid = guid();
        (activeObj || [])?.forEach((target: any) => {
          if (!target) {
            return;
          }
          target.sub_type = `point_registration_${uuid}`;
        });
        saveCanvas();
        cancelBrush();
        // const json = editor.canvas2Json();
        // const jsonResult = formatResult(json.objects);
        // const result = {
        //   file_image: jsonResult?.filter((i: any) => i.type === 'image')?.[0],
        //   registration_points: activeResult,
        //   outline_points: jsonResult?.filter((i: any) => i.type === 'outline_point'),
        // };
        // onChange('registration', result);
      }} title={'配准'}>
        配准
      </ToolbarItem>
      <ToolbarItem
        onContextMenu={() => {
          setMeasurementErrorRule(data?.measurementErrorRule || {});
          form.setFieldsValue(data?.measurementErrorRule || {});
          setMeasurementErrorVisible(true);
        }}
        onClick={() => {
          if (!Object.keys(measurementErrorRule)?.length) {
            setMeasurementErrorVisible(true);
            return;
          }
          const activeObj = [].concat(!!editor.canvas.getActiveObject()?._objects ? editor.canvas.getActiveObject()?._objects : editor.canvas.getActiveObject());
          if (!!activeObj?.length) {
            const uuid = guid();
            activeObj?.forEach((target: any) => {
              if (!target) {
                return;
              }
              target.sub_type = `${target.sub_type?.split('_')?.[0]}_measurementError_${uuid}`;
            });
            saveCanvas();
            cancelBrush();
          } else {
            message.warning('请选择标定框');
          }

          // const json = editor.canvas2Json();
          // const jsonResult = formatResult(json.objects);
          // const result = {
          //   file_image: jsonResult?.filter((i: any) => i.type === 'image')?.[0],
          //   registration_points: activeResult,
          //   outline_points: jsonResult?.filter((i: any) => i.type === 'outline_point'),
          // };
          // onChange('measurementError', result);
        }}
        title={'测量误差'}
      >
        误差测量
      </ToolbarItem>
      <ToolbarDivider />
      {/* <ToolbarItem
        onClick={enablePan}
        title={panEnable ? '选择元素' : '拖拽画布'}
      >
        {
          panEnable ?
            <DragOutlined style={{ fontSize: 22, color: panEnable ? '#000' : '#ccc' }} /> :
            <BorderlessTableOutlined style={{ fontSize: 22, color: panEnable ? '#000' : '#ccc' }} />
        }
      </ToolbarItem> */}
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
                label={'设计值'}
                rules={[{ required: false, message: '设计值' }]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <Form.Item
                name={'measurement_offset'}
                label={'测量抵消'}
                rules={[{ required: false, message: '测量抵消' }]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <Form.Item
                name={'output_index'}
                label={'产出指数'}
                rules={[{ required: false, message: '产出指数' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item
                name={'high_error_tolerance'}
                label={'告警上限'}
                rules={[{ required: false, message: '告警上限' }]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <Form.Item
                name={'high_warning_tolerance'}
                label={'预警上限'}
                rules={[{ required: false, message: '预警上限' }]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <Form.Item
                name={'low_warning_tolerance'}
                label={'预警下限'}
                rules={[{ required: false, message: '预警下限' }]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <Form.Item
                name={'low_error_tolerance'}
                label={'告警下限'}
                rules={[{ required: false, message: '告警下限' }]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <Form.Item
                name={'averaging_depth'}
                label={'平均深度'}
                rules={[{ required: false, message: '平均深度' }]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <Form.Item
                name={'minimum_points'}
                label={'微小点数'}
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
                onRuleCancel();
              });

            }}
            onCancel={() => onRuleCancel()}
          >
            <Form form={form} scrollToFirstError>
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
    </CenterV>
  )
}
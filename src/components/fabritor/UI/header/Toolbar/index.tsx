import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { Form, Input, InputNumber, message, Modal } from 'antd';
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

export default function Toolbar() {
  const { data, isReady, setActiveObject, object, editor, onLoadTypeChange } = useContext<any>(GloablStateContext);
  const timerRef = useRef<any>(null);
  const brushRef = useRef<any>([]);
  const [form] = Form.useForm();
  const [selectedBtn, setSelectedBtn] = useState('');
  const [caliperRule, setCaliperRule] = useState({});
  const [ruleVisible, setRuleVisible] = useState(false);

  useEffect(() => {
    setCaliperRule(data?.caliperRule || {})
  }, [data?.caliperRule]);
  const cancelBrush = () => {
    setSelectedBtn('');
    brushRef.current = [];
    if (editor?.canvas) {
      editor.canvas.isDrawingMode = false;
    }
  }
  // 卡尺画完
  const brushEnd = (target: any, type: string) => {
    if (!!timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      if (!!target.path) {
        // 如果是平均卡尺，一条线
        // 如果是单边卡尺，两条线
        brushRef.current.push(target);
        // 删除画笔，然后按照首尾 添加直线
        removeObject(target, editor.canvas);
        const point = target.path;
        drawLine({
          points: [point[0][1], point[0][2], point[point.length - 1][1], point[point.length - 1][2]],
          left: target.left,
          top: target.top,
          stroke: '#f00',
          strokeWidth: 2,
          canvas: editor.canvas,
          sub_type: 'line',
          ...caliperRule
        });
        if (
          (type === 'average' && brushRef.current?.length >= 1)
          ||
          (type === 'one' && brushRef.current?.length >= 2)
        ) {
          if (type === 'one') {
            brushRef.current?.forEach((item: any) => {
              const point = item.path;
              const res1: any = getArrowPoint([
                { x: point[0][1], y: point[0][2] },
                {
                  x: point[point.length - 1][1],
                  y: point[point.length - 1][2]
                }
              ]);
              // const res1: any = getArrowPoint([
              //   { x: point[0][1], y: point[0][2] },
              //   {
              //     x: point[0][1] + point[0][1] / 1000,
              //     y: point[0][2] + point[0][2] / 1000
              //   }
              // ]);
              drawLine({
                points: res1,
                left: Math.min(res1[0], res1[2]),
                top: Math.min(res1[1], res1[3]),
                stroke: '#f00',
                strokeWidth: 2,
                strokeDashArray: [8, 8],
                canvas: editor.canvas,
                sub_type: 'line-fuzhu'
              });

              // const res2: any = getArrowPoint([
              //   { x: point[point.length - 1][1], y: point[point.length - 1][2] },
              //   {
              //     x: point[point.length - 1][1] + point[point.length - 1][1] / 1000,
              //     y: point[point.length - 1][2] + point[point.length - 1][2] / 1000
              //   }
              // ]);
              // drawLine({
              //   points: res2,
              //   left: Math.min(res2[0], res2[2]),
              //   top: Math.min(res2[1], res2[3]),
              //   stroke: '#f00',
              //   strokeWidth: 2,
              //   strokeDashArray: [8, 8],
              //   canvas: editor.canvas,
              //   sub_type: 'line-fuzhu'
              // });
            });
          }

          // 已经画够了，取消画笔
          console.log('clear');
          cancelBrush();
        }
      }
    }, 100);
  };
  useEffect(() => {
    if (!!isReady && ['average', 'one'].includes(selectedBtn)) {
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
    console.log(list);

    const initItem = (item: any) => {
      const {
        sub_type, path, height, width, text, strokeWidth,
        left, top, scaleX = 1, angle,
        backgroundColor, fill, fontSize
      } = item;
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
          url: item.objects?.[0]?.src,
        }
      } else if (["line", "dash-line", "arrow-line-1", "arrow-line-2"].includes(sub_type)) {
        return {
          type: sub_type, left, top,
          x1: item.x1,
          y1: item.y1,
          x2: item.x2,
          y2: item.y2,
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
      } else if (sub_type === 'rect') {
        return common;
      } else if (sub_type === 'circle') {
        return {
          type: sub_type,
          left: left + width / 2, top: top + top / 2,
          radius: width / 2,
          angle,
          scale: scaleX
        }
      } else if (sub_type === "sector") {
        return common;
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
    return result || [];
  };
  // 保存结果
  const saveCanvas = () => {
    const json = editor.canvas2Json();
    const result = formatResult(json.objects);
    console.log('result', result);
    !!onLoadTypeChange && onLoadTypeChange({ type: 'mark', data: result });
    message.success('保存画布成功');
    localStorage.setItem('fabritor_web_json', JSON.stringify({ ...json, caliperRule }));
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
  };
  // 卡尺link
  const brushLink = () => {

  };
  // 卡尺规则关闭
  const onRuleCancel = () => {
    setRuleVisible(false);
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
      {
        !!onLoadTypeChange ?
          <Fragment>
            <SegmentSwitch
              style={{ width: 180, height: 32, fontSize: 16, backgroundColor: 'transparent' }}
              fontInBody={[
                { value: false, label: '连续拉流', backgroundColor: 'rgba(24, 144, 255, 1)' },
                { value: true, label: '单点拉流', backgroundColor: '#88db57' }
              ]}
              onChange={(e: any) => {
                cancelBrush();
                onLoadTypeChange({ type: 'pull', data: e });
              }}
            />
            <ToolbarItem
              onDoubleClick={() => {
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
              onDoubleClick={() => {
                setCaliperRule(data?.caliperRule || {});
                form.setFieldsValue(data?.caliperRule || {});
                setRuleVisible(true);
              }}
              onClick={() => {
                if (!Object.keys(caliperRule)?.length) {
                  setRuleVisible(true);
                  return;
                }
                setSelectedBtn(prev => prev === 'one' ? '' : 'one');
                if (selectedBtn === 'one') {
                  cancelBrush();
                } else {
                  initBrush();
                }
              }}
              selectable={selectedBtn === 'one'}
              title={'单边卡尺'}
            >
              单边卡尺
            </ToolbarItem>
            <ToolbarItem onClick={() => {
              cancelBrush();
              brushLink();
            }} title={'卡尺Link'}>
              卡尺Link
            </ToolbarItem>
            <ToolbarItem onClick={() => {
              cancelBrush();
              const activeObj = editor.canvas.getActiveObject()?._objects;
              const result = formatResult(activeObj);
              onLoadTypeChange({
                type: 'registration',
                data: result
              });
            }} title={'配准'}>
              配准
            </ToolbarItem>
            <ToolbarItem onClick={() => {
              cancelBrush();
              const activeObj = editor.canvas.getActiveObject()?._objects;
              if (!!activeObj?.length) {
                const result = formatResult(activeObj);
                onLoadTypeChange({
                  type: 'measurementError',
                  data: result
                });
              } else {
                message.warning('请选择标定点');
              }
            }} title={'测量误差'}>
              误差测量
            </ToolbarItem>
          </Fragment>
          : null
      }
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
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item
                name={'measurement_offset'}
                label={'测量抵消'}
                rules={[{ required: false, message: '测量抵消' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item
                name={'output_index'}
                label={'产出指数'}
                rules={[{ required: false, message: '产出指数' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={'high_error_tolerance'}
                label={'告警上限'}
                rules={[{ required: false, message: '告警上限' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item
                name={'high_warning_tolerance'}
                label={'预警上限'}
                rules={[{ required: false, message: '预警上限' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item
                name={'low_warning_tolerance'}
                label={'预警下限'}
                rules={[{ required: false, message: '预警下限' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item
                name={'low_error_tolerance'}
                label={'告警下限'}
                rules={[{ required: false, message: '告警下限' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item
                name={'averaging_depth'}
                label={'平均深度'}
                rules={[{ required: false, message: '平均深度' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item
                name={'mirimum_points'}
                label={'微小点数'}
                rules={[{ required: false, message: '微小点数' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Form>
          </Modal>
        ) : null
      }
    </CenterV>
  )
}
import { Fragment, useContext, useEffect, useState } from 'react';
import { Button, message, Modal } from 'antd';
import { GloablStateContext } from '@/context';
import { ClearOutlined, ExclamationCircleFilled, UndoOutlined, RedoOutlined, SaveOutlined, DragOutlined } from '@ant-design/icons';
import { CenterV } from '@/components/fabritor/components/Center';
import ToolbarItem from './ToolbarItem';
import ToolbarDivider from '@/components/fabritor/components/ToolbarDivider';
import { DRAG_ICON } from '@/common/constants/globalConstants';
import SegmentSwitch from '@/components/SegmentSwitch';

export default function Toolbar() {
  const { setActiveObject, editor, onLoadTypeChange } = useContext<any>(GloablStateContext);
  const [panEnable, setPanEnable] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

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
  }
  const saveCanvas = () => {
    const json = editor.canvas2Json();
    console.log('画布数据：', json);

    const initItem = (item: any) => {
      const { sub_type, path, strokeWidth } = item;
      return Object.assign(
        {},
        item,
        !sub_type ? {
          type: path?.length > 3 ? 'pencil' : 'point',
          path,
          width: strokeWidth,
          height: strokeWidth
        } : {
          type: sub_type
        }
      )
    }
    const result = (json.objects || [])?.map((item: any) => {
      const { type } = item;
      return type === 'group' ? {
        ...item,
        children: item.objects?.map((cItem: any) => {
          return initItem(cItem)
        })
      } : initItem(item)
    })?.filter((i: any) => i.type !== 'image');
    // console.log('result', JSON.stringify(result));
    !!onLoadTypeChange && onLoadTypeChange({ type: 'mark', data: result });
    message.success('保存画布成功');
    localStorage.setItem('fabritor_web_json', JSON.stringify(json));
  };

  const enablePan = () => {
    const enable = editor.switchEnablePan();
    setPanEnable(enable);
  }

  useEffect(() => {
    if (editor) {
      setCanUndo(editor.fhistory.canUndo());
      setCanRedo(editor.fhistory.canRedo());
    }
  });

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
                onLoadTypeChange({ type: 'pull', data: e })
              }}
            />
            <ToolbarItem onClick={() => {
              onLoadTypeChange({ type: 'registration' })
            }} title={'配准'}>
              配准
            </ToolbarItem>
            <ToolbarItem onClick={() => {
              onLoadTypeChange({ type: 'measurementError' })
            }} title={'测量误差'}>
              测量误差
            </ToolbarItem>
          </Fragment>
          : null
      }
      <ToolbarDivider />
      <ToolbarItem
        onClick={enablePan}
        title={panEnable ? '选择元素' : '拖拽画布'}
      >
        {
          panEnable ?
            <DragOutlined style={{ fontSize: 22, color: panEnable ? '#000' : '#ccc' }} /> :
            <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(DRAG_ICON)}`} style={{ width: 22, height: 22 }} />
        }
      </ToolbarItem>
      <ToolbarItem onClick={saveCanvas} title={'保存数据'}>
        <SaveOutlined style={{ fontSize: 20 }} />
      </ToolbarItem>
      <ToolbarItem onClick={clearCanvas} title={'清空画布'}>
        <ClearOutlined style={{ fontSize: 20 }} />
      </ToolbarItem>
    </CenterV>
  )
}
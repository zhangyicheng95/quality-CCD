import { useContext, useEffect, useState } from 'react';
import { Modal } from 'antd';
import { GloablStateContext } from '@/context';
import { ClearOutlined, ExclamationCircleFilled, UndoOutlined, RedoOutlined, SaveOutlined } from '@ant-design/icons';
import { CenterV } from '@/components/fabritor/components/Center';
import ToolbarItem from './ToolbarItem';
import ToolbarDivider from '@/components/fabritor/components/ToolbarDivider';

export default function Toolbar() {
  const { setActiveObject, editor } = useContext<any>(GloablStateContext);
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
    console.log('原始', json);

    const result = (json.objects || [])?.filter((i: any) => i.id !== "fabritor-sketch")?.map((item: any) => {
      const { width, height, top, left, type, sub_type, path, strokeWidth } = item;
      return {
        type: !!sub_type ? sub_type : path?.length > 2 ? 'pencil' : 'point',
        width: !!sub_type ? width : strokeWidth,
        height: !!sub_type ? height : strokeWidth,
        top, left,
        ...path?.length > 2 ? { path } : {}
      }
    })
    console.log(result);
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
      <ToolbarItem
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
      </ToolbarItem>
      <ToolbarDivider />
      {/* <ToolbarItem
        onClick={enablePan}
        title={panEnable ? '选择元素' : '拖拽画布'}
      >
        {
          panEnable? 
          <DragOutlined style={{ fontSize: 22, color: panEnable ? '#000' : '#ccc' }} /> :
          <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(DRAG_ICON)}`} style={{ width: 22, height: 22 }} />
        }
      </ToolbarItem> */}
      <ToolbarItem onClick={saveCanvas} title={'保存数据'}>
        <SaveOutlined style={{ fontSize: 20 }} />
      </ToolbarItem>
      <ToolbarItem onClick={clearCanvas} title={'清空画布'}>
        <ClearOutlined style={{ fontSize: 20 }} />
      </ToolbarItem>
    </CenterV>
  )
}
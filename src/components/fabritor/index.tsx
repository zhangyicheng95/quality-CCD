import { fabric } from 'fabric';
import { useEffect, useRef, useState } from 'react';
import { Layout, Spin } from 'antd';
import Header from './UI/header';
import Panel from './UI/panel';
import Setter from './UI/setter';
import Editor from './editor';
import { GloablStateContext } from '@/context';
import ContextMenu from './components/ContextMenu';
import { SKETCH_ID } from '@/common/constants/globalConstants';
import ObjectRotateAngleTip from './components/ObjectRotateAngleTip';
import rough from 'roughjs';
import styles from './index.less';
import './font.css';

const { Content } = Layout;

const workspaceStyle: React.CSSProperties = {
  // background: '#ddd',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  flex: 1
}

const contentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
}

export default function Fabritor() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const workspaceEl = useRef<HTMLDivElement>(null);
  const roughSvgEl = useRef(null);
  const [editor, setEditor] = useState<any>(null);
  const [roughSvg, setRoughSvg] = useState<any>();
  const [activeObject, setActiveObject] = useState<fabric.Object | null | undefined>(null);
  const [isReady, setReady] = useState(false);
  const contextMenuRef = useRef<any>(null);

  const clickHandler = (opt: any) => {
    const { target } = opt;
    if (editor.getIfPanEnable()) return;

    if (!target) {
      contextMenuRef.current?.hide();
      return;
    }

    if (opt.button === 3) { // 右键
      if (target.id !== SKETCH_ID) {
        editor.canvas?.setActiveObject(target);
      }
      setTimeout(() => {
        contextMenuRef.current?.show();
      }, 50);
    } else {
      contextMenuRef.current?.hide();
    }
  }

  const selectionHandler = (opt: any) => {
    const { selected, sketch } = opt;
    if (selected && selected.length) {
      const selection = editor.canvas?.getActiveObject();
      setActiveObject(selection);
    } else {
      // @ts-ignore
      setActiveObject(sketch);
    }
  }

  const groupHandler = () => {
    const selection = editor.canvas?.getActiveObject();
    setActiveObject(selection);
  }

  const loadJsonHandler = (opt: any) => {
    const { lastActiveObject } = opt;
    if (lastActiveObject) {
      editor.canvas?.setActiveObject(lastActiveObject);
      setActiveObject(lastActiveObject);
    }
  };
  // 窗口大小改变，动态修改画布大小
  const resizeCanvas = () => {
    editor?.canvas?.setWidth?.(workspaceEl?.current?.offsetWidth);
    editor?.canvas?.setHeight?.(workspaceEl?.current?.offsetHeight);
  };
  // 初始化绑定事件
  const initEvent = () => {
    editor.canvas?.on('selection:created', selectionHandler);
    editor.canvas?.on('selection:updated', selectionHandler);
    editor.canvas?.on('selection:cleared', selectionHandler);
    editor.canvas?.on('mouse:down', clickHandler);
    editor.canvas?.on('fabritor:group', groupHandler);
    editor.canvas?.on('fabritor:ungroup', groupHandler);
    editor.canvas?.on('fabritor:load:json', loadJsonHandler);
    window.addEventListener('resize', resizeCanvas);
  };
  const removeEvent = () => {
    editor.canvas?.off('selection:created', selectionHandler);
    editor.canvas?.off('selection:updated', selectionHandler);
    editor.canvas?.off('selection:cleared', selectionHandler);
    editor.canvas?.off('mouse:down', clickHandler);
    editor.canvas?.off('fabritor:group', groupHandler);
    editor.canvas?.off('fabritor:ungroup', groupHandler);
    editor.canvas?.off('fabritor:load:json', loadJsonHandler);
    window.removeEventListener('resize', resizeCanvas);
  }
  // 初始化画布
  const initEditor = async () => {
    const _editor: any = new Editor({
      canvasEl: canvasEl.current,
      workspaceEl: workspaceEl.current,
      sketchEventHandler: {
        groupHandler: () => {
          setActiveObject(_editor.canvas?.getActiveObject());
        }
      }
    });

    await _editor.init();
    setEditor(_editor);
    setReady(true);
    setActiveObject(_editor.sketch);

    const jsonStr = localStorage.getItem('fabritor_web_json')
    if (jsonStr) {
      const json = JSON.parse(jsonStr);
      await _editor.loadFromJSON(json);
    }

    _editor.canvas?.on('object:moving', function (e: any) {
      var obj = e.target;

      // if object is too big ignore
      if (obj?.cacheHeight > obj?.canvas?.height || obj?.cacheWidth > obj?.canvas?.width) {
        return;
      }
      obj?.setCoords();
      // top-left  corner
      if (obj?.getBoundingRect()?.top < 0) {
        obj.top = 0; //Math.max(obj?.top, obj?.top - obj?.getBoundingRect()?.top);
      }
      if (obj?.getBoundingRect()?.left < 0) {
        obj.left = 0; //Math.max(obj?.left, obj?.left - obj?.getBoundingRect()?.left);
      }
      // bot-right corner
      if (
        (obj?.getBoundingRect()?.top + obj?.getBoundingRect()?.height / (_editor?.sketch?.zoomY || 1)) > obj?.canvas?.height
      ) {
        obj.top = obj?.canvas?.height - obj?.getBoundingRect()?.height / (_editor?.sketch?.zoomY || 1); //Math.min(obj?.top, obj?.canvas?.height - obj?.getBoundingRect()?.height + obj?.top - obj?.getBoundingRect()?.top);
      }
      if (
        (obj?.getBoundingRect()?.left + obj?.getBoundingRect()?.width / (_editor?.sketch?.zoomX || 1)) > obj?.canvas?.width
      ) {
        obj.left = _editor.sketch?.width - obj?.getBoundingRect()?.width / (_editor?.sketch?.zoomX || 1); //Math.min(obj?.left, obj?.canvas?.width - obj?.getBoundingRect()?.width + obj?.left - obj?.getBoundingRect()?.left);
      }
    });
  }

  const initRoughSvg = () => {
    // @ts-ignore rough svg
    setRoughSvg(rough.svg(roughSvgEl.current));
  }

  useEffect(() => {
    if (editor) {
      initEvent();
      initRoughSvg();
    }

    return () => {
      if (editor) {
        removeEvent();
      }
    }
  }, [editor]);

  useEffect(() => {
    initEditor();

    return () => {
      if (editor) {
        editor.destroy();
      }
    }
  }, []);

  return (
    <GloablStateContext.Provider
      value={{
        object: activeObject,
        setActiveObject,
        isReady,
        setReady,
        editor,
        roughSvg
      }}
    >
      <div style={{ height: '100%' }} className={styles["fabritor-layout"]}>
        <Spin spinning={!isReady}>
          <ObjectRotateAngleTip />
          <Header />
          <div style={{ height: 'calc(100% - 51px)' }} className="flex-box">
            <Panel />
            <Content style={contentStyle}>
              <ContextMenu ref={contextMenuRef} object={activeObject}>
                <div style={workspaceStyle} ref={workspaceEl} className="fabritor-workspace">
                  <canvas ref={canvasEl} />
                </div>
              </ContextMenu>
            </Content>
            <Setter />
          </div>
        </Spin>
        <svg id="fabritor-rough-svg" ref={roughSvgEl} />
      </div>
    </GloablStateContext.Provider>
  )
}
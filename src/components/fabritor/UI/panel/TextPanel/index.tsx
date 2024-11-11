import { Button } from 'antd';
import PresetFontPanel from './PresetFontPanel';
import { useContext } from 'react';
import { GloablStateContext } from '@/context';
import { createTextbox } from '@/components/fabritor/editor/objects/textbox';

export default function TextPanel() {
  const { editor } = useContext<any>(GloablStateContext);

  const handleAddText = async (options: any) => {
    await createTextbox({ ...options, canvas: editor.canvas });
  }

  return (
    <div className="fabritor-panel-wrapper">
      <Button type="primary" block onClick={() => { handleAddText({}) }} size="large">
        {'添加文本框'}
      </Button>
      <PresetFontPanel addTextBox={handleAddText} />
    </div>
  )
}
import { useState, useEffect, useContext } from 'react';
import { Button, Typography } from 'antd';
import { GloablStateContext } from '@/context';

const { Text } = Typography;

export default function BaseInfo() {
  const [desc, setDesc] = useState('');
  const { editor, addImage } = useContext<any>(GloablStateContext);

  const handleChange = (v: any) => {
    const _v = v || 'ubvision fabritor';
    setDesc(_v);
    if (!editor) return;
    const { sketch } = editor;
    // @ts-ignore custom desc
    sketch.set('fabritor_desc', _v);

    editor.fireCustomModifiedEvent();
  }

  useEffect(() => {
    if (!editor) return;
    const { sketch } = editor;
    // @ts-ignore custom desc
    setDesc(sketch.fabritor_desc);
  }, [editor?.sketch]);

  return (
    <Text
      editable={{
        onChange: handleChange,
        autoSize: {
          minRows: 1,
          maxRows: 1
        }
      }}
      className="flex-box"
      ellipsis={true}
      style={{ margin: 0, width: 200, height: 46, lineHeight: '46px' }}
    >
      {desc || ''}
      <Button onClick={() => {
        addImage({})
      }}>导入CAD图纸</Button>
    </Text>
  )
}
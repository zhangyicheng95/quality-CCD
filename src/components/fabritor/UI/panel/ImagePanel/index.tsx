import { createFImage } from '@/components/fabritor/editor/objects/image';
import { useContext } from 'react';
import ImageSelector from '@/components/fabritor/components/ImageSelector';
import { GloablStateContext } from '@/context';

export default function ImagePanel() {
  const { editor } = useContext(GloablStateContext);

  const addImage = async (url: any) => {
    await createFImage({
      imageSource: url,
      canvas: editor.canvas
    });
  }

  return (
    <div className="fabritor-panel-wrapper">
      <ImageSelector onChange={addImage} style={{ height: 40, width: 'auto', fontSize: 16, borderRadius: 4 }} />
    </div>
  )
}
import { createFImage } from '@/components/fabritor/editor/objects/image';
import { useContext } from 'react';
import ImageSelector from '@/components/fabritor/components/ImageSelector';
import { GloablStateContext } from '@/context';
import { BASE_IP } from '@/services/api';

export default function ImagePanel() {
  const { editor } = useContext<any>(GloablStateContext);

  const addImage = async (url: any) => {
    const res = `${url?.indexOf('http') === 0
      ? url
      : `${BASE_IP}file${url?.indexOf('\\') === 0 || url?.indexOf('/') === 0 ? '' : '\\'
      }${url}`
      }`;

    await createFImage({
      imageSource: res,
      canvas: editor.canvas
    });
  }

  return (
    <div className="fabritor-panel-wrapper">
      <ImageSelector onChange={addImage} style={{ height: 40, width: 'auto', fontSize: 16, borderRadius: 4 }} />
    </div>
  )
}
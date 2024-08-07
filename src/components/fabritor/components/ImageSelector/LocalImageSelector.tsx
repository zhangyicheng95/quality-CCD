import { useRef, useState } from 'react';
import ChooseFileButton from '@/components/ChooseFileButton';
import FileManager from '@/components/FileManager';
import { btnFetch } from '@/services/api';
import { message } from 'antd';

export default function LocalImageSelector(props: any) {
  const { onChange } = props;
  const [selectPathVisible, setSelectPathVisible] = useState(false);
  const [selectedPath, setSelectedPath] = useState<any>({});

  return (
    <div className='flex-box' style={{ flexWrap: 'wrap', gap: 16 }}>
      <ChooseFileButton
        name={'fabric-img-select'}
        type="primary"
        onClick={() => {
          if (!!localStorage.getItem('parentOrigin')) {
            window?.parent?.postMessage?.(
              { type: 'openFile', name: 'fabric-img-select', suffix: "image/*" },
              localStorage.getItem('parentOrigin') || '',
            );
          } else {
            setSelectPathVisible?.(true);
          }
        }}
        onOk={(value: any) => {
          onChange(value);
        }}
        style={{ height: 40, width: 'auto', fontSize: 16, borderRadius: 4 }}
      >
        添加图片
      </ChooseFileButton>
      <ChooseFileButton
        name={'fabric-img-select'}
        type="primary"
        onClick={() => {
          if (!!localStorage.getItem('parentOrigin')) {
            window?.parent?.postMessage?.(
              { type: 'openFile', name: 'fabric-img-select', suffix: "dwg" },
              localStorage.getItem('parentOrigin') || '',
            );
          } else {
            setSelectPathVisible?.(true);
          }
        }}
        onOk={(value: any) => {
          btnFetch(
            'post',
            'localhost:8801/dwgToImg',
            { url: value }
          ).then((res: any) => {
            if (res && res.code === 'SUCCESS') {
              onChange(res?.data || '');
            } else {
              message.error('截图上传时，接口报错', 5);
            }
          });
        }}
        style={{ height: 40, width: 'auto', fontSize: 16, borderRadius: 4 }}
      >
        添加CAD模板
      </ChooseFileButton>
      {selectPathVisible ? (
        <FileManager
          fileType={selectedPath.fileType}
          data={selectedPath}
          onOk={(val: any) => {
            const { id, value } = val;
            onChange(value);
            setSelectedPath(value);
            setSelectPathVisible?.(false);
          }}
          onCancel={() => {
            setSelectPathVisible?.(false);
          }}
        />
      ) : null}
    </div>
  );
}
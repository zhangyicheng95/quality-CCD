import { useContext, useState } from 'react';
import ChooseFileButton from '@/components/ChooseFileButton';
import FileManager from '@/components/FileManager';
import { btnFetch } from '@/services/api';
import { message } from 'antd';
import { GloablStateContext } from '@/context';

export default function LocalImageSelector(props: any) {
  const { onChange } = props;
  const { fetchType, yName, } = useContext<any>(GloablStateContext);
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
              { type: 'openFile', name: 'fabric-img-select', suffix: ['jpg', 'png', 'svg', 'dxf'] },
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
              { type: 'openFile', name: 'fabric-img-select', suffix: ["dwg", "dxf"] },
              localStorage.getItem('parentOrigin') || '',
            );
          } else {
            setSelectPathVisible?.(true);
          }
        }}
        onOk={(value: any) => {
          btnFetch(fetchType, yName, { type: 'dwgToImg', url: value }).then((res: any) => {
            if (!!res && res.code === 'SUCCESS') {
              onChange(res?.data || value);
            } else {
              message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
            }
          }).catch(() => {
            onChange(value);
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
            const { value } = val;
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
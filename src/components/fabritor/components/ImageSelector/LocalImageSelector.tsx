import { useRef, useState } from 'react';
import { Button } from 'antd';
import LocalFileSelector from '../LocalFileSelector';
import ChooseFileButton from '@/components/ChooseFileButton';
import FileManager from '@/components/FileManager';

export default function LocalImageSelector(props: any) {
  const { onChange, ...rest } = props;
  const localFileSelectorRef = useRef<any>();
  const [selectPathVisible, setSelectPathVisible] = useState(false);
  const [selectedPath, setSelectedPath] = useState<any>({});

  const handleClick = () => {
    localFileSelectorRef.current?.start?.();
  }

  const handleFileChange = (file: any) => {
    if (file.type === 'image/svg+xml') {
      // const url = URL.createObjectURL(file);
      // addSvg?.({ url });
      return;
    }

    const reader = new FileReader();
    reader.onload = (revt: any) => {
      onChange?.(revt.target.result);
    }
    reader.readAsDataURL(file);
  }

  return (
    <div>
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
        添加本地图片
      </ChooseFileButton>
      {selectPathVisible ? (
        <FileManager
          fileType={selectedPath.fileType}
          data={selectedPath}
          onOk={(val: any) => {
            const { id, value, ...rest } = val;
            onChange(val?.value);
            setSelectedPath(val?.value);
            setSelectPathVisible?.(false);
          }}
          onCancel={() => {
            setSelectPathVisible?.(false);
          }}
        />
      ) : null}

      {/* <Button type="primary" size="large" onClick={handleClick} {...rest}>
        添加本地图片
      </Button>

      <LocalFileSelector accept={["image/*", ".dwg"]} ref={localFileSelectorRef} onChange={handleFileChange} /> */}
    </div>
  );
}
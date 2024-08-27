import { Dropdown, Button, message } from 'antd';
import { ExportOutlined, FileOutlined, ImportOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { downloadFile, base64ToBlob } from '@/utils/utils';
import { useContext, useRef, useState } from 'react';
import { GloablStateContext } from '@/context';
import LocalFileSelector from '@/components/fabritor/components/LocalFileSelector';
import { CenterV } from '@/components/fabritor/components/Center';
import { SETTER_WIDTH } from '@/common/constants/globalConstants';

const i18nKeySuffix = 'header.export';

const importItems: MenuProps['items'] = [
  { key: 'json', label: '导入JSON模版' },
  { type: 'divider' },
  // { key: 'cad', label: '导入CAD模版' },
];
const exportItems: MenuProps['items'] = [
  { key: 'jpg', label: '导出为 JPG' },
  { key: 'png', label: '导出为 PNG' },
  { key: 'svg', label: '导出为 SVG' },
  { key: 'json', label: '导出为 JSON' },
  { type: 'divider' },
  { key: 'clipboard', label: '复制到剪贴板' },
];

export default function FileToolbar() {
  const { editor, setReady, setActiveObject } = useContext<any>(GloablStateContext);
  const localFileSelectorRef = useRef<any>();
  const [acceptType, setAcceptType] = useState("application/json");

  const selectJsonFile = (type?: string) => {
    setAcceptType(type || "application/json");
    setTimeout(() => {
      localFileSelectorRef.current?.start?.();
    }, 200);
  }

  const handleFileChange = (file: any) => {
    setReady(false);
    try {
      if (file?.name?.indexOf('.dwg') > -1) {

      } else if (file?.name?.indexOf('.json') > -1) {
        const reader = new FileReader();
        reader.onload = (async (evt) => {
          const json = evt.target?.result as string;
          if (json) {
            await editor.loadFromJSON(json, true);
            editor.fhistory.reset();
            setReady(true);
            setActiveObject(null);
            editor.fireCustomModifiedEvent();
          }
        });
        reader.readAsText(file);
      }
    } catch (err) {
      console.log(err);
      setReady(true);
    }
  }

  const copyImage = async () => {
    try {
      const png = editor.export2Img({ format: 'png' });
      const blob = await base64ToBlob(png);
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
      message.success('复制成功');
    } catch (e) {
      message.error('复制失败，请选择导出到本地');
    }
  }
  // 导入事件
  const handleImportClick = ({ key }: any) => {
    const { sketch } = editor;
    // @ts-ignore
    const name = sketch.fabritor_desc;
    switch (key) {
      case 'json':
        selectJsonFile()
        break;
      case 'cad':
        selectJsonFile(".ubv,.dwg")
        break;
      default:
        break;
    }
  }
  // 导出事件
  const handleExportClick = ({ key }: any) => {
    const { sketch } = editor;
    // @ts-ignore
    const name = sketch.fabritor_desc;
    switch (key) {
      case 'png':
        const png = editor.export2Img({ format: 'png' });
        downloadFile(png, 'png', name);
        break;
      case 'jpg':
        const jpg = editor.export2Img({ format: 'jpg' });
        downloadFile(jpg, 'jpg', name);
        break;
      case 'svg':
        const svg = editor.export2Svg();
        downloadFile(svg, 'svg', name);
        break;
      case 'json':
        const json = editor.canvas2Json();
        const result = {
          ...json,
          objects: (json.objects || [])?.filter((i: any) => i.sub_type?.indexOf('_result') < 0)
        }
        downloadFile(`data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(result, null, 2)
        )}`, 'json', name);
        break;
      case 'clipboard':
        copyImage();
        break;
      default:
        break;
    }
  }
  return (
    <CenterV
      className="fabritor-export flex-box-justify-end"
      style={{
        paddingRight: 16,
        gap: 16
      }}
    >
      <Dropdown
        menu={{ items: importItems, onClick: handleImportClick }}
        arrow={{ pointAtCenter: true }}
        placement="bottom"
      >
        <Button type="primary" icon={<ImportOutlined />}>导入</Button>
      </Dropdown>
      <Dropdown
        menu={{ items: exportItems, onClick: handleExportClick }}
        arrow={{ pointAtCenter: true }}
        placement="bottom"
      >
        <Button type="primary" icon={<ExportOutlined />}>导出</Button>
      </Dropdown>
      <LocalFileSelector accept={acceptType} ref={localFileSelectorRef} onChange={handleFileChange} />
    </CenterV>
  )
}
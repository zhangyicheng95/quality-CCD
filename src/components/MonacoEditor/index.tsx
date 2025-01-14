import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Select, Modal, Input, message, Upload, Button } from 'antd';
import Monaco from 'react-monaco-editor';
import * as _ from 'lodash';
import './index.less';
import { useModel } from 'umi';
import { downFileFun, formatJson } from '@/utils/utils';
import { CloudDownloadOutlined, UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
interface Props {
  id: any;
  defaultValue?: any;
  language?: any;
  visible: any;
  onOk: any;
  onCancel: any;
}
let timer: NodeJS.Timeout | null = null;
const MonacoEditor: React.FC<Props> = (props) => {
  const { id = '', defaultValue = '', language = '', visible, onOk, onCancel } = props;
  const { initialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  const editorRef = useRef<any>({
    editor: null,
    editorValue: '',
  });
  const [editorValue, setEditorValue] = useState('');
  const [editorLanguage, setEditorLanguage] = useState('');

  const theme = useMemo(() => {
    return params?.contentData?.theme || 'realDark';
  }, [params?.contentData?.theme]);

  useEffect(() => {
    document.oncontextmenu = function (e) {
      /*屏蔽浏览器默认右键事件*/
      e = e || window.event;
      return false;
    };

    return () => {
      document.oncontextmenu = function (e) {
        /*允许浏览器默认右键事件*/
        e = e || window.event;
        return true;
      };
    };
  }, []);
  useEffect(() => {
    setEditorValue(defaultValue);
    editorRef.current.editorValue = defaultValue;
  }, [defaultValue]);
  useEffect(() => {
    setEditorLanguage(language || 'json');
  }, [language]);

  // 导入项目
  const uploadProps = {
    accept: '.json',
    showUploadList: false,
    multiple: true,
    beforeUpload(file: any) {
      const reader = new FileReader(); // 创建文件对象
      reader.readAsText(file); // 读取文件的内容/URL
      reader.onload = (res: any) => {
        const {
          target: { result },
        } = res;
        try {
          setEditorLanguage('json');
          setEditorValue(result);
        } catch (err) {
          message.error('json文件格式错误，请修改后上传。');
          console.error(err);
        }
      };
      return false;
    },
  };

  return (
    <Modal
      title={
        <div className="flex-box">
          编辑器
          {!!language ? (
            <Select
              style={{ width: 200, margin: '0 24px' }}
              onChange={(val) => {
                return setEditorLanguage(val);
              }}
              value={editorLanguage}
            >
              <Option value="javascript">javascript</Option>
              <Option value="typescript">typescript</Option>
              <Option value="scss">scss</Option>
              <Option value="html">html</Option>
              <Option value="python">python</Option>
              <Option value="json">json</Option>
              <Option value="sql">sql</Option>
              <Option value="redis">redis</Option>
              <Option value="shell">shell</Option>
              <Option value="java">java</Option>
            </Select>
          ) : null}
          {
            editorLanguage === 'json' ?
              <div className="flex-box" style={{ gap: 8 }}>
                <Upload {...uploadProps}>
                  <Button
                    icon={<UploadOutlined />}
                  // type="primary"
                  >
                    导入本地json
                  </Button>
                </Upload>
                <Button
                  icon={<CloudDownloadOutlined />}
                  onClick={() => {
                    downFileFun(editorValue, `json编辑器.json`);
                  }}
                >
                  导出json文件
                </Button>
              </div>
              : null
          }
        </div>
      }
      width="calc(100vw - 48px)"
      wrapClassName={'monaco-editor-modal'}
      centered
      open={visible}
      onOk={() => {
        try {
          onOk({
            id,
            value: editorLanguage === 'json' ? JSON.parse(editorValue) : editorValue,
            language: editorLanguage,
          });
        } catch (err) {
          message.error('json格式错误');
        }
        // setEditorValue(editorRef.current.editorValue);
      }}
      onCancel={() => {
        onCancel();
      }}
    // getContainer={false}
    >
      <Input.TextArea
        style={{ height: '100%' }}
        onChange={(e: any) => {
          const { value } = e.target;
          // timer && clearTimeout(timer);
          // timer = setTimeout(() => {
          editorRef.current.editorValue = value;
          setEditorValue(value);
          // }, 300);
        }}
        value={_.isObject(editorValue) ? formatJson(editorValue) : editorValue}
      />
    </Modal>
  );
};

export default MonacoEditor;

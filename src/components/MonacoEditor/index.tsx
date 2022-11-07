import React, { useEffect, useRef, useState } from 'react';
import {
  Select,
  Modal,
} from 'antd';
import Monaco from 'react-monaco-editor';
import './index.less';

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
  const {
    id = '',
    defaultValue = '',
    language = 'typescript',
    visible,
    onOk,
    onCancel,
  } = props;
  const editorRef = useRef<any>({
    editor: null,
    editorValue: '',
  });
  const [editorValue, setEditorValue] = useState('');
  const [editorLanguage, setEditorLanguage] = useState('');

  useEffect(() => {
    setEditorValue(defaultValue);
  }, [defaultValue]);
  useEffect(() => {
    setEditorLanguage(language);
  }, [language]);

  return (
    <Modal
      title={
        <div className="flex-box">
          monaco Editor
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
          {/* <Button
            onClick={() => {
              editorRef?.current.editor
                ?.getAction('editor.action.formatDocument')
                .run(); // 格式化
            }}
          >
            格式化
          </Button> */}
        </div>
      }
      width="calc(100vw - 48px)"
      wrapClassName={"monaco-editor-modal"}
      centered
      open={visible}
      onOk={() => {
        onOk({
          id,
          value: editorValue,
          language: editorLanguage,
        });
        // setEditorValue(editorRef.current.editorValue);
      }}
      onCancel={() => {
        onCancel();
      }}
      getContainer={false}
    >
      <Monaco
        width="100%"
        height="calc(100vh - 216px)"
        language={editorLanguage}
        theme="vs-dark"
        value={editorValue}
        onChange={(value: any) => {
          timer && clearTimeout(timer);
          timer = setTimeout(() => {
            editorRef.current.editorValue = value;
            setEditorValue(value);
          }, 300);
        }}
        options={{
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line',
          automaticLayout: false,
        }}
        editorDidMount={(editor: any, monaco: any) => {
          editorRef.current.editor = editor;
        }}
      />
    </Modal>
  );
};

export default MonacoEditor;

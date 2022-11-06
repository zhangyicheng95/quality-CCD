import React, { useEffect, useRef, useState } from 'react';
import { Select, Modal, message, } from 'antd';
import * as _ from 'lodash';
import styles from './index.less';
import { selectFilePathService } from '@/services/api';
import { divide } from 'lodash';

interface Props {
  fileType?: any;
  data: any;
  onOk: any;
  onCancel: any;
}

const FileManager: React.FC<Props> = (props) => {
  const { fileType = 'file', data, onOk, onCancel, } = props;
  const { value } = data;
  const [list, setList] = useState<any>([]);
  const [select, setSelect] = useState(value || '/');

  useEffect(() => {
    selectFilePathService(select).then(res => {
      if (!!res && !!res.items && _.isArray(res.items)) {
        const { items } = res;
        setList(items || []);
      } else {
        !_.isUndefined(res) && message.error('接口异常');
      }
    });
  }, [select]);

  return (
    <Modal
      title={fileType === 'file' ? '选择文件' : '选择文件夹'}
      width="calc(100vw - 48px)"
      wrapClassName={"file-manager-modal"}
      centered
      open={true}
      onOk={() => {
        onOk(Object.assign({}, data, { value: select }));
      }}
      onCancel={() => {
        onCancel();
      }}
      getContainer={false}
    >
      <div className={styles.fileManagerBox}>
        <div className="file-managet-title">
          {(select + '').split(`\\`).map((item: string, index: number) => {
            return <a onClick={() => {
              setSelect((select + '').split(`\\`).slice(0, index + 1).join('\\'));
            }}>{item}{`  ${index + 1 === (select + '').split(`\\`).length ? '' : '/'}  `}</a>
          })}
        </div>
        <div className="file-manager-item-box">
          {
            (list || []).map((item: any, index: number) => {
              const { type, name } = item;
              return <div className="file-manager-item">
                {
                  type === 'file' ?
                    fileType === 'file' ?
                      <span onClick={() => {
                        setSelect((prev: string) => `${prev}\\${name}`);
                        setList([]);
                      }}>{name}</span>
                      : <div className='can-not-select'>{name}</div>
                    :
                    <a onClick={() => {
                      setSelect((prev: string) => `${prev}\\${name}`)
                    }}>{name}/</a>
                }
              </div>
            })
          }
        </div>
      </div>
    </Modal>
  );
};

export default FileManager;

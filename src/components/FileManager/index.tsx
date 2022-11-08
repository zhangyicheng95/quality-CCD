import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Modal, message, Spin, } from 'antd';
import * as _ from 'lodash';
import styles from './index.less';
import { selectFilePathService } from '@/services/api';
import { CalendarOutlined, FileOutlined, FileTextOutlined, FolderOpenOutlined, HomeOutlined } from '@ant-design/icons';
import moment from 'moment';

interface Props {
  fileType?: any;
  data: any;
  onOk: any;
  onCancel: any;
}

const FileManager: React.FC<Props> = (props) => {
  const { fileType = 'file', data, onOk, onCancel, } = props;
  const { value } = data;
  const [loading, setLoading] = useState<any>(false);
  const [list, setList] = useState<any>([]);
  const [select, setSelect] = useState(value || '');

  useEffect(() => {
    setLoading(true);
    selectFilePathService(select + '\\').then(res => {
      if (!!res && !!res.items && _.isArray(res.items)) {
        const { items } = res;
        setList(items || []);
      } else {
        !_.isUndefined(res) && message.error('接口异常');
      }
      setLoading(false);
    });
  }, [select]);
  const selectList = useMemo(() => {
    return (select + '').split(`\\`).filter(Boolean);
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
          {selectList.map((item: string, index: number) => {
            if (!item) return null;
            return <a key={item} onClick={() => {
              setSelect(selectList.slice(0, index + 1).join('\\'));
            }}>
              {
                index === 0 ?
                  <HomeOutlined style={{ marginRight: 8 }} />
                  : null
              }
              {item}&nbsp;{`   ${index + 1 === (select + '').split(`\\`).length ? '' : '/'}   `}&nbsp;
            </a>
          })}
        </div>
        <div className="file-managet-header flex-box">
          <div className="header-name flex-box">
            <FileTextOutlined />
            文件名
          </div>
          <div className="header-time flex-box">
            <CalendarOutlined />
            修改时间
          </div>
          <div className="header-size flex-box">
            <CalendarOutlined />
            创建时间
          </div>
        </div>
        <div className="file-manager-item-box">
          <Spin spinning={loading}>
            {
              (list || []).map((item: any, index: number) => {
                const { type, name, create_at, update_time } = item;
                return <div className="file-manager-item flex-box" key={index}>
                  <div className="body-name flex-box">
                    {
                      type === 'file' ?
                        <Fragment>
                          <FileOutlined className='file-icon' />
                          {
                            fileType === 'file' ?
                              <span onClick={() => {
                                setSelect((prev: string) => `${prev}\\${name}`);
                                setList([]);
                              }}>{name}</span>
                              : <div className='can-not-select'>{name}</div>
                          }
                        </Fragment>
                        :
                        <Fragment>
                          <FolderOpenOutlined className='dir-icon' />
                          <a onClick={() => {
                            setSelect((prev: string) => `${prev}\\${name}`)
                          }}>{name}/</a>
                        </Fragment>
                    }
                  </div>
                  <div className="body-time flex-box">
                    {moment(update_time).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                  <div className="body-size flex-box">
                    {moment(create_at).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                </div>
              })
            }
          </Spin>
        </div>
      </div>
    </Modal>
  );
};

export default FileManager;

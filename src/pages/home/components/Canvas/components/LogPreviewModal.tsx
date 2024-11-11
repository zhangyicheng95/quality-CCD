import React from 'react';
import * as _ from 'lodash';
import { Modal } from 'antd';
import { connect } from 'umi';

interface Props {
  type: any;
  onCancel: any;
}

const LogPreviewModal: React.FC<Props> = (props: any) => {
  const { type, onCancel, snapshot } = props;
  const { logStr, errorData } = snapshot;

  return (
    <Modal
      title={'日志信息'}
      width="calc(100vw - 48px)"
      wrapClassName={'full-screen-modal'}
      centered
      open={true}
      footer={null}
      getContainer={false}
      onCancel={onCancel}
    >
      <div className="log-content">
        {type === 'log' ? (
          <div
            className="content-item-span"
            dangerouslySetInnerHTML={{
              // 此处需要处理
              __html: _.isString(logStr) ? logStr : logStr.join('<br/>'),
            }}
          />
        ) : type === 'error' ? (
          <div className="content-item-span ">
            {/* <BasicScrollBar data={errorData}> */}
            {errorData?.map?.((log: any, index: number) => {
              const { color, node_name, nid, message, time } = log;
              return (
                <div className="log-item flex-box-start" key={index}>
                  <div className="log-item-content">
                    <div className="content-item">
                      <span>{time}&nbsp;</span>
                      &nbsp;
                      <div
                        className="content-item-span"
                        style={{ color }}
                        dangerouslySetInnerHTML={{
                          __html: `节点${node_name || ''}（${nid || ''}）${message}`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            {/* </BasicScrollBar> */}
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default connect(({ home, themeStore }) => ({
  snapshot: home.snapshot || {},
}))(LogPreviewModal);

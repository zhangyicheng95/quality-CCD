import React, { useEffect, useState, } from "react";
import styles from "./index.module.less";
import * as _ from "lodash";
import moment from "moment";
import PrimaryTitle from "@/components/PrimaryTitle";
import { useLocation, useHistory } from "react-router";
import ImageDom from "@/components/ImageDom";

const HistoryDetail: React.FC<any> = (props: any) => {
  const history = useHistory();
  const { state = {} } = useLocation<any>();
  const { orderId, uid, data = {} } = state;
  const { store_path } = data;
  const [imgSize, setImgSize] = useState(1);

  useEffect(() => {
    if (!state || _.isEmpty(state)) {
      history.replace({ pathname: '/history' });
    }
  }, [])

  useEffect(() => {
    const img = new Image();
    img.src = store_path;
    img.onload = (res: any) => {
      const { width = 1, height = 1 } = img;
      setImgSize(width / height);
    };
  }, [store_path])

  return (
    <div className={`${styles.historyDetail} page-size`}>
      <PrimaryTitle title={'历史详情'} />
      <div className="history-detail-box">
        <div className="detail-item flex-box-start">
          <div className="detail-item-title">
            订单ID：
          </div>
          <div className="detail-item-value">{orderId}</div>
        </div>
        <div className="detail-item flex-box-start">
          <div className="detail-item-title">
            节点ID：
          </div>
          <div className="detail-item-value">{uid}</div>
        </div>
        <div className="detail-item flex-box-start">
          <div className="detail-item-title">
            节点图片：
          </div>
          <div className="detail-item-value">
            <ImageDom
              src={store_path}
              alt="节点图片"
              style={imgSize < 1 ? { height: '100%', width: 'auto' } : { width: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetail;

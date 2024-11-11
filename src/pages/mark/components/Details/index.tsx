import React, { useEffect, useRef, useState } from "react";
import styles from './index.less';
import * as _ from "lodash";
import MarkCanvas from "@/components/platForm/MarkCanvas";
import { useHistory, useLocation } from "react-router";
import PrimaryTitle from "@/components/PrimaryTitle";
import { Button, DatePicker, Form } from "antd";

const MarkDetail: React.FC = (props: any) => {
  const history = useHistory();
  const { state = {} } = useLocation<any>();
  // 把获取标注数据的函数拿过来
  const [getDataFun, setGetDataFun] = useState<any>({ feat: null, pen: null, zoom: 1000, });

  // 如果刷新页面，state会制空，那么自动返回列表页
  useEffect(() => {
    if (!state || _.isEmpty(state)) {
      history.goBack();
    }
  }, []);

  // 获取数据，走保存函数
  const onSave = () => {
    const featData = getDataFun?.feat();
    const penData = getDataFun?.pen();
    const params = { featData, penData, zoom: getDataFun.zoom }
    console.log(params);
  }

  return <div className={`${styles.markCanvas} page-size background-ubv`}>
    <div className="search-box flex-box">
      <Button type="primary" ghost onClick={() => onSave()}>
        获取标注数据
      </Button>
    </div>
    <div className="mark-box">
      {
        _.isObject(state) && !_.isEmpty(state) &&
        <MarkCanvas
          data={state}
          setGetDataFun={setGetDataFun}
        />
      }
    </div>
  </div >;
};

export default MarkDetail;

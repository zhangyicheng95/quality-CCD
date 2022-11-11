import React, { useEffect, useRef, useState } from "react";
import styles from './index.less';
import * as _ from "lodash";
import MarkCanvas from "@/components/platForm/MarkCanvas";
import { useHistory, useLocation } from "react-router";

const MarkDetail: React.FC = (props: any) => {
  const history = useHistory();
  const { state = {} } = useLocation<any>();
  const [getDataFun, setGetDataFun] = useState<any>({ feat: null, pen: null });

  useEffect(() => {
    console.log(state)
    if (!state || _.isEmpty(state)) {
      history.goBack();
    }
  }, [])

  return <div className={styles.markCanvas}>
    {
      _.isObject(state) && !_.isEmpty(state) &&
      <MarkCanvas
        data={state}
        setGetDataFun={setGetDataFun}
      />
    }
  </div>;
};

export default MarkDetail;

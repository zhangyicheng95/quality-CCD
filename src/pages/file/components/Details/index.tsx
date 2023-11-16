import React, { useEffect, useState, } from "react";
import styles from "./index.module.less";
import * as _ from "lodash";
import moment from "moment";
import PrimaryTitle from "@/components/PrimaryTitle";

const fileDetail: React.FC<any> = (props: any) => {

  return (
    <div className={`${styles.fileDetail} page-size background-ubv`}>
      <PrimaryTitle title={'文档详情'} />

    </div>
  );
};

export default fileDetail;

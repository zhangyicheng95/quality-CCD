import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Button, Col, Form, Row, Switch, Table } from "antd";
import _ from "lodash";
import { getParams } from "@/services/api";
import { BlockOutlined, CaretDownOutlined, CaretRightOutlined } from "@ant-design/icons";

const Control: React.FC<any> = (props: any) => {
  const [nodeList, setNodeList] = useState<any>([]);
  const getData = async () => {
    const res = await getParams({ id: '123123123' });
    const { data } = res;
    const { flowData } = data;
    const { nodes } = flowData;
    setNodeList(nodes);
  };

  useEffect(() => {
    if (!localStorage.getItem("ipUrl-history")) return;
    getData();
  }, []);

  const onFinish = () => {
  };
  return (
    <div className={`${styles.control} flex-box`}>
      <div className="title">
        参数控制
      </div>
      <div className="control-body">
        {
          (nodeList || []).map((node: any, index: any) => {
            const { id, alias, name, config = {}, hidden } = node;
            const { initParams = {} } = config;
            if (!!initParams && !_.isEmpty(initParams)) {
              return <div key={id}>
                <div className="item-title flex-box" onClick={() => {
                  setNodeList((prev: any) => {
                    return prev.map((pre: any) => {
                      if (pre.id === id) {
                        return Object.assign({}, pre, {
                          hidden: !hidden,
                        });
                      }
                      return pre;
                    })
                  })
                }}>
                  {hidden ? <CaretRightOutlined /> : <CaretDownOutlined />}
                  {alias || name}
                </div>
                {
                  !hidden && (Object.entries(initParams) || []).map((item: any) => {
                    const { alias, name, value, default: deaultValue, widget, onHidden } = item[1];
                    const { type } = widget;
                    console.log(item[1])
                    if (onHidden) return null;
                    return <div className="flex-box param-item" key={`${id}_${item[0]}`}>
                      <div className="icon-box flex-box">
                        <BlockOutlined className="item-icon" />
                      </div>
                      <div className="value-box">
                        <p>{alias || name}（{type}）</p>
                        {value}
                      </div>
                      <div className="btn-box">
                        <Button type="link" onClick={() => {

                        }}>编辑</Button>
                      </div>
                    </div>
                  })
                }
              </div>
            }
          })
        }
        <div className="title">
          RIO标定
        </div>
        <div className="img-box">

        </div>
      </div>
      <div className="control-footer flex-box">
        <Button type="primary" onClick={() => onFinish()}>确认</Button>
      </div>
    </div>
  );
};

export default Control;

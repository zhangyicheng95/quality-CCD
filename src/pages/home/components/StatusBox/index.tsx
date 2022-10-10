import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Col, Form, Row, Table } from "antd";
import { guid } from "@/share/Utils/AppUtilHelper";
import moment from "moment";
import { url } from "../../api";
import PanelTitle from "@/components/PanelTitle";
import _ from "lodash";

const StatusBox: React.FC<any> = (props: any) => {
  const { errorData, leftInfo, data = {} } = props;
  const [form] = Form.useForm();
  const [selected, setSelected] = useState(2);
  const [rightList, setRightList] = useState<Array<any>>([]);

  const columns = [
    {
      title: "报警时间",
      dataIndex: "time",
      key: "time",
      render: (text: any) => {
        return moment(text).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "报警类型",
      dataIndex: "level",
      key: "level",
      render: (text: any) => {
        return <div className="flex-box">
          <span className={`level-icon ${text}`} />
          <span style={text === 'error' ? { color: '#e50012' } : {}}>{text}</span>
        </div>;
      },
    },
    {
      title: "位置",
      dataIndex: "position",
      key: "position",
      render: (text: any, record: any) => {
        return `${record?.node_name || ""}（${record?.nid || ""}）`;
      },
    },
    {
      title: "内容",
      dataIndex: "message",
      key: "message",
    },
  ];
  useEffect(() => {
    setRightList(errorData);
  }, [errorData]);

  return (
    <div className={styles.statusBox}>
      <div className="left-info">
        <PanelTitle>基础信息</PanelTitle>
        <div className="info-box">
          {/* <Form
            form={form}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            // layout={'vertical'}
            scrollToFirstError
            style={{ width: "100%" }}
          > */}
          {Object.entries(leftInfo || {}).map(
            (item: any, index: number) => {
              return (
                <Col span={12} key={index} style={{ padding: '0 48px' }}>
                  <span style={{ fontWeight: "bold" }}>{item[0]}: </span>
                  {_.isString(item[1]) ? item[1] : null}
                  {/* <Form.Item
                        name={item[0]}
                        label={item[1].title}
                        rules={[{ required: false, message: item[1].title }]}
                      >
                        {item[1].value}
                      </Form.Item> */}
                </Col>
              );
            }
          )}
          {/* </Form> */}
        </div>
      </div>
      <div className="right-info">
        {/* <div className="title">异常显示</div> */}
        <div className="info-tab">
          {[
            // { title: "报警信息", key: 1 },
            { title: "最近NG", key: 2 },
          ].map((item: any, index: number) => {
            return (
              <div
                className={`info-tab-item ${selected === item.key ? "selected" : ""
                  }`}
                key={item.key}
                onClick={() => setSelected(item.key)}
              >
                {item.title}
              </div>
            );
          })}
        </div>
        <div className="info-table">
          <Table
            columns={columns}
            scroll={{ y: 115 }}
            dataSource={rightList}
            pagination={false}
            rowKey={(record) => guid()}
          />
        </div>
      </div>
      <div className="left-info bottom-info">
        <div className="info-box">
          {(Object.entries(_.omit(_.omit(data, 'status'), 'uid') || {}) || []).map(
            (item: any) => {
              if (!_.isUndefined(item[1]) && !_.isEmpty(item[1])) {
                return (
                  <Col span={24} key={item[0]} style={{ padding: '0 24px' }}>
                    {
                      _.isString(item[1]) && item[1].indexOf('http') > -1 ?
                        null : (
                          <>
                            <span style={{ fontWeight: "bold" }}>{item[0]}: </span>
                            <span style={{ wordBreak: "break-all" }}>{item[1]}</span>
                          </>
                        )
                    }
                  </Col>
                );
              }
              return null;
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusBox;

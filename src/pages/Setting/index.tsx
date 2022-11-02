import React, { useEffect, useState, useRef, useMemo } from "react";
import { Form, Input, message, Button, Tree } from "antd";
import * as _ from "lodash";
import styles from "./index.module.less";
import { getParams } from "@/services/api";

const Setting: React.FC<any> = (props) => {
  const [form] = Form.useForm();
  const { validateFields, } = form;
  const [paramData, setParamData] = useState<any>({});
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [treeData, setTreeData] = useState([]);

  const getData = async () => {
    const res = await getParams({ id: '123123123' });
    const { data } = res;
    const { flowData } = data;
    const { nodes } = flowData;
    let idList: any = [];
    let checkedList: any = [];
    const result: any = (nodes || []).map((node: any) => {
      const { alias, name, id, config } = node;
      const { initParams = {} } = config;
      idList = idList.concat(id);
      if (!!initParams && !_.isEmpty(initParams)) {
        return {
          title: alias || name,
          key: id,
          children: Object.entries(initParams).map((param: any) => {
            const { alias, name, onHidden } = param[1];
            const key = `${id}@$@${param[0]}`;
            idList = idList.concat(param[1]);
            if (!onHidden) {
              checkedList = checkedList.concat(key)
            }
            return {
              title: alias || name,
              key: key,
              checked: true,
            };
          }),
        }
      };
      return null;
    }).filter(Boolean);
    setParamData(data);
    setTreeData(result);
    setExpandedKeys(idList);
    setCheckedKeys(checkedList);
  };
  useEffect(() => {
    if (!localStorage.getItem("ipUrl-history")) return;
    getData();
  }, []);

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };

  const onCheck = (checkedKeysValue: React.Key[]) => {
    setCheckedKeys(checkedKeysValue);
  };

  const onFinish = () => {
    validateFields()
      .then((values) => {
        let nodeList: any = [].concat(paramData?.flowData?.nodes);
        (checkedKeys || []).forEach((key: any) => {
          const id = key.split('@$@');
          if (!!id[1]) {
            nodeList = nodeList.map((node: any) => {
              if (node.id === id[0]) {
                const { config } = node;
                const { initParams = {} } = config;
                return Object.assign({}, node, {
                  config: Object.assign({}, config, {
                    initParams: Object.assign({}, initParams, {
                      [id[1]]: Object.assign({}, initParams[id[1]], {
                        onHidden: false
                      })
                    })
                  })
                });
              };
              return node;
            })
          }
        });
        const result = Object.assign({}, paramData, {
          flowData: Object.assign({}, paramData?.flowData, {
            nodes: nodeList,
          })
        });
        message.success('更新配置成功');
        localStorage.setItem("ipUrl-history", values['ipUrl-history']);
        localStorage.setItem("ipString", values['ipString']);
        // window.location.reload();
      })
      .catch((err) => {
        const { errorFields } = err;
        _.isArray(errorFields) && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
      });
  }

  return (
    <div className={`${styles.setting} flex-box`}>
      <div className="title">
        系统配置
      </div>
      <div className="body">
        <Form
          form={form}
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item
            name="ipUrl-history"
            label="服务端地址"
            initialValue={localStorage.getItem("ipUrl-history") || undefined}
            rules={[{ required: true, message: "服务端地址" }]}
          >
            <Input placeholder="localhost:8866" />
          </Form.Item>
          <Form.Item
            name="ipString"
            label="方案ID绑定"
            initialValue={localStorage.getItem("ipString") || undefined}
            rules={[{ required: true, message: "方案ID绑定" }]}
          >
            <Input placeholder="方案ID" />
          </Form.Item>
          <Form.Item
            name="params"
            label="参数项管理"
            initialValue={localStorage.getItem("params") || undefined}
            rules={[{ required: false, message: "参数项管理" }]}
          >
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={true}
              // @ts-ignore
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              treeData={treeData}
            />
          </Form.Item>
        </Form>

      </div>
      <div className="footer flex-box">
        <Button type="primary" onClick={() => onFinish()}>确认</Button>
      </div>
    </div>
  );
};

export default Setting;
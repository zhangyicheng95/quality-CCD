import React, { useEffect, useState, useRef, useMemo } from "react";
import { Form, Input, message, Button, Tree } from "antd";
import * as _ from "lodash";
import styles from "./index.module.less";
import { getParams, updateParams } from "@/services/api";
import PrimaryTitle from "@/components/PrimaryTitle";

const Setting: React.FC<any> = (props) => {
  const [form] = Form.useForm();
  const { validateFields, setFieldsValue } = form;
  const [paramData, setParamData] = useState<any>({});
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [treeData, setTreeData] = useState([]);

  const getData = () => {
    getParams(localStorage.getItem("ipString") || '').then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        const { data = {} } = res;
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
        if (!localStorage.getItem("quality_name")) {
          setFieldsValue({ quality_name: data.name });
        }
      } else {
        message.error(res?.msg || '接口异常');
      }
    });
  };
  useEffect(() => {
    if (!localStorage.getItem("ipUrl-history") || !localStorage.getItem("ipString")) return;
    getData();
  }, []);

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };

  const onCheck = (checkedKeysValue: React.Key[]) => {
    setCheckedKeys(checkedKeysValue.filter((i: any) => i?.indexOf("@$@") > -1));
  };

  const onFinish = () => {
    validateFields()
      .then((values) => {
        let nodeList: any = [].concat(paramData?.flowData?.nodes);
        (checkedKeys || []).forEach((key: any) => {
          const id = key.split('@$@');
          if (!!id[1]) {
            nodeList = nodeList.map((node: any) => {
              const { config } = node;
              const { initParams = {} } = config;
              return Object.assign({}, node, {
                config: Object.assign({}, config, {
                  initParams: Object.entries(initParams).reduce((pre: any, cen: any) => {
                    return Object.assign({}, pre, {
                      [cen[0]]: Object.assign({}, cen[1], {
                        onHidden: !checkedKeys.includes(`${node.id}@$@${cen[0]}`)
                      })
                    });
                  }, {}),
                })
              });
            })
          }
        });
        const result = Object.assign({}, paramData, {
          flowData: Object.assign({}, paramData?.flowData, {
            nodes: nodeList,
          })
        });
        updateParams({
          id: paramData.id,
          data: result
        }).then((res: any) => {
          if (res && res.code === 'SUCCESS') {
            message.success('修改成功')
          } else {
            message.error(res?.msg || '接口异常');
          }
        })
        message.success('更新配置成功');
        localStorage.setItem("quality_name", values['quality_name']);
        localStorage.setItem("ipUrl-history", values['ipUrl-history']);
        localStorage.setItem("ipString", values['ipString']);
        window.location.reload();
      })
      .catch((err) => {
        const { errorFields } = err;
        _.isArray(errorFields) && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
      });
  }

  return (
    <div className={`${styles.setting} flex-box`}>
      <PrimaryTitle title={"系统配置"} />
      <div className="body">
        <Form
          form={form}
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item
            name="quality_name"
            label="方案名称"
            initialValue={localStorage.getItem("quality_name") || paramData?.name}
            rules={[{ required: true, message: "方案名称" }]}
          >
            <Input placeholder="方案名称" />
          </Form.Item>
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
              showLine={true}
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
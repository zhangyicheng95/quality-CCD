import React, { useEffect, useState, } from "react";
import { Form, Input, message, Button, Tree } from "antd";
import * as _ from "lodash";
import styles from "./index.module.less";
import { getParams, updateParams } from "@/services/api";
import PrimaryTitle from "@/components/PrimaryTitle";
import FileManager from "@/components/FileManager";
import TooltipDiv from "@/components/TooltipDiv";
import { useHistory } from "umi";
import { FormOutlined } from "@ant-design/icons";
import moment from "moment";

const Setting: React.FC<any> = (props) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { validateFields, setFieldsValue, getFieldValue } = form;
  const [paramData, setParamData] = useState<any>({});
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [treeData, setTreeData] = useState([]);
  const [selectPathVisible, setSelectPathVisible] = useState(false);
  const [selectedPath, setSelectedPath] = useState<any>('');
  const [edit, setEdit] = useState({
    ip: false,
    id: false,
  });

  const getData = () => {
    getParams(localStorage.getItem("ipString") || '').then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        const { data = {} } = res;
        const { flowData, commonInfo, name } = data;
        const { nodes } = flowData;
        let checkedList: any = [];
        const result: any = (nodes || []).map((node: any) => {
          const { alias, name, id, config } = node;
          const { initParams = {} } = config;
          if (!!initParams && !_.isEmpty(initParams)) {
            return {
              title: alias || name,
              key: id,
              children: Object.entries(initParams).map((param: any) => {
                const { alias, name, onHidden } = param[1];
                const key = `${id}@$@${param[0]}`;
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
        setCheckedKeys(checkedList);
        if (!localStorage.getItem("quality_name")) {
          setFieldsValue({ quality_name: data.name });
        };
        if (_.isObject(commonInfo) && !_.isEmpty(commonInfo)) {
          setFieldsValue({
            productionInfo: commonInfo['productionInfo'],
            stationInfo: commonInfo['stationInfo'],
            useInfo: commonInfo['useInfo'],
          });
        };
      } else {
        message.error(res?.msg || '接口异常');
      }
    });
  };
  useEffect(() => {
    if (!localStorage.getItem("ipUrl-history")) {
      localStorage.setItem("ipUrl-history", 'localhost:8866');
      setFieldsValue({ "ipUrl-history": 'localhost:8866' });
    }
    if (!localStorage.getItem("ipUrl-history") || !localStorage.getItem("ipString")) return;
    getData();
  }, []);

  const onCheck = (checkedKeysValue: React.Key[]) => {
    setCheckedKeys(checkedKeysValue.filter((i: any) => i?.indexOf("@$@") > -1));
  };

  const onFinish = () => {
    validateFields()
      .then((values) => {
        const { productionInfo, stationInfo, useInfo } = values;
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
          commonInfo: { productionInfo, stationInfo, useInfo },
          flowData: Object.assign({}, paramData?.flowData, {
            nodes: nodeList,
          })
        });
        updateParams({
          id: paramData.id,
          data: result
        }).then((res: any) => {
          if (res && res.code === 'SUCCESS') {
            message.success('更新配置成功')
          } else {
            message.error(res?.msg || '接口异常');
          }
        })
        localStorage.setItem("quality_icon", values['quality_icon'] || '');
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
    <div className={`${styles.setting} flex-box page-size background-ubv`}>
      <PrimaryTitle title={"系统配置"} />
      <div className="body">
        <Form
          form={form}
          layout="horizontal"
          scrollToFirstError
        >
          <Form.Item
            name="quality_icon"
            label="系统图标"
            initialValue={localStorage.getItem("quality_icon") || ''}
            rules={[{ required: false, message: "系统图标" }]}
          >
            <div className="flex-box">
              {
                getFieldValue("quality_icon") ?
                  <TooltipDiv title={getFieldValue("quality_icon")} style={{ marginRight: 16, }}>
                    {getFieldValue("quality_icon")}
                  </TooltipDiv>
                  : null
              }
              <Button style={{ height: 40 }} onClick={() => {
                setSelectedPath(localStorage.getItem("quality_icon") || '');
                setSelectPathVisible(true)
              }}>选择系统图标</Button>
            </div>
          </Form.Item>
          <Form.Item
            name="quality_name"
            label="系统名称"
            initialValue={localStorage.getItem("quality_name") || paramData?.name}
            rules={[{ required: false, message: "系统名称" }]}
          >
            <Input placeholder="系统名称" />
          </Form.Item>
          <div className="flex-box has-edit-btn">
            <Form.Item
              name="ipUrl-history"
              label="服务端地址"
              initialValue={localStorage.getItem("ipUrl-history") || undefined}
              rules={[{ required: true, message: "服务端地址" }]}
            >
              <Input placeholder="localhost:8866" disabled={!edit.ip} />
            </Form.Item>
            <Button type="primary" onClick={() => setEdit(prev => Object.assign({ ip: !prev.ip }))}>
              {edit.ip ? '确认' : '修改'}
            </Button>
          </div>
          <div className="flex-box has-edit-btn">
            <Form.Item
              name="ipString"
              label="方案ID绑定"
              initialValue={localStorage.getItem("ipString") || undefined}
              rules={[{ required: true, message: "方案ID绑定" }]}
            >
              <Input placeholder="方案ID" disabled={!edit.id} />
            </Form.Item>
            <Button type="primary" onClick={() => setEdit(prev => Object.assign({ id: !prev.id }))}>
              {edit.id ? '确认' : '修改'}
            </Button>
          </div>
          <Form.Item
            name="canvas"
            label="配置布局"
          >
            <Button
              icon={<FormOutlined />}
              type="primary"
              onClick={() => {
                history.push({ pathname: `/home/edit` });
                window.location.reload();
              }}
            >
              前往配置
            </Button>
          </Form.Item>
          <Form.Item
            name="productionInfo"
            label="产线信息"
            rules={[{ required: false, message: "产线信息" }]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            name="stationInfo"
            label="工位信息"
            rules={[{ required: false, message: "工位信息" }]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            name="useInfo"
            label="功能信息"
            rules={[{ required: false, message: "功能信息" }]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            name="params"
            label="参数项管理"
            rules={[{ required: false, message: "参数项管理" }]}
          >
            <Tree
              checkable
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
        <Button type="primary" onClick={() => onFinish()}>保存</Button>
      </div>

      {
        selectPathVisible ?
          <FileManager
            data={{ value: selectedPath }}
            onOk={(val: any) => {
              const { value } = val;
              console.log(value);
              setFieldsValue({ quality_icon: value })
              setSelectPathVisible(false);
              setSelectedPath('');
            }}
            onCancel={() => {
              setSelectPathVisible(false);
              setSelectedPath('');
            }}
          />
          : null
      }
    </div>
  );
};

export default Setting;
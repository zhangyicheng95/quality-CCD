import React, { useEffect, useMemo, useState, } from "react";
import { Form, Input, message, Button, Tree, Select } from "antd";
import * as _ from "lodash";
import styles from "./index.module.less";
import { updateParams } from "@/services/api";
import PrimaryTitle from "@/components/PrimaryTitle";
import FileManager from "@/components/FileManager";
import TooltipDiv from "@/components/TooltipDiv";
import { connect, useHistory, useModel } from "umi";
import { FormOutlined } from "@ant-design/icons";

const Setting: React.FC<any> = (props) => {
  const { initialState, setInitialState } = useModel<any>('@@initialState');
  const { params: paramsData } = initialState;
  const { projectStatus } = props;
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
    historyIp: false,
    id: false,
  });

  const isVision = useMemo(() => {
    // @ts-ignore
    return window.QUALITY_CCD_CONFIG.type === 'vision';
  }, []);
  // 已添加的tabs
  const ipList = useMemo(() => {
    return JSON.parse(localStorage.getItem('ipList') || "[]");
  }, [localStorage.getItem('ipList')]);
  // 获取数据信息
  useEffect(() => {
    if (!_.isEmpty(paramsData)) {
      const { quality_name, name, flowData, commonInfo } = paramsData;
      const { nodes } = flowData;
      let checkedList: any = [];
      const result: any = (nodes || []).map((node: any) => {
        const { alias, name, id, config = {} } = node;
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
      setParamData(paramsData);
      setTreeData(result);
      setCheckedKeys(checkedList);
      setFieldsValue({ quality_name: quality_name || name });
      if (_.isObject(commonInfo) && !_.isEmpty(commonInfo)) {
        setFieldsValue({
          productionInfo: commonInfo['productionInfo'],
          stationInfo: commonInfo['stationInfo'],
          useInfo: commonInfo['useInfo'],
        });
      };
    }
  }, [paramsData]);
  // 设置服务端IP
  useEffect(() => {
    if (!localStorage.getItem("ipUrl-history")) {
      localStorage.setItem("ipUrl-history", 'localhost:8867');
      setFieldsValue({ "ipUrl-history": 'localhost:8867' });
    }
    if (!localStorage.getItem("ipUrl-realtime")) {
      localStorage.setItem("ipUrl-realtime", 'localhost:8866');
      setFieldsValue({ "ipUrl-realtime": 'localhost:8866' });
    }
  }, []);

  const onCheck = (checkedKeysValue: React.Key[]) => {
    setCheckedKeys(checkedKeysValue.filter((i: any) => i?.indexOf("@$@") > -1));
  };

  const onFinish = () => {
    validateFields()
      .then((values) => {
        const { quality_icon, quality_name, productionInfo, stationInfo, useInfo } = values;
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
          quality_name,
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
            message.error(res?.msg || res?.message || '接口异常');
          }
        })
        !!quality_icon && localStorage.setItem("quality_icon", quality_icon || '');
        localStorage.setItem("ipUrl-realtime", values['ipUrl-realtime']);
        localStorage.setItem("ipUrl-history", values['ipUrl-history']);
        // try {
        //   const result = ipList.map((item: any) => {
        //     if (item.key === localStorage.getItem('ipString')) {
        //       return Object.assign({}, item, { key: values['ipString'] });
        //     }
        //     return item;
        //   });
        //   localStorage.setItem("ipList", JSON.stringify(result));
        // } catch (err) { }
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
            initialValue={paramData?.quality_name || paramData?.name}
            rules={[{ required: false, message: "系统名称" }]}
          >
            <Input placeholder="系统名称" />
          </Form.Item>
          <div className="flex-box has-edit-btn">
            <Form.Item
              name="ipUrl-realtime"
              label="服务端地址"
              initialValue={localStorage.getItem("ipUrl-realtime") || undefined}
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
              name="ipUrl-history"
              label="历史记录地址"
              initialValue={localStorage.getItem("ipUrl-history") || undefined}
              rules={[{ required: true, message: "历史记录服务端地址" }]}
            >
              <Input placeholder="localhost:8867" disabled={!edit.historyIp} />
            </Form.Item>
            <Button type="primary" onClick={() => setEdit(prev => Object.assign({ historyIp: !prev.historyIp }))}>
              {edit.historyIp ? '确认' : '修改'}
            </Button>
          </div>
          <Form.Item
            name="ipString"
            label="方案ID绑定"
            initialValue={localStorage.getItem("ipString") || undefined}
            rules={[{ required: true, message: "方案ID绑定" }]}
          >
            {
              isVision ?
                <Input placeholder="方案ID" />
                :
                <Select
                  style={{ width: '100%' }}
                  size="large"
                  options={projectStatus.map((item: any) => _.omit(item, 'disabled'))}
                  placeholder="方案ID"
                />
            }
          </Form.Item>
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
          {
            !isVision ?
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
              : null
          }
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

export default connect(({ home, themeStore }) => ({
  projectStatus: themeStore.projectStatus,
}))(Setting);
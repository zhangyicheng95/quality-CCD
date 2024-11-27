import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Form, Input, message, Button, Tree, Select, Row, Col, Switch } from 'antd';
import * as _ from 'lodash';
import styles from './index.module.less';
import { updateParams } from '@/services/api';
import PrimaryTitle from '@/components/PrimaryTitle';
import FileManager from '@/components/FileManager';
import TooltipDiv from '@/components/TooltipDiv';
import { connect, useModel } from 'umi';
import { DeleteOutlined, EditOutlined, FormOutlined } from '@ant-design/icons';

const Setting: React.FC<any> = (props) => {
  const { initialState } = useModel<any>('@@initialState');
  const { params: paramsData } = initialState;
  const { projectListStore } = props;
  const [form] = Form.useForm();
  const { validateFields, setFieldsValue, getFieldValue } = form;
  const [paramData, setParamData] = useState<any>({});
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [treeData, setTreeData] = useState<any>([]);
  const [selectPathVisible, setSelectPathVisible] = useState(false);
  const [selectedPath, setSelectedPath] = useState<any>('');
  const [ipUrlList, setIpUrlList] = useState<any>([]);

  const isVision = useMemo(() => {
    // @ts-ignore
    return window.QUALITY_CCD_CONFIG.type === 'vision';
  }, []);

  // 获取数据信息
  useEffect(() => {
    if (!_.isEmpty(paramsData) && !_.isEmpty(paramsData?.flowData)) {
      const { quality_name, name, flowData } = paramsData;
      const { nodes } = flowData;
      let checkedList: any = [];
      const result: any = (nodes || [])
        ?.map?.((node: any) => {
          const { alias, name, id, config = {} } = node;
          const { initParams = {} } = config;
          if (!!initParams && !_.isEmpty(initParams)) {
            return {
              title: alias || name,
              key: id,
              children: Object.entries(initParams)?.map?.((param: any) => {
                const { alias, name, onHidden } = param[1];
                const key = `${id}@$@${param[0]}`;
                if (_.isBoolean(onHidden) && !onHidden) {
                  checkedList = checkedList.concat(key);
                }
                return {
                  title: alias || name,
                  key: key,
                  checked: true,
                };
              }),
            };
          }
          return null;
        })
        .filter(Boolean);
      setParamData(paramsData);
      setTreeData([{ title: '参数节点', key: 'parent_001', children: result }]);
      setCheckedKeys(checkedList);
      setFieldsValue({
        quality_name: quality_name || name,
        selfStart: paramsData.selfStart || false,
        errorSelfStart: paramsData.errorSelfStart || false,
        filterWarning: paramsData.filterWarning || false,
      });
    }
  }, [paramsData]);
  // 设置服务端IP
  useEffect(() => {
    if (!localStorage.getItem('ipUrl-history')) {
      localStorage.setItem('ipUrl-history', 'localhost:8867');
      setFieldsValue({ 'ipUrl-history': 'localhost:8867' });
    }
    if (!localStorage.getItem('ipUrl-realtime')) {
      localStorage.setItem('ipUrl-realtime', 'localhost:8866');
      setFieldsValue({ 'ipUrl-realtime': 'localhost:8866' });
    }
    if (!localStorage.getItem('ipUrlList')) {
      setIpUrlList([{ name: '本地服务', value: 'localhost:8866' }]);
    } else {
      try {
        const list = JSON.parse(localStorage.getItem('ipUrlList') || '[]');
        if (!!list.length) {
          setIpUrlList(list);
        } else {
          setIpUrlList([{ name: '本地服务', value: 'localhost:8866' }]);
        }
      } catch (e) {
        console.log('ipUrlList有问题', e);
        localStorage.removeItem('ipUrlList');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'ipUrlList',
      JSON.stringify(ipUrlList?.map?.((item: any) => _.omit(item, 'edit'))),
    );
  }, [ipUrlList]);
  // 服务端地址列表
  const updateIpUrl = (index: number, name: string, value: any) => {
    setIpUrlList((prev: any) =>
      prev?.map?.((item: any, iIndex: number) => {
        if (index === iIndex) {
          return { ...item, [name]: value };
        }
        return item;
      }),
    );
  };
  // 参数树状结构
  const onCheck = (checkedKeysValue: React.Key[]) => {
    setCheckedKeys(checkedKeysValue.filter((i: any) => i?.indexOf('@$@') > -1));
  };
  // 保存
  const onFinish = () => {
    validateFields()
      .then((values) => {
        const { quality_icon, quality_name, selfStart, errorSelfStart, filterWarning } = values;
        let nodeList: any = [].concat(paramData?.flowData?.nodes);
        (paramData?.flowData?.nodes || []).forEach?.((key: any) => {
          nodeList = nodeList?.map?.((node: any) => {
            const { config } = node;
            const { initParams = {} } = config;
            return Object.assign({}, node, {
              config: Object.assign({}, config, {
                initParams: Object.entries(initParams).reduce((pre: any, cen: any) => {
                  return Object.assign({}, pre, {
                    [cen[0]]: Object.assign({}, cen[1], {
                      onHidden: !checkedKeys.includes(`${node.id}@$@${cen[0]}`),
                    }),
                  });
                }, {}),
              }),
            });
          });
        });
        const result = Object.assign({}, paramData, {
          quality_name,
          selfStart,
          errorSelfStart,
          filterWarning,
          contentData: {
            ...(paramData?.contentData || {}),
            ipList: (paramData?.contentData?.ipList || [])?.map?.((item: any) => {
              if (item.key === paramData.id) {
                return {
                  ...item,
                  label: quality_name,
                };
              }
              return item;
            }),
          },
          configList: (paramData.configList || [])?.map?.((config: any) => {
            if (config.value === paramData?.selectedConfig) {
              return Object.assign({}, config, {
                data: nodeList,
              });
            }
            return config;
          }),
          flowData: Object.assign({}, paramData?.flowData, {
            nodes: nodeList,
          }),
        });
        updateParams({
          id: paramData.id,
          data: result,
        }).then((res: any) => {
          if (res && res.code === 'SUCCESS') {
            message.success('更新配置成功');
          } else {
            message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
          }
          if (!!quality_icon) {
            localStorage.setItem('quality_icon', quality_icon || '');
          } else {
            localStorage.removeItem('quality_icon');
          }
          localStorage.setItem('ipUrl-history', values['ipUrl-history'] || '');
          localStorage.setItem('ipString', values['ipString'] || '');
          window.location.reload();
        });
      })
      .catch((err) => {
        const { errorFields } = err;
        _.isArray(errorFields) && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
      });
  };

  return (
    <div className={`${styles.setting} flex-box page-size background-ubv`}>
      <PrimaryTitle title={'系统配置'} />
      <div className="body">
        <Form form={form} layout="horizontal" scrollToFirstError>
          {paramData?.contentData?.changeLogo ? (
            <Form.Item
              name="quality_icon"
              label="系统图标"
              initialValue={localStorage.getItem('quality_icon') || ''}
              rules={[{ required: false, message: '系统图标' }]}
            >
              <div className="flex-box">
                {getFieldValue('quality_icon') ? (
                  <TooltipDiv title={getFieldValue('quality_icon')} style={{ marginRight: 16 }}>
                    {getFieldValue('quality_icon')}
                  </TooltipDiv>
                ) : null}
                {getFieldValue('quality_icon') ? (
                  <Button
                    style={{ height: 40 }}
                    onClick={() => {
                      setFieldsValue({ quality_icon: undefined });
                    }}
                  >
                    移除
                  </Button>
                ) : (
                  <Button
                    style={{ height: 40 }}
                    onClick={() => {
                      setSelectedPath(localStorage.getItem('quality_icon') || '');
                      setSelectPathVisible(true);
                    }}
                  >
                    选择系统图标
                  </Button>
                )}
              </div>
            </Form.Item>
          ) : null}
          <Form.Item
            name="quality_name"
            label="系统名称"
            initialValue={paramData?.quality_name || paramData?.name}
            rules={[{ required: false, message: '系统名称' }]}
          >
            <Input placeholder="系统名称" />
          </Form.Item>
          <Form.Item
            name="ipUrl"
            label="服务端地址"
            rules={[{ required: false, message: '服务端地址' }]}
          >
            {isVision ? (
              <Input
                placeholder="localhost:8866"
                onBlur={(e) => localStorage.setItem('ipUrl-realtime', e.target.value)}
              />
            ) : (
              <Fragment>
                {(ipUrlList || [])?.map?.((ip: any, index: number) => {
                  const { name, value, edit } = ip;
                  return (
                    <div className="flex-box ipList-item" key={`ipUrl-${index}`}>
                      <Input
                        defaultValue={name}
                        disabled={!edit}
                        onBlur={(e) => updateIpUrl(index, 'name', e.target.value)}
                      />
                      <Input
                        defaultValue={value}
                        disabled={!edit}
                        onBlur={(e) => updateIpUrl(index, 'value', e.target.value)}
                      />
                      <Button
                        icon={<EditOutlined />}
                        className="del-btn"
                        onClick={() => updateIpUrl(index, 'edit', !edit)}
                      />
                      <Button
                        icon={<DeleteOutlined />}
                        disabled={ipUrlList?.length === 1}
                        className="del-btn"
                        onClick={() => {
                          setIpUrlList((prev: any) =>
                            prev.filter((i: any, iIndex: number) => iIndex !== index),
                          );
                        }}
                      />
                    </div>
                  );
                })}
                <Button
                  type="primary"
                  onClick={() => {
                    setIpUrlList((prev: any) => prev.concat({ name: '', value: '', edit: true }));
                  }}
                >
                  添加服务地址
                </Button>
              </Fragment>
            )}
          </Form.Item>
          <Form.Item
            name="ipUrl-history"
            label="历史记录地址"
            initialValue={localStorage.getItem('ipUrl-history') || undefined}
            rules={[{ required: false, message: '历史记录服务端地址' }]}
          >
            <Input
              placeholder="localhost:8867"
              onBlur={(e) => localStorage.setItem('ipUrl-history', e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="ipString"
            label="方案ID绑定"
            initialValue={localStorage.getItem('ipString') || undefined}
            rules={[{ required: false, message: '方案ID绑定' }]}
          >
            {isVision ? (
              <Input placeholder="方案ID" />
            ) : (
              <Select
                style={{ width: '100%' }}
                size="large"
                allowClear
                showSearch
                optionFilterProp="label"
                options={projectListStore}
                placeholder="方案ID"
                onChange={(e, option: any) => {
                  const { value, realIp } = option;
                  localStorage.setItem('ipUrl-realtime', realIp);
                  localStorage.setItem('ipString', value);
                  window.location.reload();
                }}
              />
            )}
          </Form.Item>
          <Row>
            <Col span={8} className="flex-box ant-form-item">
              <div className="ant-col ant-form-item-label">
                <label title="配置布局">配置布局</label>
              </div>
              <Button
                icon={<FormOutlined />}
                type="primary"
                onClick={() => {
                  let hash = '';
                  if (location.href?.indexOf('?') > -1) {
                    hash = location.href.split('?')[1];
                  }
                  location.href = `${location.href?.split('#/')?.[0]}#/home/edit${!!hash ? `?${hash}` : ''
                    }`;
                  window.location.reload();
                }}
              >
                前往配置
              </Button>
            </Col>
            {/* <Col span={8}>
              <Form.Item
                name="selfStart"
                label="开机自启动"
                tooltip="开启软件后，自动检测链接状态，并启动"
                valuePropName="checked"
                rules={[{ required: false, message: "开机自启动" }]}
              >
                <Switch />
              </Form.Item>
            </Col> */}
            {/* <Col span={8}>
              <Form.Item
                name="errorSelfStart"
                label="异常自动重启"
                tooltip="运行发生报错时，自动重启服务。"
                valuePropName="checked"
                rules={[{ required: false, message: "异常自动重启" }]}
              >
                <Switch />
              </Form.Item>
            </Col> */}
          </Row>
          <Form.Item
            name="filterWarning"
            label="过滤warning"
            tooltip="不显示warning告警提示，只有阻断性报错才展示"
            valuePropName="checked"
            initialValue={paramsData?.filterWarning}
            rules={[{ required: false, message: "过滤warning" }]}
          >
            <Switch />
          </Form.Item>
          {!isVision && !_.isEmpty(treeData) && !!treeData?.length ? (
            <Form.Item
              name="params"
              label="参数项管理"
              rules={[{ required: false, message: '参数项管理' }]}
            >
              <Tree
                checkable
                defaultExpandedKeys={['parent_001']}
                showLine={true}
                // @ts-ignore
                onCheck={(checkedKeysValue: any) => {
                  onCheck(_.pull(checkedKeysValue, 'parent_001'));
                }}
                checkedKeys={checkedKeys}
                treeData={treeData}
              />
            </Form.Item>
          ) : null}
        </Form>
      </div>
      <div className="footer flex-box">
        <Button type="primary" onClick={() => onFinish()}>
          保存
        </Button>
      </div>

      {selectPathVisible ? (
        <FileManager
          data={{ value: selectedPath }}
          onOk={(val: any) => {
            const { value } = val;
            setFieldsValue({ quality_icon: value });
            setSelectPathVisible(false);
            setSelectedPath('');
          }}
          onCancel={() => {
            setSelectPathVisible(false);
            setSelectedPath('');
          }}
        />
      ) : null}
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  projectStatus: themeStore.projectStatus,
  projectListStore: themeStore.projectList,
}))(Setting);

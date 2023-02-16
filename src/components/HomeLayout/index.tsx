import { getAllProject, getListStatusService } from "@/services/api";
import { Badge, Form, message, Modal, Select, Tabs } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as _ from 'lodash';
import styles from "./index.module.less";
import { connect } from "umi";

const HomeLayout: React.FC<any> = (props) => {
  const { children, initialState, dispatch } = props;
  const { params = {} } = initialState;
  const { quality_name, name, id } = params;
  const timerRef = useRef<any>();
  const [form] = Form.useForm();
  const { validateFields } = form;
  const [activeKey, setActiveKey] = useState('1');
  const [items, setItems] = useState<any>([]);
  const [list, setList] = useState<any>([]);
  const [projectList, setProjectList] = useState([]);
  const [addItemsVisible, setAddItemsVisible] = useState(false);

  const isVision = useMemo(() => {
    // @ts-ignore
    return window.QUALITY_CCD_CONFIG.type === 'vision';
  }, []);
  // 获取方案列表
  useEffect(() => {
    if (isVision) return;
    getAllProject().then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        const result = (res?.data || []).map((item: any) => {
          const { name, id } = item;
          return {
            value: id,
            label: name,
          };
        });
        setProjectList(result);
      } else {
        message.error(res?.msg || res?.message || '接口异常');
      }
    });

    return () => {
      !!timerRef.current && clearInterval(timerRef.current);
    }
  }, []);
  // 已添加的标签的IDS
  const ids = useMemo(() => {
    return items.map((item: any) => item.key);
  }, [items]);
  // 启动循环列表状态
  useEffect(() => {
    if (isVision) return;
    loopGetStatus(projectList);
    !!timerRef.current && clearInterval(timerRef.current);
    if (projectList.length) {
      timerRef.current = setInterval(() => {
        loopGetStatus(projectList);
      }, 2500)
    }
  }, [projectList]);
  // 循环获取任务列表状态
  const loopGetStatus = (list: any) => {
    getListStatusService().then((res: any) => {
      if (!!res && res.code === 'SUCCESS') {
        const result = list.map((item: any) => {
          const { value } = item;
          return {
            ...item,
            running: _.isObject(res?.data) && !_.isEmpty(res?.data[value]),
            disabled: ids.includes(value),
          };
        })
        setList(result);
        dispatch({
          type: 'themeStore/statusAction',
          payload: result
        });
      } else {
        message.error(res?.message || '接口异常');
        setList(list);
      }
    });
  };
  // 进来默认加载标签页
  useEffect(() => {
    if (!!localStorage.getItem('ipList')) {
      try {
        const data = JSON.parse(localStorage.getItem('ipList') || "[]").map((item: any) => {
          if (item.key === id) {
            return Object.assign({}, item, {
              name: quality_name || name,
              label: list.filter((i: any) => i.value === id)[0]?.running ?
                <div className="flex-box" style={{ gap: 8 }}>
                  <Badge color={'green'} />
                  {quality_name || name}
                </div>
                :
                (quality_name || name),
            });
          }
          const alias = !!item.name ? item.name : item.label;
          return {
            ...item,
            name: alias,
            label: list.filter((i: any) => i.value === item.key)[0]?.running ?
              <div className="flex-box" style={{ gap: 8 }}>
                <Badge color={'green'} />
                {alias}
              </div>
              :
              alias,
          };
        });
        setItems(data);
      } catch (err) { }
      setActiveKey(localStorage.getItem('ipString') || '');
    } else {
      const list = [
        { label: quality_name || name, name: quality_name || name, children: null, key: id },
      ];
      setItems(list);
      setActiveKey(id);
      localStorage.setItem('ipList', JSON.stringify(list));
    }
  }, [localStorage.getItem('ipString'), list]);
  // 点击不同标签页
  const onChange = (newActiveKey: string) => {
    localStorage.setItem('ipString', newActiveKey);
    window.location.reload();
  };
  // 添加tabs
  const add = () => {
    validateFields().then(values => {
      const { value } = values;
      const { label, key } = value;
      const newActiveKey = key + '';
      const newPanes = [...items];
      newPanes.push({ label: label, children: null, key: newActiveKey });
      localStorage.setItem('ipString', newActiveKey);
      localStorage.setItem('ipList', JSON.stringify(newPanes));
      window.location.reload();
    });
  };
  // 删除tabs
  const remove = (targetKey: any) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item: any, i: any) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item: any) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex]?.key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    localStorage.setItem('ipString', newActiveKey);
    localStorage.setItem('ipList', JSON.stringify(newPanes));
    window.location.reload();
  };
  // 编辑tabs的统一入口
  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (action === 'add') {
      setAddItemsVisible(true);
    } else {
      remove(targetKey);
    }
  };
  // 关闭添加弹框
  const onCancel = () => {
    form.resetFields();
    setAddItemsVisible(false);
  };

  return (
    <div className={styles.reportWrap}>
      <div className="box flex-box">
        {/* <Tabs
          type="editable-card"
          onChange={onChange}
          activeKey={activeKey}
          onEdit={onEdit}
          items={items}
        /> */}
        <div className="content-box">
          {children}
        </div>
      </div>
      {
        addItemsVisible ?
          <Modal
            title={`添加方案窗口`}
            wrapClassName="history-window-modal"
            centered
            width="50vw"
            open={addItemsVisible}
            // maskClosable={false}
            onOk={() => add()}
            onCancel={() => onCancel()}
            getContainer={false}
            destroyOnClose={true}
          >
            <Form form={form} scrollToFirstError>
              <Form.Item
                name={'value'}
                label="绑定方案"
                rules={[{ required: true, message: '绑定方案' }]}
              >
                <Select
                  style={{ width: '100%' }}
                  size="large"
                  labelInValue
                  options={list}
                  placeholder="方案ID"
                />
              </Form.Item>

            </Form>
          </Modal>
          : null
      }
    </div>
  );
};

export default connect((state: any) => {
  return {};
})(HomeLayout);

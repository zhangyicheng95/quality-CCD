import { getAllProject } from "@/services/api";
import { Form, message, Modal, Select, Tabs } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./index.module.less";

const HomeLayout: React.FC<any> = (props) => {
  const { children, initialState } = props;
  const { params = {} } = initialState;
  const { quality_name, name, id } = params;
  const [form] = Form.useForm();
  const { validateFields } = form;
  const [activeKey, setActiveKey] = useState('1');
  const [items, setItems] = useState<any>([]);
  const [list, setList] = useState([]);
  const [addItemsVisible, setAddItemsVisible] = useState(false);
  // 获取方案列表
  useEffect(() => {
    if (!addItemsVisible) return;
    getAllProject().then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        setList(() => (res?.data || []).map((item: any) => {
          const { name, id } = item;
          return {
            value: id,
            label: name,
            disabled: ids.includes(id),
          };
        }));
      } else {
        message.error(res?.msg || res?.message || '接口异常');
      }
    });
  }, [addItemsVisible]);
  // 进来默认加载标签页
  useEffect(() => {
    if (!!localStorage.getItem('ipList')) {
      try {
        const data = JSON.parse(localStorage.getItem('ipList') || "[]").map((item: any) => {
          if (item.key === id) {
            return Object.assign({}, item, { label: quality_name || name });
          }
          return item;
        });
        setItems(data);
      } catch (err) { }
      setActiveKey(localStorage.getItem('ipString') || '');
    } else {
      const list = [
        { label: quality_name || name, children: null, key: id, closable: false },
      ];
      setItems(list);
      setActiveKey(id);
      localStorage.setItem('ipList', JSON.stringify(list));
    }
  }, [localStorage.getItem('ipString')]);
  // 已添加的标签的ID
  const ids = useMemo(() => {
    return items.map((item: any) => item.key);
  }, [items]);
  // 点击不同标签页
  const onChange = (newActiveKey: string) => {
    localStorage.setItem('ipString', newActiveKey);
    window.location.reload();
  };

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
        <Tabs
          type="editable-card"
          onChange={onChange}
          activeKey={activeKey}
          onEdit={onEdit}
          items={items}
        />
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

export default HomeLayout;

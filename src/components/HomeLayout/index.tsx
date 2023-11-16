import { getAllProject, getListStatusService, login } from "@/services/api";
import { Button, Form, Input, message, Modal, } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as _ from 'lodash';
import styles from "./index.module.less";
import { connect } from "umi";
import { useHistory } from "react-router";
import { cryptoEncryption, getLoginTime, getUserData } from "@/utils/utils";
import { useReloadAfterStationary } from "@/hooks/useReloadAfterStationary";

const HomeLayout: React.FC<any> = (props) => {
  const { children, initialState = {}, setInitialState, dispatch } = props;
  const { location: historyLocation } = useHistory();
  const userData = getUserData();
  const { params = {} } = initialState;
  const { name, id } = params;
  const [form] = Form.useForm();
  const { validateFields, resetFields } = form;
  const timerRef = useRef<any>();
  const [list, setList] = useState<any>([]);
  const [projectList, setProjectList] = useState([]);
  const [currentLoginStatus, setCurrentLoginStatus] = useState(false);
  const [visiable, setVisiable] = useState(true);
  const [hasInit, setHasInit] = useState(false);

  const isVision = useMemo(() => {
    // @ts-ignore
    return window?.QUALITY_CCD_CONFIG?.type === 'vision';
  }, []);
  // useEffect(() => {
  //   const time = getLoginTime();
  //   const current = new Date().getTime();
  //   if (current - time >= 5 * 60 * 1000) {
  //     setCurrentLoginStatus(false);
  //     setVisiable(true);
  //   } else {
  //     setCurrentLoginStatus(true);
  //     setVisiable(false);
  //   }
  // }, [historyLocation?.pathname]);
  // 获取方案列表
  useEffect(() => {
    if (isVision) return;
    setHasInit(true);
    try {
      const list = JSON.parse(localStorage.getItem("ipUrlList") || JSON.stringify([{ name: '本地服务', value: 'localhost:8866' }]));
      if (!!list.length) {
        loopGetProjects(0, list[0], list);
      } else {
        dispatch({
          type: 'themeStore/projectListAction',
          payload: [{ name: '本地服务', value: 'localhost:8866' }]
        });
      }
    } catch (e) {
      console.log('ipUrlList有问题', e);
      localStorage.removeItem("ipUrlList");
    }

    return () => {
      timerRef.current && clearTimeout(timerRef.current);
      setHasInit(false);
    }
  }, []);
  // 循环获取项目列表
  const loopGetProjects = (index: number, data: any, list: any) => {
    if (index === list?.length || !data?.value) {
      return;
    }
    getAllProject(data.value).then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        const result = (res?.data || []).map((item: any) => {
          const { quality_name, name, id } = item;
          return {
            value: id,
            realIp: data.value,
            label: name,
          };
        });
        setProjectList((prev) => prev.concat(result));
        dispatch({
          type: 'themeStore/projectListAction',
          payload: { label: data.name, options: result }
        });
      } else {
        message.error(res?.msg || res?.message || '接口异常');
      }
      loopGetProjects(index + 1, list[index + 1], list);
    });
  };
  // 启动循环列表状态
  useEffect(() => {
    if (isVision) return;
    if (_.isEmpty(projectList)) return;
    if (projectList.length) {
      loopGetStatus(projectList);
    }
  }, [projectList]);
  // 循环获取任务列表状态
  const loopGetStatus = (list: any) => {
    getListStatusService().then((res: any) => {
      if (!!res && res.code === 'SUCCESS') {
        !!timerRef.current && clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setHasInit((prev: any) => {
            if (prev) {
              loopGetStatus(list);
            };
            return prev;
          });
        }, 2500);
        const result = list.map((item: any) => {
          const { value } = item;
          return {
            ...item,
            running: _.isObject(res?.data) && !_.isEmpty(res?.data[value]),
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
    if (!!params?.contentData?.ipList) {
      try {
        const data = (params?.contentData?.ipList || []).map((item: any) => {
          if (item.key === id) {
            return Object.assign({}, item, {
              name: name,
              label: name,
            });
          }
          const alias = !!item.name ? item.name : item.label;
          return {
            ...item,
            name: alias,
            label: alias,
          };
        });
        setInitialState((preInitialState: any) => ({
          ...preInitialState,
          params: {
            ...params, contentData: {
              ...params?.contentData,
              ipList: data
            }
          }
        }));
      } catch (err) { }
    } else {
      if (!!name) {
        const list = [
          { label: name, name: name, children: null, key: id },
        ];
        setInitialState((preInitialState: any) => ({
          ...preInitialState,
          params: {
            ...params, contentData: {
              ...params?.contentData,
              ipList: list
            }
          }
        }));
      } else {
        setInitialState((preInitialState: any) => ({
          ...preInitialState,
          params: {
            ...params, contentData: {
              ...params?.contentData,
              ipList: []
            }
          }
        }));
      }
    }
  }, []);
  const handleOk = () => {
    validateFields()
      .then((values) => {
        const { password, ...rest } = values;
        login({
          ...rest,
          password: cryptoEncryption(password),
        }).then((res: any) => {
          if (res?.code === 'SUCCESS') {
            localStorage.setItem('userInfo', JSON.stringify(Object.assign({},
              res?.data,
              { loginTime: new Date().getTime() },
            )));
            handleCancel();
            setCurrentLoginStatus(true);
          } else {
            message.error(res?.msg || res?.message || '接口异常');
          }
        });
      });
  };
  const handleCancel = () => {
    setVisiable(false);
    resetFields();
  };
  if (!!userData?.loginTime) {
    // 5分钟无操作，自动注销
    useReloadAfterStationary({}, () => {
      setInitialState((s: any) => ({ ...s, currentUser: undefined }));
      localStorage.removeItem('userInfo');
      let hash = '';
      if (location.href?.indexOf('?') > -1) {
        hash = location.href.split('?')[1];
      }
      location.href = location.href?.split('#/')?.[0] + '#/home' + '?' + hash;
      window.location.reload();
    });
  }

  return (
    <div className={styles.reportWrap}>
      <div className="box flex-box">
        <div className="content-box">
          {/* {
            (["/control", "/setting"].includes(historyLocation?.pathname)) ?
              (
                (!!currentLoginStatus) ? */}
          {children}
          {/* :
                  <div className="mask-body">
                    <Modal
                      title="权限校验"
                      open={visiable}
                      centered
                      onOk={handleOk}
                      onCancel={handleCancel}
                      destroyOnClose
                      maskClosable={false}
                    >
                      <Form
                        form={form}
                        scrollToFirstError
                      >
                        <Form.Item
                          name="userName"
                          label="用户账号"
                          rules={[{ required: true, message: "用户账号" }]}
                        >
                          <Input allowClear placeholder="用户账号" />
                        </Form.Item>
                        <Form.Item
                          name="password"
                          label="用户密码"
                          rules={[{ required: true, message: "用户密码" }]}
                        >
                          <Input.Password visibilityToggle={false} allowClear placeholder="权限密码" />
                        </Form.Item>
                      </Form>
                    </Modal>
                  </div>
              )
              : children
          } */}
        </div>
      </div>
    </div>
  );
};

export default connect((state: any) => {
  return {};
})(HomeLayout);

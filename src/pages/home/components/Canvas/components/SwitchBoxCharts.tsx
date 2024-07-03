import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Badge, Form, message } from 'antd';
import { getFlowStatusService, startFlowService, stopFlowService } from '@/services/api';
import SegmentSwitch from '@/components/SegmentSwitch';
import openNotificationWithIcon from '@/components/openNotificationWithIcon';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const SwitchBoxCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  const {
    dispatch,
    fontSize = 14,
    yName = '',
    timeSelectDefault = [],
    des_column = 1,
    direction = 0,
    modelRotate = false,
  } = data;
  const ipString: any = localStorage.getItem('ipString') || '';
  const [form] = Form.useForm();
  const timeRef = useRef<any>();
  const statusListRef = useRef<any>({});
  const socketRef = useRef<any>({});
  const [localhostLoading, setLocalhostLoading] = useState(false);
  const [loading, setLoading] = useState({});
  const [statusList, setStatusList] = useState<any>({});

  const socketListen = (ip: string, id: string) => {
    socketRef.current[id] = new WebSocket(`ws://${ip}:8866/task-error/${id}`);
    socketRef.current[id].onopen = () => {
      console.log(`开关中的task-error ws:open`);
    };
    socketRef.current[id].onmessage = (msg: any) => {
      try {
        const result = JSON.parse(msg.data);
        const currentData = {
          time: new Date().getTime(),
          ...result,
          level: _.toLower(result.level),
          message: `（机器${ip}） ${
            _.isArray(result?.message) ? result.message.join(',') : result.message
          }`,
        };
        openNotificationWithIcon(currentData);
      } catch (err) {
        // console.log(err);
      }
    };
    socketRef.current[id].onclose = function () {
      console.log(`开关中的task-error ws:close`);
      socketRef.current[id] = null;
    };
  };
  // 轮训查询状态
  const initStatus = (list: any, index: number) => {
    const item = list?.[index];
    if (!!item) {
      const url = `${item?.ip?.indexOf('http') > -1 ? '' : 'http://'}${item?.ip}${
        item?.ip?.indexOf(':') > -1 ? '' : ':8866'
      }`;
      getFlowStatusService(item.projectId, url).then((res) => {
        statusListRef.current = {
          ...statusListRef.current,
          [`${item.ip}_${item.projectId}`]:
            !!res && res.code === 'SUCCESS' && !!Object.keys?.(res?.data || {})?.length,
        };
        setStatusList(statusListRef.current);
        form.setFieldsValue({
          ...statusListRef.current,
          all: Object.values(statusListRef.current)?.includes(true),
        });
        if (res && res.code === 'SUCCESS') {
          if (!socketRef.current?.[item.projectId] && item.projectId !== ipString) {
            socketListen(item?.ip, item?.projectId);
          }
        } else {
          message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
        }
        initStatus(list, index + 1);
      });
    } else {
      setTimeout(() => {
        if (timeRef.current) {
          initStatus(list, 0);
        }
      }, 5000);
    }
  };
  useEffect(() => {
    if (timeSelectDefault.length) {
      statusListRef.current = (timeSelectDefault || [])
        ?.sort((a: any, b: any) => a.sort - b.sort)
        .reduce((pre: any, cen: any) => {
          return {
            ...pre,
            [`${cen.ip}_${cen.projectId}`]: false,
          };
        }, {});
      setLoading(statusListRef.current);
      setStatusList(statusListRef.current);
      timeRef.current = true;
      setTimeout(() => {
        initStatus(timeSelectDefault, 0);
      }, 500);
    }

    return () => {
      timeRef.current = false;
      Object.entries(socketRef.current).forEach((item: any) => {
        item[1]?.close();
      });
    };
  }, [timeSelectDefault]);
  const titleLength = useMemo(() => {
    let length = yName.length;
    (timeSelectDefault || [])
      ?.sort((a: any, b: any) => a.sort - b.sort)
      ?.forEach((item: any) => {
        const { label } = item;
        if (label?.length > length) {
          length = label?.length;
        }
      });
    return length * fontSize + 16;
  }, [timeSelectDefault, fontSize, yName]);
  // 启动任务
  const start = (id: string, ip: string) => {
    const url = `${ip?.indexOf('http') > -1 ? '' : 'http://'}${ip}${
      ip?.indexOf(':') > -1 ? '' : ':8866'
    }`;
    return new Promise((resolve: any, reject: any) => {
      if (!ipString) {
        resolve(false);
      } else {
        setLoading((prev: any) => {
          return {
            ...prev,
            [`${ip}_${id}`]: true,
          };
        });
        startFlowService(id, url).then((res: any) => {
          if (res && res.code === 'SUCCESS') {
            message.success('任务启动成功');
            dispatch({
              type: 'home/set',
              payload: {
                started: true,
              },
            });
            resolve(true);
          } else {
            message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
            resolve(false);
          }
          setLoading((prev: any) => {
            return {
              ...prev,
              [`${ip}_${id}`]: false,
            };
          });
        });
      }
    });
  };
  // 停止任务
  const end = (id: string, ip: string) => {
    const url = `${ip?.indexOf('http') > -1 ? '' : 'http://'}${ip}${
      ip?.indexOf(':') > -1 ? '' : ':8866'
    }`;
    return new Promise((resolve: any, reject: any) => {
      if (!ipString) {
        reject(false);
      } else {
        setLoading((prev: any) => {
          return {
            ...prev,
            [`${ip}_${id}`]: true,
          };
        });
        stopFlowService(id, url).then((res: any) => {
          if (res && res.code === 'SUCCESS') {
            message.success('任务停止成功');
            dispatch({
              type: 'home/set',
              payload: {
                started: false,
              },
            });
            resolve(true);
          } else {
            message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
            resolve(false);
          }
          setLoading((prev: any) => {
            return {
              ...prev,
              [`${ip}_${id}`]: false,
            };
          });
        });
      }
    });
  };
  // 批量启动
  const startList = (list: any, index: number) => {
    const item = list?.[index];
    if (!!item && !!item.projectId) {
      start(item.projectId, item.ip).then((res: any) => {
        statusListRef.current = {
          ...statusListRef.current,
          [`${item.ip}_${item.projectId}`]: !!res,
        };
        form.setFieldsValue({
          [`${item.ip}_${item.projectId}`]: !!res,
        });
        setTimeout(() => {
          setLoading((prev: any) => {
            return {
              ...prev,
              [`${item.ip}_${item.projectId}`]: false,
            };
          });
        }, direction * 1000 || 1000);
        startList(list, index + 1);
      });
    } else {
      setLocalhostLoading(false);
      setLoading((prev: any) =>
        Object.entries(prev)?.reduce((pre: any, cen: any) => {
          return {
            ...pre,
            [cen[0]]: false,
          };
        }, {}),
      );
      setTimeout(() => {
        setStatusList(statusListRef.current);
        form.setFieldsValue({
          ...statusListRef.current,
          all: Object.values(statusListRef.current)?.includes(true),
        });
      }, 200);
    }
  };
  // 批量停止
  const stopList = (list: any, index: number) => {
    const item = list?.[index];
    if (!!item && !!item.projectId) {
      end(item.projectId, item.ip).then((res: any) => {
        statusListRef.current = {
          ...statusListRef.current,
          [`${item.ip}_${item.projectId}`]: !res,
        };
        form.setFieldsValue({
          [`${item.ip}_${item.projectId}`]: false,
        });
        setLoading((prev: any) => {
          return {
            ...prev,
            [`${item.ip}_${item.projectId}`]: false,
          };
        });
        stopList(list, index + 1);
      });
    } else {
      setLocalhostLoading(false);
      setLoading((prev: any) =>
        Object.entries(prev)?.reduce((pre: any, cen: any) => {
          return {
            ...pre,
            [cen[0]]: false,
          };
        }, {}),
      );
      setTimeout(() => {
        setStatusList(statusListRef.current);
        form.setFieldsValue({
          ...statusListRef.current,
          all: Object.values(statusListRef.current)?.includes(true),
        });
      }, 200);
    }
  };

  return (
    <div id={`echart-${id}`} className={`${styles.switchBoxCharts}`} style={{ fontSize }}>
      <Form
        form={form}
        scrollToFirstError
        className={`${des_column > 1 ? 'flex-box' : 'flex-box-column'} switch-box-form`}
        style={des_column > 1 ? { flexWrap: 'wrap' } : {}}
      >
        <div
          className="switch-box-item"
          style={{
            width: `calc(${100 / des_column}% - 4px)`,
            minWidth: `calc(${100 / des_column}% - 4px)`,
            maxWidth: `calc(${100 / des_column}% - 4px)`,
          }}
        >
          {useMemo(() => {
            let values = Object.values(statusList);
            values = values.filter((i: any) => !_.isUndefined(i));
            if (!values.length) {
              values = [false];
            }
            return (
              <Form.Item
                name={`all`}
                label=""
                initialValue={values?.includes(true)}
                style={{ marginBottom: 0 }}
              >
                <SegmentSwitch
                  title={
                    <div
                      style={{ minWidth: titleLength, textAlign: !!modelRotate ? 'left' : 'right' }}
                    >
                      {yName}
                    </div>
                  }
                  fontInBody={[
                    { label: '停止', value: false, backgroundColor: 'grey' },
                    { label: '启动', value: true, backgroundColor: '#88db57' },
                  ]}
                  buttonColor={values?.includes(false) && values?.includes(true) ? '#b8831b' : ''}
                  reverse={!!modelRotate}
                  loading={localhostLoading}
                  onClick={(e: any) => {
                    setLocalhostLoading(true);
                    setLoading((prev: any) =>
                      Object.entries(prev)?.reduce((pre: any, cen: any) => {
                        return {
                          ...pre,
                          [cen[0]]: true,
                        };
                      }, {}),
                    );
                    if (e) {
                      startList(timeSelectDefault, 0);
                    } else {
                      stopList(timeSelectDefault, 0);
                    }
                  }}
                />
              </Form.Item>
            );
          }, [timeSelectDefault, localhostLoading, statusList])}
        </div>
        {useMemo(
          () =>
            (timeSelectDefault || [])
              ?.sort((a: any, b: any) => a.sort - b.sort)
              ?.map((item: any, index: number) => {
                const { label, ip, projectId } = item;
                return (
                  <div
                    className="switch-box-item"
                    style={{
                      width: `calc(${100 / des_column}% - 4px)`,
                      minWidth: `calc(${100 / des_column}% - 4px)`,
                      maxWidth: `calc(${100 / des_column}% - 4px)`,
                    }}
                    key={`switch-box-item-${index}`}
                  >
                    <Form.Item
                      name={`${item.ip}_${item.projectId}`}
                      label=""
                      initialValue={!!statusList?.[`${item.ip}_${item.projectId}`]}
                      style={{ marginBottom: 0 }}
                    >
                      <SegmentSwitch
                        title={
                          <div
                            className={`${!!modelRotate ? 'flex-box' : 'flex-box-justify-end'}`}
                            style={{
                              minWidth: titleLength,
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            {!!statusList?.[`${item.ip}_${item.projectId}`] ? (
                              <Badge color={'green'} />
                            ) : null}
                            {label}
                          </div>
                        }
                        fontInBody={[
                          { label: '停止', value: false, backgroundColor: 'grey' },
                          { label: '启动', value: true, backgroundColor: '#88db57' },
                        ]}
                        reverse={!!modelRotate}
                        loading={loading?.[`${item.ip}_${item.projectId}`]}
                        onClick={(e: any) => {
                          if (e) {
                            start(projectId, ip).then((res) => {
                              setTimeout(() => {
                                setStatusList((prev: any) => {
                                  return {
                                    ...prev,
                                    [`${item.ip}_${item.projectId}`]: !!res,
                                  };
                                });
                                form.setFieldsValue({
                                  all: Object.values(statusListRef.current)?.includes(true),
                                  [`${item.ip}_${item.projectId}`]: !!res,
                                });
                              }, 200);
                            });
                          } else {
                            end(projectId, ip).then((res) => {
                              setTimeout(() => {
                                setStatusList((prev: any) => {
                                  return {
                                    ...prev,
                                    [`${item.ip}_${item.projectId}`]: !res,
                                  };
                                });
                                form.setFieldsValue({
                                  all: Object.values(statusListRef.current)?.includes(true),
                                  [`${item.ip}_${item.projectId}`]: !res,
                                });
                              }, 200);
                            });
                          }
                        }}
                      />
                    </Form.Item>
                  </div>
                );
              }),
          [timeSelectDefault, loading, statusList],
        )}
      </Form>
    </div>
  );
};

export default SwitchBoxCharts;

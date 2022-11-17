import React, { Fragment, useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Spin, notification, Button, message, Modal, Badge, Cascader, Form } from "antd";
import _ from "lodash";
import TBJ from "./components/TBJdom";
import DGH from "./components/DGHdom";
import DPJ from "./components/DPJdom";
import MFD from "./components/MFDdom";
import FC from "./components/FCdom";
import Common from "./components/Commondom";
import { getFlowStatusService, getParams, startFlowService, stopFlowService, touchFlowService, updateParams } from "@/services/api";
import { website } from "@/services/consts";
import moment from "moment";
import GridLayout from "@/components/GridLayout";
import { AndroidOutlined, PauseCircleOutlined, PlayCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { isWeiChai, logColors } from "@/common/constants/globalConstants";
import TooltipDiv from "@/components/TooltipDiv";
import { guid } from "@/utils/utils";

let timer: string | number | NodeJS.Timer | null | undefined = null;
const Home: React.FC<any> = (props: any) => {
  const [form] = Form.useForm();
  const { validateFields, } = form;
  // @ts-ignore
  const { type } = window.QUALITY_CCD_CONFIG;
  const ipString: any = localStorage.getItem('ipString');
  const socketRef = useRef<WebSocket>();
  const socketErrorRef = useRef<WebSocket>();
  const socketLogRef = useRef<WebSocket>();
  const socketStateRef = useRef<WebSocket>();
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [infoData, setInfoData] = useState<any>('');
  const [historyData, setHistoryData] = useState<any>({});
  const [logData, setLogData] = useState<any>([]);
  const [errorData, setErrorData] = useState<Array<any>>([]);
  const [taskDataConnect, setTaskDataConnect] = useState(false);
  const [addWindowVisible, setAddWindowVisible] = useState(false);
  const [editWindowData, setEditWindowData] = useState<any>({});
  const [gridHomeList, setGridHomeList] = useState<any>([]);
  const [gridContentList, setGridContentList] = useState<any>({});
  const [paramData, setParamData] = useState<any>({});
  const [nodeList, setNodeList] = useState<any>([]);

  const gridList: any = [
    <div key={'slider-1'}>
      <div className="btn-box">
        <div className={`common-card-title-box flex-box drag-btn ${started ?
          taskDataConnect ? 'success-message' : 'error-message'
          : ''
          }`}>
          当前状态：{
            started ?
              taskDataConnect ?
                <Badge status="processing" className="status-icon" text={"服务已连接"} /> :
                <Badge status="error" className="status-icon" text={"socket未连接"} />
              :
              loading ? '启动中' : '未启动'
          }
        </div>
        <Button
          className="flex-box btn"
          icon={<PlusCircleOutlined className="btn-icon" />}
          type="text"
          onClick={() => setAddWindowVisible(true)}
          disabled={!paramData.id}
        >添加窗口</Button>
        {
          isWeiChai ? null :
            <Fragment>
              <Button
                className="flex-box btn"
                icon={<PlayCircleOutlined className="btn-icon" />}
                type="link"
                onClick={() => start()}
                disabled={started}
                loading={!started && loading}
              >启动检测</Button>
              <Button
                className="flex-box btn"
                danger
                icon={<PauseCircleOutlined className="btn-icon" />}
                type="text"
                onClick={() => end()}
                disabled={!started}
                loading={started && loading}
              >停止检测</Button>
              {
                process.env.NODE_ENV === 'development' ?
                  <Button
                    className="flex-box btn"
                    icon={<AndroidOutlined className="btn-icon" />}
                    type="link"
                    onClick={() => touchFlowService()}
                    disabled={!started}
                    loading={started && loading}
                  >自助触发</Button>
                  : null
              }
            </Fragment>
        }
      </div>
    </div>,
    <div key={'slider-2'}>
      <div className="info-box">
        <div className="common-card-title-box drag-btn">
          基本信息
        </div>
        <div className="info-box-content">
          {
            <TooltipDiv title={infoData} className="info-item">
              订单号：{infoData}
            </TooltipDiv>
          }
          {/* {
            Object.entries({ orderId: 'xxxxxxxxx-xxx' }).map((item: any, index: number) => {
              return <TooltipDiv title={item[1]} className="info-item" key={item[0]}>
                订单号：{item[1]}
              </TooltipDiv>
            })
          } */}
        </div>
      </div>
    </div>,
    <div key={'slider-3'}>
      <div className="info-box message-box">
        <div className="common-card-title-box drag-btn success-message">
          实时信息
        </div>
        <div className="info-box-content">
          {/* {
            Object.entries(historyData).map((item: any, index: number) => {
              return <div className="message-item" key={index} onClick={() => {
                // setHistoryImg(item[1]);
                // setHistoryImgTitle(item[0]);
              }}>
                {item[0]}
              </div>
            })
          } */}
        </div>
      </div>
    </div>,
    <div key={'content'}>
      <Spin spinning={loading}>
        <div className="home-content flex-box">
          {
            !_.isEmpty(gridContentList) && !_.isEmpty(paramData) ?
              type === 'tbj' ?
                <TBJ />
                :
                type === 'dgh' ?
                  <DGH />
                  :
                  type === 'dpj' ?
                    <DPJ />
                    :
                    type === 'mfd' ?
                      <MFD />
                      :
                      type === 'fc' ?
                        <FC />
                        :
                        <Common
                          gridContentList={gridContentList}
                          setGridContentList={setGridContentList}
                          paramData={paramData}
                          setParamData={setParamData}
                          setEditWindowData={setEditWindowData}
                          setAddWindowVisible={setAddWindowVisible}
                        />
              : null
          }
        </div>
        <div className="drag-btn" />
      </Spin>
    </div>,
    <div key={'footer-1'}>
      <div className="log-content">
        <div className="common-card-title-box drag-btn warning-message">
          日志信息
        </div>
        <div
          className="content-item-span"
          dangerouslySetInnerHTML={{
            __html: logData.map((i: any) => i.data).join(`<br/><br/>`),
          }}
        />
      </div>
    </div>,
    <div key={'footer-2'}>
      <div className="log-content">
        <div className="common-card-title-box drag-btn error-message">
          错误信息
        </div>
        <div className="content-item-span">
          {/* <BasicScrollBar data={errorData}> */}
          {
            errorData.map((log: any, index: number) => {
              const { level, node_name, nid, message, time } = log;
              return (
                <div className="log-item flex-box-start" key={index}>
                  <div className="log-item-content">
                    <div className="content-item">
                      <span>{moment(time).format('YYYY-MM-DD HH:mm:ss')}&nbsp;</span>
                      &nbsp;
                      <div
                        className="content-item-span"
                        style={{
                          color:
                            level === 'warning'
                              ? logColors.warning
                              : level === 'error'
                                ? logColors.error
                                : logColors.critical,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: `节点${node_name || ''}（${nid || ''}）发生错误：${message}`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          }
          {/* </BasicScrollBar> */}
        </div>
      </div>
    </div>,
  ];
  const getServiceStatus = () => {
    getFlowStatusService(ipString).then((res: any) => {
      if (!!res && _.isObject(res) && !_.isEmpty(res)) {
        setStarted(true);
      } else {
        setStarted(false);
      }
      setLoading(false);
    })
  };
  useEffect(() => {
    if (!localStorage.getItem("ipUrl-history") || !ipString) return;
    getParams(localStorage.getItem("ipString") || '').then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        const { data = {} } = res;
        const { flowData, contentData = {} } = data;
        const { nodes } = flowData;
        setParamData(data);
        setNodeList(() => nodes.map((node: any) => {
          const { name, alias, id, ports } = node;
          return {
            value: id,
            label: `${alias || name} - ${id}`,
            children: (ports?.items || []).map((port: any) => {
              const { group, label = {} } = port;
              const { name, alias } = label;
              const value = alias || name;
              if (group === 'bottom') {
                return {
                  value: value,
                  label: value,
                  disabled: contentData.content[id]?.value[1] === value,
                }
              }
              return null;
            }).filter(Boolean),
          }
        }));
        setGridHomeList(contentData.home || [
          { i: "slider-1", x: 0, y: 0, w: 2, h: 6, minW: 2, maxW: 4, minH: isWeiChai ? 2 : 4, maxH: 30 },
          { i: "slider-2", x: 0, y: 4, w: 2, h: 9, minW: 2, maxW: 4, minH: 4, maxH: 30 },
          { i: "slider-3", x: 0, y: 8, w: 2, h: 15, minW: 2, maxW: 4, minH: 4, maxH: 30 },
          { i: "content", x: 2, y: 0, w: 10, h: 24, minW: 6, maxW: 12, minH: 4, maxH: 30 },
          { i: "footer-1", x: 2, y: 24, w: 7, h: 6, minW: 2, maxW: 10, minH: 4, maxH: 30 },
          { i: "footer-2", x: 9, y: 24, w: 3, h: 6, minW: 2, maxW: 10, minH: 4, maxH: 30 }
        ]);
        setGridContentList(contentData.content || {});
      } else {
        message.error(res?.msg || '接口异常');
      }
    });
  }, []);
  useEffect(() => {
    if (isWeiChai) {
      setLoading(false);
      setStarted(true);
      return;
    }
    if (!ipString) return;
    getServiceStatus();
    timer = setInterval(() => {
      getServiceStatus()
    }, 5000);

    return () => {
      timer && clearInterval(timer);
    }
  }, []);
  const start = () => {
    if (!ipString) return;
    setLoading(true);
    startFlowService(ipString || '').then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        message.success('任务启动成功');
        setStarted(true);
      } else {
        message.error(res?.msg || '接口异常');
      }
      setLoading(false);
    });
  };
  const end = () => {
    if (!ipString) return;
    setLoading(true);
    stopFlowService(ipString || '').then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        message.success('任务停止成功');
        setStarted(false);
      } else {
        message.error(res?.msg || '接口异常');
      }
      setLoading(false);
    })
  };
  // task-data
  let timeConnect = 0;
  function webSocketInit(service: string) {
    socketRef.current = new WebSocket(service);
    socketRef.current.onopen = function () {
      console.log("data ws:open");
      setTaskDataConnect(true);
      socketRef.current && socketRef.current?.send("PING");
    };
    socketRef.current.onmessage = function (res) {
      try {
        const result = JSON.parse(res.data);
        const { uid = "", orderId = "", data = {} } = result;
        if (uid) {
          const newData = (Object.entries(data || {}) || []).reduce(
            (pre: any, cen: any) => {
              return {
                uid,
                ...pre,
                // ...rest,
                [_.toLower(cen[0]?.split("@")[0])]: _.isBoolean(cen[1])
                  ? cen[1]
                    ? "RUNNING"
                    : "STOPPED"
                  : cen[1],
              };
            }, {}
          );
          console.log("data ws:message:", newData);
          if (isWeiChai) {
            setInfoData((preInfo: any) => {
              if (preInfo === orderId) {
                setGridContentList((prev: any) => {
                  return Object.entries(prev).reduce((pre: any, cen: any) => {
                    return Object.assign({}, pre, cen[0] === newData.uid ? {
                      [cen[0]]: Object.assign({}, cen[1], newData)
                    } : { [cen[0]]: cen[1] })
                  }, {});
                });
              } else {
                setGridContentList({});
              }
              return orderId;
            });
          } else {
            setGridContentList((prev: any) => {
              return Object.entries(prev).reduce((pre: any, cen: any) => {
                return Object.assign({}, pre, cen[0] === newData.uid ? {
                  [cen[0]]: Object.assign({}, cen[1], newData)
                } : { [cen[0]]: cen[1] })
              }, {});
            });
          }
          const imgData = Object.entries(newData).filter((res: any) => {
            return _.isString(res[1]) ? res[1].indexOf("http") > -1 : false;
          });
          if (imgData[0] && imgData[0][1]) {
            setHistoryData((prev: any) => {
              return Object.assign({}, prev, {
                [`${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')} ${uid}`]: imgData[0][1]
              });
            });
          }
        }
      } catch (err) {

      }
    };
    socketRef.current.onclose = function () {
      console.log("data ws:close");
      socketRef.current = undefined;
    };
    socketRef.current.onerror = function (err) {
      console.log("data ws:error:", err);
      setTaskDataConnect(false);
      reconnect(service);
    };
  };
  // 重连
  function reconnect(service: string) {
    timeConnect++;
    console.log(`第${timeConnect}次重连`);
    // 进行重连
    setTimeout(() => {
      webSocketInit(service);
    }, 10000);
  };
  // task-error
  let timeErrorConnect = 0;
  function errorWebSocketInit(service: string) {
    socketErrorRef.current = new WebSocket(service);
    socketErrorRef.current.onopen = function () {
      console.log("error ws:open");
      socketErrorRef.current && socketErrorRef.current.send("PING");
    };
    socketErrorRef.current.onmessage = function (res) {
      try {
        const result = JSON.parse(res.data);
        const currentData = {
          time: new Date().getTime(),
          ...result,
          level: _.toLower(result.level),
          message: _.isArray(result?.message)
            ? result.message.join(",")
            : result.message,
        };
        // console.log('error ws:', currentData)
        setErrorData((prev) => prev.concat(currentData));
        if (errorData.length > 5) {
          notification.destroy();
        }
        openNotificationWithIcon({
          type: result?.level,
          title:
            result?.level === "ERROR"
              ? "错误"
              : result?.level === "CRITICAL"
                ? "阻断挂起"
                : "告警",
          content: (
            <div>
              <p style={{ marginBottom: 8 }}>
                错误节点：{`${result?.node_name || ""}（${result?.nid || ""}）`}
              </p>
              <p style={{ marginBottom: 0 }}>
                错误信息：{currentData?.message || ""}
              </p>
            </div>
          ),
        });
      } catch (err) {
        // console.log(err);
      }
    };
    socketErrorRef.current.onclose = function () {
      console.log("error ws:close");
    };
    socketErrorRef.current.onerror = function (err) {
      console.log("ws:error:", err);
      errorReconnect(service);
    };
  };
  // 重连
  function errorReconnect(service: string) {
    timeErrorConnect++;
    console.log(`第${timeErrorConnect}次重连`);
    // 进行重连
    setTimeout(() => {
      errorWebSocketInit(service);
    }, 10000);
  };
  // task-log
  let timeLogConnect = 0;
  function logWebSocketInit(service: string) {
    socketLogRef.current = new WebSocket(service);
    socketLogRef.current.onopen = function () {
      console.log("log ws:open");
    };
    socketLogRef.current.onmessage = function (res) {
      try {
        setLogData((prev: any) => prev.concat(res))
      } catch (err) {

      }
    };
    socketLogRef.current.onclose = function () {
      console.log("log ws:close");
      socketLogRef.current = undefined;
    };
    socketLogRef.current.onerror = function (err) {
      logReconnect(service);
    };
  };
  // 重连
  function logReconnect(service: string) {
    timeLogConnect++;
    console.log(`第${timeLogConnect}次重连`);
    // 进行重连
    setTimeout(() => {
      logWebSocketInit(service);
    }, 2000);

  };
  const onclose = () => {
    socketRef.current && socketRef.current.close();
    socketErrorRef.current && socketErrorRef.current.close();
    socketLogRef.current && socketLogRef.current.close();
    socketStateRef.current && socketStateRef.current.close();
  };
  useEffect(() => {
    if (started && ipString) {
      logWebSocketInit(`${website.socket}task-log/${ipString}?tail=1&n=1`)
      errorWebSocketInit(`${website.socket}task-error/${ipString}`);
      webSocketInit(`${website.socket}task-data/${ipString}`);
    } else {
      onclose()
    }

    return () => {
      onclose();
    };
  }, [started]);

  useEffect(() => {
    if (!_.isEmpty(paramData)) {
      updateParams({
        id: paramData.id,
        data: Object.assign({}, paramData, !!paramData.contentData ? {
          contentData: Object.assign({}, paramData.contentData, !!paramData.contentData.content ? {
            content: Object.entries(paramData.contentData.content).reduce((pre: any, cen: any) => {
              return Object.assign({}, pre, {
                [cen[0]]: {
                  value: cen[1].value,
                  size: cen[1].size,
                }
              });
            }, {}),
          } : {}),
        } : {}),
      }).then((res: any) => {
        if (res && res.code === 'SUCCESS') {

        } else {
          message.error(res?.msg || '接口异常');
        }
      });
    }
  }, [paramData]);

  useEffect(() => {
    if (nodeList.length && !_.isEmpty(gridContentList)) {
      setNodeList((prev: any) => prev.map((item: any) => {
        const { value, children } = item;
        return Object.assign({}, item, {
          children: children.map((child: any) => {
            return Object.assign({}, child, { disabled: !!gridContentList[value] && child.value === gridContentList[value].value[1] });
          }),
        });
        return item;
      }));
    }
  }, [gridContentList]);

  return (
    <div className={`${styles.home} flex-box`}>
      {
        !_.isEmpty(gridHomeList) ?
          <GridLayout
            dragName={'.drag-btn'}
            list={gridList}
            layout={gridHomeList}
            onChange={(data: any) => {
              setGridHomeList(data);
              if (paramData.id) {
                const params = Object.assign({}, paramData, { contentData: Object.assign({}, paramData.contentData, { home: data }) });
                setParamData(params);
              }
            }}
          />
          : null
      }

      {
        addWindowVisible ?
          <Modal
            title={`${_.isEmpty(editWindowData) ? '添加' : '编辑'}监控窗口`}
            wrapClassName="history-window-modal"
            centered
            width="50vw"
            open={addWindowVisible}
            // maskClosable={false}
            onOk={() => {
              validateFields()
                .then((values) => {
                  values = Object.entries(values).reduce((pre: any, cen: any) => {
                    return Object.assign({}, pre, {
                      [cen[0].split('-')[0]]: cen[1]
                    });
                  }, {});
                  const { windowSelect } = values;
                  const id = windowSelect[0];
                  let result = {};
                  if (_.isEmpty(editWindowData)) {
                    result = Object.assign({}, gridContentList, {
                      [id]: {
                        value: windowSelect,
                        size: { i: id, x: 0, y: 0, w: 3, h: 3, minW: 2, maxW: 10, minH: 4, maxH: 32 },
                      }
                    });
                  } else {
                    result = Object.assign({}, _.omit(gridContentList, editWindowData.value[0]), {
                      [id]: {
                        value: windowSelect,
                        size: Object.assign({}, editWindowData.size, { i: id, }),
                      }
                    });
                  }
                  console.log(result)
                  if (paramData.id) {
                    const params = Object.assign({}, paramData, { contentData: Object.assign({}, paramData.contentData, { content: result }) });
                    setParamData(params);
                  }
                  form.resetFields();
                  setEditWindowData({});
                  setGridContentList(result);
                  setAddWindowVisible(false);
                })
                .catch((err) => {
                  const { errorFields } = err;
                  _.isArray(errorFields) && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
                });
            }}
            onCancel={() => {
              form.resetFields();
              setEditWindowData({});
              setAddWindowVisible(false);
            }}
            getContainer={false}
            destroyOnClose={true}
          >
            <Form
              form={form}
              scrollToFirstError
            >
              <Form.Item
                name={`windowSelect-${guid()}`}
                label="绑定节点"
                rules={[{ required: false, message: "绑定节点" }]}
                initialValue={editWindowData.value}
              >
                <Cascader
                  style={{ width: '100%' }}
                  options={nodeList}
                // expandTrigger="hover"
                />
              </Form.Item>
            </Form>
          </Modal>
          : null
      }
    </div>
  );
};

export default Home;

// 告警提示框
const openNotificationWithIcon = (item: any) => {
  const { type = "", title = "", content = "" } = item;
  notification[type === "WARNING" ? "warning" : "error"]({
    message: title,
    description: content,
    duration: 6, //type === "CRITICAL" ? null : 5, // 自动关闭时间，null表示不关闭
  });
};

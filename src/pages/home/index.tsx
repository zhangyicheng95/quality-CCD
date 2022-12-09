import React, { Fragment, useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Spin, notification, Button, message, Modal, Badge, Cascader, Form, Popover, Menu, Tooltip } from "antd";
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
import { AndroidOutlined, CloseCircleOutlined, LoadingOutlined, PauseCircleOutlined, PlayCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { logColors, systemType } from "@/common/constants/globalConstants";
import TooltipDiv from "@/components/TooltipDiv";
import { guid } from "@/utils/utils";

let timer: string | number | NodeJS.Timer | null | undefined = null;
let updateTimer: string | number | NodeJS.Timer | null | undefined = null;
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
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState<any>({});
  const [activeTab, setActiveTab] = useState<any>('1');
  const [logData, setLogData] = useState<any>([]);
  const [footerData, setFooterData] = useState<any>([]);
  const [errorData, setErrorData] = useState<Array<any>>([]);
  const [taskDataConnect, setTaskDataConnect] = useState(false);
  const [addWindowVisible, setAddWindowVisible] = useState(false);
  const [editWindowData, setEditWindowData] = useState<any>({});
  const [gridHomeList, setGridHomeList] = useState<any>([]);
  const [gridContentList, setGridContentList] = useState<any>({});
  const [gridCanEdit, setGridCanEdit] = useState(true);
  const [paramData, setParamData] = useState<any>({});
  const [nodeList, setNodeList] = useState<any>([]);

  const gridList: any = [
    <div key={'slider-1'}>
      <div className="btn-box background-ubv">
        <div className={`common-card-title-box flex-box drag-btn ${started ?
          taskDataConnect ? 'success-message' : 'error-message'
          : ''
          }`}>
          <div className="flex-box common-card-title">
            当前状态：{
              started ?
                taskDataConnect ?
                  <Tooltip title={'服务已连接'} placement={"bottom"}>
                    <Badge status="processing" className="status-icon" />
                  </Tooltip> :
                  <Tooltip title={'socket未连接'} placement={"bottom"}>
                    <Badge status="error" className="status-icon" />
                  </Tooltip>
                :
                loading ?
                  <Tooltip title={'启动中'} placement={"bottom"}>
                    <LoadingOutlined style={{ fontSize: 15 }} />
                  </Tooltip>
                  :
                  <Tooltip title={'未启动'} placement={"bottom"}>
                    <Badge status="default" className="status-icon" />
                  </Tooltip>
            }
          </div>
        </div>
        <Button
          className="flex-box btn"
          icon={started ? <div style={{ height: 30, width: 30, marginRight: 8 }}>
            <div className="k-loader" />
          </div> : <PlayCircleOutlined className="btn-icon" />}
          type="link"
          onClick={() => start()}
          disabled={started}
          loading={!started && loading}
        >{started ? '检测中' : '启动检测'}</Button>
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
          (paramData.id) ?
            <Popover placement="right" title={'配置窗口'} trigger="click" content={<Menu items={[
              { label: `${gridCanEdit ? '锁定' : '解锁'}布局`, key: 'clock', disabled: false, onClick: () => setGridCanEdit(prev => !prev) },
              { label: '添加监控窗口', key: 'add', onClick: () => setAddWindowVisible(true) },
              {
                label: '显示首页窗口',
                key: 'home-content',
                children: [
                  {
                    label: '显示基本信息', key: 'slider-2',
                    disabled: gridHomeList[1]?.w !== 0,
                    onClick: () => setGridHomeList((prev: any) => {
                      let data = [].concat(prev);
                      data[1] = Object.assign({}, data[1], {
                        w: 2, h: 4, minW: 2, minH: 4,
                      });
                      return data;
                    }),
                  },
                  {
                    label: '显示实时信息', key: 'slider-3',
                    disabled: gridHomeList[2]?.w !== 0,
                    onClick: () => setGridHomeList((prev: any) => {
                      let data = [].concat(prev);
                      data[2] = Object.assign({}, data[2], {
                        w: 2, h: 4, minW: 2, minH: 4,
                      });
                      return data;
                    }),
                  },
                  {
                    label: '显示日志信息', key: 'footer-1',
                    disabled: gridHomeList[4]?.w !== 0,
                    onClick: () => setGridHomeList((prev: any) => {
                      let data = [].concat(prev);
                      data[4] = Object.assign({}, data[4], {
                        w: 7, h: 4, minW: 2, minH: 4,
                      });
                      return data;
                    }),
                  },
                  {
                    label: '显示错误信息', key: 'footer-2',
                    disabled: gridHomeList[5]?.w !== 0,
                    onClick: () => setGridHomeList((prev: any) => {
                      let data = [].concat(prev);
                      data[5] = Object.assign({}, data[5], {
                        w: 3, h: 4, minW: 2, minH: 4,
                      });
                      return data;
                    }),
                  },
                  {
                    label: '显示节点状态信息', key: 'footer-2',
                    disabled: gridHomeList[6]?.w !== 0,
                    onClick: () => setGridHomeList((prev: any) => {
                      let data = [].concat(prev);
                      data[6] = Object.assign({}, data[6], {
                        y: 12, w: 12, h: 2, minW: 2, minH: 2,
                      });
                      return data;
                    }),
                  },
                ],
              },
            ]}>
            </Menu>}>
              <Button
                className="flex-box btn"
                icon={<PlusCircleOutlined className="btn-icon" />}
                type="text"
              >配置窗口</Button>
            </Popover>
            :
            <Button
              className="flex-box btn"
              icon={<PlusCircleOutlined className="btn-icon" />}
              type="text"
              disabled={true}
            >配置窗口</Button>
        }
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
      </div>
    </div>,
    <div key={'slider-2'}>
      <div className="info-box background-ubv">
        <div className="common-card-title-box flex-box drag-btn">
          <div className="flex-box common-card-title">
            基本信息
          </div>
          <CloseCircleOutlined className="common-card-title-icon" onClick={() => {
            setGridHomeList((prev: any) => {
              let data = [].concat(prev);
              data[1] = Object.assign({}, data[1], {
                w: 0, h: 0, minW: 0, minH: 0
              });
              return data;
            });
          }} />
        </div>
        <div className="info-box-content">
          <div className="info-item">
            <span>产线信息：</span>{paramData?.commonInfo?.productionInfo}
          </div>
          <div className="info-item">
            <span>工位信息：</span>{paramData?.commonInfo?.stationInfo}
          </div>
          <div className="info-item">
            <span>功能信息：</span>{paramData?.commonInfo?.useInfo}
          </div>
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
      <div className="info-box message-box background-ubv">
        <div className="common-card-title-box flex-box drag-btn success-message">
          <div className="flex-box common-card-title">
            实时信息
          </div>
          <CloseCircleOutlined className="common-card-title-icon" onClick={() => {
            setGridHomeList((prev: any) => {
              let data = [].concat(prev);
              data[2] = Object.assign({}, data[2], {
                w: 0, h: 0, minW: 0, minH: 0
              });
              return data;
            });
          }} />
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
        <div className="home-content flex-box background-ubv">
          {
            !_.isEmpty(paramData) ?
              type === 'tbj' ?
                <TBJ
                  gridContentList={gridContentList}
                  setGridContentList={setGridContentList}
                  paramData={paramData}
                  setParamData={setParamData}
                  setEditWindowData={setEditWindowData}
                  setAddWindowVisible={setAddWindowVisible}
                  edit={gridCanEdit}
                  setActiveTab={setActiveTab}
                />
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
                          edit={gridCanEdit}
                        />
              : null
          }
        </div>
        <div className="drag-btn" />
      </Spin>
    </div>,
    <div key={'footer-1'}>
      <div className="log-content background-ubv">
        <div className="common-card-title-box flex-box drag-btn warning-message">
          <div className="flex-box common-card-title">
            日志信息
          </div>
          <CloseCircleOutlined className="common-card-title-icon" onClick={() => {
            setGridHomeList((prev: any) => {
              let data = [].concat(prev);
              data[4] = Object.assign({}, data[4], {
                w: 0, h: 0, minW: 0, minH: 0
              });
              return data;
            });
          }} />
        </div>
        <div
          className="content-item-span"
          dangerouslySetInnerHTML={{
            __html: (logData.slice(logData.length - 50)).map((i: any) => i.data).join(`<br/><br/>`),
          }}
        />
      </div>
    </div>,
    <div key={'footer-2'}>
      <div className="log-content background-ubv">
        <div className="common-card-title-box flex-box drag-btn error-message">
          <div className="flex-box common-card-title">
            错误信息
          </div>
          <CloseCircleOutlined className="common-card-title-icon" onClick={() => {
            setGridHomeList((prev: any) => {
              let data = [].concat(prev);
              data[5] = Object.assign({}, data[5], {
                w: 0, h: 0, minW: 0, minH: 0
              });
              return data;
            });
          }} />
        </div>
        <div className="content-item-span">
          {/* <BasicScrollBar data={errorData}> */}
          {
            errorData.slice(errorData.length - 50).map((log: any, index: number) => {
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
    // <div key={'footer-3'}>
    //   <div className="log-content background-ubv">
    //     <div className={`common-card-title-box flex-box drag-btn ${started ? 'success-message' : ''}`}>
    //       <div className="flex-box common-card-title">
    //         节点状态信息
    //       </div>
    //       <CloseCircleOutlined className="common-card-title-icon" onClick={() => {
    //         setGridHomeList((prev: any) => {
    //           let data = [].concat(prev);
    //           data[6] = Object.assign({}, data[6], {
    //             w: 0, h: 0, minW: 0, minH: 0
    //           });
    //           return data;
    //         });
    //       }} />
    //     </div>
    //     <div className="flex-box footer-scroll">
    //       {
    //         Object.entries(footerData).map((item: any, index: number) => {
    //           const { Status } = item[1];
    //           return <div className={`footer-item-box ${Status === 'running' ? 'success' : 'error'}`} key={`footer-3-${index}`}>
    //             {
    //               `${!!gridContentList[item[0]] && gridContentList[item[0]]?.nid ||
    //               item[0] ||
    //               "未知节点"
    //               }（${_.toUpper(item[1].Status)}）`
    //             }
    //           </div>
    //         })
    //       }
    //     </div>
    //   </div>
    // </div >
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
    if (!ipString) return;
    getParams(ipString || '').then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        const { data = {} } = res;
        const { flowData, contentData = {} } = data;
        const { nodes } = flowData;
        setParamData(data);
        setNodeList(() => nodes.map((node: any) => {
          const { name, alias, id, ports } = node;
          return {
            value: id,
            label: `${alias || name}`,
            children: (ports?.items || []).map((port: any) => {
              const { group, label = {} } = port;
              const { name, alias } = label;
              const value = alias || name;
              if (group === 'bottom') {
                return {
                  value: value,
                  label: value,
                  disabled: !_.isEmpty(contentData) && !!contentData?.content && contentData?.content[id]?.value[1] === value,
                }
              }
              return null;
            }).filter(Boolean),
          }
        }));
        setGridHomeList(!!contentData?.home ? contentData?.home : [
          { i: "slider-1", x: 0, y: 0, w: 2, h: 6, minW: 2, maxW: 4, minH: 4, maxH: 30 },
          { i: "slider-2", x: 0, y: 4, w: 2, h: 9, minW: 2, maxW: 4, minH: 4, maxH: 30 },
          { i: "slider-3", x: 0, y: 8, w: 2, h: 15, minW: 2, maxW: 4, minH: 4, maxH: 30 },
          { i: "content", x: 2, y: 0, w: 10, h: 24, minW: 6, maxW: 12, minH: 4, maxH: 30 },
          { i: "footer-1", x: 2, y: 24, w: 7, h: 6, minW: 2, maxW: 10, minH: 4, maxH: 30 },
          { i: "footer-2", x: 9, y: 24, w: 3, h: 6, minW: 2, maxW: 10, minH: 4, maxH: 30 }
        ]);
        setGridContentList(!!contentData?.content ? contentData?.content : {});
      } else {
        message.error(res?.msg || '接口异常');
      }
    });
  }, []);
  useEffect(() => {
    if (!ipString) return;
    setLoading(true);
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
    timer && clearInterval(timer);
    setLoading(true);
    stopFlowService(ipString || '').then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        message.success('任务停止成功');
        setStarted(false);
      } else {
        message.error(res?.msg || '接口异常');
      }
      setLoading(false);
      timer = setInterval(() => {
        getServiceStatus()
      }, 5000);
    })
  };
  // task-data
  let timeConnect = 0;
  function webSocketInit(service: string) {
    socketRef.current = new WebSocket(service);
    socketRef.current.onopen = function () {
      console.log("data ws:open");
      stateWebSocketInit(`${website.socket}task-state/${ipString}`);
      setTaskDataConnect(true);
      socketRef.current && socketRef.current?.send("PING");
    };
    socketRef.current.onmessage = function (res) {
      try {
        const result = JSON.parse(res.data);
        const { uid = "", orderId = "", data = {}, ...rest } = result;
        if (uid) {
          const newData = (Object.entries(data || {}) || []).reduce(
            (pre: any, cen: any) => {
              return {
                uid,
                ...pre,
                ...rest,
                [_.toLower(cen[0]?.split("@")[0])]: _.isBoolean(cen[1])
                  ? cen[1]
                    ? "RUNNING"
                    : "STOPPED"
                  : cen[1],
              };
            }, {}
          );
          setGridContentList((prev: any) => {
            return Object.entries(prev).reduce((pre: any, cen: any) => {
              return Object.assign({}, pre, cen[0] === newData.uid ? {
                [cen[0]]: Object.assign({}, cen[1], newData)
              } : { [cen[0]]: cen[1] })
            }, {});
          });
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
  //task-state
  function stateWebSocketInit(service: string) {
    //获取节点状态
    socketStateRef.current = new WebSocket(service);
    socketStateRef.current.onopen = function () {
      console.log("state ws:open");
    };
    socketStateRef.current.onmessage = function (stateRes) {
      try {
        const result = JSON.parse(stateRes.data);
        setFooterData(result);
      } catch (err) {
        // console.log(err);
      }
    };
    socketStateRef.current.onclose = function () {
      console.log("state ws:close");
      socketStateRef.current = undefined;
      // reconnect(service);
    };
  }
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
    if (!_.isEmpty(paramData) && !!paramData.id) {
      updateTimer && clearTimeout(updateTimer);
      updateTimer = setTimeout(() => {
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
      }, 500);
    }
  }, [paramData]);

  useEffect(() => {
    if (nodeList.length) {
      setNodeList((prev: any) => prev.map((item: any) => {
        const { value, children } = item;
        return Object.assign({}, item, {
          children: children.map((child: any) => {
            return Object.assign({}, child, {
              disabled: !_.isEmpty(gridContentList) && !!gridContentList[value] && gridContentList[value]?.type === systemType && child.value === gridContentList[value].value[1]
            });
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
            edit={gridCanEdit}
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
                        size: { i: id, x: 0, y: 0, w: 3, h: 3, minW: 2, maxW: 12, minH: 2, maxH: 32 },
                        type: systemType,
                        tab: activeTab,
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

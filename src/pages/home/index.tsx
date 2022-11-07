import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Spin, notification, Button, message, DatePicker } from "antd";
import _ from "lodash";
import TBJ from "./components/TBJdom";
import DGH from "./components/DGHdom";
import DPJ from "./components/DPJdom";
import MFD from "./components/MFDdom";
import FC from "./components/FCdom";
import Common from "./components/Commondom";
import { getFlowStatusService, startFlowService, stopFlowService, touchFlowService } from "@/services/api";
import { website } from "@/services/consts";
import moment from "moment";
import GridLayout from "@/components/GridLayout";
import { AndroidOutlined, PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { guid } from "@/utils/utils";
import { logColors } from "@/common/constants/globalConstants";
import BasicScrollBar from "@/components/BasicScrollBar";
import TooltipDiv from "@/components/TooltipDiv";

const id = 'HomelayoutArr';
const Home: React.FC<any> = (props: any) => {
  // @ts-ignore
  const { type } = window.QUALITY_CCD_CONFIG;
  const ipString: any = localStorage.getItem('ipString');
  const socketRef = useRef<WebSocket>();
  const socketErrorRef = useRef<WebSocket>();
  const socketLogRef = useRef<WebSocket>();
  const socketStateRef = useRef<WebSocket>();
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Array<any>>([]);
  const [historyData, setHistoryData] = useState<any>({});
  const [logData, setLogData] = useState<any>([]);
  const [errorData, setErrorData] = useState<Array<any>>([]);
  const [footerData, setFooterData] = useState<any>({});
  const [taskDataConnect, setTaskDataConnect] = useState(false);

  const gridList: any = [
    <div key={'slider-1'}>
      <div className="btn-box">
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
      </div>
    </div>,
    <div key={'slider-2'}>
      <div className="info-box">
        <div className="common-card-title-box drag-btn">
          基本信息
        </div>
        <div className="info-box-content">
          {
            Object.entries({ orderId: 'xxxxxxxxx-xxx' }).map((item: any, index: number) => {
              return <TooltipDiv title={item[1]} className="info-item" key={item[0]}>
                订单号：{item[1]}
              </TooltipDiv>
            })
          }
        </div>
      </div>
    </div>,
    <div key={'slider-3'}>
      <div className="info-box message-box">
        <div className="common-card-title-box drag-btn">
          实时信息
        </div>
        <div className="info-box-content">
          {
            [{}, {}, {}, {}].map((item: any, index: number) => {
              return <div className="message-item" key={index} onClick={() => {
                console.log(item)
              }}>
                {moment(new Date().getTime()).format('MM-DD HH:mm:ss')}
              </div>
            })
          }
        </div>
      </div>
    </div>,
    <div key={'content'}>
      <Spin spinning={loading}>
        <div className="home-content flex-box">
          {
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
                        data={data}
                      />
          }
        </div>
        <div className="drag-btn" />
      </Spin>
    </div>,
    <div key={'footer-1'}>
      <div className="log-content">
        <div className="common-card-title-box drag-btn">
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
        <div className="common-card-title-box drag-btn">
          错误信息
        </div>
        <div className="content-item-span">
          <BasicScrollBar data={errorData}>
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
          </BasicScrollBar>
        </div>
      </div>
    </div>,
  ];
  const layout: any = !!localStorage.getItem(id) ? JSON.parse(localStorage.getItem(id) || "") : [
    { i: "slider-1", x: 0, y: 0, w: 2, h: 6, minW: 2, maxW: 4, minH: 4, maxH: 30 },
    { i: "slider-2", x: 0, y: 4, w: 2, h: 9, minW: 2, maxW: 4, minH: 4, maxH: 30 },
    { i: "slider-3", x: 0, y: 8, w: 2, h: 15, minW: 2, maxW: 4, minH: 4, maxH: 30 },
    { i: "content", x: 2, y: 0, w: 10, h: 24, minW: 6, maxW: 12, minH: 4, maxH: 30 },
    { i: "footer-1", x: 2, y: 10, w: 7, h: 6, minW: 2, maxW: 10, minH: 4, maxH: 30 },
    { i: "footer-2", x: 7, y: 10, w: 3, h: 6, minW: 2, maxW: 10, minH: 4, maxH: 30 }
  ];

  useEffect(() => {
    if (!ipString) return;
    getFlowStatusService(ipString).then((res: any) => {
      if (!!res && _.isObject(res) && !_.isEmpty(res)) {
        setStarted(true);
      } else {
        setStarted(false)
      }
      setLoading(false);
    })
  }, []);
  const start = () => {
    if (!localStorage.getItem('ipString')) return;
    setLoading(true);
    startFlowService(localStorage.getItem('ipString') || '').then((res: any) => {
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
    if (!localStorage.getItem('ipString')) return;
    setLoading(true);
    stopFlowService(localStorage.getItem('ipString') || '').then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        message.success('任务停止成功');
        setStarted(false);
      } else {
        message.error(res?.msg || '接口异常');
      }
      setLoading(false);
    })
  }
  // task-data
  let timeConnect = 0;
  function webSocketInit(service: string) {
    // stateWebSocketInit(`${website.socket}task-state/${ipString}`);
    // let timer: any = null;
    socketRef.current = new WebSocket(service);
    socketRef.current.onopen = function () {
      console.log("data ws:open");
      setTaskDataConnect(true);
      // timer = setInterval(() => {
      socketRef.current && socketRef.current?.send("PING");
      // }, 500);
    };
    socketRef.current.onmessage = function (res) {
      try {
        const result = JSON.parse(res.data);
        const { uid = "", data = {}, ...rest } = result;
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
          // console.log("data ws:message:", newData);
          setData((prev: any) => {
            if (prev.filter((i: any) => i.uid === newData.uid).length) {
              return prev.map((item: any) => {
                if (item.uid === newData.uid) {
                  return Object.assign({}, item, newData);
                }
                return item;
              })
            }
            return prev.concat(newData)
          });
          const imgData = Object.entries(newData).filter((res: any) => {
            return _.isString(res[1]) ? res[1].indexOf("http") > -1 : false;
          });
          if (imgData[0]) {
            setHistoryData((prev: any) => {
              return Object.assign({}, prev, {
                [`${uid} ${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}`]: imgData[0]
              });
            });
          }
        }
      } catch (err) {

      }
    };
    socketRef.current.onclose = function () {
      console.log("data ws:close");
      // timer && clearInterval(timer);
      // timer = null;
      socketRef.current = undefined;
      // reconnect(service);
    };
    socketRef.current.onerror = function (err) {
      console.log("data ws:error:", err);
      setTaskDataConnect(false);
      reconnect(service);
    };
  }
  // 重连
  function reconnect(service: string) {
    timeConnect++;
    console.log(`第${timeConnect}次重连`);
    // 进行重连
    setTimeout(() => {
      webSocketInit(service);
    }, 10000);
  }
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
  }
  // 重连
  function errorReconnect(service: string) {
    timeErrorConnect++;
    console.log(`第${timeErrorConnect}次重连`);
    // 进行重连
    setTimeout(() => {
      errorWebSocketInit(service);
    }, 10000);
  }
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
  }
  // 重连
  function logReconnect(service: string) {
    timeLogConnect++;
    console.log(`第${timeLogConnect}次重连`);
    // 进行重连
    setTimeout(() => {
      logWebSocketInit(service);
    }, 2000);

  }
  const onclose = () => {
    socketRef.current && socketRef.current.close();
    socketErrorRef.current && socketErrorRef.current.close();
    socketLogRef.current && socketLogRef.current.close();
    socketStateRef.current && socketStateRef.current.close();
  }
  useEffect(() => {
    if (started) {
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

  return (
    <div className={`${styles.home} flex-box`}>
      <GridLayout id={id} dragName={'.drag-btn'} list={gridList} layout={layout} />
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

import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import {
  Spin,
  notification,
  Button,
  message,
  Modal,
  Badge,
  Cascader,
  Form,
  Popover,
  Menu,
  Tooltip,
} from 'antd';
import _ from 'lodash';
import TBJ from './components/TBJdom';
import DGH from './components/DGHdom';
import DPJ from './components/DPJdom';
import MFD from './components/MFDdom';
import FC from './components/FCdom';
import Common from './components/Commondom';
import {
  getFlowStatusService,
  getParams,
  startFlowService,
  stopFlowService,
  touchFlowService,
  updateParams,
} from '@/services/api';
import GridLayout from '@/components/GridLayout';
import {
  AndroidOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { systemType } from '@/common/constants/globalConstants';
import { guid } from '@/utils/utils';
import { connect } from 'umi';
let i = 0,
  j = 0,
  k = 0;

let timer: string | number | NodeJS.Timer | null | undefined = null;
let updateTimer: string | number | NodeJS.Timer | null | undefined = null;
const Home: React.FC<any> = (props: any) => {
  const { logStr, historyData, gridContentList, footerData, errorData } = props.snapshot;
  console.log('home', ++i);
  const [form] = Form.useForm();
  const { validateFields } = form;
  // @ts-ignore
  const { type } = window.QUALITY_CCD_CONFIG;
  const ipString: any = localStorage.getItem('ipString') || '';
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<any>('1');
  const [taskDataConnect, setTaskDataConnect] = useState(false);
  const [addWindowVisible, setAddWindowVisible] = useState(false);
  const [editWindowData, setEditWindowData] = useState<any>({});
  const [gridHomeList, setGridHomeList] = useState<any>([]);
  const [gridCanEdit, setGridCanEdit] = useState(true);
  const [paramData, setParamData] = useState<any>({});
  const [nodeList, setNodeList] = useState<any>([]);

  const gridList: any = [
    <div key={'slider-1'}>
      <div className="btn-box background-ubv">
        <div
          className={`common-card-title-box flex-box drag-btn ${
            started ? (taskDataConnect ? 'success-message' : 'error-message') : ''
          }`}
        >
          <div className="flex-box common-card-title">
            当前状态：
            {started ? (
              taskDataConnect ? (
                <Tooltip title={'服务已连接'} placement={'bottom'}>
                  <Badge status="processing" className="status-icon" />
                </Tooltip>
              ) : (
                <Tooltip title={'socket未连接'} placement={'bottom'}>
                  <Badge status="error" className="status-icon" />
                </Tooltip>
              )
            ) : loading ? (
              <Tooltip title={'启动中'} placement={'bottom'}>
                <LoadingOutlined style={{ fontSize: 15 }} />
              </Tooltip>
            ) : (
              <Tooltip title={'未启动'} placement={'bottom'}>
                <Badge status="default" className="status-icon" />
              </Tooltip>
            )}
          </div>
        </div>
        <Button
          className="flex-box btn"
          icon={
            started ? (
              <div style={{ height: 30, width: 30, marginRight: 8 }}>
                <div className="k-loader" />
              </div>
            ) : (
              <PlayCircleOutlined className="btn-icon" />
            )
          }
          type="link"
          onClick={() => start()}
          disabled={started}
          loading={!started && loading}
        >
          {started ? '检测中' : '启动检测'}
        </Button>
        <Button
          className="flex-box btn"
          danger
          icon={<PauseCircleOutlined className="btn-icon" />}
          type="text"
          onClick={() => end()}
          disabled={!started}
          loading={started && loading}
        >
          停止检测
        </Button>
        {paramData.id ? (
          <Popover
            placement="right"
            title={'配置窗口'}
            trigger="click"
            content={
              <Menu
                items={[
                  {
                    label: `${gridCanEdit ? '锁定' : '解锁'}布局`,
                    key: 'clock',
                    disabled: false,
                    onClick: () => setGridCanEdit((prev) => !prev),
                  },
                  { label: '添加监控窗口', key: 'add', onClick: () => setAddWindowVisible(true) },
                  {
                    label: '显示首页窗口',
                    key: 'home-content',
                    children: [
                      {
                        label: '显示基本信息',
                        key: 'slider-2',
                        disabled: gridHomeList[1]?.w !== 0,
                        onClick: () =>
                          setGridHomeList((prev: any) => {
                            let data = [].concat(prev);
                            data[1] = Object.assign({}, data[1], {
                              w: 2,
                              h: 4,
                              minW: 2,
                              minH: 4,
                            });
                            return data;
                          }),
                      },
                      {
                        label: '显示实时信息',
                        key: 'slider-3',
                        disabled: gridHomeList[2]?.w !== 0,
                        onClick: () =>
                          setGridHomeList((prev: any) => {
                            let data = [].concat(prev);
                            data[2] = Object.assign({}, data[2], {
                              w: 2,
                              h: 4,
                              minW: 2,
                              minH: 4,
                            });
                            return data;
                          }),
                      },
                      {
                        label: '显示日志信息',
                        key: 'footer-1',
                        disabled: gridHomeList[4]?.w !== 0,
                        onClick: () =>
                          setGridHomeList((prev: any) => {
                            let data = [].concat(prev);
                            data[4] = Object.assign({}, data[4], {
                              w: 7,
                              h: 4,
                              minW: 2,
                              minH: 4,
                            });
                            return data;
                          }),
                      },
                      {
                        label: '显示错误信息',
                        key: 'footer-2',
                        disabled: gridHomeList[5]?.w !== 0,
                        onClick: () =>
                          setGridHomeList((prev: any) => {
                            let data = [].concat(prev);
                            data[5] = Object.assign({}, data[5], {
                              w: 3,
                              h: 4,
                              minW: 2,
                              minH: 4,
                            });
                            return data;
                          }),
                      },
                      {
                        label: '显示节点状态信息',
                        key: 'footer-2',
                        disabled: gridHomeList[6]?.w !== 0,
                        onClick: () =>
                          setGridHomeList((prev: any) => {
                            let data = [].concat(prev);
                            data[6] = Object.assign({}, data[6], {
                              y: 12,
                              w: 12,
                              h: 2,
                              minW: 2,
                              minH: 2,
                            });
                            return data;
                          }),
                      },
                    ],
                  },
                ]}
              ></Menu>
            }
          >
            <Button
              className="flex-box btn"
              icon={<PlusCircleOutlined className="btn-icon" />}
              type="text"
            >
              配置窗口
            </Button>
          </Popover>
        ) : (
          <Button
            className="flex-box btn"
            icon={<PlusCircleOutlined className="btn-icon" />}
            type="text"
            disabled={true}
          >
            配置窗口
          </Button>
        )}
        {process.env.NODE_ENV === 'development' ? (
          <Button
            className="flex-box btn"
            icon={<AndroidOutlined className="btn-icon" />}
            type="link"
            onClick={() => setInterval(() => touchFlowService(), 1000)}
            disabled={!started}
            loading={started && loading}
          >
            自助触发
          </Button>
        ) : null}
      </div>
    </div>,
    <div key={'slider-2'}>
      <div className="info-box background-ubv">
        <div className="common-card-title-box flex-box drag-btn">
          <div className="flex-box common-card-title">基本信息</div>
          <CloseCircleOutlined
            className="common-card-title-icon"
            onClick={() => {
              setGridHomeList((prev: any) => {
                let data = [].concat(prev);
                data[1] = Object.assign({}, data[1], {
                  w: 0,
                  h: 0,
                  minW: 0,
                  minH: 0,
                });
                return data;
              });
            }}
          />
        </div>
        <div className="info-box-content">
          <div className="info-item">
            <span>产线信息：</span>
            {paramData?.commonInfo?.productionInfo}
          </div>
          <div className="info-item">
            <span>工位信息：</span>
            {paramData?.commonInfo?.stationInfo}
          </div>
          <div className="info-item">
            <span>功能信息：</span>
            {paramData?.commonInfo?.useInfo}
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
          <div className="flex-box common-card-title">实时信息</div>
          <CloseCircleOutlined
            className="common-card-title-icon"
            onClick={() => {
              setGridHomeList((prev: any) => {
                let data = [].concat(prev);
                data[2] = Object.assign({}, data[2], {
                  w: 0,
                  h: 0,
                  minW: 0,
                  minH: 0,
                });
                return data;
              });
            }}
          />
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
          {!_.isEmpty(paramData) ? (
            type === 'tbj' ? (
              <TBJ
                gridContentList={gridContentList}
                // setGridContentList={setGridContentList}
                paramData={paramData}
                setParamData={setParamData}
                setEditWindowData={setEditWindowData}
                setAddWindowVisible={setAddWindowVisible}
                edit={gridCanEdit}
                setActiveTab={setActiveTab}
              />
            ) : type === 'dgh' ? (
              <DGH />
            ) : type === 'dpj' ? (
              <DPJ />
            ) : type === 'mfd' ? (
              <MFD />
            ) : type === 'fc' ? (
              <FC />
            ) : (
              <Common
                gridContentList={gridContentList}
                // setGridContentList={setGridContentList}
                paramData={paramData}
                setParamData={setParamData}
                setEditWindowData={setEditWindowData}
                setAddWindowVisible={setAddWindowVisible}
                edit={gridCanEdit}
              />
            )
          ) : null}
        </div>
        <div className="drag-btn" />
      </Spin>
    </div>,
    <div key={'footer-1'}>
      <div className="log-content background-ubv">
        <div className="common-card-title-box flex-box drag-btn warning-message">
          <div className="flex-box common-card-title">日志信息</div>
          <CloseCircleOutlined
            className="common-card-title-icon"
            onClick={() => {
              setGridHomeList((prev: any) => {
                let data = [].concat(prev);
                data[4] = Object.assign({}, data[4], {
                  w: 0,
                  h: 0,
                  minW: 0,
                  minH: 0,
                });
                return data;
              });
            }}
          />
        </div>
        <div
          className="content-item-span"
          dangerouslySetInnerHTML={{
            __html: logStr,
          }}
        />
      </div>
    </div>,
    <div key={'footer-2'}>
      <div className="log-content background-ubv">
        <div className="common-card-title-box flex-box drag-btn error-message">
          <div className="flex-box common-card-title">错误信息</div>
          <CloseCircleOutlined
            className="common-card-title-icon"
            onClick={() => {
              setGridHomeList((prev: any) => {
                let data = [].concat(prev);
                data[5] = Object.assign({}, data[5], {
                  w: 0,
                  h: 0,
                  minW: 0,
                  minH: 0,
                });
                return data;
              });
            }}
          />
        </div>
        <div className="content-item-span">
          {/* <BasicScrollBar data={errorData}> */}
          {errorData.map((log: any, index: number) => {
            const { level, color, node_name, nid, message, time } = log;
            return (
              <div className="log-item flex-box-start" key={index}>
                <div className="log-item-content">
                  <div className="content-item">
                    <span>{time}&nbsp;</span>
                    &nbsp;
                    <div
                      className="content-item-span"
                      style={{ color }}
                      dangerouslySetInnerHTML={{
                        __html: `节点${node_name || ''}（${nid || ''}）发生错误：${message}`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {/* </BasicScrollBar> */}
        </div>
      </div>
    </div>,
    <div key={'footer-3'}>
      <div className="log-content background-ubv">
        <div
          className={`common-card-title-box flex-box drag-btn ${started ? 'success-message' : ''}`}
        >
          <div className="flex-box common-card-title">节点状态信息</div>
          <CloseCircleOutlined
            className="common-card-title-icon"
            onClick={() => {
              setGridHomeList((prev: any) => {
                let data = [].concat(prev);
                data[6] = Object.assign({}, data[6], {
                  w: 0,
                  h: 0,
                  minW: 0,
                  minH: 0,
                });
                return data;
              });
            }}
          />
        </div>
        <div className="flex-box footer-scroll">
          {Object.entries(footerData).map((item: any, index: number) => {
            const { Status } = item[1];
            return (
              <div
                className={`footer-item-box ${Status === 'running' ? 'success' : 'error'}`}
                key={`footer-3-${index}`}
              >
                {`${
                  (!!gridContentList[item[0]] && gridContentList[item[0]]?.nid) ||
                  item[0] ||
                  '未知节点'
                }（${_.toUpper(item[1].Status)}）`}
              </div>
            );
          })}
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
    });
  };
  useEffect(() => {
    if (!ipString) return;
    getParams(ipString || '').then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        const { data = {} } = res;
        const { flowData, contentData = {} } = data;
        const { nodes } = flowData;
        setParamData(data);
        setNodeList(() =>
          nodes.map((node: any) => {
            const { name, alias, id, ports } = node;
            return {
              value: id,
              label: `${alias || name}`,
              children: (ports?.items || [])
                .map((port: any) => {
                  const { group, label = {} } = port;
                  const { name, alias } = label;
                  const value = alias || name;
                  if (group === 'bottom') {
                    return {
                      value: value,
                      label: value,
                      disabled:
                        !_.isEmpty(contentData) &&
                        !!contentData?.content &&
                        contentData?.content[id]?.value[1] === value,
                    };
                  }
                  return null;
                })
                .filter(Boolean),
            };
          }),
        );
        setGridHomeList(
          !!contentData?.home
            ? contentData?.home
            : [
                { i: 'slider-1', x: 0, y: 0, w: 2, h: 6, minW: 2, maxW: 4, minH: 4, maxH: 30 },
                { i: 'slider-2', x: 0, y: 4, w: 2, h: 9, minW: 2, maxW: 4, minH: 4, maxH: 30 },
                { i: 'slider-3', x: 0, y: 8, w: 2, h: 15, minW: 2, maxW: 4, minH: 4, maxH: 30 },
                { i: 'content', x: 2, y: 0, w: 10, h: 24, minW: 6, maxW: 12, minH: 4, maxH: 30 },
                { i: 'footer-1', x: 2, y: 24, w: 7, h: 6, minW: 2, maxW: 10, minH: 4, maxH: 30 },
                { i: 'footer-2', x: 9, y: 24, w: 3, h: 6, minW: 2, maxW: 10, minH: 4, maxH: 30 },
              ],
        );
        props.dispatch({
          type: 'home/set',
          payload: {
            gridContentList: contentData?.content || {},
          },
        });
        // setGridContentList(!!contentData?.content ? contentData?.content : {});
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
      getServiceStatus();
    }, 5000);

    return () => {
      timer && clearInterval(timer);
    };
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
        getServiceStatus();
      }, 5000);
    });
  };

  // const onclose = () => {
  //   socketRef.current && socketRef.current.close();
  //   socketErrorRef.current && socketErrorRef.current.close();
  //   socketLogRef.current && socketLogRef.current.close();
  //   socketStateRef.current && socketStateRef.current.close();
  // };
  // useEffect(() => {
  //   if (started && ipString) {
  //     // errorWebSocketInit(`${website.socket}task-error/${ipString}`);
  //   } else {
  //     onclose();
  //   }

  //   return () => {
  //     onclose();
  //   };
  // }, [started]);

  useEffect(() => {
    if (!_.isEmpty(paramData) && !!paramData.id) {
      updateTimer && clearTimeout(updateTimer);
      updateTimer = setTimeout(() => {
        updateParams({
          id: paramData.id,
          data: Object.assign(
            {},
            paramData,
            !!paramData.contentData
              ? {
                  contentData: Object.assign(
                    {},
                    paramData.contentData,
                    !!paramData.contentData.content
                      ? {
                          content: Object.entries(paramData.contentData.content).reduce(
                            (pre: any, cen: any) => {
                              return Object.assign({}, pre, {
                                [cen[0]]: {
                                  value: cen[1].value,
                                  size: cen[1].size,
                                },
                              });
                            },
                            {},
                          ),
                        }
                      : {},
                  ),
                }
              : {},
          ),
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
      // TODO: 这里也应该丢dva里去
      setNodeList((prev: any) =>
        prev.map((item: any) => {
          const { value, children } = item;
          return Object.assign({}, item, {
            children: children.map((child: any) => {
              return Object.assign({}, child, {
                disabled:
                  !_.isEmpty(gridContentList) &&
                  !!gridContentList[value] &&
                  gridContentList[value]?.type === systemType &&
                  child.value === gridContentList[value].value[1],
              });
            }),
          });
          return item;
        }),
      );
    }
  }, [gridContentList]);

  return (
    <div className={`${styles.home} flex-box`}>
      {!_.isEmpty(gridHomeList) ? (
        <GridLayout
          dragName={'.drag-btn'}
          edit={gridCanEdit}
          list={gridList}
          layout={gridHomeList}
          onChange={(data: any) => {
            setGridHomeList(data);
            if (paramData.id) {
              const params = Object.assign({}, paramData, {
                contentData: Object.assign({}, paramData.contentData, { home: data }),
              });
              setParamData(params);
            }
          }}
        />
      ) : null}

      {addWindowVisible ? (
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
                    [cen[0].split('-')[0]]: cen[1],
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
                    },
                  });
                } else {
                  result = Object.assign({}, _.omit(gridContentList, editWindowData.value[0]), {
                    [id]: {
                      value: windowSelect,
                      size: Object.assign({}, editWindowData.size, { i: id }),
                    },
                  });
                }
                console.log(result);
                if (paramData.id) {
                  const params = Object.assign({}, paramData, {
                    contentData: Object.assign({}, paramData.contentData, { content: result }),
                  });
                  setParamData(params);
                }
                form.resetFields();
                setEditWindowData({});
                props.dispatch({
                  type: 'home/set',
                  payload: {
                    gridContentList: result,
                  },
                });
                // setGridContentList(result);
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
          <Form form={form} scrollToFirstError>
            <Form.Item
              name={`windowSelect-${guid()}`}
              label="绑定节点"
              rules={[{ required: false, message: '绑定节点' }]}
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
      ) : null}
    </div>
  );
};

// export default Home;

Home.displayName = 'Home';

export default connect(({ home }) => ({
  snapshot: home.snapshot || {},
}))(Home);

// 告警提示框

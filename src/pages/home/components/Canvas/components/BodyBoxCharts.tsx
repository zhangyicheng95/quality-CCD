import React, { useEffect, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { connect } from 'umi';
import { PauseCircleOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import BasicButton from '@/components/BasicButton';
import { message } from 'antd';
import { startFlowService, stopFlowService } from '@/services/api';
import icon1 from '@/assets/liguang/timeLook.svg';
import icon2 from '@/assets/liguang/defectDetail.svg';
import icon3 from '@/assets/liguang/formulaManagement.svg';

interface Props {
  data: any;
  id: any;
}

const BodyBoxCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, started } = props;
  let { dispatch, timeSelectDefault, fontSize, yName = 0, iconSize, fetchParams = 0 } = data;
  const ipString: any = localStorage.getItem('ipString') || '';
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState();

  useEffect(() => {
    const select = timeSelectDefault?.filter(
      (i: any) => !['start', 'stop', 'end', 'restart'].includes(i.value),
    )?.[0]?.value;
    dispatch({
      type: 'home/set',
      payload: {
        bodyBoxTab: select,
      },
    });
    setSelected(select);
  }, []);
  // 启动任务
  const start = () => {
    if (!ipString) {
      return;
    } else {
      setLoading(true);
      startFlowService(ipString || '', '').then((res: any) => {
        if (res && res.code === 'SUCCESS') {
          message.success('任务启动成功');
          dispatch({
            type: 'home/set',
            payload: {
              started: true,
            },
          });
        } else {
          message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
        }
        setLoading(false);
      });
    }
  };
  // 停止任务
  const end = () => {
    return new Promise((resolve: any, reject: any) => {
      if (!ipString) {
        reject(false);
      } else {
        setLoading(true);
        stopFlowService(ipString || '').then((res: any) => {
          if (res && res.code === 'SUCCESS') {
            message.success('任务停止成功');
            dispatch({
              type: 'home/set',
              payload: {
                started: false,
              },
            });
          } else {
            message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
          }
          setLoading(false);
          resolve(true);
        });
      }
    });
  };
  // 重启任务
  const reStart = () => {
    if (!ipString) return;
    setLoading(true);
    end()
      .then((res) => {
        if (res) {
          setTimeout(() => {
            start();
          }, 3000);
        }
      })
      .catch((err) => console.log(err));
  };
  // 切换tab
  const onTabChange = (value: any) => {
    dispatch({
      type: 'home/set',
      payload: {
        bodyBoxTab: value,
      },
    });
    setSelected(value);
  };

  return (
    <div id={`echart-${id}`} className={`${styles.bodyBoxCharts}`} style={{ fontSize }}>
      <div
        className="flex-box-start body-box-change-btn"
        style={{ marginLeft: yName, marginTop: fetchParams }}
      >
        {(timeSelectDefault || [])
          ?.sort((a: any, b: any) => a.sort - b.sort)
          ?.map((item: any, index: number) => {
            const { label, value } = item;
            return (
              <div
                className="flex-box-center body-box-change-btn-item"
                key={`body-box-change-btn-item-${index}`}
                style={Object.assign(
                  {},
                  { width: iconSize, minWidth: iconSize },
                  (['stop', 'end'].includes(value) &&
                    !timeSelectDefault.filter((i: any) => i.value === 'restart')?.[0]) ||
                    ['restart'].includes(value)
                    ? { marginRight: 24 }
                    : {},
                )}
              >
                <BasicButton
                  title={_.lowerCase(value) === 'start' && started ? '检测' : label}
                  icon={
                    _.lowerCase(value) === 'start' ? (
                      started ? (
                        <div className="btn-self-icon flex-box-center success"></div>
                      ) : (
                        <PlayCircleOutlined className="OK-font" />
                      )
                    ) : ['stop', 'end'].includes(value) ? (
                      <PauseCircleOutlined className={started ? 'error-font' : ''} />
                    ) : _.lowerCase(value) === 'restart' ? (
                      <ReloadOutlined />
                    ) : (
                      <div
                        className="flex-box-center body-box-change-btn-item-icon"
                        style={{ height: iconSize, width: iconSize }}
                      >
                        <img
                          src={
                            label.indexOf('实时') > -1
                              ? icon1
                              : label.indexOf('缺陷') > -1
                              ? icon2
                              : icon3
                          }
                          alt=""
                        />
                      </div>
                    )
                  }
                  iconSize={iconSize || 40}
                  direction={'vertical'}
                  disabled={
                    _.lowerCase(value) === 'start'
                      ? started
                      : ['stop', 'end', 'restart'].includes(value)
                      ? !started
                      : false
                  }
                  loading={['start', 'stop', 'end', 'restart'].includes(value) ? loading : false}
                  hover={!['start', 'stop', 'end', 'restart'].includes(value)}
                  selected={selected === value}
                  onClick={() => {
                    if (_.lowerCase(value) === 'start') {
                      start();
                    } else if (['stop', 'end'].includes(value)) {
                      end();
                    } else if (_.lowerCase(value) === 'restart') {
                      reStart();
                    } else {
                      onTabChange(value);
                    }
                  }}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
  bodyBoxTab: home.bodyBoxTab,
}))(BodyBoxCharts);

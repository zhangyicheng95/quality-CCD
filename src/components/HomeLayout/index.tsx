import { getAllProject, getListStatusService } from '@/services/api';
import { message } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as _ from 'lodash';
import styles from './index.module.less';
import { connect } from 'umi';
import { getUserData } from '@/utils/utils';
import { useReloadAfterStationary } from '@/hooks/useReloadAfterStationary';

const HomeLayout: React.FC<any> = (props) => {
  const { children, initialState = {}, setInitialState, dispatch } = props;
  const userData = getUserData();
  const { params = {} } = initialState;
  const { name, id } = params;
  const timerRef = useRef<any>();
  const [list, setList] = useState<any>([]);
  const [projectList, setProjectList] = useState([]);
  const [hasInit, setHasInit] = useState(false);

  const isVision = useMemo(() => {
    // @ts-ignore
    return window?.QUALITY_CCD_CONFIG?.type === 'vision';
  }, []);
  // 获取方案列表
  useEffect(() => {
    const messageFun = (e: any) => {
      if (e.data.from === 'open') {
        localStorage.setItem('parentOrigin', e.origin);
      }
    };
    window.addEventListener('message', messageFun);
    if (isVision) return;
    setHasInit(true);
    try {
      const list = JSON.parse(
        localStorage.getItem('ipUrlList') ||
          JSON.stringify([{ name: '本地服务', value: 'localhost:8866' }]),
      );
      if (!!list.length) {
        loopGetProjects(0, list[0], list);
      } else {
        dispatch({
          type: 'themeStore/projectListAction',
          payload: [{ name: '本地服务', value: 'localhost:8866' }],
        });
      }
    } catch (e) {
      console.log('ipUrlList有问题', e);
      localStorage.removeItem('ipUrlList');
    }

    return () => {
      window.removeEventListener('message', messageFun);
      timerRef.current && clearTimeout(timerRef.current);
      setHasInit(false);
    };
  }, []);
  // 循环获取项目列表
  const loopGetProjects = (index: number, data: any, list: any) => {
    if (index === list?.length || !data?.value) {
      return;
    }
    getAllProject(data.value).then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        const result = (res?.data || [])?.map?.((item: any) => {
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
          payload: { label: data.name, options: result },
        });
      } else {
        message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
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
        const result = list?.map?.((item: any) => {
          const { value } = item;
          return {
            ...item,
            running: _.isObject(res?.data) && !_.isEmpty(res?.data[value]),
          };
        });
        setList(result);
        dispatch({
          type: 'themeStore/statusAction',
          payload: result,
        });
      } else {
        message.error(res?.message || '后台服务异常，请重启服务');
        setList(list);
        dispatch({
          type: 'themeStore/statusAction',
          payload: list,
        });
      }
      !!timerRef.current && clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setHasInit((prev: any) => {
          if (prev) {
            loopGetStatus(list);
          }
          return prev;
        });
      }, 2500);
    });
  };
  // 进来默认加载标签页
  useEffect(() => {
    if (!!params?.contentData?.ipList) {
      try {
        const data = (params?.contentData?.ipList || [])?.map?.((item: any) => {
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
            ...params,
            contentData: {
              ...params?.contentData,
              ipList: data,
            },
          },
        }));
      } catch (err) {}
    } else {
      if (!!name) {
        const list = [{ label: name, name: name, children: null, key: id }];
        setInitialState((preInitialState: any) => ({
          ...preInitialState,
          params: {
            ...params,
            contentData: {
              ...params?.contentData,
              ipList: list,
            },
          },
        }));
      } else {
        setInitialState((preInitialState: any) => ({
          ...preInitialState,
          params: {
            ...params,
            contentData: {
              ...params?.contentData,
              ipList: [],
            },
          },
        }));
      }
    }
  }, []);
  if (!!userData?.loginTime) {
    // 5分钟无操作，自动注销
    useReloadAfterStationary({}, () => {
      setInitialState((s: any) => ({ ...s, currentUser: undefined }));
      localStorage.removeItem('userInfo');
      let hash = '';
      if (location.href?.indexOf('?') > -1) {
        hash = location.href.split('?')[1];
      }
      location.href = `${location.href?.split('#/')?.[0]}#/home${!!hash ? `?${hash}` : ''}`;
      window.location.reload();
    });
  }
  // 一个小时无操作的话，自动刷新重连，防止socket不推送数据
  useReloadAfterStationary({ wait: 1000 * 60 * 60, interval: 1000 * 60 }, () => {
    window.location.reload();
  });
  window.focus();
  return (
    <div className={styles.reportWrap}>
      <div className="box flex-box">
        <div className="content-box">{children}</div>
      </div>
    </div>
  );
};

export default connect((state: any) => {
  return {};
})(HomeLayout);

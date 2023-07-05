import { getAllProject, getListStatusService } from "@/services/api";
import { Badge, message, } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as _ from 'lodash';
import styles from "./index.module.less";
import { connect } from "umi";

const HomeLayout: React.FC<any> = (props) => {
  const { children, initialState, setInitialState, dispatch } = props;
  const { params = {} } = initialState;
  const { quality_name, name, id } = params;
  const timerRef = useRef<any>();
  const [list, setList] = useState<any>([]);
  const [projectList, setProjectList] = useState([]);

  const isVision = useMemo(() => {
    // @ts-ignore
    return window.QUALITY_CCD_CONFIG.type === 'vision';
  }, []);
  // 获取方案列表
  useEffect(() => {
    if (isVision) return;

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
      !!timerRef.current && clearTimeout(timerRef.current);
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
          loopGetStatus(list);
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
              name: quality_name || name,
              label: (quality_name || name),
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
      if (!!quality_name || !!name) {
        const list = [
          { label: quality_name || name, name: quality_name || name, children: null, key: id },
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

  return (
    <div className={styles.reportWrap}>
      <div className="box flex-box">
        <div className="content-box">
          {children}
        </div>
      </div>
    </div>
  );
};

export default connect((state: any) => {
  return {};
})(HomeLayout);

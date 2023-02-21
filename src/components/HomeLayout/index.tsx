import { getAllProject, getListStatusService } from "@/services/api";
import { Badge, Form, message, Modal, Select, Tabs } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as _ from 'lodash';
import styles from "./index.module.less";
import { connect } from "umi";

const HomeLayout: React.FC<any> = (props) => {
  const { children, initialState, dispatch } = props;
  const { params = {} } = initialState;
  const { quality_name, name, id } = params;
  const timerRef = useRef<any>();
  const [items, setItems] = useState<any>([]);
  const [list, setList] = useState<any>([]);
  const [projectList, setProjectList] = useState([]);

  const isVision = useMemo(() => {
    // @ts-ignore
    return window.QUALITY_CCD_CONFIG.type === 'vision';
  }, []);
  // 获取方案列表
  useEffect(() => {
    if (isVision) return;
    getAllProject().then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        const result = (res?.data || []).map((item: any) => {
          const { name, id } = item;
          return {
            value: id,
            label: name,
          };
        });
        setProjectList(result);
      } else {
        message.error(res?.msg || res?.message || '接口异常');
      }
    });

    return () => {
      !!timerRef.current && clearInterval(timerRef.current);
    }
  }, []);
  // 已添加的标签的IDS
  const ids = useMemo(() => {
    return items.map((item: any) => item.key);
  }, [items]);
  // 启动循环列表状态
  useEffect(() => {
    if (isVision) return;
    loopGetStatus(projectList);
    !!timerRef.current && clearInterval(timerRef.current);
    if (projectList.length) {
      timerRef.current = setInterval(() => {
        loopGetStatus(projectList);
      }, 2500)
    }
  }, [projectList]);
  // 循环获取任务列表状态
  const loopGetStatus = (list: any) => {
    getListStatusService().then((res: any) => {
      if (!!res && res.code === 'SUCCESS') {
        const result = list.map((item: any) => {
          const { value } = item;
          return {
            ...item,
            running: _.isObject(res?.data) && !_.isEmpty(res?.data[value]),
            disabled: ids.includes(value),
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
    if (!!localStorage.getItem('ipList')) {
      try {
        const data = JSON.parse(localStorage.getItem('ipList') || "[]").map((item: any) => {
          if (item.key === id) {
            return Object.assign({}, item, {
              name: quality_name || name,
              label: list.filter((i: any) => i.value === id)[0]?.running ?
                <div className="flex-box" style={{ gap: 8 }}>
                  <Badge color={'green'} />
                  {quality_name || name}
                </div>
                :
                (quality_name || name),
            });
          }
          const alias = !!item.name ? item.name : item.label;
          return {
            ...item,
            name: alias,
            label: list.filter((i: any) => i.value === item.key)[0]?.running ?
              <div className="flex-box" style={{ gap: 8 }}>
                <Badge color={'green'} />
                {alias}
              </div>
              :
              alias,
          };
        });
        setItems(data);
      } catch (err) { }
    } else {
      if (!!quality_name || !!name) {
        const list = [
          { label: quality_name || name, name: quality_name || name, children: null, key: id },
        ];
        setItems(list);
        localStorage.setItem('ipList', JSON.stringify(list));
      } else {
        localStorage.setItem('ipList', JSON.stringify([]));
      }
    }
  }, [localStorage.getItem('ipString'), list]);

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

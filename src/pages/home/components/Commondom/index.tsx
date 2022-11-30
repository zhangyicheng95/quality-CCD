import React, { useEffect, useState } from "react";
import styles from "./index.module.less";
import { Image, Popconfirm } from "antd";
import _ from "lodash";
import GridLayout from "@/components/GridLayout";

let timer: string | number | NodeJS.Timeout | null | undefined = null;
const Common: React.FC<any> = (props: any) => {
  const {
    gridContentList = {}, setGridContentList, paramData, setParamData,
    setEditWindowData, setAddWindowVisible, edit
  } = props;
  const [list, setList] = useState([]);
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    if (!_.isEmpty(gridContentList)) {
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        let listData: any = [],
          layoutData: any = [];

        Object.entries(gridContentList)
          .filter((i: any) => !i[1].type)
          .forEach((item: any, index: number) => {
            const key = item[0];
            if (_.isEmpty(item[1])) { return; }
            const { size, value } = item[1];
            listData = listData.concat(
              <div key={key} className="flex-box drag-item-content-box" >
                <div className="flex-box-center drag-item-btn-box" >
                  <div style={{ cursor: 'pointer' }} onClick={() => {
                    setEditWindowData(item[1]);
                    setAddWindowVisible(true);
                  }}>编辑</div>
                  <Popconfirm
                    title="确认删除监控窗口吗?"
                    onConfirm={() => {
                      const result = _.omit(gridContentList, key);
                      const params = Object.assign({}, paramData, { contentData: Object.assign({}, paramData.contentData, { content: result }) });
                      setGridContentList(result);
                      setParamData(params);
                    }}
                    okText="确认"
                    cancelText="取消"
                  >
                    <div style={{ cursor: 'pointer' }}>删除</div>
                  </Popconfirm>
                </div>
                {
                  _.isString(item[1][value[1]]) && item[1][value[1]].indexOf('http') > -1 ?
                    <Image
                      src={item[1][value[1]]} alt="logo"
                      style={{ width: '100%', height: 'auto' }}
                    />
                    : null
                }
                <div className="custom-drag" />
              </div>
            );
            layoutData = layoutData.concat(size)
          });

        setList(listData);
        setLayout(layoutData);
      }, 100);
    }
  }, [gridContentList]);

  return (
    <div className={`${styles.common} flex-box`}>
      {
        !_.isEmpty(list) && !_.isEmpty(layout) ?
          <GridLayout
            edit={edit}
            list={list}
            layout={layout}
            onChange={(data: any) => {
              const result = Object.entries(gridContentList).reduce((pre: any, cen: any) => {
                return Object.assign({}, pre, {
                  [cen[0]]: Object.assign({}, cen[1], {
                    size: data.filter((i: any) => i.i === cen[0])[0]
                  }),
                });
              }, {});
              const params = Object.assign({}, paramData, { contentData: Object.assign({}, paramData.contentData, { content: result }) });
              setGridContentList(result);
              setParamData(params);
            }}
          />
          : null
      }
    </div>
  );
};

export default Common;

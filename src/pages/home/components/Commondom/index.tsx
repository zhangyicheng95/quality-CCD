import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.module.less';
import { Image, Popconfirm } from 'antd';
import _ from 'lodash';
import GridLayout from '@/components/GridLayout';
import { connect } from 'umi';
import TooltipDiv from '@/components/TooltipDiv';

const Common: React.FC<any> = (props: any) => {
  const { dispatch,
    snapshot,
    started,
    paramData,
    setParamData,
    setEditWindowData,
    setAddWindowVisible, } = props;
  const { gridContentList } = snapshot;

  const [list, setList] = useState([]);
  const [layout, setLayout] = useState([]);

  const ifCanEdit = useMemo(() => {
    return location.hash.indexOf('edit') > -1;
  }, [location.hash]);

  useEffect(() => {
    if (!_.isEmpty(gridContentList)) {
      let listData: any = [],
        layoutData: any = [];

      Object.entries(gridContentList)
        .filter((i: any) => !i[1].type)
        .forEach((item: any, index: number) => {
          const key = item[0];
          if (_.isEmpty(item[1])) {
            return;
          }

          const { size, value } = item[1];
          const label = paramData?.flowData?.nodes?.filter((i: any) => i.id === value[0])[0]?.alias;
          listData = listData.concat(
            <div key={key} className=" drag-item-content-box">
              <div className="common-card-title-box flex-box custom-drag success-message">
                <TooltipDiv className="flex-box common-card-title">{`${label} - ${value[1]}`}</TooltipDiv>
                {
                  ifCanEdit ?
                    <div className="flex-box drag-item-btn-box">
                      <div
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setEditWindowData(item[1]);
                          setAddWindowVisible(true);
                        }}
                      >
                        编辑
                      </div>
                      <Popconfirm
                        title="确认删除监控窗口吗?"
                        onConfirm={() => {
                          const result = _.omit(gridContentList, key);
                          const params = Object.assign({}, paramData, {
                            contentData: Object.assign({}, paramData.contentData, { content: result }),
                          });
                          dispatch({
                            type: 'home/set',
                            payload: {
                              gridContentList: result,
                            },
                          });
                          dispatch({ type: 'home/snapshot' });
                          setParamData(params);
                        }}
                        okText="确认"
                        cancelText="取消"
                      >
                        <div style={{ cursor: 'pointer' }}>删除</div>
                      </Popconfirm>
                    </div>
                    : null
                }
              </div>
              {_.isString(item[1][value[1]]) && item[1][value[1]].indexOf('http') > -1 ? (
                <Image
                  src={item[1][value[1]]}
                  alt="logo"
                  style={{ width: '100%', height: 'auto' }}
                />
              ) : null}
            </div>,
          );
          layoutData = layoutData.concat(size);
        });

      setList(listData);
      setLayout(layoutData);
    } else {
      setList([]);
    }
  }, [gridContentList, started]);

  return (
    <div className={`${styles.common} flex-box`}>
      {!_.isEmpty(list) && !_.isEmpty(layout) ? (
        <GridLayout
          list={list}
          layout={layout}
          onChange={(data: any) => {
            const result = Object.entries(gridContentList).reduce((pre: any, cen: any) => {
              return Object.assign({}, pre, {
                [cen[0]]: Object.assign({}, cen[1], {
                  size: data.filter((i: any) => i.i === cen[0])[0],
                }),
              });
            }, {});
            const params = Object.assign({}, paramData, {
              contentData: Object.assign({}, paramData.contentData, { content: result }),
            });
            dispatch({
              type: 'home/set',
              payload: {
                gridContentList: result,
              },
            });
            dispatch({ type: 'home/snapshot' });
            setParamData(params);
          }}
        />
      ) : null}
    </div>
  );
};

export default connect(({ home }) => ({
  snapshot: home.snapshot || {},
  started: home.started || false,
  canvasLock: home.canvasLock || false,
}))(Common);

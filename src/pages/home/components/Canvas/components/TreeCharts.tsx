import React, { useEffect } from 'react';
import { message, Tree } from 'antd';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import { DownOutlined } from '@ant-design/icons';

interface Props {
  data: any;
  id: any;
}

const TreeCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dataValue, fontSize, line_height, ifOnShowTab,
  } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = [
      {
        name: 'parent 1',
        key: '0-0',
        children: [
          {
            name: 'parent 1-0',
            key: '0-0-0',
            children: [
              {
                name: 'leaf',
                key: '0-0-0-0',
              },
              {
                name: 'leaf',
                key: '0-0-0-1',
              },
              {
                name: 'leaf',
                key: '0-0-0-2',
              },
            ],
          },
          {
            name: 'parent 1-1',
            key: '0-0-1',
            children: [
              {
                name: 'leaf',
                key: '0-0-1-0',
              },
            ],
          },
          {
            name: 'parent 1-2',
            key: '0-0-2',
            children: [
              {
                name: 'leaf',
                key: '0-0-2-0',
              },
              {
                name: 'leaf',
                key: '0-0-2-1',
              },
            ],
          },
        ],
      },
      {
        name: 'parent 2',
        key: '1-0',
        children: [
          {
            name: 'leafleafleafleaf',
            key: '1-0-0',
          },
          {
            name: 'leaf',
            key: '1-0-1',
          },
        ],
      },
    ];
  }
  useEffect(() => {
    if (!_.isArray(dataValue)) {
      message.error('树形组件数据格式不正确，请检查');
      console.log('TreeCharts:', dataValue);
      return;
    }
  }, [dataValue]);
  if (!ifOnShowTab) return null;
  return (
    <div
      id={`echart-${id}`}
      className={`${styles.treeCharts} flex-box-center`}
      style={{ fontSize }}
    >
      <Tree
        showLine
        defaultExpandAll
        switcherIcon={<DownOutlined />}
        fieldNames={{ title: 'name' }}
        // defaultExpandedKeys={treeData}
        treeData={dataValue}
      />
    </div>
  );
};

export default TreeCharts;

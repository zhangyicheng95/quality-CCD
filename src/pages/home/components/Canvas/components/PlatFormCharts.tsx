import React, { useMemo } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import PlatFormModal from '@/components/platForm';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const PlatFormCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let { dataValue, fontSize, fetchType, xName, ifFetch, platFormOptions = '{}' } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = 10;
  }
  const ifCanEdit = useMemo(() => {
    return location.hash?.indexOf('edit') > -1;
  }, [location.hash]);

  return (
    <div id={`echart-${id}`} className={`${styles.platFormCharts} flex-box`}>
      {
        ifCanEdit ? null : (
          <PlatFormModal
            visible={true}
            data={Object.assign(
              {
                name: 'imageLabel',
                alias: '正极相机区域配置',
                require: true,
                type: 'File',
                widget: {
                  type: 'ImageLabelField',
                  options:
                    !!platFormOptions && platFormOptions !== 'undefined'
                      ? JSON.parse(platFormOptions)
                      : {
                          //
                          左上水平隔膜: {
                            灰度差: {
                              name: '灰度差',
                              alias: '灰度差',
                              require: true,
                              default: 15,
                              value: 15,
                              type: 'int',
                              description: '边界变化的灰度差',
                              widget: { type: 'InputNumber', max: 255, min: 0, step: 1 },
                            },
                            灰度合并像素: {
                              name: '灰度合并像素',
                              alias: '灰度合并像素',
                              require: true,
                              default: 2,
                              value: 2,
                              type: 'int',
                              description: '边界变化的灰度合并像素',
                              widget: { type: 'InputNumber', max: 5, min: 1, step: 1 },
                            },
                            亮度变化方向: {
                              name: '亮度变化方向',
                              alias: '亮度变化方向',
                              require: true,
                              default: 2,
                              value: 2,
                              type: 'List[string]',
                              description: '边界找线亮度变化方向, 1为亮到暗, 2为暗到亮',
                              widget: {
                                type: 'Select',
                                options: [
                                  { label: '1-亮到暗', value: 1 },
                                  { label: '2-暗到亮', value: 2 },
                                ],
                              },
                            },
                            直线度: {
                              name: '直线度',
                              alias: '直线度',
                              require: true,
                              default: 3,
                              value: 3,
                              type: 'int',
                              description: '直线度要求，值越小，线越直',
                              widget: { type: 'InputNumber', max: 100, min: 1, step: 1 },
                            },
                            降噪滤波核: {
                              name: '降噪滤波核',
                              alias: '降噪滤波核',
                              require: true,
                              default: 5,
                              value: 5,
                              type: 'int',
                              description: '去噪滤波核大小',
                              widget: { type: 'InputNumber', max: 21, min: 1, step: 1 },
                            },
                            找线方向下采样倍数: {
                              name: '找线方向下采样倍数',
                              alias: '找线方向下采样倍数',
                              require: true,
                              default: 8,
                              value: 8,
                              type: 'int',
                              description: '区域下采样倍数，提高计算速度',
                              widget: { type: 'InputNumber', max: 16, min: 2, step: 2 },
                            },
                            垂直找线方向下采样倍数: {
                              name: '垂直找线方向下采样倍数',
                              alias: '垂直找线方向下采样倍数',
                              require: true,
                              default: 2,
                              value: 2,
                              type: 'int',
                              description: '区域下采样倍数，提高计算速度',
                              widget: { type: 'InputNumber', max: 16, min: 2, step: 2 },
                            },
                            搜索框个数: {
                              name: '搜索框个数',
                              alias: '搜索框个数',
                              require: true,
                              default: 15,
                              value: 15,
                              type: 'int',
                              description: '搜索框个数',
                              widget: { type: 'InputNumber', max: 1000, min: 3, step: 1 },
                            },
                            搜索框宽度: {
                              name: '搜索框宽度',
                              alias: '搜索框宽度',
                              require: true,
                              default: 6,
                              value: 6,
                              type: 'int',
                              description: '搜索框宽度',
                              widget: { type: 'InputNumber', max: 1000, min: 3, step: 1 },
                            },
                            找线方法: {
                              name: '找线方法',
                              alias: '找线方法',
                              require: true,
                              default: '卡尺找线',
                              value: '卡尺找线',
                              type: 'List[string]',
                              description: '找线方法，1-卡尺找线，2-EDLines找线',
                              widget: {
                                type: 'Select',
                                options: [
                                  { label: '卡尺找线', value: '卡尺找线' },
                                  { label: 'EDLine找线', value: 'EDLine找线' },
                                ],
                              },
                            },
                          },
                        },
                },
                fetchType,
                xName,
                ifFetch,
                fontSize,
                inHome: true,
              },
              !!dataValue ? { localPath: dataValue } : {},
            )}
          />
        )
        // <Button onClick={() => setPlatFormVisible(true)}>开始标注</Button>
      }
    </div>
  );
};

export default PlatFormCharts;

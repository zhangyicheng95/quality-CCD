import React, { memo, useEffect, useRef, useState } from 'react';
import { Image, message } from 'antd';
import styles from '../index.module.less';
import * as _ from 'lodash';
import TooltipDiv from '@/components/TooltipDiv';
import { useModel } from 'umi';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}
// 图片列表组件
const ImgsCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dataValue = [], imgs_width: width = 150, imgs_height: height = 150,
  } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = [
      {
        value:
          'https://img0.baidu.com/it/u=4285923189,2766387018&fm=253&fmt=auto&app=138&f=JPEG?w=281&h=499',
        name: 'data1',
      },
      {
        value:
          'https://img.zcool.cn/community/01a24d55efd0006ac7251df84f100f.jpg@3000w_1l_2o_100sh.jpg',
        name: 'data2',
      },
      {
        value:
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg9.doubanio.com%2Fview%2Fnote%2Fl%2Fpublic%2Fp61025315.jpg&refer=http%3A%2F%2Fimg9.doubanio.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1684313532&t=c46ef54f701c6b74cf0864410fcde75f',
        name: 'data3',
      },
      {
        value: 'https://picnew9.photophoto.cn/20150712/huagongchangjianzhutupian-11762860_1.jpg',
        name: 'data4',
      },
      {
        value: 'https://img-qn.51miz.com/Element/00/16/74/69/000e44be_E167469_6d5c450g.png',
        name: 'data5',
      },
    ];
  }
  const { initialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  const dom = useRef<any>();

  const [imgList, setImgList] = useState([]);

  useEffect(() => {
    if (!_.isArray(dataValue)) {
      message.error('图片列表数据格式不正确，请检查');
      console.log('ImgsCharts:', dataValue);
      return;
    }
    if (_.isEmpty(dataValue)) return;
    // let result: any = [];
    // const loadFun = (item: any, index: number) => {
    //     if (!item) return;
    //     const { name, value } = item;
    //     const img = document.createElement('img');
    //     img.src = value;
    //     img.title = name || 'img.png';
    //     img.onload = (res: any) => {
    //         const { width = 1, height = 1 } = img;
    //         if (width > height) {
    //             result = result.concat({ ...item, imgHeight: '100%', imgWidth: 'auto' })
    //         } else {
    //             result = result.concat({ ...item, imgHeight: 'auto', imgWidth: '100%' })
    //         }

    //         if (index + 1 === dataValue.length) {
    //             setImgList(result);
    //             return;
    //         }
    //         loadFun(dataValue[index + 1], index + 1);
    //     };
    // };
    // loadFun(dataValue[0], 0);
  }, []);
  return (
    <div id={`echart-${id}`} className={`${styles.imgsCharts}`} ref={dom}>
      {_.isArray(dataValue) &&
        (dataValue || [])?.map?.((item: any, index: number) => {
          const { name, value, imgWidth, imgHeight } = item;
          return (
            <div
              key={`echart-${id}-${index}`}
              id={`echart-${id}-${index}`}
              className={`flex-box img-item`}
              style={{
                width: width,
                minWidth: width,
                maxWidth: width,
                height: height + 24,
                minHeight: height + 24,
                maxHeight: height + 24,
              }}
            >
              {/* <div className="img-item-left">
                            {name}
                        </div> */}
              <div className="img-item-right">
                <div className="img-item-right-top">
                  <Image
                    src={value}
                    alt={name || 'logo'}
                    style={{ width: 'auto', height: '100%' }}
                  />
                </div>
                <TooltipDiv title={name} className="img-item-right-bottom">
                  {name}
                </TooltipDiv>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default memo(ImgsCharts);

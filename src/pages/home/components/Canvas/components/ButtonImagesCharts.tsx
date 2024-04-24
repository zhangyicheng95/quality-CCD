import React, { Fragment, useEffect, useRef, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { numToString } from '@/utils/utils';
import { Modal, Image, message } from 'antd';
import TooltipDiv from '@/components/TooltipDiv';
import { DownloadOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import { btnFetch } from '@/services/api';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const ButtonImagesCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dataValue = {},
    fontSize = 12,
    reverse,
    transformSize,
    modelRotateScreenshot,
    fetchType,
    xName,
  } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue['list'] = [
      [
        {
          title: 'NG',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'gray',
          type: 0,
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'NG',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'gray',
          type: 0,
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'NG',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'gray',
          type: 0,
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'NG',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'gray',
          type: 0,
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
      [
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
        {
          title: 'OK',
          link: 'http://file/D:/结果图/camera3/20240105/OK/20240105094729375035_8TQI_img_.jpg',
          color: 'green',
        },
      ],
    ];
    dataValue['list'] = dataValue['list']?.map?.((item: any) => {
      return item?.map?.((i: any, index: number) => {
        return { ...i, title: `${i.title}-${index + 1}` };
      });
    });
  }

  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [chartSize, setChartSize] = useState(false);
  const dom = useRef<any>();
  const modalDom = useRef<any>();
  const downDom = useRef<any>();

  useEffect(() => {
    let img: any = document.createElement('img');
    img.src = selectedItem.link;
    img.title = 'img.png';
    img.onload = (res: any) => {
      const { width = 1, height = 1 } = img;
      setChartSize(
        width / height > modalDom?.current?.clientWidth / modalDom?.current?.clientHeight,
      );
      img = null;
    };
  }, [selectedItem.link, modalDom?.current?.clientWidth, modalDom?.current?.clientHeight]);

  useEffect(() => {
    if (!!modelRotateScreenshot && !!dataValue?.action) {
      setTimeout(() => {
        downLoad().then((base64: any) => {
          btnFetch(
            fetchType,
            xName,
            { image: encodeURIComponent(base64) },
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
          ).then((res: any) => {
            if (res && res.code === 'SUCCESS') {
              message.success('success');
            } else {
              message.error('截图上传时，接口报错', 5);
            }
          });
        });
      }, 500);
    }
  }, [dataValue?.action]);

  const downLoad = (type?: string) => {
    return new Promise((resolve, reject) => {
      downDom.current.style['opacity'] = 0;
      html2canvas(dom.current, {
        scale: 1,
        useCORS: true, // 是否尝试使⽤CORS从服务器加载图像
        allowTaint: false, // 是否允许跨域图像。会污染画布，导致⽆法使⽤canvas.toDataURL ⽅法
      }).then((canvas: any) => {
        let imageDataURL = canvas.toDataURL('image/png', { quality: 1 });
        if (type === 'down') {
          var link = document.createElement('a');
          link.href = imageDataURL;
          link.download = `output.png`;
          link.click();
        } else {
          const base64 = imageDataURL.split('data:image/png;base64,')[1];
          resolve(base64);
        }
        downDom.current.style['opacity'] = 1;
      });
    });
  };
  return (
    <div
      id={`echart-${id}`}
      className={`${transformSize < 1 ? 'flex-box-start' : 'flex-box-center'} ${
        styles.buttonImagesCharts
      }`}
      ref={dom}
      style={{ fontSize }}
    >
      {!!dataValue?.list?.length ? (
        <Fragment>
          <div className="flex-box img-box-mark-top">
            <DownloadOutlined
              className="flex-box-center img-box-mark-top-icon"
              ref={downDom}
              onClick={() => downLoad('down')}
            />
            {Array.from({ length: dataValue?.list[0]?.length / 2 || 24 })?.map?.(
              (item: any, index: number) => {
                index = index * 2;
                let ngStatus = false;
                try {
                  dataValue?.list.forEach((i: any) => {
                    if (i[index]?.type == 0 || i[index + 1]?.type == 0) {
                      ngStatus = true;
                      throw new Error();
                    }
                  });
                } catch (err) {}
                return (
                  <TooltipDiv
                    className={`flex-box-center img-box-mark-top-item ${ngStatus ? 'error' : ''}`}
                    key={index}
                  >
                    {`${index / 2 + 1}档`}
                  </TooltipDiv>
                );
              },
            )}
          </div>
          <div className="flex-box img-button-charts-body">
            <div className="flex-box img-box-mark-right">
              {(!!reverse ? _.cloneDeep(dataValue?.list).reverse() : dataValue?.list)?.map?.(
                (item: any, index: number) => {
                  let ngStatus = false;
                  try {
                    item.forEach((i: any) => {
                      if (i?.type == 0) {
                        ngStatus = true;
                        throw new Error();
                      }
                    });
                  } catch (err) {}
                  return (
                    <div className="flex-box img-button-item-line" key={`item-${index}`}>
                      <TooltipDiv
                        className={`flex-box img-button-item-line-icon ${ngStatus ? 'error' : ''}`}
                      >
                        {`${!!reverse ? `${dataValue?.list.length - index}` : `${index + 1}`}槽`}
                      </TooltipDiv>
                      {Array.from({ length: item.length / 2 })?.map?.((i: any, tIndex: number) => {
                        tIndex = tIndex * 2;
                        return (
                          <div
                            className={`img-button-item-box`}
                            key={`i-${tIndex}-${item[tIndex]?.link || tIndex}`}
                          >
                            <div
                              className="img-button-item-box-item"
                              style={
                                !!item[tIndex]?.color
                                  ? {
                                      backgroundColor: item[tIndex]?.color,
                                    }
                                  : {}
                              }
                              onClick={() => {
                                setSelectedItem(item[tIndex]);
                                setVisible(true);
                              }}
                            >
                              {item[tIndex]?.title}
                            </div>
                            <div
                              className="img-button-item-box-item"
                              style={Object.assign(
                                {},
                                !!item[tIndex + 1]?.color
                                  ? { backgroundColor: item[tIndex + 1]?.color }
                                  : {},
                                { marginTop: '-2px' },
                              )}
                              onClick={() => {
                                setSelectedItem(item[tIndex + 1]);
                                setVisible(true);
                              }}
                            >
                              {item[tIndex + 1]?.title}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </Fragment>
      ) : null}
      {!!visible ? (
        <Modal
          title={`${selectedItem?.title} - 缺陷图片`}
          wrapClassName="view-defect-modal"
          centered
          width="50vw"
          open={!!visible}
          maskClosable={false}
          destroyOnClose
          footer={null}
          onCancel={() => {
            setVisible(false);
          }}
        >
          <div className="flex-box-center img-button-charts-body" ref={modalDom}>
            <div
              className="img-box"
              style={
                chartSize ? { width: '100%', height: 'auto' } : { width: 'auto', height: '100%' }
              }
            >
              <Image
                src={selectedItem?.link}
                alt={selectedItem?.title || 'logo'}
                style={
                  chartSize ? { width: '100%', height: 'auto' } : { width: 'auto', height: '100%' }
                }
              />
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default ButtonImagesCharts;

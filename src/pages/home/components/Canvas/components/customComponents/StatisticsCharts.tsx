import React, { useEffect } from 'react';
import styles from '../../index.module.less';
import * as _ from 'lodash';
import { Button, message } from 'antd';
import CustomWindowBody from '@/components/CustomWindowBody';
import { btnFetch } from '@/services/api';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const aaa = {
  左上水平区域: {
    找线方向: {
      name: '找线方向',
      alias: '找线方向',
      require: true,
      default: 0,
      value: 0,
      type: 'int',
      description: '数值',
      widget: {
        type: 'Select',
        options: [
          {
            label: '从下到上',
            value: 0,
          },
          {
            label: '从左到右',
            value: 90,
          },
          {
            label: '从上到下',
            value: 180,
          },
          {
            label: '从右到左',
            value: 270,
          },
        ],
      },
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
          {
            label: '亮到暗',
            value: 1,
          },
          {
            label: '暗到亮',
            value: 2,
          },
        ],
      },
    },
    亮度差: {
      name: '亮度差',
      alias: '亮度差',
      require: true,
      default: 30,
      value: 30,
      type: 'int',
      description: '亮度差',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条数量: {
      name: '直方条数量',
      alias: '直方条数量',
      require: true,
      default: 10,
      value: 10,
      type: 'int',
      description: '直方条数量',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条宽度: {
      name: '直方条宽度',
      alias: '直方条宽度',
      require: true,
      default: 8,
      value: 8,
      type: 'int',
      description: '直方条宽度',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
  },
  左下水平区域: {
    找线方向: {
      name: '找线方向',
      alias: '找线方向',
      require: true,
      default: 180,
      value: 180,
      type: 'int',
      description: '数值',
      widget: {
        type: 'Select',
        options: [
          {
            label: '从下到上',
            value: 0,
          },
          {
            label: '从左到右',
            value: 90,
          },
          {
            label: '从上到下',
            value: 180,
          },
          {
            label: '从右到左',
            value: 270,
          },
        ],
      },
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
          {
            label: '亮到暗',
            value: 1,
          },
          {
            label: '暗到亮',
            value: 2,
          },
        ],
      },
    },
    亮度差: {
      name: '亮度差',
      alias: '亮度差',
      require: true,
      default: 30,
      value: 30,
      type: 'int',
      description: '亮度差',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条数量: {
      name: '直方条数量',
      alias: '直方条数量',
      require: true,
      default: 10,
      value: 10,
      type: 'int',
      description: '直方条数量',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条宽度: {
      name: '直方条宽度',
      alias: '直方条宽度',
      require: true,
      default: 8,
      value: 8,
      type: 'int',
      description: '直方条宽度',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
  },
  右上水平区域: {
    找线方向: {
      name: '找线方向',
      alias: '找线方向',
      require: true,
      default: 0,
      value: 0,
      type: 'int',
      description: '数值',
      widget: {
        type: 'Select',
        options: [
          {
            label: '从下到上',
            value: 0,
          },
          {
            label: '从左到右',
            value: 90,
          },
          {
            label: '从上到下',
            value: 180,
          },
          {
            label: '从右到左',
            value: 270,
          },
        ],
      },
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
          {
            label: '亮到暗',
            value: 1,
          },
          {
            label: '暗到亮',
            value: 2,
          },
        ],
      },
    },
    亮度差: {
      name: '亮度差',
      alias: '亮度差',
      require: true,
      default: 30,
      value: 30,
      type: 'int',
      description: '亮度差',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条数量: {
      name: '直方条数量',
      alias: '直方条数量',
      require: true,
      default: 10,
      value: 10,
      type: 'int',
      description: '直方条数量',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条宽度: {
      name: '直方条宽度',
      alias: '直方条宽度',
      require: true,
      default: 8,
      value: 8,
      type: 'int',
      description: '直方条宽度',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
  },
  右下水平区域: {
    找线方向: {
      name: '找线方向',
      alias: '找线方向',
      require: true,
      default: 180,
      value: 180,
      type: 'int',
      description: '数值',
      widget: {
        type: 'Select',
        options: [
          {
            label: '从下到上',
            value: 0,
          },
          {
            label: '从左到右',
            value: 90,
          },
          {
            label: '从上到下',
            value: 180,
          },
          {
            label: '从右到左',
            value: 270,
          },
        ],
      },
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
          {
            label: '亮到暗',
            value: 1,
          },
          {
            label: '暗到亮',
            value: 2,
          },
        ],
      },
    },
    亮度差: {
      name: '亮度差',
      alias: '亮度差',
      require: true,
      default: 30,
      value: 30,
      type: 'int',
      description: '亮度差',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条数量: {
      name: '直方条数量',
      alias: '直方条数量',
      require: true,
      default: 10,
      value: 10,
      type: 'int',
      description: '直方条数量',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条宽度: {
      name: '直方条宽度',
      alias: '直方条宽度',
      require: true,
      default: 8,
      value: 8,
      type: 'int',
      description: '直方条宽度',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
  },
  顶部: {
    找线方向: {
      name: '找线方向',
      alias: '找线方向',
      require: true,
      default: 0,
      value: 0,
      type: 'int',
      description: '数值',
      widget: {
        type: 'Select',
        options: [
          {
            label: '从下到上',
            value: 0,
          },
          {
            label: '从左到右',
            value: 90,
          },
          {
            label: '从上到下',
            value: 180,
          },
          {
            label: '从右到左',
            value: 270,
          },
        ],
      },
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
          {
            label: '亮到暗',
            value: 1,
          },
          {
            label: '暗到亮',
            value: 2,
          },
        ],
      },
    },
    亮度差: {
      name: '亮度差',
      alias: '亮度差',
      require: true,
      default: 30,
      value: 30,
      type: 'int',
      description: '亮度差',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条数量: {
      name: '直方条数量',
      alias: '直方条数量',
      require: true,
      default: 80,
      value: 80,
      type: 'int',
      description: '直方条数量',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条宽度: {
      name: '直方条宽度',
      alias: '直方条宽度',
      require: true,
      default: 10,
      value: 10,
      type: 'int',
      description: '直方条宽度',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
  },
  底部: {
    找线方向: {
      name: '找线方向',
      alias: '找线方向',
      require: true,
      default: 180,
      value: 180,
      type: 'int',
      description: '数值',
      widget: {
        type: 'Select',
        options: [
          {
            label: '从下到上',
            value: 0,
          },
          {
            label: '从左到右',
            value: 90,
          },
          {
            label: '从上到下',
            value: 180,
          },
          {
            label: '从右到左',
            value: 270,
          },
        ],
      },
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
          {
            label: '亮到暗',
            value: 1,
          },
          {
            label: '暗到亮',
            value: 2,
          },
        ],
      },
    },
    亮度差: {
      name: '亮度差',
      alias: '亮度差',
      require: true,
      default: 30,
      value: 30,
      type: 'int',
      description: '亮度差',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条数量: {
      name: '直方条数量',
      alias: '直方条数量',
      require: true,
      default: 80,
      value: 80,
      type: 'int',
      description: '直方条数量',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条宽度: {
      name: '直方条宽度',
      alias: '直方条宽度',
      require: true,
      default: 10,
      value: 10,
      type: 'int',
      description: '直方条宽度',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
  },
  左部: {
    找线方向: {
      name: '找线方向',
      alias: '找线方向',
      require: true,
      default: 270,
      value: 270,
      type: 'int',
      description: '数值',
      widget: {
        type: 'Select',
        options: [
          {
            label: '从下到上',
            value: 0,
          },
          {
            label: '从左到右',
            value: 90,
          },
          {
            label: '从上到下',
            value: 180,
          },
          {
            label: '从右到左',
            value: 270,
          },
        ],
      },
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
          {
            label: '亮到暗',
            value: 1,
          },
          {
            label: '暗到亮',
            value: 2,
          },
        ],
      },
    },
    亮度差: {
      name: '亮度差',
      alias: '亮度差',
      require: true,
      default: 30,
      value: 30,
      type: 'int',
      description: '亮度差',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条数量: {
      name: '直方条数量',
      alias: '直方条数量',
      require: true,
      default: 80,
      value: 80,
      type: 'int',
      description: '直方条数量',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条宽度: {
      name: '直方条宽度',
      alias: '直方条宽度',
      require: true,
      default: 10,
      value: 10,
      type: 'int',
      description: '直方条宽度',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
  },
  右部: {
    找线方向: {
      name: '找线方向',
      alias: '找线方向',
      require: true,
      default: 90,
      value: 90,
      type: 'int',
      description: '数值',
      widget: {
        type: 'Select',
        options: [
          {
            label: '从下到上',
            value: 0,
          },
          {
            label: '从左到右',
            value: 90,
          },
          {
            label: '从上到下',
            value: 180,
          },
          {
            label: '从右到左',
            value: 270,
          },
        ],
      },
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
          {
            label: '亮到暗',
            value: 1,
          },
          {
            label: '暗到亮',
            value: 2,
          },
        ],
      },
    },
    亮度差: {
      name: '亮度差',
      alias: '亮度差',
      require: true,
      default: 30,
      value: 30,
      type: 'int',
      description: '亮度差',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条数量: {
      name: '直方条数量',
      alias: '直方条数量',
      require: true,
      default: 80,
      value: 80,
      type: 'int',
      description: '直方条数量',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条宽度: {
      name: '直方条宽度',
      alias: '直方条宽度',
      require: true,
      default: 10,
      value: 10,
      type: 'int',
      description: '直方条宽度',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
  },
  左上角: {
    找线方向: {
      name: '找线方向',
      alias: '找线方向',
      require: true,
      default: 315,
      value: 315,
      type: 'int',
      description: '数值',
      widget: {
        type: 'Select',
        options: [
          {
            label: '从下到上',
            value: 0,
          },
          {
            label: '从左到右',
            value: 90,
          },
          {
            label: '从上到下',
            value: 180,
          },
          {
            label: '从右到左',
            value: 270,
          },
          {
            label: '左上',
            value: 315,
          },
        ],
      },
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
          {
            label: '亮到暗',
            value: 1,
          },
          {
            label: '暗到亮',
            value: 2,
          },
        ],
      },
    },
    亮度差: {
      name: '亮度差',
      alias: '亮度差',
      require: true,
      default: 30,
      value: 30,
      type: 'int',
      description: '亮度差',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条数量: {
      name: '直方条数量',
      alias: '直方条数量',
      require: true,
      default: 30,
      value: 30,
      type: 'int',
      description: '直方条数量',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条宽度: {
      name: '直方条宽度',
      alias: '直方条宽度',
      require: true,
      default: 6,
      value: 6,
      type: 'int',
      description: '直方条宽度',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
  },
  左下角: {
    找线方向: {
      name: '找线方向',
      alias: '找线方向',
      require: true,
      default: 225,
      value: 225,
      type: 'int',
      description: '数值',
      widget: {
        type: 'Select',
        options: [
          {
            label: '从下到上',
            value: 0,
          },
          {
            label: '从左到右',
            value: 90,
          },
          {
            label: '从上到下',
            value: 180,
          },
          {
            label: '从右到左',
            value: 270,
          },
          {
            label: '左下',
            value: 225,
          },
        ],
      },
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
          {
            label: '亮到暗',
            value: 1,
          },
          {
            label: '暗到亮',
            value: 2,
          },
        ],
      },
    },
    亮度差: {
      name: '亮度差',
      alias: '亮度差',
      require: true,
      default: 30,
      value: 30,
      type: 'int',
      description: '亮度差',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条数量: {
      name: '直方条数量',
      alias: '直方条数量',
      require: true,
      default: 30,
      value: 30,
      type: 'int',
      description: '直方条数量',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条宽度: {
      name: '直方条宽度',
      alias: '直方条宽度',
      require: true,
      default: 6,
      value: 6,
      type: 'int',
      description: '直方条宽度',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
  },
  右上角: {
    找线方向: {
      name: '找线方向',
      alias: '找线方向',
      require: true,
      default: 45,
      value: 45,
      type: 'int',
      description: '数值',
      widget: {
        type: 'Select',
        options: [
          {
            label: '从下到上',
            value: 0,
          },
          {
            label: '从左到右',
            value: 90,
          },
          {
            label: '从上到下',
            value: 180,
          },
          {
            label: '从右到左',
            value: 270,
          },
          {
            label: '右上',
            value: 45,
          },
        ],
      },
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
          {
            label: '亮到暗',
            value: 1,
          },
          {
            label: '暗到亮',
            value: 2,
          },
        ],
      },
    },
    亮度差: {
      name: '亮度差',
      alias: '亮度差',
      require: true,
      default: 30,
      value: 30,
      type: 'int',
      description: '亮度差',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条数量: {
      name: '直方条数量',
      alias: '直方条数量',
      require: true,
      default: 30,
      value: 30,
      type: 'int',
      description: '直方条数量',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条宽度: {
      name: '直方条宽度',
      alias: '直方条宽度',
      require: true,
      default: 6,
      value: 6,
      type: 'int',
      description: '直方条宽度',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
  },
  右下角: {
    找线方向: {
      name: '找线方向',
      alias: '找线方向',
      require: true,
      default: 135,
      value: 135,
      type: 'int',
      description: '数值',
      widget: {
        type: 'Select',
        options: [
          {
            label: '从下到上',
            value: 0,
          },
          {
            label: '从左到右',
            value: 90,
          },
          {
            label: '从上到下',
            value: 180,
          },
          {
            label: '从右到左',
            value: 270,
          },
          {
            label: '右下',
            value: 135,
          },
        ],
      },
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
          {
            label: '亮到暗',
            value: 1,
          },
          {
            label: '暗到亮',
            value: 2,
          },
        ],
      },
    },
    亮度差: {
      name: '亮度差',
      alias: '亮度差',
      require: true,
      default: 30,
      value: 30,
      type: 'int',
      description: '亮度差',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条数量: {
      name: '直方条数量',
      alias: '直方条数量',
      require: true,
      default: 30,
      value: 30,
      type: 'int',
      description: '直方条数量',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
    直方条宽度: {
      name: '直方条宽度',
      alias: '直方条宽度',
      require: true,
      default: 6,
      value: 6,
      type: 'int',
      description: '直方条宽度',
      widget: { type: 'InputNumber', max: 1000, min: 0, step: 1 },
    },
  },
};

const StatisticsCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let { dataValue, titleFontSize = 24, fontSize = 24, fetchType, xName, yName = 2 } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = {
      total: {
        alias: '总产量',
        value: 1234,
      },
      flowerNumber: {
        alias: '每单花篮数(自换)',
        value: 123,
      },
      today: {
        alias: '当班产量',
        value: 234,
      },
      picNumber: {
        alias: '每单进片数(自换)',
        value: 134,
      },
      todayCapacity: {
        alias: '当前产能',
        value: 124,
      },
      piecesPerNumber: {
        alias: '每单进料片数',
        value: 1234,
      },
      totalInPiecesNumber: {
        alias: '总进料片数',
        value: 123,
      },
      orderPiecesPerNumber: {
        alias: '每单分选片数',
        value: 234,
      },
      totalOutPiecesNumber: {
        alias: '总出料片数',
        value: 134,
      },
      pieceInterval: {
        alias: '片间隔时间',
        value: 124,
      },
      totalPiecesPerNumber: {
        alias: '总分选片数',
        value: 124,
      },
    };
  }
  useEffect(() => {}, []);
  const onSubmit = () => {
    btnFetch(fetchType, xName, { type: 'statistics', value: 0 }).then((res: any) => {
      if (!!res && res.code === 'SUCCESS') {
      } else {
        message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
      }
    });
  };

  return (
    <div
      id={`echart-${id}`}
      className={`${styles.paramControlCharts}`}
      style={{ fontSize: titleFontSize }}
    >
      <CustomWindowBody title="生产统计" style={{ fontSize }} titleFontSize={titleFontSize}>
        <div className="param-control-item-box">
          {Object.entries(dataValue || {})?.map?.((item: any, index: number) => {
            const { alias, value } = item[1];
            return (
              <div
                className="flex-box param-control-item"
                key={`param-control-item-${item[0]}`}
                style={Object.assign({}, { width: `${100 / yName - 1}%` })}
              >
                <div className="param-control-item-title">{alias} :</div>
                <div className="param-control-item-value">{value}</div>
              </div>
            );
          })}
          {Object.entries(dataValue || {})?.length ? (
            <div className="flex-box param-control-item" style={{ width: `${100 / yName - 1}%` }}>
              <div className="param-control-item-title" />
              <Button
                type="primary"
                className="param-control-item-value"
                style={{ width: '100%' }}
                onClick={() => onSubmit()}
              >
                清零
              </Button>
            </div>
          ) : null}
        </div>
      </CustomWindowBody>
    </div>
  );
};

export default StatisticsCharts;

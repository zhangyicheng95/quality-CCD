import React, { useEffect, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { AutoComplete, Button, message } from 'antd';
import { btnFetch } from '@/services/api';
import { useModel } from 'umi';
import TooltipDiv from '@/components/TooltipDiv';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const ButtonCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  const {
    fontSize = 14,
    yName = '按钮',
    xName = '',
    fetchType,
    ifNeedClear,
    valueColor = 'primary',
  } = data;
  const { initialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  const [value, setValue] = useState('');
  const [valueList, setValueList] = useState<any>([]);

  useEffect(() => {
    setValueList(JSON.parse(localStorage.getItem(`inputButton-${params.id}-${id}`) || '[]'));
  }, [localStorage.getItem(`inputButton-${params.id}-${id}`)]);
  const onChange = (val: any) => {
    try {
      const res = JSON.parse(val);
      if (fetchType === 'post' && !_.isObject(res)) {
        setValue(JSON.stringify({ msg: val }));
      } else {
        setValue(val);
      }
    } catch (e) {
      setValue(!!val ? JSON.stringify({ msg: val }) : '');
    }
  };

  return (
    <div id={`echart-${id}`} className={`${styles.buttonCharts} flex-box`}>
      <AutoComplete
        options={(valueList || [])?.map?.((item: any) => {
          return {
            label: (
              <div className="flex-box-justify-between" style={{ paddingRight: 8 }} key={item}>
                {item}
                <TooltipDiv
                  onClick={(e: any) => {
                    // 防止鼠标击穿
                    e.preventDefault();
                    e.stopPropagation();
                    setValueList((prev: any) => {
                      const result = prev.filter((i: any) => i !== item);
                      localStorage.setItem(
                        `inputButton-${params.id}-${id}`,
                        JSON.stringify(result),
                      );
                      return result;
                    });
                  }}
                >
                  删除
                </TooltipDiv>
              </div>
            ),
            value: item,
          };
        })}
        style={{ width: '100%', fontSize }}
        showSearch
        onChange={(value: string) => onChange(value)}
      />
      <Button
        type={['primary', 'link', 'ghost'].includes(valueColor) ? valueColor : ''}
        style={Object.assign(
          { fontSize },
          !['primary', 'link', 'ghost'].includes(valueColor)
            ? { backgroundColor: valueColor, color: '#fff' }
            : {},
        )}
        onClick={() => {
          let param1: any = null;
          if (!_.isUndefined(value) && !_.isNull(value) && _.isString(value) && !!value) {
            try {
              param1 = JSON.parse(value);
              setValueList((prev: any) => {
                const result = !!param1?.msg
                  ? Array.from(new Set(prev.concat(param1?.msg)))
                  : Array.from(new Set(prev.concat(value)));
                localStorage.setItem(`inputButton-${params.id}-${id}`, JSON.stringify(result));
                return result;
              });
            } catch (e) {
              console.log('参数按钮传递参数格式不对:', e);
              message.error('传递参数 格式不正确');
              param1 = '';
            }
          }
          btnFetch(fetchType, xName, param1).then((res: any) => {
            if (!!res && res.code === 'SUCCESS') {
              message.success('success');
            } else {
              message.error(res?.message || '接口异常');
            }
          });
        }}
      >
        {yName}
      </Button>
      {!!value && ifNeedClear ? (
        <Button
          style={{ fontSize }}
          onClick={() => {
            setValue('');
            window.location.reload();
          }}
        >
          清空
        </Button>
      ) : null}
    </div>
  );
};

export default ButtonCharts;

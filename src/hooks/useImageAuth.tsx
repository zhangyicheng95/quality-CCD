import { imageExists } from '@/utils/utils';
import { useEffect, useState } from 'react';

const useImageAuth = (props: any) => {
  const { dataValue, imgs_width, imgs_height } = props?.data || {};
  const [link, setLink] = useState(''); // loading 获取权限中, error 获取权限失败

  useEffect(() => {
    imageExists(dataValue?.url || dataValue, (res: boolean) => {
      if (res) {
        setLink(dataValue)
      } else {
        if (!!dataValue?.url) {
          setLink({
            ...dataValue,
            url: dataValue?.url?.replace(imgs_width, imgs_height)
          })
        } else {
          setLink(dataValue?.replace(imgs_width, imgs_height))
        }
      }
    });
  }, []);


  return {
    link,
  };
};

export default useImageAuth;

import { fetchGet } from '@/services/fetch';
import { imageExists } from '@/utils/utils';
import { useEffect, useState } from 'react';

const useImageAuth = (props: any) => {
  const { dataValue } = props?.data || {};
  const [link, setLink] = useState(false);

  useEffect(() => {
    imageExists(dataValue?.url || dataValue, (res: boolean) => {
      if (res) {
        setLink(false);
      } else {
        setLink(true);
      }
    });
  }, [JSON.stringify(dataValue)]);

  return {
    link,
  };
};

export default useImageAuth;

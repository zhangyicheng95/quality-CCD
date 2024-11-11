import { imageExists } from '@/utils/utils';
import _ from 'lodash';
import useImageAuth from './useImageAuth';

const imageWrapper = (WrappedComponent: any) => {

  const Component = (props: any) => {
    const { link } = useImageAuth(props);

    // if (!link) {
    //   return <div>
    //     图片不存在
    //     <div>
    //       {props.data.dataValue?.url || props.data.dataValue}
    //     </div>
    //   </div>;
    // }
    // props.data.dataValue = link;

    return <WrappedComponent {...props} needReplace={!!link} />;
  };

  return Component;

};

export default imageWrapper;

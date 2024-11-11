import React from 'react';
import PrimaryTitle from '@/components/PrimaryTitle';
import styles from './index.less';
import ReactRuler from '@/components/ReactRuler';
import MarkCanvasFabric from '@/components/platFormFabric/MarkCanvasFabric';
import Fabritor1 from '@/components/fabritor';

const MarkList: React.FC = (props: any) => {
  return (
    <div className={`${styles.markList} background-ubv`}>
      {/* <ReactRuler /> */}
      {/* <MarkCanvasFabric
        width={400}
        height={400}
        orientation={100}
        url={
          'https://ts1.cn.mm.bing.net/th/id/R-C.6195f97cbda5adc5c5a20bd54f8f1787?rik=DCKWcoAcSLKKLQ&riu=http%3a%2f%2fimg1.xcarimg.com%2fnews%2f3305%2f3308%2f4390%2f20110810232606712965.jpg-908x681.jpg&ehk=eHQs4fbLytZQlYDb9EngsqDxiiZ0VXw62bpt2YZS7jI%3d&risl=&pid=ImgRaw&r=0'
        }
        activeBoxIndex={''}
        regions={[1, 5]}
      /> */}
      <Fabritor1 />
    </div>
  );
};

export default MarkList;

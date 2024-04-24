import React, { useEffect } from 'react';
import PrimaryTitle from '@/components/PrimaryTitle';
import styles from './index.less';
import CSVReader from 'react-csv-reader';

const MarkList: React.FC = (props: any) => {
  useEffect(() => {}, []);
  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header: any) => header.toLowerCase().replace(/\W/g, '_'),
  };
  return (
    <div className={`${styles.markList} page-size background-ubv`}>
      <PrimaryTitle title={'测试专用'} />
      <CSVReader
        cssClass="csv-reader-input"
        label="Select CSV with secret Death Star statistics"
        onFileLoaded={(data: any, fileInfo: any, originalFile: any) => {
          console.log(data, fileInfo, originalFile);
        }}
        onError={(error: any) => {
          console.log(error);
        }}
        parserOptions={papaparseOptions}
        inputId="ObiWan"
        inputName="ObiWan"
        inputStyle={{ color: 'red' }}
      />
    </div>
  );
};

export default MarkList;

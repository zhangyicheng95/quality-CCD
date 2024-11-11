import React, { } from 'react';
import _ from 'lodash';
import styles from '../index.module.less';
import { connect } from 'umi';
import Fabritor1 from '@/components/fabritor';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const FabricCharts: React.FC<Props> = (props: any) => {
  let { data = {}, id, started } = props;
  let {
    dataValue = { type: '', data: [] },
    fontSize = 20,
    fetchType,
    xName, yName,
  } = data;

  if (process.env.NODE_ENV === 'development') {
    dataValue = {
      "data": [
        {
          "type": "sector",
          "sub_type": "measurementError_2bdc2a07",
          "name": "a1",
          "design_value": 13,
          "measurement_offset": 2,
          "output_index": 1,
          "high_error_tolerance": 0.5,
          "low_error_tolerance": 0.5,
          "high_warning_tolerance": 0.25,
          "low_warning_tolerance": 0.25,
          "averaging_depth": 0,
          "minimum_points": 1,
          "result": {
            "type": 2,
            "value": 13.545120239257813,
          }
        },
        {
          "type": "line",
          "sub_type": "average_half_s3f4gg4d",
          "name": "h1",
          "design_value": 9.800000190734864,
          "measurement_offset": 0,
          "output_index": 2,
          "high_error_tolerance": 0.5,
          "low_error_tolerance": 0.5,
          "high_warning_tolerance": 0.25,
          "low_warning_tolerance": 0.25,
          "averaging_depth": 0,
          "minimum_points": 1,
          "x1": 826.32071304321289,
          "y1": 126.226240158081055,
          "x2": 930.10594367980957,
          "y2": 165.568119049072266,
          "result": {
            "type": 1,
            "value": 10.07961654663086,
            "x1": 826.32071304321289,
            "y1": 126.226240158081055,
            "x2": 930.10594367980957,
            "y2": 165.568119049072266,
          }
        },

      ]
    }
  }
  return (
    <div
      id={`echart-${id}`}
      className={`flex-box-column ${styles.fabricCharts}`}
      style={{ fontSize }}
    >
      <Fabritor1
        shapeFromData={dataValue}
        fetchType={fetchType}
        xName={xName}
        yName={yName}
      />
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(FabricCharts);

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
          "type": "line",
          "sub_type": "average_w2r4g6j9",
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
          "x1": 4.369999885559082,
          "y1": 8.369999885559082,
          "x2": 16.93000030517578,
          "y2": 19.290000915527345,
          "result": {
            "type": 2,
            "value": 13.545120239257813,
            "x1": 1106.32071304321289,
            "y1": 186.226240158081055,
            "x2": 1065.10594367980957,
            "y2": 215.568119049072266,
            "model_result_type": 2,
            "model_result_value": 13.561905860900879,
            "model_x1": 5.440000057220459,
            "model_y1": 9.4399995803833,
            "model_x2": 15.90999984741211,
            "model_y2": 18.059999465942384
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
          "x1": 25.969999313354493,
          "y1": 6.449999809265137,
          "x2": 27.170000076293947,
          "y2": 6.090000152587891,
          "result": {
            "type": 1,
            "value": 10.07961654663086,
            "x1": 826.32071304321289,
            "y1": 126.226240158081055,
            "x2": 930.10594367980957,
            "y2": 165.568119049072266,
            "model_result_type": 0,
            "model_result_value": 9.853288650512696,
            "model_x1": 26.43000030517578,
            "model_y1": 6.449999809265137,
            "model_x2": 30.15999984741211,
            "model_y2": 15.569999694824219
          }
        },

      ]
    }

    // for (let i = 0; i < 66; i++) {
    //   dataValue['data'].push({
    //     type: 'point',
    //     x: 10 * i,
    //     y: 5 * i,
    //   })
    // }
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

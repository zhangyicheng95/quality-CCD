import React, { useEffect, useRef } from 'react';
import styles from './index.less';

import * as XLSX from 'xlsx';
import '@univerjs/design/lib/index.css';
import '@univerjs/ui/lib/index.css';
import '@univerjs/sheets-ui/lib/index.css';
import '@univerjs/sheets-formula/lib/index.css';
import { Univer, UniverInstanceType } from '@univerjs/core';
import { defaultTheme } from '@univerjs/design';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { UniverSheetsPlugin, SetRangeValuesCommand } from '@univerjs/sheets';
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';
import { UniverUIPlugin } from '@univerjs/ui';
import { FUniver } from '@univerjs/facade';
import ImportCSVButtonPlugin from './plugins/ImportCSVButton';
import { Button, Upload } from 'antd';
import { parseCSV2UniverData } from '@/utils/utils';
import _ from 'lodash';

const UniverExcel: React.FC = (props: any) => {
  const univerRef: any = useRef();
  const workbookRef: any = useRef();
  const univerAPI: any = useRef();

  useEffect(() => {
    univerRef.current = new Univer({
      theme: defaultTheme,
    });
    univerRef.current.registerPlugin(UniverRenderEnginePlugin);
    univerRef.current.registerPlugin(UniverFormulaEnginePlugin);
    univerRef.current.registerPlugin(UniverUIPlugin, {
      container: 'luckysheet',
      header: true,
      footer: true,
    });
    univerRef.current.registerPlugin(ImportCSVButtonPlugin);

    univerRef.current.registerPlugin(UniverDocsPlugin, {
      hasScroll: false,
    });
    univerRef.current.registerPlugin(UniverDocsUIPlugin);
    univerRef.current.registerPlugin(UniverSheetsPlugin);
    univerRef.current.registerPlugin(UniverSheetsUIPlugin);
    univerRef.current.registerPlugin(UniverSheetsFormulaPlugin);
    workbookRef.current = univerRef.current.createUnit(UniverInstanceType.UNIVER_SHEET, {});

    univerAPI.current = FUniver.newAPI(univerRef.current);
    // const activeWorkbook: any = univerAPI.getActiveWorkbook();
    // const sheet = activeworkbookRef.create('Sheet2', 10, 10);

    return () => {
      univerRef.current?.dispose?.();
      univerRef.current = null;
      workbookRef.current = null;
      univerAPI.current = null;
    };
  }, []);

  const onSave = () => {
    // const saveData = workbookRef.current.save();
    const activeWorkbook: any = univerAPI.current.getActiveWorkbook();
    const snapshot = activeWorkbook.getSnapshot();
    console.log(snapshot);
  };
  const onSetData = () => {
    const activeSheet = univerAPI.current.getActiveWorkbook().getActiveSheet();
    const range = activeSheet.getRange(0, 0, 2, 3); // x,y开始坐标，行列 设置的数量
    range.setValue('aaaaaa');
  };

  // 导入项目
  const uploadProps = {
    accept: '.csv,.xlsx',
    showUploadList: false,
    multiple: true,
    beforeUpload(file: any) {
      // const univerAPI: any = FuniverRef.newAPI(univerRef.current);
      // console.log(univerAPI);
      // univerAPI.importXLSXToSnapshot(file).then((data: any) => {
      //   console.log(data);
      // });

      const reader = new FileReader(); // 创建文件对象
      if (file.name?.indexOf('.xlsx') > 1) {
        reader.readAsBinaryString(file); // 读取文件的内容/URL
        reader.onload = (res: any) => {
          const workbook = XLSX.read(res.target.result, { type: 'binary' });
          const { SheetNames, Sheets } = workbook;
          (SheetNames || [])?.forEach((item: any) => {
            const jsonData: any = XLSX.utils.sheet_to_json(Sheets[item], { header: 1, defval: '' });
            const value = parseCSV2UniverData(jsonData);
            const activeWorkbook: any = univerAPI.current.getActiveWorkbook();
            const sheet = activeWorkbook.create(item, value?.length, value?.[0]?.length);
            const range = sheet.getRange(0, 0, value?.length, value?.[0]?.length); // x,y开始坐标，行列 设置的数量
            range.setValue(value);

            const sheets = activeWorkbook.getSnapshot().sheets;
            const localSheet: any = Object.entries(sheets)?.[0];
            if (_.isEmpty(localSheet?.[1]?.cellData)) {
              univerAPI.current.executeCommand('sheet.command.remove-sheet', {
                subUnitId: localSheet?.[0],
              });
            }
          });
        };
      } else {
        console.log(file);
        reader.readAsText(file); // 读取文件的内容/URL
        reader.onload = (res: any) => {
          const text = reader.result;
          if (typeof text !== 'string') return;
          const workbook = XLSX.read(res.target.result, { type: 'binary' });
          console.log(workbook);
          console.log(res);
          const rows = text.split(/\r\n|\n/);
          const data = rows.map((line) => line.split(','));
          const value = parseCSV2UniverData(data);
          const activeWorkbook: any = univerAPI.current.getActiveWorkbook();
          const sheet = activeWorkbook.create(
            workbook?.SheetNames?.[0],
            value?.length,
            value?.[0]?.length,
          );
          const range = sheet.getRange(0, 0, value?.length, value?.[0]?.length); // x,y开始坐标，行列 设置的数量
          range.setValue(value);

          const sheets = activeWorkbook.getSnapshot().sheets;
          const localSheet: any = Object.entries(sheets)?.[0];
          if (_.isEmpty(localSheet?.[1]?.cellData)) {
            univerAPI.current.executeCommand('sheet.command.remove-sheet', {
              subUnitId: localSheet?.[0],
            });
          }
        };
      }

      return false;
    },
  };
  return (
    <div className={`${styles.univerExcel} page-size background-ubv`}>
      <div style={{ width: '100%', gap: 8 }} className="flex-box">
        <Upload {...uploadProps}>
          <Button
          // onClick={() => {
          //   onSetData();
          // }}
          >
            数据
          </Button>
        </Upload>
        <Button
          onClick={() => {
            onSave();
          }}
        >
          导出
        </Button>
      </div>
      <div
        id="luckysheet"
        style={{
          margin: 0,
          padding: 0,
          width: '100%',
          height: '90%',
        }}
      ></div>
    </div>
  );
};

export default UniverExcel;

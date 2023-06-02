import React, { Fragment, useEffect, useMemo, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { connect, useModel } from 'umi';
import { Button, Form, message } from 'antd';
import { FormatWidgetToDom } from '@/pages/control';
import MonacoEditor from '@/components/MonacoEditor';
import PlatFormModal from '@/components/platForm';
import FileManager from '@/components/FileManager';

interface Props {
    data: any,
    id: any,
    setMyChartVisible?: any,
    onClick?: any,
}

const OperationCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    const { operationList, dataValue = [], } = data;
    const [form] = Form.useForm();
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;

    const [configList, setConfigList] = useState<any>([]);
    const [configValueList, setConfigValueList] = useState<any>({});
    const [editorVisible, setEditorVisible] = useState(false);
    const [editorValue, setEditorValue] = useState<any>({});
    const [platFormVisible, setPlatFormVisible] = useState(false);
    const [platFormValue, setPlatFormValue] = useState<any>({});
    const [selectPathVisible, setSelectPathVisible] = useState(false);
    const [selectedPath, setSelectedPath] = useState<any>({});

    useEffect(() => {
        if (!_.isArray(operationList)) {
            message.error('数据格式不正确，请检查');
            localStorage.removeItem(`localGridContentList-${params.id}`);
            return;
        }
        const { flowData, } = params;
        const { nodes } = flowData;
        const node = nodes.filter((i: any) => i.id === id.split('$$')[0])?.[0];
        if (!!node) {
            const { config = {} } = node;
            const { initParams = {} } = config;
            let resConfig: any = [],
                resValue: any = {};
            operationList?.forEach((item: any) => {
                if (initParams[item]) {
                    resConfig = resConfig.concat(initParams[item]);
                    resValue[item] = initParams[item]?.value;
                }
            });
            console.log(resConfig);
            setConfigList(resConfig);
            setConfigValueList(resValue)
        }

    }, [operationList, params]);

    const widgetChange = (key: any, value: any) => {
        setConfigValueList((prev: any) => ({ ...prev, [key]: value }));
    }
    const onOk = () => {
        console.log(configValueList);
    };
    const onCancel = () => {

    };

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.operationCharts} flex-box`}
        >
            <div className="operation-body">
                {
                    useMemo(() => {
                        return configList.map((item: any, index: number) => {
                            return <FormatWidgetToDom
                                key={item?.name}
                                id={item?.name}
                                label={item?.alias || item?.name}
                                config={[item?.name, item]}
                                widgetChange={widgetChange}
                                form={form}
                                disabled={false}
                                setEditorVisible={setEditorVisible}
                                setEditorValue={setEditorValue}
                                setPlatFormVisible={setPlatFormVisible}
                                setPlatFormValue={setPlatFormValue}
                                setSelectPathVisible={setSelectPathVisible}
                                setSelectedPath={setSelectedPath}
                            />
                        })
                    }, [configList])
                }
            </div>
            <div className="operation-footer flex-box-center">
                <Button type="primary" onClick={() => onOk()} >确认</Button>
                <Button onClick={() => onCancel()}>重置</Button>
            </div>

            {
                editorVisible ? (
                    <MonacoEditor
                        id={editorValue.id}
                        defaultValue={editorValue.value}
                        language={editorValue.language}
                        visible={editorVisible}
                        onOk={(val: any) => {
                            const { id, value, language } = val;
                            widgetChange(id, { value, language });
                            setEditorValue({});
                            setEditorVisible(false);
                        }}
                        onCancel={() => {
                            setEditorVisible(false);
                        }}
                    />
                ) : null
            }
            {
                platFormVisible ? (
                    <PlatFormModal
                        visible={platFormVisible}
                        data={platFormValue}
                        onOk={(val: any) => {
                            const { id, ...rest } = val;
                            widgetChange(id, rest);
                            setPlatFormValue({});
                            setPlatFormVisible(false);
                        }}
                        onCancel={() => {
                            setPlatFormValue({});
                            setPlatFormVisible(false);
                        }}
                    />
                ) : null
            }
            {
                selectPathVisible ?
                    <FileManager
                        fileType={selectedPath.fileType}
                        data={selectedPath}
                        onOk={(val: any) => {
                            const { id, value, ...rest } = val;
                            widgetChange(id, { value, ...rest, localPath: value });
                            setSelectedPath({});
                            setSelectPathVisible(false);
                        }}
                        onCancel={() => {
                            setSelectPathVisible(false);
                            setSelectedPath({});
                        }}
                    />
                    : null
            }
        </div>
    );

};

export default OperationCharts;
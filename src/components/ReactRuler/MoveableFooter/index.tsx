import React, { Fragment, useMemo, useState } from 'react';
import * as _ from 'lodash';
import { connect, useModel } from 'umi';
import styles from './index.less';
import { Modal, Tree } from 'antd';

interface Props {
    nodeList?: any;
}

const MoveableFooter: React.FC<Props> = (props: any) => {
    const {
        nodeList, dispatch, footerData, started
    } = props;
    const { initialState, setInitialState } = useModel<any>('@@initialState');
    const { params } = initialState;
    const ifCanEdit = useMemo(() => {
        return location.hash?.indexOf('edit') > -1;
    }, [location.hash]);
    const [footerSelectVisible, setFooterSelectVisible] = useState(false);
    const [footerSelectList, setFooterSelectList] = useState<any>([]);

    return (
        <div className={`flex-box ${styles.moveableFooter}`}>
            {started ? (
                <div className="home-footer-item-box success">检测中</div>
            ) : (
                <div
                    className="home-footer-item-box success"
                    onClick={() => {
                        ifCanEdit && setFooterSelectVisible(true);
                    }}
                >
                    未启动
                </div>
            )}
            {(
                _.isBoolean(params?.contentData?.showLogo) ? params?.contentData?.showLogo : true
            ) ? (
                <div className="home-footer-powerby">&copy;技术支持: UBVision团队</div>
            ) : null}
            {useMemo(() => {
                return (
                    <Fragment>
                        {
                            // 节点状态
                            !!footerSelectList?.length &&
                            footerSelectList?.map?.((id: any, index: number) => {
                                const item = footerData?.['state']?.[id] || footerData[id];
                                if (!item) {
                                    return null;
                                }
                                const { Status, name } = item;
                                return (
                                    <div
                                        key={id}
                                        className={`home-footer-item-box ${Status === 'running' ? 'success-font' : 'error-font'
                                            }`}
                                        onClick={() => {
                                            ifCanEdit && setFooterSelectVisible(true);
                                        }}
                                    >
                                        {name?.split('|')?.[1] ||
                                            nodeList?.filter((i: any) => i.value === id)[0]?.label}
                                        {index + 1 === footerSelectList?.length ? null : (
                                            <span className="operation-line">|</span>
                                        )}
                                    </div>
                                );
                            })
                        }
                        {
                            // 内存状态
                            !!footerData?.['ram']
                                ? Object.entries(footerData?.['ram'])?.map?.((item: any) => {
                                    const { current, total } = item;
                                    return (
                                        <div
                                            key={item[0]}
                                            className={`home-footer-item-box`}
                                            onClick={() => {
                                                ifCanEdit && setFooterSelectVisible(true);
                                            }}
                                        >
                                            {`${item[0]} : ${current}/${total}`}
                                        </div>
                                    );
                                })
                                : null
                        }
                        {
                            // 运行时间
                            !!footerData?.['time'] ? footerData?.['time'] : null
                        }
                    </Fragment>
                );
            }, [started, footerData, footerSelectList])}

            {
                // footer节点显示选择
                footerSelectVisible ? (
                    <Modal
                        title={'选择底部展示的状态信息'}
                        wrapClassName="history-window-modal"
                        centered
                        width="50vw"
                        open={footerSelectVisible}
                        // maskClosable={false}
                        onOk={() => {
                            if (params.id) {
                                const param = Object.assign({}, params, {
                                    contentData: Object.assign({}, params.contentData, { footerSelectList }),
                                });
                                setInitialState((preInitialState: any) => ({
                                    ...preInitialState,
                                    params: param,
                                }));
                            }
                            setFooterSelectVisible(false);
                        }}
                        onCancel={() => setFooterSelectVisible(false)}
                        getContainer={false}
                        maskClosable={false}
                    >
                        <Tree
                            checkable
                            defaultExpandAll
                            showLine
                            onCheck={(checkedKeysValue: any) => {
                                setFooterSelectList(_.pull(checkedKeysValue, 'footer_001'));
                            }}
                            checkedKeys={footerSelectList}
                            treeData={[
                                {
                                    key: 'footer_001',
                                    value: 'footer_001',
                                    title: '节点状态列表',
                                    label: '节点状态列表',
                                    children: nodeList?.map?.((item: any) => _.omit(item, 'children')),
                                },
                            ]}
                        />
                    </Modal>
                ) : null
            }
        </div>
    );
};

export default connect(({ home, themeStore }) => ({
    started: home.started || false,
    footerData: home.snapshot?.footerData || {},
}))(MoveableFooter);

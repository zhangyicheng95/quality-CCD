import Mock from 'mockjs';

// yarn add file-saver --save
// @types/file-saver

function getBoxList() {
    const data = [];
    for (let i = 0; i < 6; i++) {
        data.push({
            name: '某某资产' + i,
            remark: '属于某某' + i,
            options: i,
            positionName: '某某单位' + i,
            maintainCompanyName: '某某单位' + i,
            maintainStaffName: '某某' + i,
            onlineStatus: i % 2,
            warningStatus: i % 2,
        });
    }
    return {
        code: 0,
        data: data
    };
}


export const DEVICE = {
    '/device/boxList': getBoxList(),
}
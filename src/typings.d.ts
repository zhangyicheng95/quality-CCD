declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';

// google analytics interface
type GAFieldsObject = {
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  nonInteraction?: boolean;
};

type Window = {
  ga: (
    command: 'send',
    hitType: 'event' | 'pageview',
    fieldsObject: GAFieldsObject | string,
  ) => void;
  reloadAuthorized: () => void;
  routerBase: string;
};

declare let ga: () => void;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

interface IValueEnum {
    [key: string]:
        | ReactNode
        | {
            text: ReactNode;
            status: 'Success' | 'Error' | 'Processing' | 'Warning' | 'Default';
        };
}

interface IOption {
    [key: string]: any;
    value: any;
    label: string;
}

interface IApi <T> {
    status: number;
    message: string;
    result: T;
}

interface IPageParams {
    current?: number;
    pageSize?: number;
}

interface IDataList<T> {
    data?: T[];
    total?: number;
    pageSize?: number;
    page?: number;
    current?: number;
    success?: boolean;
}

interface IUser {
    id?: string;
    userId?: string;
    account?: string;
    username?: string;
    avatar?: string;
    userNo?: string;
    orgId1?: number;
    orgId2?: number;
    orgStrId1?: string;
    orgStrId2?: string;
    orgStrId3?: string;
    roleIds?: number[];
    roleNames?: string[];
    mail?: string;
    roleType?: string;
    password?: string;
    repassword?: string;
}

interface IUpgradePackage {
    upgradePackageId?: string;
    number?: string;
    id?: string;
    name?: string;
    type?: UpgradePackageType;
    version?: string;
    productId?: number;
    productName?: string;
    moduleId?: number;
    moduleName?: string;
    status?: number;
    validateProgress?: number;
    signType?: string;
    validateRequired?: boolean;
    file?: any;
    createAt?: string;
    desc?: string;
    signType?: string;
    signStr?: string;
    deviceTotal?: number;
    deviceSuccess?: number;
    deviceFailed?: number;
    deviceCanceled?: number;
}

interface IModule {
    id?: string;
    name?: string;
    alias?: string;
    desc?: string;
    productId?: number;
    productName?: string;
    createAt?: string;
}

interface IBatch {
    id?: number;
    upgradePackageNumber?: string;
    upgradePackageId?: number;
    number?: string;
    type?: number;
    upgradeType?: number;
    status?: string;
    createAt?: string;
    upgradeAt?: string;
    productId?: string;
    productName?: string;
    version?: string;
    preVersion?: string;
    upgradeRetry?: number;
    upgradeInterval?: number;
    upgradePushRate?: number;
    upgradeRange?: number;
    upgradeAfterTime?: number;
    upgradeTime?: string;
    isCover?: boolean;
    devices?: any[];
    file?: string;
    upgradeTimeout?: number;
    deviceTotal?: number;
    deviceSuccess?: number;
    deviceFailed?: number;
    deviceCanceled?: number;
    devicePushed?: number;
    deviceUnpushed?: number;
    deviceProcessing?: number;
    upgradePackageVersion?: string;
    upgradePackagePreVersion?: string;
}

interface IUpgradePackageDeviceCount {
    all?: number,
    unpushed?: number,
    pushed?: number,
    processing?: number,
    success?: number,
    failed?: number,
    cancelled?: number
}

interface IDevice {
    id?: string;
    name?: string;
    deviceId?: number;
    productId?: string;
    productName?: string;
    version?: string;
    batchIds?: string[];
    status?: number;
    deviceStatus?: number; // 0: 离线 1:在线
    updateAt?: string;
}

interface IRemoteConfigEditHistory {
    id?: string;
    key?: string;
    updateAt?: string;
    detail?: any;
}

interface IRemoteConfig {
    productId?: string;
    data?: any;
    editHistories?: IRemoteConfigEditHistory[]
}

interface IAnnex {
    pictures?: string[];
    videos?: string[];
}

interface IAlarm {
    id?: number;
    index?: number;
    deviceName?: string;
    licPlateNum?: string;
    produceName?: string;
    alarmMessage?: string;
    startTime?: string;
    endTime?: string;
    customerName?: string;
    serviceProviderName?: string;
    address?: string;
    annex?: IAnnex;
}

interface IServiceProvider {
    id?: number;
    name?: string;
}

interface ICustomer {
    id?: number;
    customerName?: string;
}

interface IAlarmCode {
    alarmCode?: string;
    alarmMessage?: string;
}

interface IAlarmType {
    alarmType?: string;
    alarmCodes: IAlarmCode[]
}

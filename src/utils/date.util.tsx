class _DateUtil {
    /**
     * 获取当前时间对象
     * @param longTypeDate
     * @returns {string}
     */
    public static getDate(longTypeDate: any) {
        let date;
        if (typeof longTypeDate === 'object') {
            date = longTypeDate;
        } else {
            date = new Date();
            date.setTime(longTypeDate);
        }

        return date;
    }

    /**
     * yyyy年MM月dd日 hh:mm:ss
     * @param longTypeDate
     * @returns {string} yyyy-MM-dd hh:mm:ss
     */
    public static datetimeFormat_1(longTypeDate: any) {
        let datetimeType = '';
        const date = this.getDate(longTypeDate);
        datetimeType += date.getFullYear(); // 年
        datetimeType += `-${  this.getMonth(date)}`; // 月
        datetimeType += `-${  this.getDay(date)}`; // 日
        datetimeType += `  ${  this.getHours(date)}`; // 时
        datetimeType += `:${  this.getMinutes(date)}`; // 分
        datetimeType += `:${  this.getSeconds(date)}`; // 分
        return datetimeType;
    }

    /**
     * HH:mm:ss
     */
    public static dateFormatHMS(longTypeDate: any) {
        let datetimeType = '';
        const date = this.getDate(longTypeDate);
        datetimeType += `  ${  this.getHours(date)}`; // 时
        datetimeType += `:${  this.getMinutes(date)}`; // 分
        datetimeType += `:${  this.getSeconds(date)}`; // 分
        return datetimeType;
    }

    /**
     * HH:mm:ss
     */
    public static dateFormatY(longTypeDate: any) {
        const date = this.getDate(longTypeDate);
        const dateType = date.getFullYear();
        return dateType;
    }

    /**
     * HH
     */
    public static dateFormatH(longTypeDate: any) {
        let datetimeType = '';
        const date = this.getDate(longTypeDate);
        datetimeType += this.getHours(date); // 时
        return datetimeType;
    }

    /**
     * MM
     */
    public static dateFormatM(longTypeDate: any) {
        let datetimeType = '';
        const date = this.getDate(longTypeDate);
        datetimeType += this.getMinutes(date); // 分
        return datetimeType;
    }

    /**
     * SS
     */
    public static dateFormatS(longTypeDate: any) {
        let datetimeType = '';
        const date = this.getDate(longTypeDate);
        datetimeType += this.getSeconds(date); // 秒
        return datetimeType;
    }

    /**
     * yyyy-MM-dd
     * @param longTypeDate
     * @returns {string}
     */
    public static dateFormat(longTypeDate: any) {
        const date: any = this.getDate(longTypeDate);
        const dateType =
            `${date.getFullYear()  }-${  this.getMonth(date)  }-${  this.getDay(date)}`; // yyyy-MM-dd格式日期
        return dateType;
    }

    /**
     *
     * @param date
     * @returns {string}
     */
    /**
     * MM-dd
     * @param longTypeDate
     * @returns {string}
     */
    public static dateFormat_MM_dd(longTypeDate: any) {
        const date: any = this.getDate(longTypeDate);
        const dateType: string =
            `${this.getMonth(date)  }-${  this.getDay(date)}`; // MM-dd格式日期
        return dateType;
    }

    /**
     * 天的格式
     * @param longTypeDate
     * @returns {string}
     */
    public static dateFormat_dd(longTypeDate: any) {
        const date = this.getDate(longTypeDate);
        const dateType = this.getDay(date); // dd格式日期
        return dateType;
    }

    /**
     *  返回月份
     * @returns {string}
     */
    public static dateFormat_MM(longTypeDate: any) {
        const date = this.getDate(longTypeDate);
        const dateType = `${this.getMonth(date)  }月`;
        return dateType;
    }

    // 返回 01-12 的月份值
    private static getMonth(date: any) {
        const month = date.getMonth() + 1; // getMonth()得到的月份是0-11
        return this.setTimeFillZero(month);
    }

    // 返回01-30的日期
    private static getDay(date: any) {
        const day = date.getDate();
        return this.setTimeFillZero(day);
    }

    // 返回小时
    private static getHours(date: any) {
        const hours = date.getHours();
        return this.setTimeFillZero(hours);
    }

    // 返回分
    private static getMinutes(date: any) {
        const minute = date.getMinutes();
        return this.setTimeFillZero(minute);
    }

    // 返回秒
    private static getSeconds(date: any) {
        const second = date.getSeconds();
        return this.setTimeFillZero(second);
    }

    private static setTimeFillZero(num: any) {
        return num < 10 ? `0${  num}` : num;
    }

    // 从mango数据的objectId中获取时间
    public static getTimeByObjectId(_id: any) {
        if (!_id) {
            return null;
        }
        const num_str = _id.substring(0, 8);
        const time = parseInt(num_str, 16) * 1000; // 16进制-->十进制成秒数然后转毫秒数
        return this.datetimeFormat_1(time);
    }

    /**
     * 获取当前月的天数
     * @returns {number}
     */
    public static getNumberDaysByMonth() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const d = new Date(year, month, 0);
        return d.getDate();
    }

    /**
     * 获取此月的天数
     * @returns {number}
     */
    public static getNumberDaysByThisMonth(month: any) {
        const date = new Date();
        const year = date.getFullYear();
        const d = new Date(year, month, 0);
        return d.getDate();
    }

    /**
     * 获取当前季度的开端月份
     * @returns {number}
     */
    public static getstartMonth() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const d = new Date(year, month, 0);
        return d.getDate();
    }

    /**
     * 获取当前时间属于哪个季度
     * @returns {number}
     */
    public static getQuarter() {
        const date = new Date();
        const month = date.getMonth() + 1;
        return Math.ceil(month / 3);
    }

    /**
     * 获取当前季度第一天的时间戳
     * @returns {number}
     */
    public static getStartQuarterDay() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        // 前季度第一个月
        const satrtQuarterMoubth = Math.ceil(month / 3) * 3 - 3;
        const d = new Date(year, satrtQuarterMoubth, 1);
        return d;
    }

    /**
     * 获取当前季度最后一天的时间戳
     * @returns {number}
     */
    public static getEndQuarterDay() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const endQuarterMoubth = Math.ceil(month / 3) * 3 - 1;
        const endQuarterDay = this.getNumberDaysByThisMonth(endQuarterMoubth);
        const d = new Date(year, endQuarterMoubth, endQuarterDay);
        return d;
    }

    /**
     * 获取某天的开始和结束时间戳
     * @returns {number}
     */
    public static dayTime($date?: any) {
        const day = {
            startTime: 0,
            endTime: 0
        };
        if ($date) {
            if (typeof $date === 'string') {
                $date = new Date($date);
            }
        } else {
            $date = new Date();
        }
        const startTime = (new Date($date.toLocaleDateString())).getTime();
        const endTime = startTime + this.dayMilliseconds();
        day.startTime = startTime;
        day.endTime = endTime;
        return day;
    }

    // 获取某天的开始和结束的标准化时间
    /**
     * 获取一分钟的毫秒数
     * @returns {number}
     */
    public static minuteMilliseconds() {
        return 1000 * 60;
    }

    /**
     * 获取一小时的毫秒数
     * @returns {number}
     */
    public static hourMilliseconds() {
        return this.minuteMilliseconds() * 60;
    }

    /**
     * 获取一天的毫秒数
     * @returns {number}
     */
    public static dayMilliseconds() {
        return this.hourMilliseconds() * 24;
    }
}

const DateUtil: any = _DateUtil;

export default DateUtil;

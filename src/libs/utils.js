/**
 * 从文本中提取出@username 标记的用户名数组
 * @param {String} text 文本内容
 * @return {Array} 用户名数组
 */
const fetchUsers = (text) => {
    if (!text) {
        return [];
    }
    // 去重函数
	const unique = (arr) => {
		return Array.from(new Set(arr));
	}

    let ignoreRegexs = [
        /```.+?```/g, // 去除单行的 ```
        /^```[\s\S]+?^```/gm, // ``` 里面的是 pre 标签内容
        /`[\s\S]+?`/g, // 同一行中，`some code` 中内容也不该被解析
        /^.*/gm, // 4个空格也是 pre 标签，在这里 . 不会匹配换行
        /\b\S*?@[^\s]*?\..+?\b/g, // somebody@gmail.com 会被去除
        /\[@.+?\\]\(\/.+?\)/g // 已经被 link 的 username
    ];

    ignoreRegexs.forEach((ignoreRegex) => {
        text = text.replace(ignoreRegex, '');
    });

    let results = text.match(/@[a-z0-9\-_]+\b/igm);
    let names = [];
    if (results) {
        for (let i = 0, l = results.length; i < l; i++) {
            let s = results[i];
            // 移除头部的@符号
            s = s.slice(1);
            names.push(s);
        }
    }
    // 去重
    names = unique(names);
    return names;
};

/**
 * 根据文本内容，替换为数据库中的数据
 * @param {String} text 文本内容
 * @param {Function} callback 回调函数
 */
export const linkUsers = (text) => {
    let users = fetchUsers(text);
    for (let i = 0, l = users.length; i < l; i++) {
        let name = users[i];
        text = text.replace(new RegExp('@' + name + '\\b(?!\\])', 'g'), '[@' + name + '](/user/' + name + ')');
    }
    return text;
};

/**
 *   对Date的扩展，将 Date 转化为指定格式的String
 *   月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *   年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *   例子：
 *   (new Date()).Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
 *   (new Date()).Format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
 */
const fmtDate = (date, fmt) => { // author: meizz
    let o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
};

/**
 * 格式化日期或时间
 * @param {string} time 需要格式化的时间
 */
export const getTime = (time) => {
    return fmtDate(new Date(time), 'yyyy-MM-dd hh:mm');
};

/**
 * 获取不同tab的信息
 * @param  {[type]}  tab     [tab分类]
 * @param  {[type]}  good    [是否是精华]
 * @param  {[type]}  top     [是否置顶]
 * @param  {Boolean} isClass [是否是样式]
 * @return {[type]}          [返回对应字符串]
 */

/*
  isClass阐述： 如果为true则返回样式，用于样式绑定（V指令:class）
  反之则返回文本，用于文本绑定（v指令 v-text）
*/
export const getTabInfo = (tab, good, top, isClass) => {
    let str = '';
    let className = '';
    if (top) {
        str = '置顶';
        className = 'top';
    } else if (good) {
        str = '精华';
        className = 'good';
    } else {
        switch (tab) {
            case 'all':
                str = '全部';
                className = 'all';
                break;
            case 'good':
                str = '精华';
                className = 'good';
                break;
            case 'share':
                str = '分享';
                className = 'share';
                break;
            case 'ask':
                str = '问答';
                className = 'ask';
                break;
            case 'job':
                str = '招聘';
                className = 'job';
                break;
            default:
                str = '暂无';
                className = 'default';
                break;
        }
    }
    return isClass ? className : str;
};

/**
 * 配置节流函数
 * @param  {[Function]}  fn     [要执行的函数]
 * @param  {[Number]}  delay    [延迟执行的毫秒数]
 * @param  {[Number]}  mustRun  [至少多久执行一次]
 * @return {[Function]}         [节流函数]
 */
export const throttle = (fn, wait, mustRun) => {
    let timeout; // 闭包
    let startTime = Date.now();
    return function() {
        let context = this;
        let args = arguments;
        let curTime = Date.now();

        clearTimeout(timeout);
        // 如果达到了规定的触发时间间隔，触发 handler
        if (curTime - startTime >= mustRun) {
            fn.apply(context, args);
            startTime = curTime;
            // 没达到触发间隔，重新设定定时器
        } else {
            timeout = setTimeout(fn, wait);
        }
    };
};
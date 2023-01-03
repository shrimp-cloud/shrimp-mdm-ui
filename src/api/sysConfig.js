import request from '@/utils/request'

// 1. console-系统配置分页
export function consoleSysConfigPage(params) {
    return request({ url: '/sys/console/sys/config/page', method: 'get', params });
}
// 2. console-系统配置详情
export function consoleSysConfigInfo(params) {
    return request({ url: '/sys/console/sys/config/info', method: 'get', params });
}
// 3. console-系统配置保存
export function consoleSysConfigSave(data) {
    return request({ url: '/sys/console/sys/config/save', method: 'post', data });
}
// 4. console-系统配置删除
export function consoleSysConfigRemove(data) {
    return request({ url: '/sys/console/sys/config/remove', method: 'post', data });
}

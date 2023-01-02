import request from '@/utils/request'

// 1. 获取服务器参数
export function consoleServerState(params) {
    return request({ url: '/sys/console/server/state', method: 'get', params });
}
// 1. console-大屏-一周访问量
export function consoleDashboardWeekVisitCount(params) {
    return request({ url: '/sys/console/dashboard/weekVisitCount', method: 'get', params });
}
// 2. common-服务器属性查询
export function commonSystemProp(params) {
    return request({ url: '/sys/common/system/prop', method: 'get', params });
}
// 1. console-接口请求记录分页
export function consoleAccessLogPage(params) {
    return request({ url: '/sys/console/access/log/page', method: 'get', params });
}

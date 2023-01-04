import request from '@/utils/request'

// 1. 获取服务器参数
export function consoleAccessLogPage(params) {
    return request({ url: '/sys/console/server/state', method: 'get', params });
}

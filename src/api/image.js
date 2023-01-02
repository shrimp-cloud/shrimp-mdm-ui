import request from '@/utils/request'

// 1. console-图库分页
export function consoleImageLibraryPage(params) {
    return request({ url: '/sys/console/image/library/page', method: 'get', params });
}
// 2. console-图库详情
export function consoleImageLibraryInfo(params) {
    return request({ url: '/sys/console/image/library/info', method: 'get', params });
}
// 3. console-图库保存
export function consoleImageLibrarySave(data) {
    return request({ url: '/sys/console/image/library/save', method: 'post', data });
}
// 4. console-图库删除
export function consoleImageLibraryRemove(data) {
    return request({ url: '/sys/console/image/library/remove', method: 'post', data });
}
// 5. console-图库搜索
export function consoleImageLibraryList(params) {
    return request({ url: '/sys/console/image/library/list', method: 'get', params });
}

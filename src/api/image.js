import request from '@/utils/request'

// 1. console-图库分页
export function imageLibraryPage(params) {
    return request({ url: '/cms/image/library/page', method: 'get', params });
}
// 2. console-图库详情
export function imageLibraryInfo(params) {
    return request({ url: '/cms/image/library/info', method: 'get', params });
}
// 3. console-图库保存
export function imageLibrarySave(data) {
    return request({ url: '/cms/image/library/save', method: 'post', data });
}
// 4. console-图库删除
export function imageLibraryRemove(data) {
    return request({ url: '/cms/image/library/remove', method: 'post', data });
}
// 5. console-图库搜索
export function imageLibraryList(params) {
    return request({ url: '/cms/image/library/list', method: 'get', params });
}

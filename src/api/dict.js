import request from '@/utils/request'


// 4. console-字典类型删除
export function consoleDictTypeRemove(data) {
    return request({ url: '/sys/console/dict/type/remove', method: 'post', data });
}
// 5. console-字典内容列表（不分页）
export function consoleDictList(params) {
    return request({ url: '/sys/console/dict/list', method: 'get', params });
}
// 6. console-字典内容添加/修改
export function consoleDictSave(data) {
    return request({ url: '/sys/console/dict/save', method: 'post', data });
}
// 7. console-字典内容删除
export function consoleDictRemove(data) {
    return request({ url: '/sys/console/dict/remove', method: 'post', data });
}
// 1. console-字典类型列表分页
export function consoleDictTypePage(params) {
    return request({ url: '/sys/console/dict/type/page', method: 'get', params });
}
// 2. console-字典类型列表详情
export function consoleDictTypeInfo(params) {
    return request({ url: '/sys/console/dict/type/info', method: 'get', params });
}
// 3. console-字典类型添加/修改
export function consoleDictTypeSave(data) {
    return request({ url: '/sys/console/dict/type/save', method: 'post', data });
}

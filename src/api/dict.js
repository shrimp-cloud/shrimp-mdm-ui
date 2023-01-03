import request from '@/utils/request'


// 1. console-字典列表分页
export function consoleDictPage(params) {
    return request({ url: '/sys/console/dict/page', method: 'get', params });
}
// 2. console-字典列表详情
export function consoleDictInfo(params) {
    return request({ url: '/sys/console/dict/info', method: 'get', params });
}
// 3. console-字典添加/修改
export function consoleDictSave(data) {
    return request({ url: '/sys/console/dict/save', method: 'post', data });
}
// 4. console-字典类型删除
export function consoleDictRemove(data) {
    return request({ url: '/sys/console/dict/remove', method: 'post', data });
}

// 5. console-字典内容列表（不分页）
export function consoleDictItemList(params) {
    return request({ url: '/sys/console/dict/item/list', method: 'get', params });
}
// 6. console-字典内容添加/修改
export function consoleDictItemSave(data) {
    return request({ url: '/sys/console/dict/item/save', method: 'post', data });
}
// 7. console-字典内容删除
export function consoleDictItemRemove(data) {
    return request({ url: '/sys/console/dict/item/remove', method: 'post', data });
}

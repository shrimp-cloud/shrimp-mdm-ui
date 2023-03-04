import request from '@/utils/request'

export function alipayConfigPage(params) {
    return request({ url: '/pay/alipay/config/page', method: 'get', params });
}
export function alipayConfigInfo(params) {
    return request({ url: '/pay/alipay/config/info', method: 'get', params });
}
export function alipayConfigCreate(data) {
    return request({ url: '/pay/alipay/config/create', method: 'post', data });
}
export function alipayConfigUpdate(data) {
    return request({ url: '/pay/alipay/config/update', method: 'post', data });
}
export function alipayConfigRemove(data) {
    return request({ url: '/pay/alipay/config/remove', method: 'post', data });
}

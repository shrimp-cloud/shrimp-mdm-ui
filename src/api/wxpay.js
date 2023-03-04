import request from '@/utils/request'

export function wxpayConfigPage(params) {
    return request({ url: '/pay/wxpay/config/page', method: 'get', params });
}
export function wxpayConfigInfo(params) {
    return request({ url: '/pay/wxpay/config/info', method: 'get', params });
}
export function wxpayConfigCreate(data) {
    return request({ url: '/pay/wxpay/config/create', method: 'post', data });
}
export function wxpayConfigUpdate(data) {
    return request({ url: '/pay/wxpay/config/update', method: 'post', data });
}
export function wxpayConfigRemove(data) {
    return request({ url: '/pay/wxpay/config/remove', method: 'post', data });
}

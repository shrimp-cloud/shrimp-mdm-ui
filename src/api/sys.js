import request from '@/utils/request';


// 1. 获取地区
export function commonAreaChoice(params) {
    return request({ url: '/sys/common/area/choice', method: 'get', params });
}
// 1. 获取动态图片
export function publicDynamicImage(params) {
    return request({ url: '/sys/public/dynamic/image', method: 'get', params });
}
// 2. 获取动态图片-birdpaper
export function publicDynamicImageBirdpaper(params) {
    return request({ url: '/sys/public/dynamic/image/birdpaper', method: 'get', params });
}
// 1. 缓存-Dict
export function cacheSysDict(params) {
    return request({ url: '/sys/cache/sys/dict', method: 'get', params });
}
// 0. 缓存-刷新全局缓存
export function cacheRefresh(params) {
    return request({ url: '/sys/cache/refresh', method: 'get', params });
}
// 1. 缓存-sysConfig
export function cacheSysConfig(params) {
    return request({ url: '/sys/cache/sys/config', method: 'get', params });
}
// 3. 缓存-tenantDomain
export function cacheTenantDomain(params) {
    return request({ url: '/sys/cache/tenant/domain', method: 'get', params });
}
// 1. common-图片验证码
export function publicCommonCaptchaPicture(params) {
    return request({ url: '/sys/public/common/captcha/picture', method: 'get', params });
}
// 5. common-字典内容列表（不分页）
export function commonDictList(params) {
    return request({ url: '/sys/common/dict/list', method: 'get', params });
}
// 1. common-文件上传
export function commonUpload(data) {
    return request({ url: '/sys/common/upload', method: 'post', data });
}
// 1. console-系统错误分页
export function consoleSysErrorPage(params) {
    return request({ url: '/sys/console/sys/error/page', method: 'get', params });
}
// 2. console-系统错误详情
export function consoleSysErrorInfo(params) {
    return request({ url: '/sys/console/sys/error/info', method: 'get', params });
}
// 5. console-租户选项
export function consoleTenantOption(params) {
    return request({ url: '/sys/console/tenant/option', method: 'get', params });
}
// 1. console-工具-密码生成
export function consoleToolPwdCreate(params) {
    return request({ url: '/sys/console/tool/pwd/create', method: 'get', params });
}
// 2. console-工具-密码加密
export function consoleToolPwdEncrypt(data) {
    return request({ url: '/sys/console/tool/pwd/encrypt', method: 'post', data });
}
// 3. console-工具-密码解密
export function consoleToolPwdDecrypt(data) {
    return request({ url: '/sys/console/tool/pwd/decrypt', method: 'post', data });
}
// 1. 获取系统版本
export function publicSystemVersion(params) {
    return request({ url: '/sys/public/system/version', method: 'get', params });
}
// 2. 系统异常上报
export function publicSystemError(data) {
    return request({ url: '/sys/public/system/error', method: 'post', data });
}



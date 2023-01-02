import request from '@/utils/request'

export function enumsDict(params) {
  return request({url: '/spring/enums/dict', method: 'get', params})
}

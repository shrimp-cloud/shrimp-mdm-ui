import useDictStore from '@/store/modules/dict'
import { dictItems } from '@/api/spring'

/**
 * 获取字典数据
 */
export function useDict(...args) {
  const res = ref({});
  return (() => {
    args.forEach((dict, index) => {
      res.value[dict] = [];
      const dicts = useDictStore().getDict(dict);
      if (dicts) {
        res.value[dict] = dicts;
      } else {
        dictItems({type: dict}).then(resp => {
          if (!resp.data) {
            console.error("枚举不存在", dict);
            return;
          }
          res.value[dict] = resp.data.map(p => ({
            value: isNaN(p.dictValue) ? p.dictValue : Number(p.dictValue), // 若 value 为数字，需要转成数字
            label: p.dictLabel,
            elTagType: p.elType,
            elTagClass: p.cssClass
          }))
          useDictStore().setDict(dict, res.value[dict]);
        })
      }
    })
    return toRefs(res.value);
  })()
}

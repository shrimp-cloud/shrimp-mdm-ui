import useDictStore from '@/store/modules/dict'
import { enumsDict } from '@/api/spring'

/**
 * 获取字典数据
 */
export function useDict(...args) {
  const res = ref({});
  return (() => {
    args.forEach((dictType, index) => {
      res.value[dictType] = [];
      const dicts = useDictStore().getDict(dictType);
      if (dicts) {
        res.value[dictType] = dicts;
      } else {
        enumsDict({type: dictType}).then(resp => {
          if (!resp.data) {
            console.error("枚举不存在", dictType);
            return;
          }
          res.value[dictType] = resp.data.map(p => ({
            value: p.value,
            label: p.label,
            elTagType: p.listClass,
            elTagClass: p.cssClass
          }))
          useDictStore().setDict(dictType, res.value[dictType]);
        })
      }
    })
    return toRefs(res.value);
  })()
}

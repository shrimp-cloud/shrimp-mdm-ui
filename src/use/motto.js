import { mottoPage } from "@/api/motto";
import { onMounted } from 'vue';

const queryParams = {
    current: 1,
    size: 999
};

const useMotto = () => {
    const dataList = ref([]);
    const total = ref(0);
    const currentMotto = ref('');

    const getList = async () => {
        const { data } = await mottoPage(queryParams);
        if (data) {
            dataList.value = data.rows;
            total.value = data.total;
        }
        const id = parseInt(Math.random() * total.value, 10);
        currentMotto.value = dataList.value[id].mainContent;
    }

    onMounted(() => {
        getList();
    });

    return currentMotto;
}

export default useMotto;


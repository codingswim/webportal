import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { ref, computed } from 'vue'

export const useWebsiteStore = defineStore('website', () => {
    const loading = ref(false)
    const list = ref([])
    const filteredList = ref([])
    const searchTerm = ref('')

    const debouncedFilteredList = computed(() => {
        if (!searchTerm.value) return list.value
        return list.value.filter(item =>
            item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
        )
    })
    const syncFilteredList = (term) => {
        searchTerm.value = term
        filteredList.value = debouncedFilteredList.value // 同步计算结果
    }

    const fetchList = async () => {
        loading.value = true
        const res = await supabase.from('websites').select('*').order('sort', { ascending: true })
        if (!res.error && res.status === 200) {
            list.value = res.data
        }
        syncFilteredList('')
        loading.value = false
    }

    const deleteWebsite = async (id) => {
        const res = await supabase.from('websites').delete().eq('id', id)
        if (!res.error && res.status === 200) {
            list.value = list.value.filter(item => item.id !== id)
        }
        syncFilteredList(searchTerm.value)
    }

    const updateSort = async () => {
        loading.value = true
        const updateList = list.value.map((item, index) => ({
            id: item.id,
            sort: index + 1
        }))
        // 调用 RPC 函数更新排序
        const res = await supabase.rpc('update_website_sort', { sort_data: updateList }) // 调用 RPC 函数
        if (res.error) throw res.error
        loading.value = false
    }

    return {
        list,
        filteredList,
        loading,

        fetchList,
        deleteWebsite,
        updateSort,
        syncFilteredList // 对外暴露同步筛选的方法
    }
})
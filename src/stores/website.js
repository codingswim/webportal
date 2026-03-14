import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useWebsiteStore = defineStore('website', {
    state: () => ({
        list: [],
        empty: false,
        loading: false,
        error: null
    }),

    getters: {
        filteredList: (state) => (searchTerm) => {
            if (!searchTerm) return state.list
            const term = searchTerm.toLowerCase()
            return state.list.filter(item =>
                item.name.toLowerCase().includes(term) ||
                item.url.toLowerCase().includes(term)
            )
        }
    },

    actions: {
        async fetchList() {
            this.loading = true
            try {
                const res = await supabase.from('websites').select('*').order('sort', { ascending: true })
                if (!res.error && res.status === 200) {
                    this.list = res.data
                    this.empty = res.data.length === 0
                }
            } catch (error) {
                this.error = error
                console.error('获取快捷方式列表失败:', error)
            } finally {
                this.loading = false
            }
        },

        async addWebsite(form) {
            try {
                const maxSort = this.dataList.length > 0
                    ? Math.max(...this.dataList.map(item => item.sort))
                    : 0
                const newItem = {
                    name: form.name,
                    url: form.url,
                    sort: maxSort + 1
                }
                const res = await supabase.from('websites').insert([newItem])
                if (!res.error) {
                    await this.fetchList()
                }
            } catch (error) {
                this.error = error
                console.error('保存快捷方式失败:', error)
            }
        },

        async deleteWebsite(id) {
            try {
                const res = await supabase.from('websites').delete().eq('id', id)
                if (!res.error) {
                    await this.fetchList()
                    return true // 成功返回true
                } else {
                    // 如果有错误，抛出异常
                    throw new Error(res.error.message || '删除失败')
                }
            } catch (error) {
                this.error = error
                console.error('删除快捷方式失败:', error)
                throw error // 重新抛出错误，让组件捕获
            }
        },

        async updateSort() {
            this.loading = true
            const updateList = this.list.map((item, index) => ({
                id: item.id,
                sort: index + 1
            }))
            // 调用 RPC 函数更新排序s
            const res = await supabase.rpc('update_website_sort', { sort_data: updateList }) // 调用 RPC 函数
            if (res.error) throw res.error
            this.loading = false
            return true
        },
    }
})
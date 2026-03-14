// src/stores/search.js
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
    state: () => ({
        searchTerm: '' // 搜索词
    }),

    actions: {
        setSearchTerm(term) {
            this.searchTerm = term
        },

        clearSearch() {
            this.searchTerm = ''
        }
    }
})
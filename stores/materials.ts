import { defineStore } from 'pinia'
import type { Material, CreateMaterialPayload } from '~/types/material'

export const useMaterialsStore = defineStore('materials', {
  state: () => ({
    materials: [] as Material[],
    currentMaterial: null as Material | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    // Сортировка по дате: более свежие материалы выше
    sortedMaterials: (state): Material[] => {
      return [...state.materials].sort((a, b) => {
        const timeA = a.datetime ? new Date(a.datetime).getTime() : 0
        const timeB = b.datetime ? new Date(b.datetime).getTime() : 0
        return timeB - timeA
      })
    },

    getMaterialById: (state) => {
      return (id: string | number): Material | undefined => {
        return state.materials.find((item) => String(item.id) === String(id))
      }
    }
  },

  actions: {
    async fetchMaterials(force = false) {
      if (this.materials.length > 0 && !force) {
        return this.materials
      }

      this.isLoading = true
      this.error = null

      try {
        const data = await $fetch<Material[]>('/api/materials')
        this.materials = Array.isArray(data) ? data : []
        return this.materials
      } catch (err: any) {
        this.error = err?.data?.statusMessage || err?.message || 'Не удалось загрузить список материалов'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchMaterialById(id: string | number): Promise<Material | null> {
      // 1. Сначала проверяем, есть ли материал уже в сторе
      const existing = this.getMaterialById(id)
      if (existing) {
        this.currentMaterial = existing
        return existing
      }

      // 2. Если в сторе нет (например, прямой переход по URL), загружаем список и ищем в нем
      await this.fetchMaterials()
      const found = this.getMaterialById(id)
      if (found) {
        this.currentMaterial = found
        return found
      }

      this.currentMaterial = null
      return null
    },

    async createMaterial(payload: CreateMaterialPayload): Promise<Material> {
      this.isLoading = true
      this.error = null

      try {
        const result = await $fetch<Material>('/api/materials/save', {
          method: 'POST',
          body: payload
        })

        // Добавляем созданный материал в список
        const savedItem: Material = {
          ...payload,
          id: result?.id || Date.now(),
          ...result
        }

        // Удаляем дубликат по id если есть, и добавляем в начало
        this.materials = [savedItem, ...this.materials.filter((m) => String(m.id) !== String(savedItem.id))]
        this.currentMaterial = savedItem

        return savedItem
      } catch (err: any) {
        this.error = err?.data?.statusMessage || err?.message || 'Не удалось сохранить материал'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})

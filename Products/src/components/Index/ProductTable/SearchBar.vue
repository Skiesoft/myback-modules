<script lang="ts">
import { defineComponent } from 'vue'
import { QueryBuilder } from '@myback/sdk'
import { Query } from '@myback/sdk/build/api/query-builder'

export default defineComponent({
  emits: ['update'],
  data () {
    const search_target:string = ''
    return {
      search_target
    }
  },
  methods: {
    async generateQuery () {
      let query:Query|null = null

      if (this.search_target === '') {
        query = QueryBuilder.greaterThan('id', -1)
      } else {
        query = QueryBuilder.like('name', '%' + this.search_target + '%')
      }
      this.$emit('update', query)
    }
  }
})

</script>

<template>
  <input @input="generateQuery()" type="text" class="form-control" placeholder="Search" v-model="search_target">
</template>

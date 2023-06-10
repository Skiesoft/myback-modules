<script lang="ts">
import { defineComponent } from 'vue'
import ProductList from './ProductList.vue'
import SearchBar from './SearchBar.vue'
import PageBar from '@/components/Common/PageBar.vue'
import { Query } from '@myback/sdk/build/api/query-builder'
import { QueryBuilder } from '@myback/sdk'

export default defineComponent({
  data () {
      type ComponentData = {
        query:Query|null,
        page:number,
        page_size:number,
      }
      return {
        query: null,
        page: 1,
        page_size: 3
      } as ComponentData
  },
  methods: {
    async pageBarReload () {
      this.$emit('totalProductUpadte');
      (this.$refs.PageBar as any).reload()
    },
    async changePage (page:number) {
      this.page = page
      await new Promise(f => setTimeout(f, 1));
      (this.$refs.ProductList as any).fetchProducts()
    },
    async changeQuery (query:Query|null) {
      if (query == null) {
        this.query = QueryBuilder.greaterThan('id', 0)
      } else {
        this.query = query
      }
      await new Promise(f => setTimeout(f, 1))
      await (this.$refs.PageBar as any).reload()
      (this.$refs.ProductList as any).fetchProducts()
    },
    async newProduct () {
      (this.$refs.ProductList as any).edit(null)
    },
    async refresh () {
      (this.$refs.ProductList as any).fetchProducts()
    }
  },
  mounted () {
    this.changeQuery(null)
  },
  components: { ProductList, SearchBar, PageBar }
})
</script>

<template>
  <div class="col-12 box justify-content-center p-4" style="height:450px">
    <div class="justify-content-between d-flex">
      <div class="d-flex">
        <h4 class="fw-bold mt-1">
          商品列表
        </h4>
        <PageBar ref="PageBar" :table_name="'Product'" :page_size="page_size" :query="query" @update="changePage"/>
      </div>
      <div class="col-4  d-flex">
        <SearchBar @update="changeQuery" />
        <router-link to="/import" custom v-slot="{ navigate }">
          <button type="button" class="btn btn-primary ms-3 col-3 fw-bold" style="background: #3B587A;" @click="navigate">商品入庫</button>
        </router-link>
        <router-link to="/view/0" custom v-slot="{ navigate }">
          <button type="button" class="btn btn-primary ms-3 col-3 fw-bold" style="background: #3B587A;" @click="navigate">新增商品</button>
        </router-link>
      </div>
    </div>
    <ProductList ref="ProductList" :query="query" :page="page" :page_size="page_size" @reload="pageBarReload()"/>
  </div>

</template>

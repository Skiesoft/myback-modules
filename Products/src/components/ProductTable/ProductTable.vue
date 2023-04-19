<script lang="ts">
  import { defineComponent } from 'vue'
  import ProductList from './ProductList.vue'
  import SearchBar from './SearchBar.vue'
  import PageBar from '../PageBar.vue'
  import ProductOperations from './ProductOperation/ProductOperations.vue'
  import { Query } from '@myback/sdk/build/api/query-builder'
  import { QueryBuilder } from '@myback/sdk'
  import { Product } from '@/model/product'

  export default defineComponent({
    data(){
      const query:Query|null = null
      const page:number = 1
      const page_size = 9
      return{
        query,
        page,
        page_size
      }
    },
    methods: {
      async changePage(page:number){
        this.page = page
        await new Promise(f => setTimeout(f, 1))
        this.$refs.ProductList.fetchProducts()
      },
      async changeQuery(query:Query|null){
        if(query == null){
          this.query = QueryBuilder.greaterThan('id',0)
        }
        else{
          this.query = query
        }
        await new Promise(f => setTimeout(f, 1))
        await this.$refs.PageBar.reload()
        this.$refs.ProductList.fetchProducts()
      },
      async edit(target_product:Product|null){
        await this.$refs.ProductOperations.openInfoModal(target_product)
      },
      async refresh(){
        this.$refs.ProductList.fetchProducts()
      }
    },
    mounted(){
      this.changeQuery(null)
    },
    components: {ProductList, SearchBar, PageBar, ProductOperations}
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
        <button type="button" class="btn btn-primary ms-3 col-3 fw-bold" style="background: #3B587A;" @click="edit(null)">新增商品</button>
      </div>
    </div>
    <ProductList ref="ProductList" :query="query" :page="page" :page_size="page_size" @open="edit"/>
  </div>

  <ProductOperations ref="ProductOperations" @refresh="refresh()"/>

</template>
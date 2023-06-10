<script lang="ts">
import { Product } from '@/model/product'
import { Database, QueryBuilder } from '@myback/sdk'
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['open'],
  props: ['query', 'page', 'page_size'],
  data () {
      type ComponentData = {
        products:Array<Product>
        sort_element:string
        sort_order:'asc'|'desc'
      }

      return {
        products: {},

        sort_element: 'id',
        sort_order: 'asc'
      } as ComponentData
  },
  methods: {
    async sort (target: string) {
      const prev_element = document.getElementById(this.sort_element)
      prev_element?.classList.remove('sortUp')
      prev_element?.classList.remove('sortDown')

      if (this.sort_element !== target) {
        this.sort_element = target
        this.sort_order = 'asc'
        document.getElementById(target)?.classList.add('sortUp')
        this.fetchProducts()
        return
      }

      if (this.sort_order === 'asc') {
        this.sort_order = 'desc'
        document.getElementById(target)?.classList.add('sortDown')
      } else {
        this.sort_order = 'asc'
        document.getElementById(target)?.classList.add('sortUp')
      }
      this.fetchProducts()
    },
    async fetchProducts () {
      const db = new Database()
      this.products = await db.find(Product, QueryBuilder.orderBy(this.query, this.sort_element, this.sort_order), this.page - 1, this.page_size)
    },
    async edit (product:Product) {
      this.$router.push({ path: '/view/' + product.id })
    },
    async deleteProduct (product:Product) {
    }
  },
  components: {}
})

</script>

<template>
  <div class="d-flex container mt-3">
    <div class="me-5 fw-bold d-flex align-items-center">
      Id
      <div id="id" class="d-flex flex-column ms-1 sortUp" @click="sort('id')" type="button">
        <div class="arrow-up"><i class="bi bi-caret-up-fill" style="font-size: 1px;" ></i></div>
        <div class="arrow-down"><i class="bi bi-caret-down-fill" style="font-size: 1px" ></i></div>
      </div>
    </div>
    <div class="col-2 fw-bold d-flex align-items-center me-2">
      名稱
      <div id="name" class="d-flex flex-column ms-1" @click="sort('name')" type="button">
        <div class="arrow-up"><i class="bi bi-caret-up-fill" style="font-size: 1px"></i></div>
        <div class="arrow-down"><i class="bi bi-caret-down-fill" style="font-size: 1px"></i></div>
      </div>
    </div>
    <div class="col fw-bold d-flex align-items-center">
      分類
      <div id="category" class="d-flex flex-column ms-1">
      </div>
    </div>
    <div class="col fw-bold d-flex align-items-center">
      狀態
      <div id="status" class="d-flex flex-column ms-1" @click="sort('status') " type="button">
        <div class="arrow-up"><i class="bi bi-caret-up-fill" style="font-size: 1px"></i></div>
        <div class="arrow-down"><i class="bi bi-caret-down-fill" style="font-size: 1px"></i></div>
      </div>
    </div>
    <div class="col fw-bold d-flex align-items-center">
      庫存
      <div id="stock" class="d-flex flex-column ms-1" @click="sort('stock')" type="button">
        <div class="arrow-up"><i class="bi bi-caret-up-fill" style="font-size: 1px"></i></div>
        <div class="arrow-down"><i class="bi bi-caret-down-fill" style="font-size: 1px"></i></div>
      </div>
    </div>
    <div class="col fw-bold d-flex align-items-center">
      新增時間
      <div id="create_time" class="d-flex flex-column ms-1" @click="sort('create_time')" type="button">
        <div class="arrow-up"><i class="bi bi-caret-up-fill" style="font-size: 1px"></i></div>
        <div class="arrow-down"><i class="bi bi-caret-down-fill" style="font-size: 1px"></i></div>
      </div>
    </div>
    <div class="col fw-bold d-flex align-items-center">
      製造商
      <div id="manufacturer" class="d-flex flex-column ms-1" @click="sort('manufacturer')" type="button">
        <div class="arrow-up"><i class="bi bi-caret-up-fill" style="font-size: 1px"></i></div>
        <div class="arrow-down"><i class="bi bi-caret-down-fill" style="font-size: 1px" ></i></div>
      </div>
    </div>
    <div class="col"></div>
  </div>

  <hr class="border border-dark opacity-100  m-2" />

  <div v-for="product in products">
    <div class="d-flex container mt-2">
      <div class="me-5" style="width: 31px">{{ product.id }}</div>
      <div class="col-2 overflowhidden me-2">{{ product.name }}</div>
      <div class="col overflowhidden">{{ product.category }}</div>
      <div class="col">{{ product.status }}</div>
      <div class="col">{{ product.stock }}</div>
      <div class="col">{{ product.create_time?.toISOString().split('T')[0] }}</div>
      <div class="col">{{ product.manufacturer }}</div>
      <div class="d-flex col">
        <button class="link" style="color: #3B587A" @click="edit(<Product>product)">Edit</button>
        <button class="link link-danger ms-1" @click="deleteProduct(<Product>product)">Delete</button>
      </div>
    </div>
  </div>

  <ProductOperations ref="ProductOperations" @fetch="fetchProducts()"/>

</template>

<style>
  .sortUp .arrow-up{
    visibility:visible
  }

  .sortUp .arrow-down{
    visibility:hidden
  }

  .sortDown .arrow-up{
    visibility:hidden
  }

  .sortDown .arrow-down{
    visibility:visible
  }

  .overflowhidden{
    overflow:hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .arrow-up{
    margin-bottom:-7px;
  }
  .arrow-down{
    margin-top:-7px;
  }

</style>

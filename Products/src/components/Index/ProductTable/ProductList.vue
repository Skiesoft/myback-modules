<script lang="ts">
import { Product } from '@/model/product'
import { Database, QueryBuilder, Storage } from '@myback/sdk'
import { defineComponent } from 'vue'
import axios from 'axios'
import Confirm from '@/components/Common/Confirm.vue'
import { Picture } from '@/model/picture'
import { ProductTag } from '@/model/product-tag'
import { Tag } from '@/model/tag'
import { TransactionItem } from '@/model/transaction-item'

export default defineComponent({
  emits: ['open'],
  props: ['query', 'page', 'page_size'],
  data () {
      type ComponentData = {
        delete_target:Product|null
        products:Array<Product>
        sort_element:string
        sort_order:'asc'|'desc'
        product_tag_display:Array<String>
      }

      return {
        products: {},
        delete_target: null,
        sort_element: 'id',
        sort_order: 'asc',
        product_tag_display: {}
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
      await new Promise(f => setTimeout(f, 1))
      this.products = await db.find(Product, QueryBuilder.orderBy(this.query, this.sort_element, this.sort_order), this.page - 1, this.page_size)

      this.product_tag_display = []
      let tags:Array<Tag> = await db.all(Tag)
      for(let i = 0 ;  i < this.products.length ; i++){
        let product_query = QueryBuilder.equal("product_id", this.products[i].id!)
        let product_tag:Array<ProductTag> = await db.find(ProductTag, product_query)
        let str:string = ''
        for(let j = 0 ; j < product_tag.length ; j++){
          str += tags.find(elem => elem.id == (product_tag[j].tag as unknown as number))!.name
          if(j != product_tag.length-1){
            str += '/'
          }
        }
        this.product_tag_display.push(str)
      }
    },
    async edit (product:Product) {
      this.$router.push({ path: '/view/' + product.id })
    },
    async deleteConfirm (product:Product) {
      this.delete_target = product;
      (this.$refs.Confirm as any).show()
    },
    async deleteProduct () {
      const db = new Database() 
      const storage = new Storage()
      const query = QueryBuilder.equal('product_id', this.delete_target?.id!)

      let transaction_item = (await db.find(TransactionItem, query)).length
      if( transaction_item != 0){
        this.delete_target!.soft_delete = 1
        db.save(Product, <Product>this.delete_target)
        this.fetchProducts()
        return
      }

      let tag_links = await db.find(ProductTag, query)
      for(let i = 0 ; i < tag_links.length ; i++){
        await db.destroy(ProductTag,tag_links[i])
      }

      let pictures = await db.find(Picture, query)
      for(let i = 0 ; i < pictures.length; i++){
        storage.destroy(pictures[i].file_name!)
        await db.destroy(Picture, pictures[i])
      }

      await db.destroy(Product ,<Product>this.delete_target)
      this.fetchProducts()
    }
  },
  components: { Confirm }
})

</script>

<template>
  <div>
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

    <div v-for="(product, i) in products">
      <div class="d-flex container mt-2">
        <div class="me-5" style="width: 31px">{{ product.id }}</div>
        <div class="col-2 overflowhidden me-2">{{ product.name }}</div>
        <div class="col overflowhidden">{{ product_tag_display[i] }}</div>
        <div class="col">{{ product.status }}</div>
        <div class="col">{{ product.stock }}</div>
        <div class="col">{{ product.create_time?.toISOString().split('T')[0] }}</div>
        <div class="col">{{ product.manufacturer }}</div>
        <div class="d-flex col">
          <button class="link" style="color: #3B587A" @click="edit(<Product>product)"><u>編輯</u></button>
          <button class="link link-danger ms-1" @click="deleteConfirm(<Product>product)"><u>刪除</u></button>
        </div>
      </div>
    </div>

    <Confirm ref="Confirm" confirm_message="確定要刪除嗎" confirm_option="刪除" table_name="product_delete" @confirm="deleteProduct()" />
  </div>
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

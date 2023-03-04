<script lang="ts">
import { Product } from '@/model/product';
import { Database, QueryBuilder } from '@myback/sdk';
import { defineComponent } from 'vue';
import Confirm from '../Confirm.vue'

  export default defineComponent({
    emits:["open"],
    props:["query", "page", "page_size"],
    data(){
      const products:Array<Product> = []

      const sort_target:string = "id"
      const sort_order:string = "asc"

      const delete_product:Product|null = null

      return{
        products,

        sort_target,
        sort_order,

        delete_product
      }
    },
    methods:{
      async sort(target: string){
        let prev_element = document.getElementById(this.sort_target)
        prev_element?.classList.remove('sortUp')
        prev_element?.classList.remove('sortDown')

        if (this.sort_target != target){
          this.sort_target = target
          this.sort_order = 'asc'
          document.getElementById(target)?.classList.add('sortUp')
          //this.updateList()
          this.fetchProducts()
          return
        }

        if(this.sort_order == 'asc'){
          this.sort_order = 'desc'
          document.getElementById(target)?.classList.add('sortDown')
        }
        else{
          this.sort_order = 'asc'
          document.getElementById(target)?.classList.add('sortUp')
        }
        //this.updateList()
        this.fetchProducts()
      },
      async fetchProducts(){
        const db = new Database()
        this.products = await db.find(Product, QueryBuilder.orderBy(this.query,this.sort_target,this.sort_order), this.page-1, this.page_size)
      },
      async edit(product:Product){
        this.$emit('open', product)
      },
      async deleteProduct(){
        const db = new Database()
        db.destroy(Product, this.delete_product)
        this.delete_product = null
        this.fetchProducts()
      },
      async deleteConfirm(product:Product){
        this.delete_product = product
        this.$refs.Confirm.show()
      }
    },
    components: {Confirm}
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
      Name
      <div id="name" class="d-flex flex-column ms-1" @click="sort('name')" type="button">
        <div class="arrow-up"><i class="bi bi-caret-up-fill" style="font-size: 1px"></i></div>
        <div class="arrow-down"><i class="bi bi-caret-down-fill" style="font-size: 1px"></i></div>
      </div>
    </div>
    <div class="col fw-bold d-flex align-items-center">
      category
      <div id="category" class="d-flex flex-column ms-1">
      </div>
    </div>
    <div class="col fw-bold d-flex align-items-center">
      Status
      <div id="status" class="d-flex flex-column ms-1" @click="sort('status') " type="button">
        <div class="arrow-up"><i class="bi bi-caret-up-fill" style="font-size: 1px"></i></div>
        <div class="arrow-down"><i class="bi bi-caret-down-fill" style="font-size: 1px"></i></div>
      </div>
    </div>
    <div class="col fw-bold d-flex align-items-center">
      In-stock
      <div id="stock" class="d-flex flex-column ms-1" @click="sort('stock')" type="button">
        <div class="arrow-up"><i class="bi bi-caret-up-fill" style="font-size: 1px"></i></div>
        <div class="arrow-down"><i class="bi bi-caret-down-fill" style="font-size: 1px"></i></div>
      </div>
    </div>
    <div class="col fw-bold d-flex align-items-center">
      Add-time
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
      <div class="col">{{ product.create_time.split('T')[0] }}</div>
      <div class="col">{{ product.manufacturer }}</div>
      <div class="d-flex col">
        <button class="link" style="color: #3B587A" @click="edit(product)">Edit</button>
        <button class="link link-danger ms-1" @click="deleteConfirm(product)">Delete</button>
      </div>
    </div>
  </div>

  <Confirm ref="Confirm" :confirm_message="'您確定要刪除此商品嗎?'" :confirm_option="'刪除'" :confirm_operation="deleteProduct" />

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
<script lang="ts">
import { defineComponent } from 'vue'
import { Database } from '@myback/sdk'
import { Product } from '@/model/product'

export default defineComponent({
  data() {
    const total_products:number = 0;
    return{
        total_products
    }
  },
  methods: {
    async update(){
      const db = new Database
      this.total_products = Number(await db.sum(Product, 'stock'))
    }
  }
})
</script>


<template>
    <div class="col-6 box border rounded m-2 d-flex justify-content-center" style="height:100px">
      <i class="bi-box m-3" style="font-size: 50px"></i>
      <div class="ms-1 mt-4 me-1">
        <h5>商品數量</h5> 
        <h5>{{ total_products }}</h5>
      </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Database, QueryBuilder } from '@myback/sdk'
import { Transaction } from '@/model/transaction';

export default defineComponent({
  props:['product'],
  data() {
    const total_orders:number = 0;
    return{
        total_orders
    }
  },
  methods: {
    async update(){
      const db = new Database
      const query = QueryBuilder.equal("product", this.product)
      this.total_orders = Number(await db.sum(Transaction, 'stock', query))
    }
  }
})
</script>


<template>
    <div class="col-5 box border rounded m-2 d-flex justify-content-center" style="height:100px">
      <i class="bi-coin m-3 ms-2" style="font-size: 50px"></i>
      <div class="ms-1 mt-4 me-1">
        <h6>訂購總計</h6> 
        <h5>{{ total_orders }}</h5>
      </div>
    </div>
</template>
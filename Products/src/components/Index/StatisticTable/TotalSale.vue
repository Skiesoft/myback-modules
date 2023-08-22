<script lang="ts">
import { defineComponent } from 'vue'
import { Database, QueryBuilder } from '@myback/sdk'
import { TransactionItem } from '@/model/transaction-item'

export default defineComponent({
  data () {
    const total_sale:number = 0
    return {
      total_sale
    }
  },
  methods: {
    async update () {
      const db = new Database()
      this.total_sale = 0

      const query = QueryBuilder.lessThan('quantity', 0)
      const sales:TransactionItem[] = await db.find(TransactionItem, query)

      for (let i = 0; i < sales.length; i++) {
        this.total_sale += sales[i].paid_price! * sales[i].quantity! * -1
      }
    }
  }
})
</script>

<template>
    <div class="col-6 box border rounded m-2 d-flex justify-content-center" style="height:100px">
      <i class="bi-box m-3" style="font-size: 50px"></i>
      <div class="ms-1 mt-4 me-1">
        <h5>銷售總額</h5>
        <h5>{{ total_sale }}</h5>
      </div>
    </div>
</template>

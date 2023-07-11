<script lang="ts">
import { defineComponent } from 'vue'
// import { Database } from '@myback/sdk'

export default defineComponent({
  data () {
    const total_orders:number = 0
    return {
      total_orders
    }
  },
  methods: {
    async update () {
      // const db = new Database()
      // this.total_orders = Number(await db.sum(Transaction, 'stock'))
    }
  }
})
</script>

<template>
    <div class="col-6 box border rounded m-2 d-flex justify-content-center" style="height:100px">
      <i class="bi-box m-3 ms-2" style="font-size: 50px"></i>
      <div class="ms-1 mt-4 me-1">
        <h5>交易總量</h5>
        <h5>{{ total_orders }}</h5>
      </div>
    </div>
</template>

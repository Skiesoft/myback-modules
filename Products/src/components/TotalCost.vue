<script lang="ts">
import { defineComponent } from 'vue'
import { Database, QueryBuilder } from '@myback/sdk'

export default defineComponent({
  data() {
    const total_cost:number = 0;
    return{
      total_cost
    }
  },
  methods: {
    async update(){
      const db = new Database
      this.total_cost = 0
    }
  }
})
</script>

<template>
  <div class="col-2 box border rounded m-2 d-flex justify-content-center" style="height:100px">
    <i class="bi-coin mt-3 me-3" style="font-size: 40px"></i>
    <div class="ms-1 mt-4 me-1">
      <h6>成本總額</h6> 
      <h5>{{ total_cost }}</h5>
    </div>
  </div>
</template>
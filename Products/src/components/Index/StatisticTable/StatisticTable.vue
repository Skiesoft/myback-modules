<script lang="ts">
import { defineComponent } from 'vue'

import TotalCost from './TotalCost.vue'
import TotalProduct from './TotalProduct.vue'
import TotalOrder from './TotalOrder.vue'
import TotalSale from './TotalSale.vue'

export default defineComponent({
  data () {

  },
  methods: {
    async update () {

    }
  },
  components: { TotalCost, TotalProduct, TotalOrder, TotalSale }
})
</script>

<template>
  <div class="col-5">
      <div class="col-11 d-flex">
        <TotalProduct/>
        <TotalCost/>
      </div>
      <div class="col-11 d-flex">
        <TotalOrder/>
        <TotalSale/>
    </div>
  </div>

</template>

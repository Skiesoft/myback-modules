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
      (this.$refs.totalProduct as any).update();
      (this.$refs.totalCost as any).update();
      (this.$refs.totalOrder as any).update();
      (this.$refs.totalSale as any).update();
    }
  },
  components: { TotalCost, TotalProduct, TotalOrder, TotalSale }
})
</script>

<template>
  <div class="col-5">
      <div class="col-11 d-flex">
        <TotalProduct ref="totalProduct"/>
        <TotalCost ref="totalCost"/>
      </div>
      <div class="col-11 d-flex">
        <TotalOrder ref="totalOrder"/>
        <TotalSale ref="totalSale"/>
    </div>
  </div>

</template>

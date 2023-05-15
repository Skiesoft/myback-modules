<script lang="ts">
  import { defineComponent } from 'vue'

  import TotalOrder from './DataBoxes/TotalOrder.vue';
  import TotalSale from './DataBoxes/TotalSale.vue';
  import StockChange from './Charts/StockChange.vue';
  import AgeDistribute from './Charts/AgeDistribute.vue';
  import GenderDistribute from './Charts/GenderDistribute.vue';


export default defineComponent ({
  data(){
    return {
      
    }
  },
  mounted(){
  },
  methods: {
    
  },
  components: {TotalOrder, TotalSale, StockChange, AgeDistribute, GenderDistribute}
})
</script>

<template>
    <div class="col-6">
      <div class="d-flex">
        <TotalOrder/>
        <TotalSale/>
      </div>
      <StockChange/>
      <AgeDistribute/>
      <GenderDistribute/>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import StatisticTable from './StatisticTable/StatisticTable.vue'
import SalesChart from './SalesChart/SalesChart.vue'
import ProductTable from './ProductTable/ProductTable.vue'

export default defineComponent({
  data () {
    return {

    }
  },
  mounted () {
    this.update()
  },
  methods: {
    async update () {
      (this.$refs.statisticTable as any).update();
      (this.$refs.salesChart as any).update();
      (this.$refs.productTable as any).update()
    }
  },
  components: { StatisticTable, SalesChart, ProductTable }
})
</script>

<template>
  <div>
    <div class="m-3 d-flex">
      <StatisticTable ref="statisticTable"/>

      <SalesChart ref="salesChart"/>
    </div>

    <ProductTable ref="productTable" class="m-3"/>
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

  button.link{
    background:none; border:none;
  }

  .mt-30px{
    margin-top: 30px;
  }

  .overflowhidden{
    overflow:hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .box {
    box-sizing: border-box;
    background: #FFFFFF;
  }

  .arrow-up{
    margin-bottom:-7px;
  }
  .arrow-down{
    margin-top:-7px;
  }

  input[type=file]::-webkit-file-upload-button {
    width: 0;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;
    border: none;
    border:0px;
  }

  body {
    background-color: #f5f5f5;
  }

</style>

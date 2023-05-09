<script lang="ts">
  import { defineComponent } from 'vue'

  import InfoTable from './InfoTable.vue'
  import DataChartTable from './DatachartsTable/DataChartTable.vue'
  //import StatisticTable from './StatisticTable/StatisticTable.vue'

  export default defineComponent ({
    data(){
      return {
        
      }
    },
    mounted(){
    },
    methods: {
      
    },
    components: {InfoTable, DataChartTable}
  })
</script>

<template>
  <div class="d-flex">
    <DataChartTable/>
    <InfoTable/>
  </div>
</template>
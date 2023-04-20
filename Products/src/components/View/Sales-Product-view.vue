<script lang="ts">
  import { defineComponent } from 'vue'

  import InfoTable from './InfoTable.vue'
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
    components: {InfoTable}
  })
</script>

<template>
  <div class="d-flex">
    <div class="col-6"></div>
    <InfoTable></InfoTable>
  </div>
</template>
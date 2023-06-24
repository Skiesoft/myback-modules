<script lang="ts">
import { defineComponent } from 'vue'

import InfoTable from './InfoTable.vue'
import DataChartTable from './DatachartsTable/DataChartTable.vue'
// import StatisticTable from './StatisticTable/StatisticTable.vue'

export default defineComponent({
  data () {
    return {

    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      if (this.$route.params.id === '0') {
        document.getElementById('DataChartTable')?.style.setProperty('display', 'none')
      }
    }
  },
  components: { InfoTable, DataChartTable }
})
</script>

<template>
  <div>
    <router-link to="/" custom v-slot="{ navigate }">
      <div class="m-3" type="button" @click="navigate">
        <i class="bi bi-arrow-left" style="font-size: 25px"></i>
      </div>
    </router-link>
    <div class="d-flex justify-content-center">
      <DataChartTable id="DataChartTable"/>
      <InfoTable/>
    </div>
  </div>
</template>

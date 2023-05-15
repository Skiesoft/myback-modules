<script lang="ts">
  import { defineComponent } from 'vue'

  import {Pie} from 'vue-chartjs'
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

  ChartJS.register(ArcElement, Tooltip, Legend)


  export default defineComponent ({
    data(){
      return {
        chartData: {
          labels: [ '男性','女性'],
          datasets: [ { backgroundColor:['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],data: [55,45] } ]
        },
        chartOptions: {
          responsive: true,
          rotation:0
        }
      }
    },
    mounted(){
    },
    methods: {
      
    },
    components: {Pie}
  })
</script>

<template>
  <div class="d-flex justify-content-center">
    <div class="box border rounded col-6 m-2 align-items-center">
      <Pie :data="chartData" :options="chartOptions"/>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement,CategoryScale, LinearScale } from 'chart.js'
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)


  export default defineComponent ({
    data(){
      return {
        chartData: {
          labels: [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          datasets: [ { data: [40, 20, 12, 15, 16, 17, 18, 19, 20, 25, 26, 27] } ]
        },
        chartOptions: {
          responsive: true
        }
      }
    },
    mounted(){
    },
    methods: {
      
    },
    components: {Bar}
  })
</script>

<template>
  <div class="d-flex box col-11 border rounded m-2 align-items-center" style="height:365px">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
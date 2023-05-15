<script lang="ts">
  import { defineComponent } from 'vue'
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement,CategoryScale, LinearScale } from 'chart.js'
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)


  export default defineComponent ({
    data(){
      return {
        chartData: {
          labels: [ '1-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100'],
          datasets: [ { label:'年齡分布',data: [40, 20, 12, 15, 16, 17, 18, 19, 20, 25] , backgroundColor:'rgba(54, 162, 235, 0.2)', borderColor:'rgb(54, 162, 235)'} ]
        },
        chartOptions: {
          responsive: true,
          indexAxis: 'y'
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
  <div class="d-flex box col-11 border rounded m-2 align-items-center p-4" >
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
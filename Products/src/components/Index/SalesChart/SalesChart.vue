<script lang="ts">
  import { defineComponent } from 'vue'
  import { Line } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement,CategoryScale, LinearScale } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

  export default defineComponent({
    data() {
        return{
          chartData: {
          labels: Array.from({length: 31}, (_, i) => i + 1),
          datasets: [ { label:'本月銷售總額', data: [40, 20, 12, 15, 16, 17, 18, 19, 20, 25, 26, 27],borderColor:'rgba(54, 162, 235, 0.2)', backgroundColor:'rgba(54, 162, 235, 0.2)' } ]
        },
        chartOptions: {
          responsive: true,
          aspectRatio: 5
        }
        }
    },
    methods: {
      async update(){
        
      }
    },
    components:{Line}
  })
</script>

<template>
  <div class="box col-7 m-2">
    <h4 class="fw-bold m-4">
      本月銷售統計
    </h4>
    <div style="height:180px">
      <Line :data="chartData" :options="chartOptions"/>
    </div>
  </div>
</template>
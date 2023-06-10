<script lang="ts">
import { defineComponent } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

export default defineComponent({
  data () {
    return {
      chartData: {
        labels: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        datasets: [{ label: '今年銷售總額', data: [40, 20, 12, 15, 16, 17, 18, 19, 20, 25, 26, 27], borderColor: 'rgba(54, 162, 235, 0.2)', backgroundColor: 'rgba(54, 162, 235, 0.2)' }]
      },
      chartOptions: {
        responsive: true
      }
    }
  },
  mounted () {
  },
  methods: {

  },
  components: { Line }
})
</script>

<template>
  <div class="d-flex box col-11 border rounded m-2 align-items-center p-4">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

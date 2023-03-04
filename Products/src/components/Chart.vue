<template>
    <Line :data="chartData" :options="chartOptions" />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { Line } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement,CategoryScale, LinearScale } from 'chart.js'

    ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

    export default defineComponent ({
    name: 'LineChart',
    components: { Line },
    data() {
        return {
        chartData: {
            labels: [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            datasets: [ { data: [40, 20, 12, 15, 16, 17, 18, 19, 20, 25, 26, 27] } ]
        },
        chartOptions: {
            responsive: true
        }
        }
    }
})
</script>
<template>
    <Line :data="chartData" :options="chartOptions" />
</template>

<script lang="ts">
    import { Line } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement,CategoryScale, LinearScale } from 'chart.js'

    ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

    export default {
    name: 'LineChart',
    components: { Line },
    data() {
        return {
        chartData: {
            labels: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [ { data: [40, 20, 12, 15, 16, 17, 18, 19, 20, 25, 26, 27] } ]
        },
        chartOptions: {
            responsive: true
        }
        }
    }
}
</script>
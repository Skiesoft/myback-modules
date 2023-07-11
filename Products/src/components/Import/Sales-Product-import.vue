<script lang="ts">
import { defineComponent } from 'vue'
import ImportTable from './ImportTable.vue'

export default defineComponent({
  data () {
    return {

    }
  },
  components: {
    ImportTable
  }
})

</script>

<template>
  <div>
    <div class="pt-3">
      <router-link to="/" custom v-slot="{ navigate }">
        <button type="button" @click="navigate" role="link" class="align-self-start btn btn-light" style="background: #f5f5f5"><i class="bi bi-arrow-left-short" style="font-size: 30px"></i></button>
      </router-link>
    </div>
    <ImportTable/>
  </div>
</template>

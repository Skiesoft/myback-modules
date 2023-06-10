<script lang="ts">
import { defineComponent } from 'vue'
import { Database } from '@myback/sdk'
import { Contact } from '../model/contact'

export default defineComponent({
  data () {
    return {
      totalMember: ''
    }
  },
  mounted () {
    this.updateTotalMember()
  },
  methods: {
    async updateTotalMember () {
      const db = new Database()
      this.totalMember = String(await db.count(Contact))
    }
  }
})
</script>

<template>
  <div class="box col-3 m-3 p-4 bg-white text-dark border rounded ">
    <h4>會員總數</h4>
    <div class="d-flex">
      <i class="bi bi-person" style="font-size: 56px"></i>
      <h1 class="mt-1 m-2 p-3">{{ totalMember }}</h1>
    </div>
  </div>
</template>

<style scoped>
.box{
  height: 161px;
}
</style>

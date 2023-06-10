<script lang="ts">
import { defineComponent } from 'vue'
import { Database, QueryBuilder } from '@myback/sdk'
import { Contact } from '../model/contact'
export default defineComponent({
  data () {
    return {
      phonenumber: '',
      phonenumber_now: '',
      membername: '',
      isMember: false
    }
  },
  methods: {
    async checkMember () {
      if (this.isMember) {
        this.$emit('updatePhoneNumber', this.phonenumber_now)
      }
    },
    async onlyNumber (evt: KeyboardEvent): Promise<void> {
      const keysAllowed: RegExp = /[0-9]/g
      const keyPressed: string = evt.key

      if (!keysAllowed.exec(keyPressed)) {
        evt.preventDefault()
      }
    },
    async findmember () {
      const db = new Database()
      const query = QueryBuilder.equal('phone_number', this.phonenumber)
      const found = await db.find(Contact, query)
      if (found[0]) {
        this.membername = found[0].name
        this.isMember = true
        this.phonenumber_now = this.phonenumber
      } else {
        this.isMember = false
        this.membername = ''
        this.phonenumber_now = ''
      }
      this.phonenumber = ''
    },
    async removeMember () {
      this.membername = ''
      this.isMember = false
      this.phonenumber_now = ''
    }
  }
})
</script>

<template>
  <div class="d-flex ms-3 flex-fill clearfix">
    <h3 class="col-2 align-self-center m-0">會員:</h3>
    <div class="col-6"><input type="text" class="form-control" placeholder="0987654321" v-model="phonenumber" @keyup.enter="findmember"  @keypress="onlyNumber($event)"></div>
    <h3 class="align-self-center m-0 ms-3">名稱：{{ membername }}</h3>
    <button v-show="isMember" class="btn btn-outline-secondary ms-auto" @click="removeMember"><i class="bi bi-x-lg"></i></button>
  </div>
</template>

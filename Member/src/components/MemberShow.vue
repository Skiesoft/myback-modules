<script lang="ts">
import { defineComponent } from 'vue'
import { Database, QueryBuilder } from '@myback/sdk'
import { Contact } from '../model/contact'
import { Transaction } from '../model/transaction'
import EditMember from './EditMember.vue'

export default defineComponent({
  props: ['id'],
  data () {
    const member: Contact = new Contact()
    return {
      member,
      createDate: '',
      totalPrice: 0,
      isshowedit: false
    }
  },
  mounted () {
    this.findMember()
  },
  methods: {
    async findMember () {
      const db = new Database()
      const query = QueryBuilder.equal('id', this.id)
      const found = await db.find(Contact, query)
      if (found[0]) {
        this.member = found[0]
        console.log(this.member)
        this.createDate = String(this.member.create_date?.getFullYear()) + ('/') + String(this.member.create_date?.getMonth()! + 1) + ('/') + String(this.member.create_date?.getDate())
        this.calculateTotalPrice()
      }
    },
    async calculateTotalPrice () {
      const db = new Database()
      const query = QueryBuilder.equal('contact', this.id)
      const found = await db.find(Transaction, query)
      if (found.length !== 0) {
        for (let i = 0; i < found.length; i++) {
          this.totalPrice += found[i].total_price
        }
      }
    },
    async showEdit () {
      this.isshowedit = true
    },
    async closeModal () {
      this.findMember()
      this.isshowedit = false
    }

  },
  components: {
    EditMember
  }
})
</script>

<template>
  <div>
    <div class="d-flex justify-content-center pt-3 pb-3">
      <router-link to="/" custom v-slot="{ navigate }">
        <button type="button" @click="navigate" role="link" class="align-self-start btn btn-light"><i class="bi bi-arrow-left-short" style="font-size: 30px"></i></button>
      </router-link>
      <div class="col-10">
        <div class="d-flex bg-white text-dark border rounded mb-3 p-3 justify-content-between" style="height: 275px">
          <i class="bi bi-person-circle align-self-center offset-1" style="font-size: 180px"></i>
          <div class="p-3 col-5">
            <div>
              <h1>{{ member.name }}</h1>
            </div>
            <div class="p-2">
              <div class="d-flex justify-content-between">
                <div>ID:</div>
                <div>{{ member.id }}</div>
              </div>
              <div class="d-flex justify-content-between">
                <div>Email:</div>
                <div>{{ member.email }}</div>
              </div>
              <div class="d-flex justify-content-between">
                <div>電話號碼:</div>
                <div>{{ member.phone }}</div>
              </div>
              <div class="d-flex justify-content-between">
                <div>加入時間:</div>
                <div>{{ createDate }}</div>
              </div>
              <div class="d-flex justify-content-between">
                <div>層級:</div>
                <!-- <div>{{ member.role }}</div> -->
              </div>
              <div class="d-flex justify-content-between">
                <div>累積消費總額:</div>
                <div>{{ totalPrice }}</div>
              </div>
            </div>
          </div>

          <button type="button" class="btn btn-outline-primary align-self-start flex-shrink-1 offset-2" @click="showEdit">編輯</button>
        </div>
        <div class="bg-white text-dark border rounded mt-3 p-3 d-flex justify-content-center" style="height: 500px">
        </div>
      </div>
    </div>

    <EditMember :show-modal-in="isshowedit" :member-id="member.id" @close="closeModal"/>
  </div>
</template>

<style scoped>
.btn-bd-light {
  --bs-btn-font-weight: 600;
  --bs-btn-color: var(--bs-black);
  --bs-btn-bg: var(--bd-violet);
  --bs-btn-border-color: var(--bd-violet);
  --bs-btn-border-radius: .5rem;
  --bs-btn-hover-color: var(--bs-black);
  --bs-btn-hover-bg: #{shade-color($bd-violet, 10%)};
  --bs-btn-hover-border-color: #{shade-color($bd-violet, 10%)};
  --bs-btn-focus-shadow-rgb: var(--bd-violet-rgb);
  --bs-btn-active-color: var(--bs-btn-hover-color);
  --bs-btn-active-bg: #{shade-color($bd-violet, 20%)};
  --bs-btn-active-border-color: #{shade-color($bd-violet, 20%)};
}
</style>

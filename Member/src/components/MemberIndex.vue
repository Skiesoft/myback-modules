<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Database, QueryBuilder } from '@myback/sdk'
import { Query } from '@myback/sdk/build/api/query-builder'
import { Contact } from '../model/contact'
import { Transaction } from '../model/transaction'
import TotalMembers from './TotalMembers.vue'
import NewMembers from './NewMembers.vue'
import MemberGrowth from './MemberGrowth.vue'
import AddMember from './AddMember.vue'
import PageBar from './PageBar.vue'
import ConfirmModal from './ConfirmModal.vue'

type DataType = {
  query: Query,
  members: Array<Contact>,
  memberPrice: Array<number>,
  current_page: number,
  isshowadd: boolean,
  search_target: string,
  sort_element: string,
  sort_order: 'asc' | 'desc' | undefined,
  page_size: number,
  list_product_count: number,
  total_page: number,
  sort_target: string,
  memberpath: Array<string>,
  isshowconfirm: boolean,
  delete_member_id: number
}

export default defineComponent({
  setup () {
    const pageBarRef = ref<InstanceType<typeof PageBar>>()
    const reload = () => {
      pageBarRef.value?.reload()
    }
    const memberGrowthRef = ref<InstanceType<typeof MemberGrowth>>()
    const updateMemberGrowth = () => {
      memberGrowthRef.value?.updateMemberGrowth()
    }
    const totalMembersRef = ref<InstanceType<typeof TotalMembers>>()
    const updateTotalMember = () => {
      totalMembersRef.value?.updateTotalMember()
    }
    const newMembersRef = ref<InstanceType<typeof NewMembers>>()
    const updateNewMember = () => {
      newMembersRef.value?.updateNewMember()
    }
    return {
      pageBarRef,
      reload,
      memberGrowthRef,
      updateMemberGrowth,
      totalMembersRef,
      updateTotalMember,
      newMembersRef,
      updateNewMember
    }
  },
  data () {
    return {
      query: QueryBuilder.greaterThan('id', -1),
      members: [],
      memberPrice: [],
      current_page: 1,
      isshowadd: false,
      search_target: '',
      sort_element: 'id',
      sort_order: 'asc',
      page_size: 10,
      list_product_count: 0,
      total_page: 0,
      sort_target: 'id',
      memberpath: [],
      isshowconfirm: false,
      delete_member_id: 0
    } as DataType
  },
  mounted () {
    this.updateMembers()
    this.changeQuery(null)
  },
  methods: {
    async showAdd () {
      this.isshowadd = true
    },
    async closeModal () {
      this.isshowadd = false
      this.isshowconfirm = false
      this.updateMemberGrowth()
      this.updateNewMember()
      this.updateTotalMember()
      this.updateMembers()
      this.reload()
    },
    async changePage (page:number) {
      this.current_page = page
      await new Promise(f => setTimeout(f, 1))
      this.updateMembers()
    },
    async sort (target: string) {
      const prev_element = document.getElementById(this.sort_target)
      prev_element?.classList.remove('sortUp')
      prev_element?.classList.remove('sortDown')

      if (this.sort_target !== target) {
        this.sort_target = target
        this.sort_order = 'asc'
        document.getElementById(target)?.classList.add('sortUp')
        this.updateMembers()
        return
      }

      if (this.sort_order === 'asc') {
        this.sort_order = 'desc'
        document.getElementById(target)?.classList.add('sortDown')
      } else {
        this.sort_order = 'asc'
        document.getElementById(target)?.classList.add('sortUp')
      }
      this.updateMembers()
    },
    async updateMembers () {
      const db = new Database()
      let query
      if (this.search_target === '') {
        query = QueryBuilder.orderBy(this.query, this.sort_element, this.sort_order)
      } else {
        query = QueryBuilder.orderBy(QueryBuilder.like('name', '%' + this.search_target + '%'), this.sort_element, this.sort_order)
      }
      this.members = await db.find(Contact, query, this.current_page - 1, this.page_size)
      this.memberpath = this.members.map(function (element) {
        return '/show/' + String(element.id)
      })
      this.calculateTotalPrice()
      this.list_product_count = Number(await db.count(Contact, query))
      this.total_page = Math.ceil(this.list_product_count / this.page_size)
    },
    async calculateTotalPrice () {
      const db = new Database()
      for (let i = 0; i < this.members.length; i++) {
        const query = QueryBuilder.equal('member', this.members[i].id!)
        let price = 0
        const found = await db.find(Transaction, query)
        if (found.length !== 0) {
          for (let j = 0; j < found.length; j++) {
            price += found[j].amount
          }
        }
        this.memberPrice[i] = price
      }
    },
    async changeQuery (query:Query|null) {
      if (query === null) {
        this.query = QueryBuilder.greaterThan('id', 0)
      } else {
        this.query = query
      }
      await new Promise(f => setTimeout(f, 1))
      this.reload()
      this.updateMembers()
    },
    async generateQuery () {
      let query:Query|null = null

      if (this.search_target === '') {
        query = QueryBuilder.greaterThan('id', -1)
      } else {
        query = QueryBuilder.like('name', '%' + this.search_target + '%')
      }
      this.changeQuery(query)
    },
    async deleteMember () {
      const db = new Database()
      const query = QueryBuilder.equal('id', this.delete_member_id)
      const found = await db.find(Contact, query)
      if (found.length !== 0) {
        await db.destroy(Contact, found[0])
      }
      this.closeModal()
    },
    async deleteMemberConfirm (id: number | undefined) {
      this.isshowconfirm = true
      this.delete_member_id = id!
    }
  },
  components: {
    TotalMembers, NewMembers, MemberGrowth, AddMember, PageBar, ConfirmModal
  }
})
</script>

<template>
  <div>
    <div class="d-flex justify-content-center">
      <h1 class="p-3 col-11"><b>會員</b></h1>
    </div>
    <div class="d-flex justify-content-center">
      <TotalMembers ref="totalMembersRef"/>
      <NewMembers ref="newMembersRef"/>
      <MemberGrowth ref="memberGrowthRef"/>
    </div>
    <div class="d-flex justify-content-center mt-3" style=" height: 450px">
      <div class="col-11 bg-white border rounded p-4">
        <div class="d-flex justify-content-between">
          <PageBar ref="pageBarRef" :table_name="'Member'" :page_size="page_size" :query="query" @update="changePage"/>
          <div class="d-flex">
            <div class="flex-grow-1 me-2">
              <input type="text" class="form-control" placeholder="Search" v-model="search_target" @input="generateQuery">
            </div>
            <button type="button" class="btn btn-primary ms-2 me-2">Mail</button>
            <button type="button" class="btn btn-primary ms-2 me-2" @click="showAdd">新增會員</button>
          </div>
        </div>

        <AddMember :show-modal-in="isshowadd" @close="closeModal"/>
        <ConfirmModal :confirm_message="'您確定要刪除此會員嗎?'" :confirm_option="'刪除'" :show-modal-in="isshowconfirm" @delete="deleteMember"/>

        <div class="d-flex container mt-2">
          <div class="d-flex col-1">
            <input type="checkbox" class="ms-2 me-2">
            <b class="ms-2 align-self-center">ID</b>
            <div class="d-flex flex-column ms-1" @click="sort('id')">
              <div class="arrow-up"><i class="bi bi-caret-up-fill" type="button" style="font-size: 1px"></i></div>
              <div class="arrow-down"><i class="bi bi-caret-down-fill" type="button" style="font-size: 1px"></i></div>
            </div>
          </div>
          <div class="col-3 d-flex">
            <b class="align-self-center">名字</b>
            <div class="d-flex flex-column ms-1" @click="sort('name')">
              <div class="arrow-up"><i class="bi bi-caret-up-fill" type="button" style="font-size: 1px"></i></div>
              <div class="arrow-down"><i class="bi bi-caret-down-fill" type="button" style="font-size: 1px"></i></div>
            </div>
          </div>
          <div class="col-3 d-flex">
            <b class="align-self-center">層級</b>
            <div class="d-flex flex-column ms-1" @click="sort('role')">
              <div class="arrow-up"><i class="bi bi-caret-up-fill" type="button" style="font-size: 1px"></i></div>
              <div class="arrow-down"><i class="bi bi-caret-down-fill" type="button" style="font-size: 1px"></i></div>
            </div>
          </div>
          <div class="col-3 d-flex">
            <b class="align-self-center">累積消費總額</b>
            <div class="d-flex flex-column ms-1">
              <div class="arrow-up"><i class="bi bi-caret-up-fill" type="button" style="font-size: 1px"></i></div>
              <div class="arrow-down"><i class="bi bi-caret-down-fill" type="button" style="font-size: 1px"></i></div>
            </div>
          </div>
          <div class="col-2 d-flex">
            <b class="align-self-center"></b>
          </div>

        </div>
        <hr class="border border-dark opacity-100  mt-0 m-2" />

        <div v-for="(member,i) in members" :key="i">
          <div class="d-flex container mt-2">
            <div class="d-flex col-1">
              <input type="checkbox" class="ms-2 me-2">
              <div class="ms-2">{{ member.id }}</div>
            </div>
            <div class="col-3">{{ member.name }}</div>
            <!-- <div class="col-3">{{ member.role }}</div> -->
            <div class="col-3">{{ memberPrice[i] }}</div>
            <div class="d-flex col-2">
              <router-link :to="{ path: memberpath[i] }" class="me-3" style="color: #3B587A">詳細資料</router-link>
              <a href="#" class="link-danger ms-3" @click="deleteMemberConfirm(member.id)">刪除</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.arrow-up{
  margin-bottom:-7px;
}
.arrow-down{
  margin-top:-7px;
}
</style>

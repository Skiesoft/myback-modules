<script lang="ts">
import { defineComponent } from 'vue'
import { Database, QueryBuilder } from '@myback/sdk'
import { Product } from '@/model/product'
import { Transaction } from '@/model/transaction'
import { TransactionItem } from '@/model/transaction-item'

export default defineComponent({
  data () {
      type ComponentData = {
        products:Array<Product>
        counts:Array<number>
        search:string
        required:boolean
        results:Array<string>
        isOpen:boolean
        arrowCounter:number
        unitPrice:Array<number>
        subTotal:Array<number>
        totalPrice:number
      }
      return {
        products: [],
        counts: [],
        search: '',
        required: false,
        results: [],
        isOpen: false,
        arrowCounter: -1,
        unitPrice: [],
        subTotal: [],
        totalPrice: 0
      } as ComponentData
  },
  methods: {
    async onlyNumber (evt: KeyboardEvent): Promise<void> {
      const keysAllowed: RegExp = /[0-9]/g
      const keyPressed: string = evt.key

      if (!keysAllowed.exec(keyPressed)) {
        evt.preventDefault()
      }
    },
    async countAdd (index: number) {
      this.counts[index] = Number(this.counts[index])
      this.counts[index] += 1
    },
    async countMinus (index: number) {
      if (this.counts[index] > 1) {
        this.counts[index] = Number(this.counts[index])
        this.counts[index] -= 1
      }
    },
    async remove (index: number) {
      this.products.splice(index, 1)
      this.unitPrice.splice(index, 1)
      this.counts.splice(index, 1)
      this.subTotal.splice(index, 1)
    },
    async find () {
      let loadingElement =  document.getElementById('loading')
      if (loadingElement) {
        loadingElement.style.visibility = "visible"
      }
      const db = new Database()
      const indexofupc = this.products.map(function (value) { return value.upc }).indexOf(this.search)
      const searchElement = document.getElementById('search')
      if (indexofupc >= 0) {
        this.products.push(this.products[indexofupc])
        this.products.splice(indexofupc, 1)
        this.unitPrice.push(this.unitPrice[indexofupc])
        this.unitPrice.splice(indexofupc, 1)
        this.search = ''
        this.counts[indexofupc]++
        this.counts.push(this.counts[indexofupc])
        this.counts.splice(indexofupc, 1)
        this.subTotal.push(this.subTotal[indexofupc])
        this.subTotal.splice(indexofupc, 1)
        this.calculateSubPrice(indexofupc)
        searchElement?.classList.remove('was-validated')
      } else {
        const queryUpc = QueryBuilder.equal('upc', this.search)
        const foundinupc = await db.find(Product, queryUpc)
        if (foundinupc[0]) {
          this.products.push(foundinupc[0])
          this.unitPrice.push(0)
          this.counts.push(1)
          this.subTotal.push(0)
          this.search = ''
          searchElement?.classList.remove('was-validated')
        } else {
          this.search = ''
          searchElement?.classList.add('was-validated')
        }
      }
      if (loadingElement) {
        loadingElement.style.visibility = "hidden"
      }
      this.results = []
    },
    async calculateSubPrice (index: number) {
      this.subTotal[index] = this.unitPrice[index] * this.counts[index]
      this.calculateTotalPrice()
    },
    async calculateTotalPrice () {
      this.totalPrice = 0
      if (this.subTotal.length > 0) {
        this.subTotal.forEach(element => {
          this.totalPrice += element
        });
      }
    },
    async filterResults () {
      let loadingElement =  document.getElementById('loading')
      if (loadingElement) {
        loadingElement.style.visibility = "visible"
      }
      const db = new Database()
      const query = QueryBuilder.like('upc', '%' + this.search + '%')
      const found = await db.find(Product, query)
      this.results = found.map(x => x.upc)
      if (loadingElement) {
        loadingElement.style.visibility = "hidden"
      }
    },
    async onEnter () {
      if (this.isOpen) {
        if (this.arrowCounter !== -1) {
          this.search = this.results[this.arrowCounter]
          this.arrowCounter = -1
        }
      }
      this.isOpen = false
    },
    async setResult (result: string) {
      if (this.results.length !== 0) {
        this.search = result
        this.arrowCounter = -1
      }
    },
    async closefilter () {
      this.isOpen = false
    },
    async onArrowDown () {
      if (this.arrowCounter < this.results.length - 1) {
        this.arrowCounter = this.arrowCounter + 1
      }
    },
    async onArrowUp () {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1
      }
    },
    async addProduct () {
      document.getElementById('add')?.setAttribute('disabled', '')
      const time = new Date()
      const transaction = new Transaction()
      transaction.time = time
      transaction.total_price = Number(this.totalPrice)

      const dbT = new Database()
      await dbT.save(Transaction, transaction)

      for (let i = 0; i < this.products.length; i++) {
        const db = new Database()
        const dbI = new Database()
        const transactionItem = new TransactionItem()

        const name = String(this.products[i].name)
        const query = QueryBuilder.equal('name', name)
        const product = await db.find(Product, query)

        product[0].status = '銷售中'
        product[0].stock += Number(this.counts[i])

        transactionItem.id = transaction.id
        transactionItem.transaction = transaction
        transactionItem.product = product[0]
        transactionItem.quantity = this.counts[i]
        transactionItem.labeled_price = this.products[i].price
        transactionItem.currency = 'NT'
        transactionItem.paid_price = this.products[i].price

        await db.save(Product, product[0])
        await dbI.save(TransactionItem, transactionItem)
      }
      this.$router.push({ path: '/' })
    },
    async checkCountValid (index: number) {
      if (this.counts[index] == 0) {
        this.counts[index] = 1
      }
    }

  },
  watch: {
    search () {
      if (this.search !== '') {
        this.filterResults()
        this.isOpen = true
      } else {
        this.results = []
        this.isOpen = false
      }
    }
  }
})
</script>

<template>
  <div class="col-12 box p-4 d-flex flex-column">
    <div class=" d-flex">
      <h4 class="fw-bold mt-1">
        商品入庫
      </h4>
    </div>
    <div class="d-flex mt-3">
      <div class="col-2 fw-bold d-flex align-items-center">
        條碼
      </div>
      <div class="col-5 fw-bold d-flex align-items-center">
        名稱
      </div>
      <div class="col-1 fw-bold d-flex align-items-center">
        單價
      </div>
      <div class="col-1 fw-bold d-flex align-items-center">
        數量
      </div>
      <div class="col-1 fw-bold d-flex align-items-center ms-3">
        小計
      </div>
    </div>

    <div v-for="(product, index) in  products" :key="index" class="d-flex mt-2">
      <div class="col-2 overflowhidden align-self-center ps-2">{{ product.name }}</div>
      <div class="col-5 overflowhidden align-self-center">{{ product.upc }}</div>
      <div class="col-1 pe-1">
        <input class="form-control" v-model="unitPrice[index]" placeholder="單價" @input="calculateSubPrice(index)" @keypress="onlyNumber($event)"/>
      </div>
      <div class="col-1 d-flex align-content-end me-1">
        <button type="button" class="btn btn-bd-count btn-sm" @click="countMinus(index), calculateSubPrice(index)"><i class="bi bi-dash"></i></button>
        <input class="form-control form-control-sm" type="text" placeholder="數量" v-model="counts[index]" @input="calculateSubPrice(index)" @keydown.enter.prevent="checkCountValid(index), calculateSubPrice(index)" @focusout="checkCountValid(index), calculateSubPrice(index)" @keypress="onlyNumber($event)">
        <button type="button" class="btn btn-bd-count btn-sm" @click="countAdd(index), calculateSubPrice(index)"><i class="bi bi-plus"></i></button>
      </div>
      <div class="col-1 align-self-center ms-3">{{ subTotal[index] }}</div>
      <div class="col-2 d-flex justify-content-end pe-3">
        <div type="button" style="color: red" @click="remove(index), calculateTotalPrice()">刪除</div>
      </div>
    </div>

    <div class="d-flex col-2 mt-2">
      <form id="search" class="align-self-center position-relative">
        <input type="text" class="form-control" placeholder="請輸入條碼"
          v-model="search"
          @keydown.enter.prevent="onEnter"
          @keyup.enter="find(); closefilter();"
          @keydown.up.prevent="onArrowUp"
          @keydown.down.prevent="onArrowDown" required>
        <ul v-show="isOpen" class="list-group mb-3 position-absolute top-100 z-index-2 w-100 text-break" style="overflow: auto; max-height: 100px;">
          <li v-for="(result, i) in results"
            :key="i"
            class="list-group-item"
            @mousedown="setResult(result); find();"
            @mouseover="arrowCounter = i"
            @mouseup.left="closefilter();"
            :class="{'active': i === arrowCounter}">{{ result }}
          </li>
        </ul>
      </form>
      <div id="loading" class="spinner-border spinner-border-sm text-primary col-2 align-self-center ms-1" role="status" aria-hidden="true" style="visibility: hidden">
      </div>
    </div>
    <div class="d-flex justify-content-end mt-auto">
      <div class="d-flex me-3"><h2 class="m-auto">總計: {{ totalPrice }}</h2></div>
      <button id='add' class="btn btn-primary" @click="addProduct()">新增入庫</button>
    </div>
  </div>
  
</template>

<style scoped>
.box{
  min-height: 450px;
  height: auto
}
</style>

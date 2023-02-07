<script lang="ts">
import { Database, QueryBuilder } from '@myback/sdk'
import { Item } from './model/item'
import { Member } from './model/member'
import { Deal } from './model/deal'

export default {
  data() {
    const items: Array<Item> = [];
    const barcodes: Array<number> = [];
    const prices: Array<number> = [];
    const counts: Array<number> = [];
    const subTotal: Array<number> = [];
    const itemnames: Array<string> = [];
    const reasons: Array<string> = [];
    const IDs: Array<number> = [];
    var totalprice: number = 0;
    const changeprices: Array<number> = [];
    const members: Array<Member> = [];
    const allitemnames: Array<string> = [];

    const results: Array<string> = []

    return {
      items,
      barcodes,
      prices,
      counts,
      subTotal,
      itemnames,
      reasons,
      IDs,
      totalprice,
      changeprices,
      members,
      barcode: "",
      itemname: "",
      price: "",
      stock: "",
      phonenumber: "",
      membername: "",
      id: "",
      allitemnames,
      results,
      isOpen: false,
      arrowCounter: -1,
      actualIncome: "",
      payment: "cash",
      bill: false
    }
  },
  mounted() {
    this.additemname()
  },
  methods: {
    async additemname() {
      const db = new Database()
      let temparray = await db.all(Item)
      this.allitemnames = temparray.map(item => item.name)
    },
    async add(item: Item){
      this.items.push(item)
      this.barcodes.push(item.barcode!)
      this.prices.push(item.price!)
      this.counts.push(1)
      this.subTotal.push(item.price!)
      this.itemnames.push(item.name!)
      this.IDs.push(item.id!)
      this.reasons.push("")
      this.changeprices.push()
      this.updatetotalprice()
    },
    async findBarcode() {
      const db = new Database()
      const index = this.barcodes.indexOf(Number(this.barcode))
      if(index >= 0){
        this.counts[index] += 1
      }
      else{
        let query = QueryBuilder.equal("barcode", Number(this.barcode))
        let found = await db.find(Item, query)
        if (found[0]){
          this.add(found[0])
          this.price = found[0].price
          this.stock = found[0].stock
        }
      }
      this.barcode = ""
    },
    async findID() {
      const db = new Database()
      const index = this.IDs.indexOf(Number(this.id))
      if(index >= 0){
        this.counts[index] += 1
      }
      else{
        let query = QueryBuilder.equal("id", this.id)
        let found = await db.find(Item, query)
        if (found[0]){
          this.add(found[0])
          this.price = found[0].price
          this.stock = found[0].stock
        }
      }
      this.id = ""
    },
    async findName(){
      const db = new Database()
      const index = this.itemnames.indexOf(this.itemname)
      if(index >= 0){
        this.counts[index] += 1
      }
      else{
        let query = QueryBuilder.equal("name", this.itemname)
        
        let found = await db.find(Item, query)
        if (found[0]){
          this.add(found[0])
          this.price = found[0].price
          this.stock = found[0].stock
        }
      }
      this.itemname = ""

    },
    async remove(index: number) {
      this.items.splice(index, 1)
      this.barcodes.splice(index, 1)
      this.prices.splice(index, 1)
      this.counts.splice(index, 1)
      this.subTotal.splice(index, 1)
      this.itemnames.splice(index, 1)
      this.IDs.splice(index, 1)
      this.reasons.splice(index, 1)
      this.totalprice = 0
      this.changeprices.splice(index, 1)
      for(var i = 0; i < this.subTotal.length; i++){
        this.totalprice += this.subTotal[i]
      }
    },
    async removeall(){
      this.items = []
      this.barcodes = []
      this.prices = []
      this.counts = []
      this.subTotal = []
      this.itemnames = []
      this.IDs = []
      this.reasons = []
      this.changeprices = []
      this.totalprice = 0
    },
    async updatetotalprice(){
      this.totalprice = 0
      for(var i = 0; i < this.subTotal.length; i++){
        this.totalprice += this.subTotal[i]
      }
      if(this.bill == true){
        this.totalprice *= 1.05
        this.totalprice = Math.ceil(this.totalprice)
      }
    },
    async updateprice(subtotalprice: number, index: number){
      this.subTotal[index] = subtotalprice
      this.updatetotalprice()
    },
    async calprice(index: number){
      let subtotalprice = Number(this.counts[index]) * Number(this.prices[index])
      if(this.changeprices[index]){
        subtotalprice = (this.prices[index] - this.changeprices[index]) * this.counts[index]
        this.updateprice(subtotalprice, index)
      }
      else{
        this.updateprice(subtotalprice, index)
      }
    },
    async findmember(){
      const db = new Database()
      let query = QueryBuilder.equal("phone_number", this.phonenumber)
      this.phonenumber = ""
      let found = await db.find(Member, query)
      if (found[0]){
        this.membername = found[0].name
      }
    },
    async countAdd(index: number){
      this.counts[index] += 1
      this.calprice(index)
    },
    async countMinus(index: number){
      this.counts[index] -= 1
      this.calprice(index)
    },
    async testadd(){
      for(var i = 1; i < 8; i++){
        const testitem: Item = new Item()
        testitem.barcode = i
        testitem.name = "test" + String(i)
        testitem.price = i * i
        this.items.push(testitem)
        this.barcodes.push(i)
        this.prices.push(i * i)
        this.counts.push(1)
        this.subTotal.push(i * i)
        this.IDs.push(i)
        this.changeprices.push()
      }
      this.totalprice = 0
      for(var i = 0; i < this.subTotal.length; i++){
        this.totalprice += this.subTotal[i]
      }
    },
    async testadditem(){
      const item1 = new Item()

      item1.barcode = 1
      item1.name = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
      item1.price = 27
      item1.stock = 3

      const db = new Database()
      await db.save(Item, item1)

      const item2 = new Item()
      item2.barcode = 2
      item2.name = "袁2欣"
      item2.price = 1835
      item2.stock = 7

      await db.save(Item, item2)

      const item3 = new Item()
      item3.barcode = 3
      item3.name = "袁3欣"
      item3.price = 15347
      item3.stock = 82

      await db.save(Item, item3)
    },
    async testaddmember(){
      const member1 = new Member()
      const member2 = new Member()
      const member3 = new Member()
      const db = new Database()

      member1.phone_number = "0987654321"
      member1.name = '王小明'

      await db.save(Member, member1)

      member2.phone_number = "0912345678"
      member2.name = '王小美'

      await db.save(Member, member2)

      member3.phone_number = "0974185263"
      member3.name = '王大明'

      await db.save(Member, member3)
    },
    async setResult(result: string) {
      var vm = this;
      if (vm.results.length !== 0) {
        vm.itemname = result;
        vm.arrowCounter = -1;
        vm.isOpen = false;
      }
    },
    async onArrowDown() {
      if (this.arrowCounter < this.results.length) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },
    async onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },
    async onEnter() {
      var vm = this;
      if (vm.isOpen) {
        vm.itemname = vm.results[vm.arrowCounter];
        vm.arrowCounter = -1;
        vm.isOpen = false;
      }
    },
    async filterResults() {
      /*
      let db = new Database()
      let query = QueryBuilder.like('name', '%' + vm.itemname + '%')
      this.results = await db.find(Item, query)
      */
      // like 修好直接刪掉
      var vm = this;
      this.results = vm.allitemnames.filter(function (item, index, array) {
        return item.indexOf(vm.itemname) > -1;
      })
    },
    async complete(){
      if(this.actualIncome != ""){
        const deal = new Deal()
        let time = '20230206'
        deal.time = time
        let len = this.items.length
        const db = new Database()
        /*
        const member = new Member()
        member.phone_number = this.phonenumber
        member.name = this.membername
        
        if(this.phonenumber != ''){
          deal.member = member
        }*/
        for(let i = 0; i <= len; i++){
          // to do : item
          deal.stock_change = -1 * this.counts[i]
          console.log(this.counts)
          // to do : member
          deal.pricing = this.prices[i]
          console.log(this.prices)
          
          deal.exchange_rate = 1
          if(this.changeprices[i]){
            deal.discount = this.changeprices[i]
          }
          else{
            deal.discount = 0
          }
          
          deal.actual_price = this.subTotal[i]
          deal.remark = ""
          db.save(Deal, deal)
        }
        console.log(db.all(Deal))
        this.resetall()
      }
    },
    async resetall(){
      this.removeall()
      this.barcode = ""
      this.itemname = ""
      this.price = ""
      this.stock = ""
      this.phonenumber = ""
      this.membername = ""
      this.id = ""
      this.isOpen = false
      this.arrowCounter = -1
      this.actualIncome = ""
      this.payment = "cash"
      this.bill = false
    },
    async paymentChange(){
      if(this.payment == 'creditCard'){
        this.bill = true
        this.updatetotalprice()
      }
      else{
        this.bill = false
        this.updatetotalprice()
      }
    },
    async showdb(){
      let db = new Database()
      console.log(await db.all(Deal))
    }
  },

  watch: {
    itemname() {
      if (this.itemname !== "") {
        this.filterResults();
        this.isOpen = true;
      } else {
        this.isOpen = false;
      }
    }
  }

}
</script>

<template>
  <div class="d-flex flex-wrap">
    <div class="w-100 d-flex block">
      <div class="d-flex flex-column col-4 border rounded bg-white text-dark m-2 p-2">
        <div class="d-flex">
          <h3 class="align-self-center d-flex justify-content-center col-2 m-2 ms-0 me-0"><b>條碼</b></h3>
          <input type="text" class="align-self-center form-control me-2 m-0" placeholder="條碼" v-model="barcode" @keyup.enter="findBarcode">
        </div>
        <div class="d-flex">
          <h3 class="align-self-center d-flex justify-content-center col-2 m-2 ms-0 me-0"><b>I D</b></h3>
          <input type="text" class="align-self-center form-control me-2 m-0" placeholder="ID" v-model="id" @keyup.enter="findID">
        </div>
        <div class="d-flex">
          <h3 class="align-self-center d-flex justify-content-center col-2 m-2 ms-0 me-0"><b>名稱</b></h3>
          <div class="align-self-center position-relative w-100 me-2">
            <input type="search" class="form-control me-2 m-0"
              v-model="itemname"
              @keydown.up.prevent="onArrowUp"
              @keydown.down.prevent="onArrowDown"
              @keydown.enter.prevent="onEnter" 
              placeholder="名稱" 
              @keyup.enter="findName"
               />
            <ul v-show="isOpen" class="list-group mb-3 position-absolute top-100 z-index-3 w-100 text-break">
              <li v-for="(result, i) in results"
                :key="i"
                class="list-group-item"
                @mouseup.left.prevent="setResult(result)"
                @mouseover="arrowCounter = i"
                @mouseup.left="findName"
                :class="{'active': i === arrowCounter}">{{ result }}
              </li>
            </ul>
          </div>
        </div>
        <div class="d-flex">
          <h3 class="align-self-center d-flex justify-content-center col-2 m-2 ms-0 me-0"><b>訂價</b></h3>
          <h3 class="m-2 ms-0">{{ price }}</h3>
        </div>
        <div class="d-flex">
          <h3 class="align-self-center d-flex justify-content-center col-2 m-2 ms-0 me-0"><b>庫存</b></h3>
          <h3 class="m-2 ms-0 p-0">{{ stock }}</h3>
        </div>

        <div><button type="button" @click="testadditem">add item to db</button></div>
        <div><button type="button" @click="testaddmember">add member to db</button></div>
        <div><button type="button" @click="showdb">show db</button></div>


        <div class="d-flex justify-content-center" style="height:30%;"><img src=""></div>
        <div class="d-flex justify-content-center" style="height:30%"><img src=""></div>
      </div>
      <div class="tableFixHead flex-fill border rounded bg-white text-dark m-2 ps-2 pe-2">
        <table class="table align-middle">
          <thead>
            <tr>
              <th class="col-3" scope="col"><h3 class="m-0">名稱</h3></th>
              <th class="col-6" scope="col"><h3 class="m-0">訂價</h3></th>
              <th class="col-1" scope="col"><h3 class="m-0">數量</h3></th>
              <th class="col-1" scope="col"><h3 class="m-0"><b>小計</b></h3></th>
              <th class="col-1 p-0" scope="col"><button type="button" class="btn btn-outline-danger mt-2 mb-1" @click="removeall">清除</button></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <th scope="row"><h5 class="p-0 text-break">{{ item.name }}</h5></th>
              <td>
                <div class="d-flex">
                  <h4 class="align-self-center m-0 col-2">{{ item.price }}</h4>
                  <div class="d-flex">
                    <input type="text" class="align-self-center form-control form-control-sm h-25" v-model="changeprices[index]" placeholder="折價差額" @input="calprice(index)">
                    <input type="text" class="align-self-center form-control form-control-sm h-25 ms-1" placeholder="原因" v-model="reasons[index]">
                  </div>
                </div>
              </td>
              <td class="p-0">
                <div class="d-flex align-content-end">
                  <button type="button" class="btn btn-bd-count"><i class="bi bi-dash" @click="countMinus(index)"></i></button>
                  <input class="form-control form-control-sm" type="text" placeholder="變數" v-model="counts[index]" @input="calprice(index)">
                  <button type="button" class="btn btn-bd-count"><i class="bi bi-plus" @click="countAdd(index)"></i></button>
                </div>
              </td>
              <td>
                <div class="d-flex p-0">
                  <h4 class="m-0"><b>{{ subTotal[index] }}</b></h4>
                </div>
              </td>
              <td>
                <button type="button" class="btn btn-bd-white" @click="remove(index)"><i class="bi bi-x-lg"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="w-100 border rounded bg-white text-dark m-2 p-2">
      <div class="d-flex mt-3 mb-3">
        <div class="d-flex ms-3 flex-fill">
          <h3 class="col-1 align-self-center m-0">會員:</h3>
          <div class="col-7"><input type="text" class="form-control" placeholder="0987654321" v-model="phonenumber" @keyup.enter="findmember"></div>
          <h3 class="align-self-center m-0 ms-3">名稱：{{ membername }}</h3>
        </div>
        <div class="d-flex col-5 me-3 justify-content-end">
          <h2 class="align-self-center me-2 mb-0"><b>應收: {{ totalprice }} </b></h2>
          <h2 class="align-self-center mb-0 d-flex justify-content-end"><b class="align-self-center">實收:</b><div class="col-8 ms-2"><input class="form-control" type="text" placeholder="金額" v-model="actualIncome"/></div></h2>
        </div>
      </div>
      <div class="d-flex justify-content-between mt-3 mb-3">
        <div class="d-flex col-6 ms-3">
          <h3 class="align-self-center m-0 col-2">付款方式:</h3>
          <select class="form-select" aria-label="pay" v-model="payment" @change="paymentChange">
            <option value="cash">現金</option>
            <option value="creditCard">信用卡</option>
          </select>
          <div class="form-check align-self-center col-5 m-0 ms-4">
              <input class="form-check-input" type="checkbox" value="receipt" id="receipt1" v-model="bill">
              <label class="form-check-label" for="receipt1">
                開立發票(金額加上營業稅 5 %)
              </label>
            </div>
        </div>
        <div>
          <button type="button" class="btn btn-success me-3" @click="complete">完成</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-bd-white {
  --bs-btn-font-weight: 600;
  --bs-btn-color: var(--bs-black);
  --bs-btn-bg: #FFFFFF;
  --bs-btn-border-color: var(--bd-violet);
  --bs-btn-border-radius: .5rem;
  --bs-btn-hover-color: var(--bs-black);
  --bs-btn-hover-bg: #FFFFFF;
  --bs-btn-hover-border-color: #{shade-color($bd-violet, 10%)};
  --bs-btn-focus-shadow-rgb: var(--bd-violet-rgb);
  --bs-btn-active-color: var(--bs-btn-hover-color);
  --bs-btn-active-bg: #FFFFFF;
  --bs-btn-active-border-color: #{shade-color($bd-violet, 20%)};
}
.btn-bd-count {
  width: 15px;
  height: auto;
  padding: 0;
  --bs-btn-font-weight: 600;
  --bs-btn-color: var(--bs-black);
  --bs-btn-bg: #FFFFFF;
  --bs-btn-border-color: var(--bd-violet);
  --bs-btn-border-radius: .5rem;
  --bs-btn-hover-color: var(--bs-black);
  --bs-btn-hover-bg: #FFFFFF;
  --bs-btn-hover-border-color: #{shade-color($bd-violet, 10%)};
  --bs-btn-focus-shadow-rgb: var(--bd-violet-rgb);
  --bs-btn-active-color: var(--bs-btn-hover-color);
  --bs-btn-active-bg: #FFFFFF;
  --bs-btn-active-border-color: #{shade-color($bd-violet, 20%)};
}
html,
body {
  height: 100%;
  padding: 0;
  margin: 0;
}

.block {
    height: 76vh;
}
.tableFixHead          { overflow: auto;}
.tableFixHead thead th { position: sticky; top: 0; z-index: 1; background-color: #FFFFFF;}

</style>
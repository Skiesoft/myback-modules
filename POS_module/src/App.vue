<script lang="ts">
import { defineComponent } from 'vue'
import { Database, QueryBuilder } from '@myback/sdk'
import { Order } from './model/order'
import { Product } from './model/product'
import { Member } from './model/member'
import { OrderItem } from './model/orderItem'

export default defineComponent ({
  data() {
    const products: Array<Product> = [];
    const counts: Array<number> = [];
    const subTotal: Array<number> = [];
    const reasons: Array<string> = [];
    const changeprices: Array<number> = [];
    const results: Array<string> = []

    return {
      products,
      counts,
      subTotal,
      reasons,
      totalprice: 0,
      changeprices,
      upc: "",
      id: "",
      productname: "",
      price: "",
      stock: "",
      phonenumber: "",
      phonenumber_now: "",
      membername: "",
      results,
      isOpen: false,
      arrowCounter: -1,
      actualIncome: "",
      payment: "cash",
      bill: false,
      isMember: false,
      focusonname: false,
      focusfind: false,
      online: false
    }
  },
  methods: {
    async add(product: Product){
      this.products.push(product)
      this.counts.push(1)
      this.subTotal.push(product.price!)
      this.reasons.push("")
      this.changeprices.push()
      this.updatetotalprice()
    },
    async findupc() {
      const db = new Database()
      const index = this.products.map(e => e.upc).indexOf(this.upc)
      if(index >= 0){
        this.counts[index] += 1
        this.calprice(index)
        this.id = String(this.products[index].id)
        this.productname = String(this.products[index].name)
        this.price = String(this.products[index].price)
        this.stock = String(this.products[index].stock)
      }
      else{
        let query = QueryBuilder.equal("upc", this.upc)
        let found = await db.find(Product, query)
        if (found[0]){
          this.add(found[0])
          this.id = found[0].id
          this.productname = found[0].name
          this.price = found[0].price
          this.stock = found[0].stock
        }
        else{
          this.removeinfo()          
        }
      }
    },
    async findID() {
      const db = new Database()
      const index = this.products.map(e => e.id).indexOf(Number(this.id))
      if(index >= 0){
        this.counts[index] += 1
        this.calprice(index)
        this.upc = String(this.products[index].upc)
        this.productname = String(this.products[index].name)
        this.price = String(this.products[index].price)
        this.stock = String(this.products[index].stock)
      }
      else{
        let query = QueryBuilder.equal("id", this.id)
        let found = await db.find(Product, query)
        if (found[0]){
          this.add(found[0])
          this.upc = found[0].upc
          this.productname = found[0].name
          this.price = found[0].price
          this.stock = found[0].stock
        }
        else{
          this.removeinfo()          
        }
      }
    },
    async findName(){
      const db = new Database()
      const index = this.products.map(e => e.name).indexOf(this.productname)
      if(index >= 0){
        this.counts[index] += 1
        this.calprice(index)
        this.upc = String(this.products[index].upc)
        this.id = String(this.products[index].id)        
        this.price = String(this.products[index].price)
        this.stock = String(this.products[index].stock)
      }
      else{
        let query = QueryBuilder.equal("name", this.productname)
        let found = await db.find(Product, query)
        if (found[0]){
          this.add(found[0])
          this.upc = found[0].upc
          this.id = found[0].id
          this.price = found[0].price
          this.stock = found[0].stock
        }
        else{
          this.removeinfo()     
        }
      }
    },
    async remove(index: number) {
      this.products.splice(index, 1)
      this.counts.splice(index, 1)
      this.subTotal.splice(index, 1)
      this.reasons.splice(index, 1)
      this.totalprice = 0
      this.changeprices.splice(index, 1)
      for(var i = 0; i < this.subTotal.length; i++){
        this.totalprice += this.subTotal[i]
      }
    },
    async removeall(){
      this.products = []
      this.counts = []
      this.subTotal = []
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
      let subtotalprice = Number(this.counts[index]) * Number(this.products[index].price)
      if(this.changeprices[index]){
        subtotalprice = (Number(this.products[index].price) - this.changeprices[index]) * this.counts[index]
        this.updateprice(subtotalprice, index)
      }
      else{
        this.updateprice(subtotalprice, index)
      }
    },
    async findmember(){
      const db = new Database()
      let query = QueryBuilder.equal("phone_number", this.phonenumber)
      let found = await db.find(Member, query)
      if (found[0]){
        this.membername = found[0].name
        this.isMember = true
        this.phonenumber_now = this.phonenumber
      }
      else{
        this.isMember = false
        this.membername = ""
        this.phonenumber_now = ""
      }
      this.phonenumber = ""
    },
    async countAdd(index: number){
      this.counts[index] = Number(this.counts[index])
      this.counts[index] += 1
      this.calprice(index)
    },
    async countMinus(index: number){
      this.counts[index] = Number(this.counts[index])
      this.counts[index] -= 1
      this.calprice(index)
    },
    async testaddproduct(){
      let namelst: Array<string> = ['宇宙戰艦大和號2199 - 獨立戰鬥指揮艦 Deusula The 2nd Core Ship (1/1000)',
        '艦隊これくしょん SPM - ”霞改二-礼号作戰-”',
        'M.S.G. D-721 - 關節、軸棒、關節固定座 3 [黑]',
        'Figure-rise-S - Masked Rider Den-O Sword Form & Plat Form 電王 劍模式 & 月台模式',
        'Figure-rise-S - Masked Rider Den-O Rod Form & Plat Form 電王 杖模式 & 月台模式',
        'Figure-rise-S - Masked Rider Den-O AX Form & Plat Form 電王 斧模式 & 月台模式',
        'Figure-rise-S - Masked Rider Den-O Gun Form & Plat Form 電王 槍模式 & 月台模式',
        'CL#005 Mine bluE#010 - [妄想…原付と、女の子と、桃源鄉]',
        '情景モジルパーツ - 色粉-深綠',
        'G.F.F. Metal Composite #1013 - RX0[N] Unicorn Gundam 02 Banshee Norn[Awakening Ver.](ROUSE DRIVE)',
        '袁 & 1','袁 - 1','袁 [ 1','袁 ] 1','袁 > 1','袁 < 1','袁 # 1','袁 " 1','袁 ” 1','袁 ( 1','袁 ) 1','袁 / 1','袁 . 1']
      for(let i = 1; i <= namelst.length; i++){
        const product = new Product()

        product.upc = String(i)
        product.name = namelst[i]
        product.category = ""
        product.status = ""
        product.create_time = new Date()
        product.manufacturer = ""
        product.unit = ""
        product.weight = 0
        product.length = 0
        product.width = 0
        product.height = 0
        product.info = ""
        product.price = Math.ceil((Math.random()) * 100)
        product.note = ""
        product.stock = Math.ceil((Math.random()) * 10)

        const db = new Database()
        await db.save(Product, product)
      }
    },
    async testaddmember(){
      let phonenumbers = ["0987654321", "0912345678", "0974185263"]
      let names = ['王小明', '王小美', '王大明']
      for(let i = 0; i < phonenumbers.length; i++){
        const member = new Member()
        member.phone_number = phonenumbers[i]
        member.name = names[i]
        const db = new Database()
        await db.save(Member, member)
      }
    },
    async setResult(result: string) {
      if (this.results.length !== 0) {
        this.productname = result;
        this.arrowCounter = -1;
      }
    },
    async onArrowDown() {
      if (this.arrowCounter < this.results.length - 1) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },
    async onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },
    async onEnter() {
      if (this.isOpen) {
        if(this.arrowCounter != -1){
          this.productname = this.results[this.arrowCounter];
          this.arrowCounter = -1;
        }
      }
      this.isOpen = false;
    },
    async filterResults() {
      let db = new Database()
      let query = QueryBuilder.like('name', '%' + this.productname + '%')
      let found = await db.find(Product, query)
      this.results = found.map(x => x.name)
    },
    async complete(){
      if(this.actualIncome != ""){
        const time = new Date()
        const order = new Order()
        let len = this.products.length      
        let id = -1;
        order.time = time
        order.amount = Number(this.actualIncome)
        order.internet_marketing = (this.online ? 1 : 0)
        if(this.membername != ''){
          let query = QueryBuilder.equal("phone_number", this.phonenumber_now)
          const db = new Database()
          let found = await db.find(Member, query)
          if(found[0]){
            order.member = found[0]
          }
        }
        const db = new Database()
        await db.save(Order, order)

        for(let i = 0; i < len; i++){
          const db= new Database()
          const orderitem = new OrderItem()
          
          let name =  String(this.products[i].name)
          let query = QueryBuilder.equal("name", name)
          let found = await db.find(Product, query)
          
          orderitem.id = order.id
          orderitem.product = found[0]
          orderitem.stock_change = -1 * this.counts[i]
          orderitem.labled_price = this.products[i].price
          orderitem.exchange_rate = 1
          orderitem.discount = (this.changeprices[i] > 0 ?  this.changeprices[i] : 0)
          orderitem.actual_price = this.subTotal[i]
          orderitem.note = ""

          await db.save(OrderItem, orderitem)
        }
        
        this.resetall()
      }
    },
    async resetall(){
      this.removeall()
      this.removeinfo()
      this.phonenumber = ""
      this.phonenumber_now = ""
      this.membername = ""
      this.isOpen = false
      this.arrowCounter = -1
      this.actualIncome = ""
      this.payment = "cash"
      this.bill = false,
      this.isMember = false,
      this.focusonname = false,
      this.focusfind = false,
      this.online = false
    },
    async paymentChange(){
      if(this.payment == 'creditCard' || this.payment == 'payonline'){
        this.bill = true
      }
      else{
        this.bill = false
      }
      this.updatetotalprice()
    },
    async showorderitem(){
      let db = new Database()
      console.log(await db.all(OrderItem))
    },
    async showorder(){
      let db = new Database()
      console.log(await db.all(Order))
    },
    async removeMember(){
      this.membername = ''
      this.isMember = false
      this.phonenumber_now = ""
    },
    async onlyNumberAndDash(evt: KeyboardEvent): Promise<void>{
      const keysAllowed: RegExp = /[0-9-]/g;
      const keyPressed: string = evt.key;
    
      if (!keysAllowed.exec(keyPressed)) {
        evt.preventDefault()
      }
    },
    async onlyNumber(evt: KeyboardEvent): Promise<void>{
      const keysAllowed: RegExp = /[0-9]/g
      const keyPressed: string = evt.key;
    
      if (!keysAllowed.exec(keyPressed)) {
        evt.preventDefault()
      }
    },
    async focusnamein(){
      this.focusonname = true
    },
    async focusnameout(){
      this.focusonname = false
      this.isOpen = false
    },
    async focusin(){
      this.removeinfo()
    },
    async removeinfo(){
      this.upc = ""
      this.id = ""
      this.productname = ""
      this.price = ""
      this.stock = ""
    },
    async closefilter(){
      this.isOpen = false;
    }
  },

  watch: {
    productname() {
      if (this.productname !== "") {
        if(this.focusonname == true){
          this.filterResults();
          this.isOpen = true;
        }
      } else {
        this.isOpen = false;
        this.removeinfo()
      }
    }
  }
})
</script>

<template>
  <div class="d-flex flex-wrap">
    <div class="w-100 d-flex" style="height: 76vh;">
      <div class="d-flex flex-column col-4 border rounded bg-white text-dark m-2 p-2">
        <div class="d-flex">
          <h3 class="align-self-center d-flex justify-content-center col-2 m-2 ms-0 me-0"><b>條碼</b></h3>
          <input type="text" class="align-self-center form-control me-2 m-0" placeholder="條碼" v-model="upc" @keyup.enter="findupc" @keypress="onlyNumberAndDash($event)" @focus="focusin" @click="focusin">
        </div>
        <div class="d-flex">
          <h3 class="align-self-center d-flex justify-content-center col-2 m-2 ms-0 me-0"><b>I D</b></h3>
          <input onkeyup="this.value=this.value.replace(/\D/g,'')" type="text" class="align-self-center form-control me-2 m-0" placeholder="ID" v-model="id" @keyup.enter="findID" @keypress="onlyNumber($event)" @focus="focusin"  @click="focusin">
        </div>
        <div class="d-flex">
          <h3 class="align-self-center d-flex justify-content-center col-2 m-2 ms-0 me-0"><b>名稱</b></h3>
          <div class="align-self-center position-relative w-100 me-2">
            <input type="search" class="form-control me-2 m-0"
              v-model="productname"
              @keydown.up.prevent="onArrowUp"
              @keydown.down.prevent="onArrowDown"
              @keydown.enter.prevent="onEnter" 
              placeholder="名稱"
              @keyup.enter="findName(); closefilter();"
              @focus="focusin"
              @focusin="focusnamein"
              @focusout="focusnameout"
               />
            <ul v-show="isOpen" class="list-group mb-3 position-absolute top-100 z-index-3 w-100 text-break" style="overflow: auto; height: 75vh">
              <li v-for="(result, i) in results"
                :key="i"
                class="list-group-item"
                @mousedown="setResult(result); findName();"
                @mouseover="arrowCounter = i"
                @mouseup.left="closefilter();"
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

        <div><button type="button" @click="testaddproduct">add product to db</button></div>
        <div><button type="button" @click="testaddmember">add member to db</button></div>
        <div><button type="button" @click="showorderitem">show orederitem</button></div>
        <div><button type="button" @click="showorder">show order</button></div>

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
            <tr v-for="(product, index) in products" :key="index">
              <th scope="row"><h5 class="p-0 text-break">{{ product.name }}</h5></th>
              <td>
                <div class="d-flex">
                  <h4 class="align-self-center m-0 col-2">{{ product.price }}</h4>
                  <div class="d-flex">
                    <input type="text" class="align-self-center form-control form-control-sm h-25" v-model="changeprices[index]" placeholder="折價差額" @input="calprice(index)"  @keypress="onlyNumber($event)"/>
                    <input type="text" class="align-self-center form-control form-control-sm h-25 ms-1" placeholder="原因" v-model="reasons[index]">
                  </div>
                </div>
              </td>
              <td class="p-0">
                <div class="d-flex align-content-end">
                  <button type="button" class="btn btn-bd-count"><i class="bi bi-dash" @click="countMinus(index)"></i></button>
                  <input class="form-control form-control-sm" type="text" placeholder="數量" v-model="counts[index]" @input="calprice(index)"  @keypress="onlyNumberAndDash($event)">
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
        <div class="d-flex ms-3 flex-fill clearfix">
          <h3 class="col-1 align-self-center m-0">會員:</h3>
          <div class="col-7"><input onkeyup="this.value=this.value.replace(/\D/g,'')" type="text" class="form-control" placeholder="0987654321" v-model="phonenumber" @keyup.enter="findmember"  @keypress="onlyNumber($event)"></div>
          <h3 class="align-self-center m-0 ms-3">名稱：{{ membername }}</h3>
          <button v-show="isMember" class="btn btn-outline-secondary ms-auto" @click="removeMember"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="d-flex col-5 me-3 justify-content-end">
          <h2 class="align-self-center me-2 mb-0"><b>應收: {{ totalprice }} </b></h2>
          <h2 class="align-self-center mb-0 d-flex justify-content-end"><b class="align-self-center">實收:</b><div class="col-8 ms-2"><input class="form-control" type="text" placeholder="金額" v-model="actualIncome"  @keypress="onlyNumber($event)"/></div></h2>
        </div>
      </div>
      <div class="d-flex justify-content-between mt-3 mb-3">
        <div class="d-flex col-6 ms-3">
          <h3 class="align-self-center m-0 col-2">付款方式:</h3>
          <select class="form-select" aria-label="pay" v-model="payment" @change="paymentChange">
            <option value="cash">現金</option>
            <option value="creditCard">信用卡</option>
            <option value="payonline">電子支付</option>
            <option value="transfer">轉帳</option>
          </select>
          <div class="col-5">
            <div class="form-check m-0 ms-4">
              <input class="form-check-input" type="checkbox" value="receipt" id="receipt1" v-model="bill" @change="updatetotalprice()">
              <label class="form-check-label" for="receipt1">
                金額加上營業稅 5 %
              </label>
            </div>
            <div class="form-check m-0 ms-4">
              <input class="form-check-input" type="checkbox" value="online" id="online1" v-model="online">
              <label class="form-check-label" for="online1">
                網站通路銷售
              </label>
            </div>
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
.tableFixHead          { overflow: auto;}
.tableFixHead thead th { position: sticky; top: 0; z-index: 1; background-color: #FFFFFF;}

</style>
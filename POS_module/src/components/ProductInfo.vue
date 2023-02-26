<script lang="ts">
import { defineComponent } from 'vue'
import { Database, QueryBuilder } from '@myback/sdk'
import { Product } from '../model/product'
import { Member } from '../model/member'
import { OrderItem } from '../model/orderItem'
import { Order } from '../model/order'

export default defineComponent({
  props:['productIn'],
  data() {
    const results: Array<string> = []
    return {
      upc: "",
      id: "",
      productname: "",
      price: "",
      stock: "",
      results,
      arrowCounter: -1,
      isOpen: false,
      focusonname: false
    }
  },
  methods:{
    async findupc() {
      const db = new Database()
      const index = this.productIn.map(function(value: Product){ return value.upc }).indexOf(this.upc)
      if(index >= 0){
        this.$emit('addcount', index)
        this.$emit('calprice',index)
        this.id = String(this.productIn[index].id)
        this.productname = String(this.productIn[index].name)
        this.price = String(this.productIn[index].price)
        this.stock = String(this.productIn[index].stock)
      }
      else{
        let query = QueryBuilder.equal("upc", this.upc)
        let found = await db.find(Product, query)
        if (found[0]){
          this.$emit('addproduct', found[0])
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
      const index = this.productIn.map(function(value: Product){ return value.id }).indexOf(Number(this.id))
      if(index >= 0){
        this.$emit('addcount', index)
        this.$emit('calprice',index)
        this.upc = String(this.productIn[index].upc)
        this.productname = String(this.productIn[index].name)
        this.price = String(this.productIn[index].price)
        this.stock = String(this.productIn[index].stock)
      }
      else{
        let query = QueryBuilder.equal("id", this.id)
        let found = await db.find(Product, query)
        if (found[0]){
          this.$emit('addproduct', found[0])
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
      const index = this.productIn.map(function(value: Product){ return value.name }).indexOf(this.productname)
      if(index >= 0){
        this.$emit('addcount', index)
        this.$emit('calprice',index)
        this.upc = String(this.productIn[index].upc)
        this.id = String(this.productIn[index].id)        
        this.price = String(this.productIn[index].price)
        this.stock = String(this.productIn[index].stock)
      }
      else{
        let query = QueryBuilder.equal("name", this.productname)
        let found = await db.find(Product, query)
        if (found[0]){
          this.$emit('addproduct', found[0])
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
    async removeinfo(){
      this.upc = ""
      this.id = ""
      this.productname = ""
      this.price = ""
      this.stock = ""
    },
    async focusin(){
      this.removeinfo()
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
    async filterResults() {
      let db = new Database()
      let query = QueryBuilder.like('name', '%' + this.productname + '%')
      let found = await db.find(Product, query)
      this.results = found.map(x => x.name)
    },
    async closefilter(){
      this.isOpen = false;
    },
    async focusnamein(){
      this.focusonname = true
    },
    async focusnameout(){
      this.focusonname = false
      this.isOpen = false
    },

    //test function start
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
    async showorderitem(){
      let db = new Database()
      console.log(await db.all(OrderItem))
    },
    async showorder(){
      let db = new Database()
      console.log(await db.all(Order))
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
    }
    // test function end

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
  <div class="d-flex flex-column col-4 border rounded bg-white text-dark m-2 p-2">
    <div class="d-flex">
      <h3 class="align-self-center d-flex justify-content-center col-2 m-2 ms-0 me-0"><b>條碼</b></h3>
      <input type="text" class="align-self-center form-control me-2 m-0" placeholder="條碼" v-model="upc" @keyup.enter="findupc" @keypress="onlyNumberAndDash($event)" @focus="focusin" @click="focusin">
    </div>
    <div class="d-flex">
      <h3 class="align-self-center d-flex justify-content-center col-2 m-2 ms-0 me-0"><b>I D</b></h3>
      <input type="text" class="align-self-center form-control me-2 m-0" placeholder="ID" v-model="id" @keyup.enter="findID" @keypress="onlyNumber($event)" @focus="focusin"  @click="focusin">
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
</template>
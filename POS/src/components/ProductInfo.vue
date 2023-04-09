<script lang="ts">
import { defineComponent } from 'vue'
import { Database, QueryBuilder } from '@myback/sdk'
import { Product } from '../model/product'
import { Member } from '../model/member'

export default defineComponent({
  props:['productIn'],
  data() {
    const results: Array<string> = []
    return {
      search: "",
      upc: "",
      id: "",
      productname: "",
      price: "",
      stock: "",
      results,
      arrowCounter: -1,
      isOpen: false,
      required: false
    }
  },
  methods:{
    async find() {
      const db = new Database()
      const indexofupc = this.productIn.map(function(value: Product){ return value.upc }).indexOf(this.search)
      const indexofid = this.productIn.map(function(value: Product){ return value.id }).indexOf(Number(this.search))
      const indexofname = this.productIn.map(function(value: Product){ return value.name }).indexOf(this.search)
      if (indexofupc >= 0){
        this.$emit('addcount', indexofupc)
        this.$emit('calprice', indexofupc)
        this.search = ""
        this.upc = String(this.productIn[indexofupc].upc)
        this.id = String(this.productIn[indexofupc].id)
        this.productname = String(this.productIn[indexofupc].name)
        this.price = String(this.productIn[indexofupc].price)
        this.stock = String(this.productIn[indexofupc].stock)
        this.required = false
      }
      else if (indexofid >= 0){
        this.$emit('addcount', indexofid)
        this.$emit('calprice',indexofid)
        this.search = ""
        this.upc = String(this.productIn[indexofid].upc)
        this.id = String(this.productIn[indexofid].id)
        this.productname = String(this.productIn[indexofid].name)
        this.price = String(this.productIn[indexofid].price)
        this.stock = String(this.productIn[indexofid].stock)
        this.required = false
      }
      else if (indexofname >= 0){
        this.$emit('addcount', indexofname)
        this.$emit('calprice',indexofname)
        this.search = ""
        this.upc = String(this.productIn[indexofname].upc)
        this.id = String(this.productIn[indexofname].id)
        this.productname = String(this.productIn[indexofname].name)
        this.price = String(this.productIn[indexofname].price)
        this.stock = String(this.productIn[indexofname].stock)
        this.required = false
      }
      else{
        let queryUpc = QueryBuilder.equal("upc", this.search)
        let foundinupc = await db.find(Product, queryUpc)
        let queryId = QueryBuilder.equal("id", this.search)
        let foundinid = await db.find(Product, queryId)
        let queryName = QueryBuilder.equal("name", this.search)
        let foundinname = await db.find(Product, queryName)
        if (foundinupc[0]){
          this.$emit('addproduct', foundinupc[0])
          this.search = ""
          this.upc = foundinupc[0].upc
          this.id = foundinupc[0].id
          this.productname = foundinupc[0].name
          this.price = foundinupc[0].price
          this.stock = foundinupc[0].stock
          this.required = false
        }
        else if (foundinid[0]){
          this.$emit('addproduct', foundinid[0])
          this.search = ""
          this.upc = foundinid[0].upc
          this.id = foundinid[0].id
          this.productname = foundinid[0].name
          this.price = foundinid[0].price
          this.stock = foundinid[0].stock
          this.required = false
        }
        else if (foundinname[0]){
          this.$emit('addproduct', foundinname[0])
          this.search = ""
          this.upc = foundinname[0].upc
          this.id = foundinname[0].id
          this.productname = foundinname[0].name
          this.price = foundinname[0].price
          this.stock = foundinname[0].stock
          this.required = false
        }
        else{
          this.search = ""
          this.required = true
          this.removeinfo()          
        }
      }
    },
    async setResult(result: string) {
      if (this.results.length !== 0) {
        this.search = result;
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
          this.search = this.results[this.arrowCounter];
          this.arrowCounter = -1;
        }
      }
      this.isOpen = false;
    },
    async removeinfo(){
      this.search = ""
      this.upc = ""
      this.id = ""
      this.productname = ""
      this.price = ""
      this.stock = ""
    },
    async filterResults() {
      let db = new Database()
      let query = QueryBuilder.like('name', '%' + this.search + '%')
      let found = await db.find(Product, query)
      this.results = found.map(x => x.name)
    },
    async closefilter(){
      this.isOpen = false;
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

        product.upc = String(i * 100)
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
        member.role = "VIP"
        member.email = "test" + String(i) + "@test.com"
        member.date = new Date()
        const db = new Database()
        await db.save(Member, member)
      }
    }
    // test function end

  },
  watch: {
    search() {
      if (this.search !== "") {
        this.filterResults();
        this.isOpen = true;
      }
      else {
        this.isOpen = false;
      }
    }
  }
})
</script>

<template>
  <div class="d-flex flex-column col-4 border rounded bg-white text-dark m-2 p-2">
    <div class="d-flex">
      <h3 class="align-self-center d-flex justify-content-center col-2 m-2 ms-0 me-0"><b>輸入</b></h3>
      <form v-if="required" class="align-self-center position-relative w-100 me-2 was-validated">
        <input type="text" class="align-self-center form-control me-2 m-0" placeholder="搜尋"
          v-model="search" 
          @keydown.enter.prevent="onEnter" 
          @keyup.enter="find(); closefilter();"
          @keydown.up.prevent="onArrowUp"
          @keydown.down.prevent="onArrowDown"
          :required="required">
        <ul v-show="isOpen" class="list-group mb-3 position-absolute top-100 z-index-3 w-100 text-break" style="overflow: auto; height: 75vh">
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
      <form v-else class="align-self-center position-relative w-100 me-2">
        <input type="text" class="align-self-center form-control me-2 m-0" placeholder="搜尋"
          v-model="search" 
          @keydown.enter.prevent="onEnter" 
          @keyup.enter="find(); closefilter();"
          @keydown.up.prevent="onArrowUp"
          @keydown.down.prevent="onArrowDown"
          >
        <ul v-show="isOpen" class="list-group mb-3 position-absolute top-100 z-index-3 w-100 text-break" style="overflow: auto; height: 75vh">
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
    </div>
    <div class="d-flex">
      <h3 class="align-self-center d-flex justify-content-center col-2 m-2 ms-0 me-0"><b>條碼</b></h3>
      <h3 class="m-2 ms-0">{{ upc }}</h3>  
    </div>
    <div class="d-flex">
      <h3 class="align-self-center d-flex justify-content-center col-2 m-2 ms-0 me-0"><b>I D</b></h3>
      <h3 class="m-2 ms-0">{{ id }}</h3>  
    </div>
    <div class="d-flex">
      <h3 class="align-self-center d-flex justify-content-center col-2 m-2 ms-0 me-0"><b>名稱</b></h3>
      <h3 class="m-2 ms-0">{{ productname }}</h3> 
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

    <div class="d-flex justify-content-center" style="height:30%;"><img src=""></div>
    <div class="d-flex justify-content-center" style="height:30%"><img src=""></div>
  </div>
</template>
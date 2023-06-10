<script lang="ts">
  import { defineComponent } from 'vue'
  import { Query } from '@myback/sdk/build/api/query-builder'
  import { Database, QueryBuilder } from '@myback/sdk'
  import { Product } from '@/model/product'

  export default defineComponent({
    data(){
      type ComponentData = {
        products:Array<Product>
        counts:Array<number>
        search:string
        required:boolean
        results:Array<string>
        isOpen:boolean
        arrowCounter:number
      }
      return{
        products: [],
        counts: [],
        search: "",
        required: false,
        results: [],
        isOpen: false,
        arrowCounter: -1
      } as ComponentData
    },
    methods: {
      async onlyNumber(evt: KeyboardEvent): Promise<void> {
        const keysAllowed: RegExp = /[0-9]/g
        const keyPressed: string = evt.key;
      
        if (!keysAllowed.exec(keyPressed)) {
          evt.preventDefault()
        }
      },
      async countAdd(index: number) {
        this.counts[index] = Number(this.counts[index])
        this.counts[index] += 1
      },
      async countMinus(index: number) {
        this.counts[index] = Number(this.counts[index])
        this.counts[index] -= 1
      },
      async remove(index: number) {
        this.products.splice(index, 1)
        this.counts.splice(index, 1)
      },
      async find() {
        const db = new Database()
        const indexofupc = this.products.map(function(value){ return value.upc }).indexOf(this.search)
        if (indexofupc >= 0){
          this.products.push(this.products[indexofupc])
          this.products.splice(indexofupc, 1)
          this.search = ""
          this.counts[indexofupc]++
          this.counts.push(this.counts[indexofupc])
          this.counts.splice(indexofupc, 1)
        }
        else{
          let queryUpc = QueryBuilder.equal("upc", this.search)
          let foundinupc = await db.find(Product, queryUpc)
          if (foundinupc[0]){
            this.products.push(foundinupc[0])
            this.counts.push(1)
            this.search = ""
            this.required = false
          }
          else{
            this.search = ""
            this.required = true       
          }
        }
      },
      async filterResults() {
        let db = new Database()
        let query = QueryBuilder.like('upc', '%' + this.search + '%')
        let found = await db.find(Product, query)
        this.results = found.map(x => x.upc)
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
      async setResult(result: string) {
        if (this.results.length !== 0) {
          this.search = result;
          this.arrowCounter = -1;
        }
      },
      async closefilter(){
        this.isOpen = false;
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
      async addProduct() {
        for(let i = 0; i < this.products.length; i++){
          const db= new Database()
          
          let name =  String(this.products[i].name)
          let query = QueryBuilder.equal("name", name)
          let product = await db.find(Product, query)

          product[0].stock += this.counts[i]

          await db.save(Product, product[0])
        }
      }

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
  <div class="col-12 box p-4 d-flex flex-column">
    <div class=" d-flex">
      <h4 class="fw-bold mt-1">
        商品入庫
      </h4>
    </div>
    <div class="d-flex mt-3">
      <div class="col-3 fw-bold d-flex align-items-center">
        條碼
      </div>
      <div class="col-5 fw-bold d-flex align-items-center">
        名稱
      </div>
      <div class="col-1 fw-bold d-flex align-items-center">
        數量
      </div>
    </div>

    <div v-for="(product, index) in  products" :key="index" class="d-flex mt-2">
      <div class="col-3 overflowhidden ps-2">{{ product.name }}</div>
      <div class="col-5 overflowhidden">{{ product.upc }}</div>
      <div class="col-2 d-flex align-content-end">
        <button type="button" class="btn btn-bd-count"><i class="bi bi-dash" @click="countMinus(index)"></i></button>
        <input class="form-control form-control-sm" type="text" placeholder="數量" v-model="counts[index]" @keypress="onlyNumber($event)">
        <button type="button" class="btn btn-bd-count"><i class="bi bi-plus" @click="countAdd(index)"></i></button>
      </div>
      <div class="col-2 d-flex justify-content-end pe-3">
        <div type="button" style="color: red" @click="remove(index)">刪除</div>
      </div>
    </div>
       

    <div class="col-3 pe-2 mt-2">
      <form v-if="required" class="align-self-center position-relative w-100 me-2 was-validated">
        <input type="text" class="form-control" placeholder="請輸入條碼"
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
        <input type="text" class="form-control" placeholder="請輸入條碼"
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
    <div class="d-flex justify-content-end mt-auto">
      <button class="btn btn-primary" @click="addProduct()">新增入庫</button>
    </div>
  </div>
</template>

<style scoped>
.box{
  min-height: 450px;
  height: auto
}
</style>
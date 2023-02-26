<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Database, QueryBuilder } from '@myback/sdk'
import { Order } from './model/order'
import { Product } from './model/product'
import { Member } from './model/member'
import { OrderItem } from './model/orderItem'
import ProductList from './component/ProductList.vue'
import ProductInfo from './component/ProductInfo.vue'
import MemberSearch from './component/MemberSearch.vue'
import Payment from './component/Payment.vue'

export default defineComponent ({
  setup(){
    const productListRef = ref<InstanceType<typeof ProductList>>()
    const calprice = (index: number) => {
      productListRef.value?.calprice(index)
    }
    const addProduct = (product: Product) => {
      productListRef.value?.add(product)
    }
    const getSubTotal = (index: number) => {
      return productListRef.value!.$data.subTotal[index]
    }
    const getSubTotalLength = () => {
      return productListRef.value!.$data.subTotal.length
    }
    const getChangePrice = (index: number) => {
      return productListRef.value!.$data.changeprices[index]
    }
    const removeList = () => {
      productListRef.value?.removeall()
    }

    const memberSearchRef = ref<InstanceType<typeof MemberSearch>>()
    const checkMember = () => {
      memberSearchRef.value?.checkMember()
    }
    const getPhoneNumber = () => {
      return memberSearchRef.value!.$data.phonenumber_now
    }
    const removeMember = () => {
      memberSearchRef.value?.removeMember()
    }

    const productInfoRef = ref<InstanceType<typeof ProductInfo>>()
    const removeInfo = () =>{
      productInfoRef.value?.removeinfo()
    }

    const paymentRef = ref<InstanceType<typeof Payment>>()
    const removePayment = () => {
      paymentRef.value?.removePayment()
    }
    const getBill = () => {
      return paymentRef.value!.$data.bill
    }
    const getOnline = () => {
      return paymentRef.value!.$data.online ? 1 : 0
    }
    return {
      calprice,
      addProduct,
      getSubTotal,
      getSubTotalLength,
      getChangePrice,
      removeList,
      productListRef,
      checkMember,
      getPhoneNumber,
      removeMember,
      memberSearchRef,
      removeInfo,
      productInfoRef,
      removePayment,
      getBill,
      getOnline,
      paymentRef
    }
  },
  data() {
    const products: Array<Product> = [];
    const counts: Array<number> = [];

    return {
      products,
      counts,
      totalprice: 0,
      actualIncome: "",
    }
  },
  methods: {
    async addcount(index: number) {
      this.counts[index] += 1
    },
    async updatetotalprice(){
      this.totalprice = 0
      for(var i = 0; i < this.getSubTotalLength()!; i++){
        this.totalprice += this.getSubTotal(i)!
      }
      if(this.getBill()!){
        this.totalprice *= 1.05
        this.totalprice = Math.ceil(this.totalprice)
      }
    },
    async updateProducts(products: Array<Product>) {
      this.products = products
    },
    async updateCounts(counts: Array<number>) {
      this.counts = counts
    },
    async complete(){
      if(this.actualIncome != ""){
        const time = new Date()
        const order = new Order()
        let len = this.products.length    
        let id = -1;
        order.time = time
        order.amount = Number(this.actualIncome)
        order.internet_marketing = this.getOnline()
        this.checkMember()
        if(this.getPhoneNumber() != ""){
          let query = QueryBuilder.equal("phone_number", String(this.getPhoneNumber()))
          const db = new Database()
          let found = await db.find(Member, query)
          if(found[0]){
            order.member = found[0]
          }
        }
        const db = new Database()
        await db.save(Order, order)

        for(let i = 0; i < len!; i++){
          const db= new Database()
          const orderitem = new OrderItem()
          
          let name =  String(this.products[i].name)
          let query = QueryBuilder.equal("name", name)
          let found = await db.find(Product, query)
          
          orderitem.id = order.id
          orderitem.product = found[0]
          orderitem.stock_change = -1 * this.counts[i]
          orderitem.labeled_price = this.products[i].price
          orderitem.exchange_rate = 1
          orderitem.discount = (this.getChangePrice(i) > 0 ?  this.getChangePrice(i) : 0)
          orderitem.actual_price = this.getSubTotal(i)
          orderitem.note = ""

          await db.save(OrderItem, orderitem)
        }
        this.resetall()
      }
    },
    async resetall(){
      this.removeMember()
      this.removeList()
      this.removeInfo()
      this.removePayment()
      this.totalprice = 0
      this.actualIncome = ""
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
    }
  },
  components:{
    ProductList, ProductInfo, MemberSearch, Payment
  }
})
</script>

<template>
  <div class="d-flex flex-wrap">
    <div class="w-100 d-flex" style="height: 76vh;">
      <ProductInfo 
        ref="productInfoRef"
        :product-in="products"
        @addcount="addcount" 
        @calprice="calprice" 
        @addproduct="addProduct" 
      ></ProductInfo>
      <ProductList 
        ref="productListRef" 
        @updatetotalprice="updatetotalprice"
        @updateProducts="updateProducts"
        @updateCounts="updateCounts"
        :products-in="products"
        :counts-in="counts" 
      ></ProductList>
    </div>
    <div class="w-100 border rounded bg-white text-dark m-2 p-2">
      <div class="d-flex mt-3 mb-3">
        <MemberSearch 
          ref="memberSearchRef"
          ></MemberSearch>
        <div class="d-flex col-5 me-3 justify-content-end">
          <h2 class="align-self-center me-2 mb-0"><b>應收: {{ totalprice }} </b></h2>
          <h2 class="align-self-center mb-0 d-flex justify-content-end"><b class="align-self-center">實收:</b><div class="col-8 ms-2"><input class="form-control" type="text" placeholder="金額" v-model="actualIncome"  @keypress="onlyNumber($event)"/></div></h2>
        </div>
      </div>
      <div class="d-flex justify-content-between mt-3 mb-3">
        <Payment
          ref="paymentRef"
          @changeBill="updatetotalprice()"
        >
        </Payment>
        <div>
          <button type="button" class="btn btn-success me-3" @click="complete">完成</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

html,
body {
  height: 100%;
  padding: 0;
  margin: 0;
}

</style>
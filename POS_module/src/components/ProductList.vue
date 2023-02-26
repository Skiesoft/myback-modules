<script lang="ts">
import { defineComponent } from 'vue'
import { Product } from '../model/product'

export default defineComponent({
  props:['productsIn', 'countsIn'],
  
  data() {
    const products: Array<Product> =  this.productsIn!
    const counts: Array<number> = this.countsIn!
    const subTotal: Array<number> = []
    const reasons: Array<string> = []
    const changeprices: Array<number> = []
    
    return {
      products,
      counts,
      subTotal,
      reasons,
      changeprices,
    }
  },
  methods: {
    async add(product: Product){
      this.products.push(product)
      this.counts.push(1)
      this.subTotal.push(product.price!)
      this.reasons.push("")
      this.changeprices.push()
      this.$emit('updatetotalprice')
      this.$emit('updateProducts', this.products)
      this.$emit('updateCounts', this.counts)
    },
    async removeall(){
      this.products = []
      this.counts = []
      this.subTotal = []
      this.reasons = []
      this.changeprices = []
      this.$emit('updatetotalprice')
      this.$emit('updateProducts', this.products)
      this.$emit('updateCounts', this.counts)
    },
    async calprice(index: number){
      let subtotalprice = Number(this.counts[index]) * Number(this.products[index].price)
      if(this.changeprices[index]){
        subtotalprice = (Number(this.products[index].price) - this.changeprices[index]) * this.counts[index]
      }
      this.subTotal[index] = subtotalprice
      this.$emit('updatetotalprice')
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
    async remove(index: number) {
      this.products.splice(index, 1)
      this.counts.splice(index, 1)
      this.subTotal.splice(index, 1)
      this.reasons.splice(index, 1)
      this.changeprices.splice(index, 1)
      this.$emit('updatetotalprice')
      this.$emit('updateProducts', this.products)
      this.$emit('updateCounts', this.counts)
    },
  }
})

</script>

<template>
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
.tableFixHead          { overflow: auto;}
.tableFixHead thead th { position: sticky; top: 0; z-index: 1; background-color: #FFFFFF;}

</style>
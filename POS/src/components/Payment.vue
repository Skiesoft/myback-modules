<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  data(){
    return {
      payment: "cash",
      bill: false,
      online: false
    }
  },
  methods: {
    async removePayment(){
      this.payment = "cash",
      this.bill = false,
      this.online = false
    },
    async paymentChange(){
      if(this.payment == 'creditCard' || this.payment == 'payonline'){
        this.bill = true
      }
      else{
        this.bill = false
      }
      this.$emit("changeBill")
    },
    async checkOnline(){
      return this.online ? 1 : 0
    }
  }
})
</script>
<template>
  <div class="d-flex col-6 ms-3">
    <h3 class="align-self-center m-0 p-0 col-3">付款方式:</h3>
    <select class="form-select" aria-label="pay" v-model="payment" @change="paymentChange">
      <option value="cash">現金</option>
      <option value="creditCard">信用卡</option>
      <option value="payonline">電子支付</option>
      <option value="transfer">轉帳</option>
    </select>
    <div class="col-5">
      <div class="form-check m-0 ms-4">
        <input class="form-check-input" type="checkbox" value="receipt" id="receipt1" v-model="bill" @change="$emit('changeBill')" :disabled="payment == 'creditCard' || payment == 'payonline'">
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
</template>
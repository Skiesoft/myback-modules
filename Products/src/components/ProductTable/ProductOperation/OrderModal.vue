<script lang="ts">
  import { Order } from '@/model/order';
  import { OrderItem } from '@/model/orderItem';
import { Modal } from 'bootstrap';
  import { defineComponent } from 'vue';

  export default defineComponent({
    props:["product"],
    data(){
      const modal:Modal|null = null

      const order_time: string = ''
      const importer: string = ''
      const labled_price: number = 0
      const exchange_rate: number = 0
      const discount: number = 0
      return{
        modal,
        order_time,
        importer,
        labled_price,
        exchange_rate,
        discount,
      }
    },
    mounted(){
      this.modal = new Modal(document.getElementById('OrderModal'))
    },
    methods: {
      async show(){
        this.modal.show()
      },
      async hide(){
        this.modal.hide()
      },
      async validCheck(){

      },
      async create(): Promise<[Order, OrderItem]>{

      },
      async clear(){
        this.order_time = ''
        this.importer = ''
        this.labled_price = 0
        this.exchange_rate = 0
        this.discount = 0
      },
      async save(){
        this.$emit('save')
      }
    }
  })
</script>

<template>
  <div class="modal fade" id="OrderModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="align-items-center justify-content-between d-flex">
          <h4 class="fw-bold m-3 mb-1">訂單資訊</h4>
          <button type="button" class="btn-close m-3 mb-1" data-bs-dismiss="modal"></button>
        </div>
        <hr class="border border-secondary opacity-100  m-1" />
        <div class="m-3 mt-1 flex-col">
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">訂單時間</h6>
            <input type="date" class="form-control p-1" v-model="order_time">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">進口商</h6>
            <input type="text" class="form-control p-1" v-model="importer">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">標價</h6>
            <input type="number" class="form-control p-1" v-model="labled_price">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">匯率</h6>
            <input type="number" class="form-control p-1" v-model="exchange_rate">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">加價折價</h6>
            <input type="number" class="form-control p-1"  v-model="discount">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">實際價格</h6>
            <h6 class="p-1">{{ labled_price*exchange_rate+discount }}</h6>
          </div>
          <div class="d-flex justify-content-end mt-2"> 
            <button type="submit" class="btn btn-primary ms-3 col-2 fw-bold" style="background: #3B587A;" @click="save()">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
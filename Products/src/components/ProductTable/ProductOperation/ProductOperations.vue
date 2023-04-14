<script lang="ts">
  import { Transaction } from '@/model/transaction';
  import { TransactionItem } from '@/model/transaction-item';
  import { Product } from '@/model/product';
  import { Database } from '@myback/sdk';
  import { orderBy } from '@myback/sdk/build/api/query-builder';
  import { defineComponent } from 'vue'; 
  import InfoModal from './InfoModal.vue'
  import OrderModal from './OrderModal.vue'

  export default defineComponent({
    data(){
      const product:Product|null = null;
      return{
        product
      }
    },
    methods: {
      async openInfoModal(target_product:Product|null){
        this.product = target_product;
        this.$refs.InfoModal.show(target_product)
      },
      async save(){
        const db = new Database()

        if(await this.$refs.InfoModal.validCheck()){
          return
        }

        this.product = this.$refs.InfoModal.product
        //editting product
        if(this.product != null){
          db.save(Product,this.product)
          this.clear()
          return
        }
        //new product without stock
        if(this.product.stock == 0){
          this.product.create_time = new Date()
          db.save(Product, this.product)
          this.clear()
          return
        }
      },
      async clear(){
        this.product = null
        this.$refs.InfoModal.hide()
        this.$emit('refresh')
      }
    },
    components: {InfoModal, OrderModal}
  })
</script>

<template>
  <InfoModal ref="InfoModal" @save="save"/>
  <OrderModal ref="OrderModal" @save="save" />
</template>
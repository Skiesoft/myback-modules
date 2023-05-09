<script lang="ts">
  import { Transaction } from '@/model/transaction';
  import { TransactionItem } from '@/model/transaction-item';
  import { Product } from '@/model/product';
  import { Database, QueryBuilder } from '@myback/sdk';
  import { defineComponent } from 'vue'; 
  import InfoModal from './InfoModal.vue'
  import Confirm from '@/components/Common/Confirm.vue'
  import { orderBy } from '@myback/sdk/build/api/query-builder';

  export default defineComponent({
    data(){
      const product:Product|null = null
      return{
        product
      }
    },
    methods: {
      async show(product:Product|null){
        this.product = product;
        if(product == null){
          this.$refs.OrderModal.clear()
        }
        this.$refs.InfoModal.load(product)
      },
      async infosave(product:Product){
        const db = new Database();
        if(this.product != null || product.stock == 0){
          db.save(Product,product)
          this.$emit('fetch')
          return
        }

        this.product = product;
        this.$refs.OrderModal.show(this.product)
      },
      async save(temp:{order:Order, orderItem:OrderItem}){
        const db = new Database()
        
        await db.save(Product, this.product!)
        await db.save(Order, temp.order)

        temp.orderItem.product = this.product!
        temp.orderItem.id = temp.order.id
        temp.orderItem.stock_change = this.product!.stock
        temp.orderItem.note = "初始化交易紀錄"
        await db.save(OrderItem, temp.orderItem)
        this.$emit('fetch')
      },
      async clear(){
        this.product = null
        this.$refs.InfoModal.hide()
        this.$emit('fetch')
      },
      async deleteConfirm(product:Product){
        this.product = product
        this.$refs.ProductConfirm.show()
      },
      async deleteProduct(){
        const db = new Database();

        let query = QueryBuilder.equal('product', this.product!.id)
        
        const orders = await db.find(OrderItem, query)
        if(orders.length > 1){
          window.alert("此商品已擁有交易紀錄，無法將其刪除")
        }
        else{
          if(orders.length == 0){
            await db.destroy(Product, this.product!)
          }
          else{
            query = QueryBuilder.equal('id', orders[0].id)
            const order = await db.find(Order, query)
            await db.destroy(Order, order[0])
            await db.destroy(OrderItem,  orders[0])
            await db.destroy(Product, this.product!)
          }
        }
        this.product = null
        this.$emit('fetch')
      }
    },
    components: {InfoModal, Confirm}
  })
</script>

<template>
  <InfoModal ref="InfoModal" @save="infosave"/>
  <OrderModal ref="OrderModal" @save="save" />
  <Confirm ref="ProductConfirm" :table_name="'Product'" confirm_message="確定要刪除此商品嗎?" confirm_option="刪除" @confirm='deleteProduct()'/>
</template>

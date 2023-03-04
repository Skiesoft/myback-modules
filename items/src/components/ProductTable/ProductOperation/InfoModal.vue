<script lang="ts">
  import { Product } from '@/model/product'
import { Database, QueryBuilder } from '@myback/sdk'
  import { Modal } from 'bootstrap'
  import { defineComponent } from 'vue'

  export default defineComponent({
    data(){
      const modal: Modal|null = null

      const product: Product = new Product()

      const category:String = ""

      const category_tags: Array<String> = []
      const pictures: Array<String> = []

      return{
        modal,
        product,
        category,
        category_tags,
        pictures
      }
    },
    mounted(){
      this.modal = new Modal(document.getElementById('ProductInfoModal'))
    },
    methods: {
      async show(target_product: Product|null ){
        if(target_product == null || this.product != null){
          this.clear()
        }
        if(target_product != null && this.product != target_product){
          this.product = target_product
        }
        this.modal.show()
      },
      async hide(){
        this.modal.hide()
      },
      async clear(){
        this.product = new Product()

        this.category = ""

        this.category_tags = []
        this.pictures = []
      },
      async validCheck(): Promise<boolean>{
        let ck:boolean = false;

        let message:string = ""
        const db = new Database()

        if(this.name == ''){
          ck = true
          message += "名稱是必填項目\n"
        }
        if(this.upc != '' && this.product == null){
          let query = QueryBuilder.equal('upc', this.upc)
          if(await db.count(Product, query) > 0){
            ck = true
            message += "條碼重複\n"
          }
        }
        if(this.category_tags.length == 0){
          ck = true
          message += "分類是必填項目\n"
        }
        if(this.manufacturer == ''){
          ck = true
          message += "製造商是必填項目\n"
        }
        if(this.price == 0){
          ck = true
          message += "定價是必填項目\n"
        }
        if(this.unit == ''){
          ck = true
          message += "單位是必填項目\n"
        }
        if(ck){
          window.alert(message)
        }
        return ck
      },
      async save(){
        this.product.category = this.category_tags.join('/')
        this.$emit('save')
      },
      async addTag(){
        if(this.category == '')
          return

        if(this.category_tags.find(elem => elem == this.category)){
          this.category = ''
          return
        }
        this.category_tags.push(this.category)
        this.category = ''
      },
      async removeTag(target: string){
        const index = this.category_tags.indexOf(target)
        this.category_tags.splice(index, 1)
      },
    }
  })
</script>

<template>
  <div class="modal fade" id="ProductInfoModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="align-items-center justify-content-between d-flex">
          <h4 class="fw-bold m-3 mb-1">商品資訊</h4>
          <button type="button" class="btn-close m-3 mb-1" data-bs-dismiss="modal"></button>
        </div>
        <hr class="border border-secondary opacity-100  m-1" />
        <div class="m-3 mt-1 flex-col">
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">名稱</h6>
            <input type="text" class="form-control p-1" v-model="product.name">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">編號</h6>
            <input type="text" class="form-control p-1" v-model="product.serial_number">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">條碼</h6>
            <input type="text" class="form-control p-1" v-model="product.upc">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">分類</h6>
            <input type="text" class="form-control p-1" v-model="category" @keyup.enter="addTag()">
          </div>
          <div class="d-flex align-items-center mt-1">
            <div class="col-3"></div>
            <div class="d-flex flex-wrap">
              <div v-for="tag in category_tags">
                <div class="d-flex border ps-2 pe-2 m-1 ms-0 border-dark rounded-3 justify-content-between align-items-center" type="button" @click="removeTag(tag)">
                  <div class="m-1">{{ tag }}</div><i class="bi bi-x" style="font-size: 20px"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">狀態</h6>
            <div class="col-6">
            <select class="form-select" v-model="product.status">
              <option selected>待進貨</option>
              <option>銷售中</option>
              <option>缺貨中</option>
              <option>絕版（或不再進貨）</option>
            </select>
            </div>
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">製造商</h6>
            <input type="text" class="form-control p-1"  v-model="product.manufacturer">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">定價</h6>
            <input type="number" class="form-control p-1" v-model="product.price">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">單位</h6>
            <input type="text" class="form-control p-1" v-model="product.unit">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">重量</h6>
            <input type="number" class="form-control p-1" v-model="product.weight">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">尺寸</h6>
            <input type="number" class="form-control p-1" v-model="product.length">
            <input type="number" class="form-control p-1 ms-1" v-model="product.width">
            <input type="number" class="form-control p-1 ms-1" v-model="product.height">
          </div>
          <div class="d-flex align-items-start mt-2 flex-wrap flex-col">
            <h6 class="col-3 m-0 pt-1 pb-1">圖片</h6>
            <div class="input-group mt-1 mb-3 col-12">
              <input type="file" class="form-control" id="inputFile" accept="image/*" multiple="true" @change="pictureUpload()">
              <label class="input-group-text" for="inputFile">選擇檔案</label>
            </div>
          </div>
          <div class="d-flex flex-wrap mt-1">
            <div v-for="name in pictures">
              <div class="align-item-start d-flex">
                <!--img class="m-1" v-bind:src="'http://localhost:8080/v1/storage/default/file/'+name" style="width:400px">
                <i class="bi bi-x" style="font-size: 25px; right: 25px" type="button" @click="pictureRemove(name)"></i--> 
              </div>
            </div>
          </div>
          <div class="d-flex align-items-start mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">商品描述</h6>
            <textarea class="form-control" v-model="product.info"></textarea>
          </div>
          <div class="d-flex align-items-start mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1" >備註</h6>
            <textarea class="form-control" v-model="product.note"></textarea>
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">庫存數量</h6>
            <input id="stock_input" type="number" class="form-control p-1" v-model="product.stock">
          </div>
          <div class="d-flex justify-content-end mt-2"> 
            <button type="submit" class="btn btn-primary ms-3 col-2 fw-bold" style="background: #3B587A;" @click="save()">Save</button>
          </div>
        </div >
      </div>
    </div>
  </div>
</template>
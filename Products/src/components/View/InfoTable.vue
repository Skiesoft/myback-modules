<script lang="ts">
  import { defineComponent } from 'vue';
  import { Picture } from '@/model/picture'
  import { Product } from '@/model/product'
  import { Database, QueryBuilder, Storage } from '@myback/sdk'

  export default defineComponent ({
    data(){

      const current_product: Product = new Product()
      const category:String = ""
      const category_tags: Array<String> = []
      const pictures: Array<Picture> = []
      const deleted_pictures: Array<Picture> = []
      const new_product: Boolean = true

      return {
        current_product,
        category,
        category_tags,
        pictures,
        deleted_pictures,
        new_product
      }
    },
    mounted(){
    },
    methods: {
      async load(product: Product|null){
        if(product == null){
          product = new Product()
          this.new_product = true
          this.unlock()
        }
        else{
          this.new_product = false
          this.lock()
        }

        if(this.current_product.id == product.id){
          return
        }

        if(this.new_product){
          this.current_product = product
          this.category = ""
          this.category_tags = []
          this.pictures = []
          this.deleted_pictures = []
          return
        }

        let query = QueryBuilder.equal('id', product.id!)
        const db = new Database()
        this.current_product = (await db.find(Product,query))[0]
        this.category = ""
        this.category_tags = this.current_product.category!.split("/")
        query = QueryBuilder.equal('product_id', product.id!)
        this.pictures = await db.find(Picture, query)
        this.deleted_pictures = []
      },
      async unlock(){
        document.getElementById('stock_input')?.removeAttribute('disabled')
      },
      async lock(){
        document.getElementById('stock_input')?.setAttribute('disabled','')
      },
      async valid(){
        let ck:boolean = false;

        let message:string = ""
        const db = new Database()

        if(this.current_product.upc != '' && this.new_product){
          let query = QueryBuilder.equal('upc', this.current_product!.upc!)
          if(await db.count(Product, query) > 0){
            ck = true
            message += "條碼重複\n"
          }
        }
        if(this.current_product.name == ''){
          ck = true
          message += "名稱是必填項目\n"
        }
        if(this.category_tags.length == 0){
          ck = true
          message += "分類是必填項目\n"
        }
        if(this.current_product.manufacturer == ''){
          ck = true
          message += "製造商是必填項目\n"
        }
        if(this.current_product.price == 0){
          ck = true
          message += "定價是必填項目\n"
        }
        if(this.current_product.unit == ''){
          ck = true
          message += "單位是必填項目\n"
        }

        if(ck){
          window.alert(message)
          return
        }
        this.save()
      },
      async save(){
        this.current_product.category = this.category_tags.join('/')
        if(this.new_product){
          this.current_product.create_time = new Date()
        }
        this.$emit('save', this.current_product)
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
      async pictureUpload(){
        const storage = new Storage()

        let picture_list = document.getElementById("inputFile")!.files
        console.log(picture_list.length)

        for(let i = 0 ; i < picture_list.length ; i++){
          let fileinfo = await storage.uploadWithAutoname(picture_list[i])
        }
      },
      async pictureRemove(picture: Picture){
        const index = this.pictures.indexOf(picture, 0)
        if(index > -1){
          this.pictures.splice(index, 1)
        }
        this.deleted_pictures.push(picture)
      }
      
    },
    components: {}
  })

</script>

<template>
      <div>
        <div class="align-items-center justify-content-between d-flex">
          <h4 class="fw-bold m-3 mb-1">商品資訊</h4>
          <button type="button" class="btn-close m-3 mb-1" data-bs-dismiss="modal"></button>
        </div>
        <hr class="border border-secondary opacity-100  m-1" />
        <div class="m-3 mt-1 flex-col">
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">名稱</h6>
            <input type="text" class="form-control p-1" v-model="current_product.name">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">編號</h6>
            <input type="text" class="form-control p-1" v-model="current_product.serial_number">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">條碼</h6>
            <input type="text" class="form-control p-1" v-model="current_product.upc">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">分類</h6>
            <input type="text" class="form-control p-1" v-model="category" @keyup.enter="addTag()">
          </div>
          <div class="d-flex align-items-center mt-1">
            <div class="col-3"></div>
            <div class="d-flex flex-wrap">
              <div v-for="tag in category_tags">
                <div class="d-flex border ps-2 pe-2 m-1 ms-0 border-dark rounded-3 justify-content-between align-items-center" type="button" @click="removeTag(tag.toString())">
                  <div class="m-1">{{ tag }}</div><i class="bi bi-x" style="font-size: 20px"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">狀態</h6>
            <div class="col-6">
            <select class="form-select" v-model="current_product.status">
              <option selected>待進貨</option>
              <option>銷售中</option>
              <option>缺貨中</option>
              <option>絕版（或不再進貨）</option>
            </select>
            </div>
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">製造商</h6>
            <input type="text" class="form-control p-1"  v-model="current_product.manufacturer">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">定價</h6>
            <input type="number" class="form-control p-1" v-model="current_product.price">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">單位</h6>
            <input type="text" class="form-control p-1" v-model="current_product.unit">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">重量</h6>
            <input type="number" class="form-control p-1" v-model="current_product.weight">
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">尺寸</h6>
            <input type="number" class="form-control p-1" v-model="current_product.length">
            <input type="number" class="form-control p-1 ms-1" v-model="current_product.width">
            <input type="number" class="form-control p-1 ms-1" v-model="current_product.height">
          </div>
          <div class="d-flex align-items-start mt-2 flex-wrap flex-col">
            <h6 class="col-3 m-0 pt-1 pb-1">圖片</h6>
            <div class="input-group mt-1 mb-3 col-12">
              <input type="file" class="form-control" id="inputFile" accept="image/*" multiple="true" @change="pictureUpload()">
              <label class="input-group-text" for="inputFile">選擇檔案</label>
            </div>
          </div>
          <div class="d-flex flex-wrap mt-1">
            <div v-for="picture in pictures">
              <div class="align-item-start d-flex">
                <img class="m-1" v-bind:src=picture.url style="width:400px">
                <i class="bi bi-x" style="font-size: 25px; right: 25px" type="button" @click="pictureRemove(picture)"></i> 
              </div>
            </div>
          </div>
          <div class="d-flex align-items-start mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">商品描述</h6>
            <textarea class="form-control" v-model="current_product.info"></textarea>
          </div>
          <div class="d-flex align-items-start mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1" >備註</h6>
            <textarea class="form-control" v-model="current_product.note"></textarea>
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">庫存數量</h6>
            <input id="stock_input" type="number" class="form-control p-1" v-model="current_product.stock">
          </div>
          <div class="d-flex justify-content-end mt-2"> 
            <button type="submit" class="btn btn-primary ms-3 col-2 fw-bold" style="background: #3B587A;" @click="valid()">Save</button>
          </div>
        </div >
  </div>

</template>
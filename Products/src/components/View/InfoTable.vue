<script lang="ts">
  import { defineComponent } from 'vue';
  import { Picture } from '@/model/picture'
  import { Product } from '@/model/product'
  import { Database, QueryBuilder, Storage } from '@myback/sdk'
  import axios from 'axios'

  

  export default defineComponent ({
    data(){
      const current_product:Product = new Product()

      const category: String = ''
      const categorys: Array<String> = []

      const pictures_files: Array<File> = []  
      const pictures: Array<Picture> = []

      return {
        current_product,
        categorys,
        category,
        pictures,
        pictures_files,
      }
    },
    mounted(){
      this.load()
    },
    methods: {
      async load(){
        const storage = new Storage()
        //clear storage's display folder

        if(this.$route.params.id == '0'){
          this.unlock()
          return
        }

        let query = QueryBuilder.equal('id', <string>this.$route.params.id)
        const db = new Database()
        this.current_product = (await db.find(Product, query))[0]
        this.categorys = this.current_product.category.split('/')

        query = QueryBuilder.equal('product_id', this.current_product.id!)
        let original_pictures = await db.find(Picture, query)
        for(let i = 0 ; i < original_pictures.length ; i++){
          let picture_file:File = await axios.get(original_pictures[i].url)
          this.pictures_files.push(picture_file)
          console.log(picture_file)

          let picture_info = await storage.uploadWithAutoname(picture_file, 'display')
          let picture:Picture = new Picture()
          picture.product_id = <Product>this.current_product
          picture.file_name = picture_info.path
          picture.url = picture_info.url
          this.pictures.push(picture)
        }

        this.lock()

      },
      async unlock(){
        document.getElementById('stock_input')?.removeAttribute('disabled')
      },
      async lock(){
        document.getElementById('stock_input')?.setAttribute('disabled','')
      },
      async valid(){
        let check:boolean = false;

        let message:string = ""
        const db = new Database()
        
        if(this.current_product.upc != '' && this.current_product.upc != undefined){
          let query = QueryBuilder.equal('upc', this.current_product!.upc!)
          let same_upc_products = await db.find(Product, query)
          if(same_upc_products.length > 0){
            if(this.$route.params.id == '0'){
              check = true
              message += "條碼重複\n"
            }
            else{
              if(same_upc_products[0].id != this.current_product.id){
                check = true
                message += "條碼重複\n"
              }
            }
          }
        }
        if(this.current_product.name == ''){
          check = true
          message += "名稱是必填項目\n"
        }
        if(this.categorys.length == 0){
          check = true
          message += "分類是必填項目\n"
        }
        if(this.current_product.manufacturer == ''){
          check = true
          message += "製造商是必填項目\n"
        }
        if(this.current_product.price == 0){
          check = true
          message += "定價是必填項目\n"
        }
        if(this.current_product.unit == ''){
          check = true
          message += "單位是必填項目\n"
        }

        if(check){
          window.alert(message)
          return
        }
        this.save()
      },
      async save(){
        this.current_product.category = this.categorys.join('/')
        if(this.$route.params.id == '0'){
          this.current_product.create_time = new Date()
        }
        const db = new Database()
        const storage = new Storage()
        await db.save(Product, <Product>this.current_product)

        const query = QueryBuilder.equal('product_id', this.current_product.id!)
        let original_pictures:Array<Picture> = await db.find(Picture, query)
        let original_pictures_files:Array<File> = []

        for(let i = 0 ; i < original_pictures.length ; i++){
          original_pictures_files.push(await axios.get(original_pictures[i].url!))
        }

        for(let i = 0 ; i < original_pictures_files.length ; i++){
          let index = this.pictures_files.indexOf(original_pictures_files[i])
          if(index == -1){
            await storage.destroy(original_pictures[i].file_name!)
            await db.destroy(Picture,original_pictures[i])
          }
        }

        for(let i = 0 ; i < this.pictures_files.length ; i++){
          let index = original_pictures_files.indexOf(this.pictures_files[i])
          if(index == -1){
            let picture_info = await storage.uploadWithAutoname(this.pictures_files[i])
            let picture:Picture = new Picture()
            picture.file_name = picture_info.path
            picture.url = picture_info.url
            picture.product_id = <Product>this.current_product;
            db.save(Picture, picture)
          }
        }
        this.$router.push({path: '/'})
      },
      async addTag(){
        if(this.category == '')
          return

        if(this.categorys.find(elem => elem == this.category)){
          this.category = ''
          return
        }
        this.categorys.push(this.category)
        this.category = ''
      },
      async removeTag(target: string){
        const index = this.categorys.indexOf(target)
        this.categorys.splice(index, 1)
      },
      async pictureUpload(){
        const storage = new Storage()
        let input_pictures = (<HTMLInputElement>document.getElementById("picture")).files
        if(input_pictures == null){
          return
        }
        for(let i = 0; i < input_pictures.length ; i++){
          this.pictures_files.push(input_pictures[i])

          let picture_info = await storage.uploadWithAutoname(input_pictures[i], 'display')
          let picture:Picture = new Picture()
          picture.file_name = picture_info.path
          picture.url = picture_info.url
          this.pictures.push(picture)
        }

      },
      async pictureRemove(picture: Picture){
        let file:File = await axios.get(picture.url!)
        let index = this.pictures_files.indexOf(file)
        this.pictures_files.splice(index, 1)

        index = this.pictures.indexOf(picture)
        this.pictures.splice(index, 1)

        const storage = new Storage()
        if(picture.file_name != undefined){
          storage.destroy(picture.file_name)
        }
      }
    },
    components: {}
  })

</script>

<template>
      <div class="col-6">
        <div class="align-items-center justify-content-between d-flex">
          <h4 class="fw-bold m-3 mb-1">商品資訊</h4>
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
              <div v-for="tag in categorys">
                <div class="d-flex btn-secondary btn p-0 ps-1 pe-1 m-1" type="button" @click="removeTag(tag.toString())">
                  <div class="m-1">{{ tag }}</div><i class="bi bi-x" style="font-size: 20px"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-center mt-2">
            <h6 class="col-3 m-0 pt-1 pb-1">狀態</h6>
            <div class="col-6">
            <select class="form-select" v-model="current_product.status">
              <option>待進貨</option>
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
              <input type="file" class="form-control" id="picture" accept="image/*" multiple="true" @change="pictureUpload()">
              <label class="input-group-text" for="picture">選擇圖片</label>
            </div>
          </div>
          <div class="d-flex flex-wrap mt-1">
            <div v-for="picture in pictures">
              <div class="align-item-start d-flex">
                <img class="m-1" v-bind:src=picture.url style="width:400px">
                <i class="bi bi-x" style="font-size: 25px; right: 25px" type="button" @click="pictureRemove(<Picture>picture)"></i> 
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
            <button type="button" class="btn btn-primary ms-3 col-2 fw-bold" @click="valid()">儲存</button>
          </div>
        </div >
  </div>

</template>
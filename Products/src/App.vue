<script lang="ts">
  import { defineComponent } from 'vue'
  import LineChart from './components/Chart.vue'
  import TotalProduct from './components/TotalProduct.vue'
  import TotalCost from './components/TotalCost.vue'
  import ProductTable from './components/ProductTable/ProductTable.vue'
  import { Product } from './model/product'
  import { Order } from './model/order'
  import { OrderItem } from './model/orderItem'
  import { Database, QueryBuilder, Storage} from '@myback/sdk'
  import * as bootstrap from 'bootstrap'

  export default defineComponent ({
  name: 'App',
  data(){
    const page_size: number = 9
    const current_page: number = 1
    const page_list_starter: number = 1
    const total_page: number = 0
    const page_list: Array<number> = []
    const page_sold_out_starter: number = 1
    const page_sold_out: Array<number> = []
    const total_page_sold_out: number = 0
    const current_page_sold_out: number = 1
    const page_size_sold_out: number = 4
    const list_product_count: number = 0;
    const sold_out_product_count: number = 0

    const products: Array<Product> = [];
    const product_editting: Product|null = null;
    let delete_product: Product|null;
    
    const sold_out_products: Array<Product> = []
    const sold_out_dates: Array<Date> = []
    const sold_out_importers: Array<String> = []

    const sort_element: string = 'id'
    const sort_order: string = 'asc';


    const total_products: number = 0
    const total_cost: number = 0

    const search_target: string = ''

    const name: string = ''
    const serial_number: string = ''
    const upc: string = ''
    const category: string = ''
    const status: string = '待進貨'
    const manufacturer: string = ''
    const price: number = 0
    const unit: string = ''
    const weight: number = 0
    const length: number = 0
    const width: number = 0
    const height: number = 0
    const info: string = ''
    const note: string = ''


    let pictures:Array<string> = []
    const tobeDelete:Array<string> = []

    const category_tags: Array<string> = [];

    const stock: number = 0

    
    const order_time: string = ''
    const importer: string = ''
    
    const labled_price: number = 0
    const exchange_rate: number = 0
    const discount: number = 0
    const actual_price: number = 0

    return {
      page_size,
      current_page,
      page_list_starter,
      total_page,
      page_list,
      page_sold_out_starter,
      page_sold_out,
      total_page_sold_out,
      current_page_sold_out,
      page_size_sold_out,
      list_product_count,
      sold_out_product_count,

      products,
      product_editting,
      
      sold_out_products,
      sold_out_dates,
      sold_out_importers,

      sort_element,
      sort_order,


      total_products,
      total_cost,

      search_target,

      name,
      serial_number,
      upc,
      category,
      status,
      manufacturer,
      price,
      unit,
      weight,
      length,
      width,
      height,
      info,
      note,

      pictures,
      tobeDelete,
      

      category_tags,

      stock,

      
      order_time,
      importer,
      
      labled_price,
      exchange_rate,
      discount,
      actual_price,

      delete_product
    }
  },
  mounted(){
    this.updateList()
    this.updatePageList()
    this.updateProduct()
    this.updatePageProduct()
  },
  methods: {
    async changePage(page: number){
      document.getElementById("page"+String(this.current_page))?.classList.remove('active')
      this.current_page = page
      document.getElementById("page"+String(this.current_page))?.classList.add('active')
      this.updateList()
    },
    async changePageProduct(page: number){
      document.getElementById('product_page' + String(this.current_page_sold_out))?.classList.remove('active')
      this.current_page_sold_out = page
      document.getElementById("product_page" + String(this.current_page_sold_out))?.classList.add('active')
      this.updateProduct()
    },
    async activateCurrentPage(){
      let page = document.getElementById("page"+String(this.current_page))
      page?.classList.add('active')
    },
    async activateCurrentPageProduct(){
      let page = document.getElementById('product_page'+String(this.current_page_sold_out))
      page?.classList.add('active')
    },
    async updatePageList(){
      for(let page in this.page_list){
        document.getElementById("page"+String(page))?.classList.remove('active')
      }

      this.page_list = []
      for(let i = 0 ; i < 3 ; i++){
        if(this.page_list_starter + i > this.total_page){
          await new Promise(f => setTimeout(f, 1))
          await this.activateCurrentPage()
          return
        }
        this.page_list.push(this.page_list_starter + i)
        
      }  
    },
    async updatePageProduct(){
      for(let page in this.page_sold_out){
        document.getElementById('product_page'+String(page))?.classList.remove('active')
      }

      this.page_sold_out = []
      for(let i = 0; i < 3; i++){
        if(this.page_sold_out_starter + i > this.total_page_sold_out){
          await new Promise(f => setTimeout(f, 1))
          await this.activateCurrentPageProduct()
          return
        }
        this.page_sold_out.push(this.page_sold_out_starter + i)
      }
    },
    async nextPageList(){
      if(this.page_list_starter + 3 > this.total_page){
        return
      }
      this.page_list_starter += 3
      this.updatePageList()
      
    },
    async prevPageList(){
      if(this.page_list_starter - 3 < 0){
        return
      }
      this.page_list_starter -= 3
      this.updatePageList()
    },

    async nextPageProduct(){
      if(this.page_sold_out_starter + 3 > this.total_page_sold_out){
        return
      }
      this.page_sold_out_starter += 3
      this.updatePageProduct()
    },
    async prevPageProduct(){
      if(this.page_sold_out_starter - 3 < 0){
        return
      }
      this.page_sold_out_starter -= 3
      this.updatePageProduct()
    },

    async updateTotalCost(){
      const db = new Database()
      const products = await db.all(Product)
      let sum = 0

      for(let i = 0; i < products.length; i++){
        
        let stock = products[i].stock
        let query_list = [QueryBuilder.equal('product', products[i].id), QueryBuilder.greaterThan('stock_change', 0)]
        const query = QueryBuilder.and(...query_list)
        const orders = await db.find(OrderItem, query)
        let idx = orders.length - 1
        while(stock > 0){
          if(stock > orders[idx].stock_change){
            sum += orders[idx].stock_change * orders[idx].actual_price
          }
          else{
            sum += stock * orders[idx].actual_price
          }
            
          stock -= orders[idx].stock_change
          idx--
        }
      }
      this.total_cost = sum
    },


    async updateList() {
      const db = new Database()
      
      this.$refs.totalProduct.update()
      this.$refs.totalCost.update()

      let query
      if(this.search_target == ''){
        query = QueryBuilder.orderBy(QueryBuilder.greaterThan('id', -1), this.sort_element, this.sort_order)
      }
      else{
        query = QueryBuilder.orderBy(QueryBuilder.like('name', '%' + this.search_target + '%'), this.sort_element, this.sort_order) 
      }
      this.products = await db.find(Product, query, this.current_page - 1, this.page_size)
      this.list_product_count = await db.count(Product, query)
      this.total_page = Math.ceil(this.list_product_count / this.page_size)
      await this.updatePageList()
    },
    async updateProduct(){
      const db = new Database()

      let query = QueryBuilder.equal('status', '缺貨中')
      this.sold_out_products = await db.find(Product, query, this.current_page_sold_out - 1, this.page_size_sold_out)
      this.sold_out_product_count = await db.count(Product, query)
      this.total_page_sold_out = Math.ceil(this.sold_out_product_count / this.page_size_sold_out)

      this.sold_out_dates = []
      this.sold_out_importers = []
      for(let i = 0; i < this.sold_out_products.length; i++){
        let query = QueryBuilder.equal('product', Number(this.sold_out_products[i].id))
        let orderitem = await db.find(OrderItem, query)
        let idx = orderitem.length - 1
        if(orderitem[idx]){
          query = QueryBuilder.equal('id', orderitem[idx].id)
          let order = await db.find(Order, query)
          this.sold_out_dates[i] = order[0].time.split('T')[0]
          this.sold_out_importers[i] = order[0].importer
        }
      }

      await this.updatePageProduct()
    },

    infoInput(product: Product){
      product.name = this.name
      product.serial_number = this.serial_number
      product.upc = this.upc
      product.category = this.category_tags.join('/')
      product.status = this.status
      product.manufacturer = this.manufacturer
      product.unit = this.unit
      product.weight = this.weight
      product.length = this.length
      product.width = this.width
      product.height = this.height
      product.info = this.info
      product.price = this.price
      product.note = this.note
      product.stock = this.stock

      product.image_string = this.pictures.join('/')
    },
    async validCheck(){

      
      let ck:boolean = false;

      let message:string = ""
      const db = new Database()

      if(this.name == ''){
        ck = true
        message += "名稱是必填項目\n"
      }

      if(this.upc != '' && this.product_editting == null){
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

    async divide(){

      if(await this.validCheck()){
        return
      }

      if(this.product_editting != null){
        await this.editProductInfo()
        this.clear()
        this.updateList()
        this.updateProduct()
        return
      }

      if(this.stock == 0){
        await this.saveProduct()
        this.clear()
        this.updateList()
        this.updateProduct()
        return
      }

      bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide()
      bootstrap.Modal.getOrCreateInstance(document.getElementById('addOrderModal')).show()
    },

    async saveProduct() {
      const db = new Database()

      const product = new Product()
      this.infoInput(product)

      product.create_time = new Date()
      await db.save(Product, product)
      
      bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide()
      return product
    },
    async backToInfoPage() {
      bootstrap.Modal.getInstance(document.getElementById('addProductModal')).show()
      bootstrap.Modal.getInstance(document.getElementById('addOrderModal')).hide()
    },
    async saveOrder(){
      const product = await this.saveProduct()

      const db = new Database();

      const order = new Order()

      order.time = new Date(this.order_time)
      order.importer = this.importer
      order.amount = this.actual_price*this.stock
      order.internet_marketing = 0
      await db.save(Order, order)

      const orderItem = new OrderItem()
      orderItem.id = order.id
      orderItem.product = product
      orderItem.stock_change = this.stock
      orderItem.labeled_price = this.labled_price
      orderItem.exchange_rate = this.exchange_rate
      orderItem.discount = this.discount
      orderItem.actual_price = this.labled_price*this.exchange_rate+this.discount
      orderItem.note = "初始交易資料"
      await db.save(OrderItem, orderItem)
      bootstrap.Modal.getInstance(document.getElementById('addOrderModal')).hide()
      this.clear()
      this.updateList()
    },

    async editProductInfo(){
      const db = new Database()

      this.infoInput(this.product_editting)
      const storage = new Storage()
      for(let i = 0 ; i < this.tobeDelete.length ; i++){
        await storage.destroy(this.tobeDelete[i])
      }
      await db.save(Product, this.product_editting)

      bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide()
      this.product_editting == null
    },

    async deleteConfirm(product: Product){
      bootstrap.Modal.getOrCreateInstance(document.getElementById('deletecConfirmModal')).show()
      this.delete_product = product
    },
    async deleteProduct() {
      const db = new Database()

      const storage = new Storage()
      
      // if(this.delete_product.image_string != null){
      //   let images = this.delete_product.image_string.split('/')

      //   for(let i = 0; i < images.length; i++){
      //     await storage.destroy(images[i])
      //   }
      // }

      await db.destroy(Product, this.delete_product)
      bootstrap.Modal.getInstance(document.getElementById('deletecConfirmModal')).hide()
      this.updateList()
    },

    async load(product: Product) {
      this.name = String(product.name)
      this.serial_number = String(product.serial_number)
      this.upc = String(product.upc)
      this.category_tags = String(product.category).split('/')
      this.status = String(product.status)
      this.manufacturer = String(product.manufacturer)
      this.unit = String(product.unit)
      this.weight = Number(product.weight)
      this.length = Number(product.length)
      this.width = Number(product.width)
      this.height = Number(product.height)
      this.info = String(product.info)
      this.price = Number(product.price)
      this.note = String(product.note)
      this.stock = Number(product.stock)

      if(product.image_string != null) {
        this.pictures = product.image_string.split('/')
      }
      

      document.getElementById('stock_input')?.setAttribute('disabled','')
    },
    async loadSoldOutProduct(product: Product, index: number){
      this.name = product.name
      this.category = product.category
      this.importer = this.sold_out_importers[index]

      
    },
    getdate(date: Date){
      let dd = String(date.getDate()).padStart(2, '0')
      let mm = String(date.getMonth() + 1).padStart(2, '0')
      let yyyy = date.getFullYear()
      
      return yyyy + '/' + mm + '/' + dd
    },
    async clear(){
      this.product_editting = null

      this.name = ''
      this.serial_number = ''
      this.upc = ''
      this.category = ''
      this.status = '待進貨'
      this.manufacturer = ''
      this.price = 0
      this.unit = ''
      this.weight = 0
      this.length = 0
      this.width = 0
      this.height = 0
      this.info = ''
      this.note = ''
      this.stock = 0

      this.category_tags = []

      this.pictures = []

      this.order_time = ''
      this.importer = ''
      
      this.labled_price = 0
      this.exchange_rate = 0
      this.discount = 0
      this.actual_price = 0

      this.tobeDelete = []
    },

    async sorwt(element: string){
      let prev_element = document.getElementById(this.sort_element)
      prev_element?.classList.remove('sortUp')
      prev_element?.classList.remove('sortDown')

      if (this.sort_element != element){
        this.sort_element = element
        this.sort_order = 'asc'
        document.getElementById(element)?.classList.add('sortUp')
        this.updateList()
        return
      }

      if(this.sort_order == 'asc'){
        this.sort_order = 'desc'
        document.getElementById(element)?.classList.add('sortDown')
      }
      else{
        this.sort_order = 'asc'
        document.getElementById(element)?.classList.add('sortUp')
      }

      this.updateList()
      
    },

    async openExistedProduct(product: Product){
      if(this.product_editting == null){
        await this.clearImage()
      }
      
      if(this.product_editting != product){
        await this.clear()
        this.product_editting = product
        await this.load(product)
      }
      
      bootstrap.Modal.getOrCreateInstance(document.getElementById('addProductModal')).show()

    },
    async openSoldOutInfo(product: Product, index: number){
      await this.clear()
      await this.loadSoldOutProduct(product, index)
      bootstrap.Modal.getOrCreateInstance(document.getElementById('infoModal')).show()
    },
    async clearImage(){
      const storage = new Storage()
      for(let i = 0 ; i < this.pictures.length ; i++){
        await storage.destroy(this.pictures[i])
      }
    },

    async open(){
      if(this.product_editting != null){
        await this.clear()
      }
      
      bootstrap.Modal.getOrCreateInstance(document.getElementById('addProductModal')).show()
      document.getElementById('stock_input')?.removeAttribute('disabled')
      
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
      for(let i = 0 ; i < this.pictures.length ; i++){
        await storage.destroy(this.pictures[i])
      }

      let picture_list = document.getElementById("inputFile").files
      
      this.pictures = []

      for(let i = 0; i <picture_list.length ; i++){
        let fileinfo = await storage.uploadWithAutoname(picture_list[i])
        this.pictures.push(fileinfo.filename)
      }

    },
    async pictureRemove(filename: string){
      if(this.product_editting != null){
        this.tobeDelete.push(filename)
        const index = this.pictures.indexOf(filename, 0)
        this.pictures.splice(index, 1)
        return
      }
      const storage = new Storage()
      const index = this.pictures.indexOf(filename, 0)

      await storage.destroy(filename)
      this.pictures.splice(index, 1)
    },
    async removeSoldOutProduct(product: Product) {
      product.status = '絕版（或不再進貨）'
      const db = new Database()
      await db.save(Product, product)
      this.updateList()
      this.updatePageList()
      this.updateProduct()
      this.updatePageProduct()
    }
  },
  components: { LineChart, TotalProduct, TotalCost, ProductTable}
  })


</script>

<template>
  <div class="d-flex flex-wrap m-4 mt-1 mb-0" >
    <TotalProduct ref="totalProduct"/>

    <TotalCost ref="totalCost"/>

    <div class="col-7 box ms-2 mb-2 mt-2 flex-grow-1" style="height:250px">
      <div class="d-flex" style="height:60px">
        <h6 class="fw-bold ms-3 mt-4">
            完售商品
        </h6>

        <nav class="m-3">
          <ul class="pagination">
            <li class="page-product">
              <a class="page-link" @click="prevPageProduct()">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <div class="d-flex" v-for="page in page_sold_out">
              <li class="page-product"  :id="'product_page' + page"><button class="page-link rounded-0" href="#" @click="changePageProduct(page)">{{ page }}</button></li>
            </div>
            <li class="page-product">
              <a class="page-link" href="#" @click="nextPageProduct()">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <table class="table table-borderless justify-content-center m-3">
        <tbody class="d-flex flex-wrap">
          <tr v-for="(product, i) in sold_out_products" :key="i" class="d-flex col-7">
            <td class="col-5 p-1">名稱: {{ product.name }}</td>
            <td class="col-3 p-1">分類: {{ product.category }}</td>
            <td class="col-3 p-1">進口商: {{ sold_out_importers[i] }}</td>
            <td class="col-5 p-1">完售時間: {{ sold_out_dates[i] }}</td>
            <td class="col-3 p-1 pe-0">
              <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#infoModal" @click="openSoldOutInfo(product, i)">
                顯示詳細資訊
              </button>
            </td>
            <td class="col-1 p-0"><button class="btn btn-outline-danger btn-sm" @click="removeSoldOutProduct(product)"><i class="bi bi-x " style="font-size: 20px"></i></button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <ProductTable/>
  </div>

  <!-- Modal -->
    <div class="modal fade" id="infoModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h6>名稱: {{ name }}</h6>
            <h6>分類: {{ category }}</h6>
            <h6>進口商: {{ importer }}</h6>
          </div>
          <div class="modal-body">
            
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="graph-tab" data-bs-toggle="tab" data-bs-target="#graph-tab-pane" type="button" role="tab" aria-controls="graph-tab-pane" aria-selected="true">圖表</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="sheet-tab" data-bs-toggle="tab" data-bs-target="#sheet-tab-pane" type="button" role="tab" aria-controls="sheet-tab-pane" aria-selected="false">表格</button>
              </li>
            </ul>

            
            <div class="tab-content" id="myTabContent">
              <div class="tab-pane fade show active" id="graph-tab-pane" role="tabpanel" aria-labelledby="graph-tab" tabindex="0">
                <LineChart/>
              </div>

              <div class="tab-pane fade" id="sheet-tab-pane" role="tabpanel" aria-labelledby="sheet-tab" tabindex="0">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col"><input class="form-check-input" type="checkbox" disabled></th>
                      <th scope="col" class="col-9  ">Title</th>
                      <th scope="col" class="col-3">Title</th>
                    </tr>
                  </thead>
                  <tbody class="table-group-divider">
                    <tr>
                      <td><input class="form-check-input" type="checkbox"></td>
                      <td>Text Line</td>
                      <td>
                        <div class="d-flex col-2">
                          <button class="link text-primary">Publish</button>
                          <button class="link text-primary ms-1">Edit</button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td><input class="form-check-input" type="checkbox"></td>
                      <td>Text Line</td>
                      <td>
                        <div class="d-flex col-2">
                          <button class="link text-primary">Publish</button>
                          <button class="link text-primary ms-1">Edit</button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td><input class="form-check-input" type="checkbox"></td>
                      <td>Text Line</td>
                      <td>
                        <div class="d-flex col-2">
                          <button class="link text-primary">Publish</button>
                          <button class="link text-primary ms-1">Edit</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
          <div class="d-flex modal-footer justify-content-between">
            
            <div class="d-flex">
              <p class="m-2">再進貨數量:</p>
              <input type="text" class="form-control ms-1 me-1" style="width:120px;">
              <p class="m-2">單位: 24個/箱</p>
            </div>

            <div class="d-flex">
              <button type="button" class="btn btn-success m-1 fw-bold" data-bs-dismiss="modal">已進貨</button>
              <button type="button" class="btn btn-danger m-1 fw-bold" data-bs-dismiss="modal">不再進貨</button>
              <button type="button" class="btn btn-outline-secondary m-1 fw-bold" data-bs-dismiss="modal">取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="addOrderModal" tabindex="-1">
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
              <button type="submit" class="btn btn-primary ms-3 col-2 fw-bold" style="background: #3B587A;" @click="saveOrder()">Save</button>
            </div>
          </div>
        </div>
      </div>
    
  </div>

  
</template>
  
<style>
  .sortUp .arrow-up{
    visibility:visible
  }
  
  .sortUp .arrow-down{
    visibility:hidden
  }

  .sortDown .arrow-up{
    visibility:hidden
  }
  
  .sortDown .arrow-down{
    visibility:visible
  }

  button.link{
    background:none; border:none; 
  } 

  .mt-30px{
    margin-top: 30px;
  }

  .overflowhidden{
    overflow:hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .box {
    box-sizing: border-box;
    background: #FFFFFF;
  }

  .arrow-up{
    margin-bottom:-7px;
  }
  .arrow-down{
    margin-top:-7px;
  }

  input[type=file]::-webkit-file-upload-button {
    width: 0;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;
    border: none;
    border:0px;
  }

  .mainPage {
    background-color: #f5f5f5;
  }

</style>
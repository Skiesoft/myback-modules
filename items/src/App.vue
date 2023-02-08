<script lang="ts">
  import LineChart from './components/Chart.vue'
  import { Item } from './model/item'
  import { Database, QueryBuilder, Storage} from '@myback/sdk'

  export default {
  name: 'App',
  data(){
    const page_size: number = 9
    const target_count: number = 0;
    const serial_number: number = 0;

    const sort_target: string = 'id'
    const sort_order: string = 'asc'

    const total_items: number = 0
    const total_cost: number = 0

    const current_page: number = 1
    const page_list_starter: number = 1
    const total_page: number = 1
    const page_list: Array<number> = []

    const search_target: string = ''

    const name: string = ''
    const upc: number = 0
    const category: string = ''
    const status: string = ''
    const manufacturer: string = ''
    const price: number = 0
    const unit: string = ''
    const weight: number = 0
    const length: number = 0
    const width: number = 0
    const height: number = 0
    const info: string = ''
    const remark: string = ''

    const target: Item|null = null;

    const items: Array<Item> = [];

    return {
      page_size,
      target_count,

      sort_target,
      sort_order,

      total_items,
      total_cost,

      current_page,
      page_list_starter,
      total_page,
      page_list,

      search_target,

      items,
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
      remark,
      target,
    }
  },
  mounted(){
    this.updateList()
    this.updatePageList()
  },
  methods: {
    async changePage(page: number){
      this.current_page = page
      this.updateList()
    },
    async updatePageList(){
      this.page_list = []
      for(let i = 0 ; i < 3 ; i++){
        if(this.page_list_starter + i > this.total_page){
          return
        }
        this.page_list.push(this.page_list_starter + i)
        
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
    async updateList() {
      const db = new Database()
      this.total_items = await db.count(Item)
      if(this.search_target == ''){
        let query = QueryBuilder.orderBy(QueryBuilder.greaterThan('id', -1), this.sort_target, this.sort_order)
        this.items = await db.find(Item, query, this.current_page-1, this.page_size)
        this.total_page = Math.ceil(this.total_items/this.page_size)
      }
      else{
        let query = QueryBuilder.orderBy(QueryBuilder.like('name', '%'+this.search_target+'%'), this.sort_target, this.sort_order)
        this.items = await db.find(Item, query, this.current_page-1, this.page_size)
        //this.target_count = await db.count(Item, query)
        //window.alert(this.target_count)
        //this.total_page = Math.ceil(this.target_count/this.page_size)
      }
      await this.updatePageList()
    },
    infoInput(item: Item){

      item.name = this.name
      item.upc = this.upc
      item.category = this.category
      item.status = this.status
      item.manufacturer = this.manufacturer
      item.unit = this.unit
      item.weight = this.weight
      item.length = this.length
      item.width = this.width
      item.height = this.height
      item.info = this.info
      item.price = this.price
      item.remark = this.remark

    },
    async editInfo(item: Item){
      const db = new Database()
      console.log(item.getOldProperties())
      await db.save(Item, item)
      this.updateList()
      this.clear()
    },
    async saveItem() {

      if(this.target != null){
        this.infoInput(this.target)
        await this.editInfo(this.target)
        this.target = null
        this.clear()
        return
      }

      const item = new Item()
      this.infoInput(item)

      item.create_time = this.getdate()
      item.plan_on_ordering = 0
      item.ordered = 0
      item.stock = 0
      
      const db = new Database()
      await db.save(Item, item)
      this.updateList()
      this.clear()
    },
    async remove(item: Item) {
      
      const db = new Database()
      await db.destroy(Item, item)
      this.updateList()
    },
    async load(item: Item) {
      this.target = item

      this.name = item.name
      this.upc = item.upc
      this.category = item.category
      this.status = item.status
      this.manufacturer = item.manufacturer
      this.unit = item.unit
      this.weight = item.weight
      this.length = item.length
      this.width = item.width
      this.height = item.height
      this.info = item.info
      this.price = item.price
      this.remark = item.remark
    },
    getdate(){
      let date = new Date()
      let dd = String(date.getDate()).padStart(2, '0')
      let mm = String(date.getMonth() + 1).padStart(2, '0')
      let yyyy = date.getFullYear()
      
      return yyyy + '/' + mm + '/' + dd
    },
    clear(){
      this.name = ''
      this.upc = 0
      this.category = ''
      this.status = ''
      this.manufacturer = ''
      this.price = 0
      this.unit = ''
      this.weight = 0
      this.length = 0
      this.width = 0
      this.height = 0
      this.info = ''
      this.remark = ''
    },
    async sort(target: string){
      let prev_element = document.getElementById(this.sort_target)
      prev_element?.classList.remove('sortUp')
      prev_element?.classList.remove('sortDown')

      if (this.sort_target != target){
        this.sort_target = target
        this.sort_order = 'asc'
        document.getElementById(target)?.classList.add('sortUp')
        this.updateList()
        return
      }

      if(this.sort_order == 'asc'){
        this.sort_order = 'desc'
        document.getElementById(target)?.classList.add('sortDown')
      }
      else{
        this.sort_order = 'asc'
        document.getElementById(target)?.classList.add('sortUp')
      }

      this.updateList()
      
    }
  },
  components: { LineChart }
  }


</script>

<template>
  <div class="d-flex flex-wrap">
    <div class="col-2 box border rounded mb-2 mt-2 me-2 d-flex justify-content-center" style="height:100px">
      <i class="bi-box m-3" style="font-size: 40px"></i>
      <div class="ms-1 mt-4 me-1">
        <h6>商品數量</h6> 
        <h5>{{ total_items }}</h5>
      </div>
    </div>

    <div class="col-2 box border rounded m-2 d-flex justify-content-center" style="height:100px">
      <i class="bi-coin mt-3 me-3" style="font-size: 40px"></i>
      <div class="ms-1 mt-4 me-1">
        <h6>成本總額</h6> 
        <h5>{{ total_cost }}</h5>
      </div>
    </div>

    <div class="col-7 box ms-2 mb-2 mt-2 flex-grow-1" style="height:250px">
      <div class="d-flex" style="height:60px">
        <h6 class="fw-bold ms-3 mt-4">
            完售商品
        </h6>

        <nav class="m-3">
          <ul class="pagination">
            <li class="page-item">
              <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li class="page-item"><a class="page-link" href="#">1</a></li>
            <li class="page-item"><a class="page-link" href="#">2</a></li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            <li class="page-item">
              <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <table class="table table-borderless justify-content-center m-3">
        <tbody class="d-flex flex-wrap">
          <tr class="d-flex col-7">
            <td class="col-5 p-1">名稱: ABCD</td>
            <td class="col-3 p-1">分類: ABCD</td>
            <td class="col-3 p-1">進口商: ABCDE</td>
            <td class="col-5 p-1">完售時間: 2021/01/01</td>
            <td class="col-3 p-1">
              <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#infoModal">
                顯示詳細資訊
              </button>
            </td>
            <td class="col-3 p-1"><i class="bi bi-x " style="font-size: 20px"></i></td>
          </tr>
          <tr class="d-flex col-7">
            <td class="col-5 p-1">名稱: ABCD</td>
            <td class="col-3 p-1">分類: ABCD</td>
            <td class="col-3 p-1">進口商: ABCDE</td>
            <td class="col-5 p-1">完售時間: 2021/01/01</td>
            <td class="col-3 p-1">
              <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#infoModal">
                顯示詳細資訊
              </button>
            </td>
            <td class="col-3 p-1"><i class="bi bi-x " style="font-size: 20px"></i></td>
          </tr>
          <tr class="d-flex col-7">
            <td class="col-5 p-1">名稱: ABCD</td>
            <td class="col-3 p-1">分類: ABCD</td>
            <td class="col-3 p-1">進口商: ABCDE</td>
            <td class="col-5 p-1">完售時間: 2021/01/01</td>
            <td class="col-3 p-1">
              <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#infoModal">
                顯示詳細資訊
              </button>
            </td>
            <td class="col-3 p-1"><i class="bi bi-x " style="font-size: 20px"></i></td>
          </tr>
          <tr class="d-flex col-7">
            <td class="col-5 p-1">名稱: ABCD</td>
            <td class="col-3 p-1">分類: ABCD</td>
            <td class="col-3 p-1">進口商: ABCDE</td>
            <td class="col-5 p-1">完售時間: 2021/01/01</td>
            <td class="col-3 p-1">
              <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#infoModal">
                顯示詳細資訊
              </button>
            </td>
            <td class="col-3 p-1"><i class="bi bi-x " style="font-size: 20px"></i></td>
          </tr>
          
          
        </tbody>
      </table>
    </div>

    <div class="col-12 box justify-content-center p-4" style="height:450px">
      <div class="justify-content-between d-flex">
        <div class="col-4 d-flex">
          <h4 class="fw-bold mt-1">
              商品列表
          </h4>

          <nav class="ms-3" style="height:40px">
            <ul class="pagination">
              <li class="page-item">
                <button class="page-link" @click="prevPageList()">
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
              <div class="d-flex" v-for="page in page_list">
                <li class="page-item" ><button class="page-link rounded-0" href="#" @click="changePage(page)">{{ page }}</button></li>
              </div>
              <li class="page-item">
                <button class="page-link" href="#" @click="nextPageList()">
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-4  d-flex">
          <input @keyup.enter="updateList()" type="text" class="form-control" placeholder="Search" v-model="search_target">
          <button type="button" class="btn btn-primary ms-3 col-3 fw-bold" style="background: #3B587A;" data-bs-toggle="modal" data-bs-target="#addProductModal">新增商品</button>
        </div>
      </div>
      

      <div class="d-flex container mt-3">
        <div class="me-5 fw-bold d-flex align-items-center">
          Id
          <div id="id" class="d-flex flex-column ms-1 sortUp" @click="sort('id')" type="button">
            <div class="arrow-up"><i class="bi bi-caret-up-fill" style="font-size: 1px;" ></i></div>
            <div class="arrow-down"><i class="bi bi-caret-down-fill" style="font-size: 1px" ></i></div>
          </div>
        </div>
        <div class="col-2 fw-bold d-flex align-items-center me-2">
          Name
          <div id="name" class="d-flex flex-column ms-1" @click="sort('name')" type="button">
            <div class="arrow-up"><i class="bi bi-caret-up-fill" style="font-size: 1px"></i></div>
           <div class="arrow-down"><i class="bi bi-caret-down-fill" style="font-size: 1px"></i></div>
          </div>
        </div>
        <div class="col fw-bold d-flex align-items-center">
          category
          <div id="category" class="d-flex flex-column ms-1" @click="sort('category')" type="button">
            <div class="arrow-up"><i class="bi bi-caret-up-fill" style="font-size: 1px"></i></div>
            <div class="arrow-down"><i class="bi bi-caret-down-fill" style="font-size: 1px"></i></div>
          </div>
        </div>
        <div class="col fw-bold d-flex align-items-center">
          Status
          <div id="status" class="d-flex flex-column ms-1" @click="sort('status') " type="button">
            <div class="arrow-up"><i class="bi bi-caret-up-fill" style="font-size: 1px"></i></div>
           <div class="arrow-down"><i class="bi bi-caret-down-fill" style="font-size: 1px"></i></div>
          </div>
        </div>
        <div class="col fw-bold d-flex align-items-center">
          In-stock
          <div id="stock" class="d-flex flex-column ms-1" @click="sort('stock')" type="button">
            <div class="arrow-up"><i class="bi bi-caret-up-fill" style="font-size: 1px"></i></div>
            <div class="arrow-down"><i class="bi bi-caret-down-fill" style="font-size: 1px"></i></div>
          </div>
        </div>
        <div class="col fw-bold d-flex align-items-center">
          Add-time
          <div id="create_time" class="d-flex flex-column ms-1" @click="sort('create_time')" type="button">
            <div class="arrow-up"><i class="bi bi-caret-up-fill" style="font-size: 1px"></i></div>
            <div class="arrow-down"><i class="bi bi-caret-down-fill" style="font-size: 1px"></i></div>
          </div>
        </div>
        <div class="col fw-bold d-flex align-items-center">
          進口商
          <div id="manufacturer" class="d-flex flex-column ms-1" @click="sort('manufacturer')" type="button">
            <div class="arrow-up"><i class="bi bi-caret-up-fill" style="font-size: 1px"></i></div>
            <div class="arrow-down"><i class="bi bi-caret-down-fill" style="font-size: 1px" ></i></div>
          </div>
        </div>
        <div class="col"></div>
      </div>

      <hr class="border border-dark opacity-100  m-2" />

      <div v-for="item in items">
        <div class="d-flex container mt-2">
          <div class="me-5" style="width: 31px">{{ item.id }}</div>
          <div class="col-2 overflowhidden me-2">{{ item.name }}</div>
          <div class="col">{{ item.category }}</div>
          <div class="col">{{ item.status }}</div>
          <div class="col">{{ item.stock }}</div>
          <div class="col">{{ item.create_time }}</div>
          <div class="col">{{ item.manufacturer }}</div>
          <div class="d-flex col">
            <button class="link" style="color: #3B587A" data-bs-toggle="modal" data-bs-target="#addProductModal" @click="load(item)">Edit</button>
            <button class="link link-danger ms-1" @click="remove(item)">Delete</button>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- Modal -->
    <div class="modal fade" id="infoModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h6>名稱: 12345</h6>
            <h6>分類: 12345</h6>
            <h6>進口商: 12345</h6>
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

    <div class="modal fade" id="addProductModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="align-items-center justify-content-between d-flex">
            <h4 class="fw-bold m-3 mb-1">商品資訊</h4>
            <button type="button" class="btn-close m-3 mb-1" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <hr class="border border-secondary opacity-100  m-1" />
          <div class="m-3 mt-1 flex-col">
            <div class="d-flex align-items-center mt-2">
              <h6 class="col-3 m-0 pt-1 pb-1">名稱</h6>
              <input type="text" class="form-control p-1" v-model="name">
            </div>
            <div class="d-flex align-items-center mt-2">
              <h6 class="col-3 m-0 pt-1 pb-1">編號</h6>
              <input type="text" class="form-control p-1" v-model="serial_number">
            </div>
            <div class="d-flex align-items-center mt-2">
              <h6 class="col-3 m-0 pt-1 pb-1">條碼</h6>
              <input type="text" class="form-control p-1" v-model="upc">
            </div>
            <div class="d-flex align-items-center mt-2">
              <h6 class="col-3 m-0 pt-1 pb-1">分類</h6>
              <div class="col-6">
              <select class="form-select"  v-model="category">
                <option selected>option 1</option>
                <option selected>option 2</option>
              </select>
              </div>
            </div>
            <div class="d-flex align-items-center mt-2">
              <h6 class="col-3 m-0 pt-1 pb-1">狀態</h6>
              <div class="col-6">
              <select class="form-select" v-model="status">
                <option selected>預購中</option>
                <option>販售中</option>
                <option>缺貨中</option>
              </select>
              </div>
            </div>
            <div class="d-flex align-items-center mt-2">
              <h6 class="col-3 m-0 pt-1 pb-1">製造商</h6>
              <input type="text" class="form-control p-1"  v-model="manufacturer">
            </div>
            <div class="d-flex align-items-center mt-2">
              <h6 class="col-3 m-0 pt-1 pb-1">定價</h6>
              <input type="text" class="form-control p-1" v-model="price">
            </div>
            <div class="d-flex align-items-center mt-2">
              <h6 class="col-3 m-0 pt-1 pb-1">單位</h6>
              <input type="text" class="form-control p-1" v-model="unit">
            </div>
            <div class="d-flex align-items-center mt-2">
              <h6 class="col-3 m-0 pt-1 pb-1">重量</h6>
              <input type="text" class="form-control p-1" v-model="weight">
            </div>
            <div class="d-flex align-items-center mt-2">
              <h6 class="col-3 m-0 pt-1 pb-1">尺寸</h6>
              <input type="text" class="form-control p-1" v-model="length">
              <input type="text" class="form-control p-1 ms-1" v-model="width">
              <input type="text" class="form-control p-1 ms-1" v-model="height">
            </div>
            <div class="d-flex align-items-start mt-2 flex-wrap flex-col">
              <h6 class="col-3 m-0 pt-1 pb-1">圖片</h6>
              <div class="input-group mt-1 mb-3 col-12">
                <input type="file" class="form-control" id="inputFile">
                <label class="input-group-text" for="inputFile">選擇檔案</label>
              </div>
              <img src="" class="img-thumbnail col-4">
            </div>
            <div class="d-flex align-items-start mt-2">
              <h6 class="col-3 m-0 pt-1 pb-1">商品描述</h6>
              <textarea class="form-control" v-model="info"></textarea>
            </div>
            <div class="d-flex align-items-start mt-2 mb-2">
              <h6 class="col-3 m-0 pt-1 pb-1" >備註</h6>
              <textarea class="form-control" v-model="remark"></textarea>
            </div>
            <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-primary ms-3 col-2 fw-bold" style="background: #3B587A;" @click="saveItem()" data-bs-dismiss="modal">Save</button>
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

</style>
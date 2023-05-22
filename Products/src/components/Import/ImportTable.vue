<script lang="ts">
  import { defineComponent } from 'vue'
  import { Query } from '@myback/sdk/build/api/query-builder'
  import { QueryBuilder } from '@myback/sdk'
  import { Product } from '@/model/product'

  export default defineComponent({
    data(){
      return{
      }
    },
    methods: {
      
    }
  })
</script>

<template>
  <div class="col-12 box p-4 d-flex flex-column">
    <div class=" d-flex">
      <h4 class="fw-bold mt-1">
        商品入庫
      </h4>
    </div>
    <div class="d-flex mt-3">
      <div class="col-3 fw-bold d-flex align-items-center">
        條碼
      </div>
      <div class="col-5 fw-bold d-flex align-items-center">
        名稱
      </div>
      <div class="col-1 fw-bold d-flex align-items-center">
        數量
      </div>
    </div>

    <div class="d-flex mt-2">
      <div class="col-3 overflowhidden ps-2">AAAAAAAAAAAAAAAAAAAAA</div>
      <div class="col-5 overflowhidden">testname</div>
      <div class="col-2 d-flex align-content-end">
        <button type="button" class="btn btn-bd-count"><i class="bi bi-dash"></i></button>
        <input class="form-control form-control-sm" type="text" placeholder="數量">
        <button type="button" class="btn btn-bd-count"><i class="bi bi-plus"></i></button>
      </div>
      <div class="col-2 d-flex justify-content-end pe-3">
        <div type="button" style="color: red">刪除</div>
      </div>
    </div>
    
    

    <div class="col-3 pe-2 mt-2">
      <input class="form-control" placeholder="請輸入條碼">
    </div>
    <div class="d-flex justify-content-end mt-auto">
      <button class="btn btn-primary">新增入庫</button>
    </div>
  </div>
</template>

<style scoped>
.box{
  min-height: 450px;
  height: auto
}
</style>
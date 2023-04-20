<script lang="ts">
  import { defineComponent } from 'vue'
  import { Database, QueryBuilder } from '@myback/sdk'
  import { Product } from '@/model/product'

  export default defineComponent({
    props: ["page_size", "table_name", "query"],
    data() { 
      const page_list:Array<number> = []
      
      const page_list_starter:number = 1
      const total_page:number = 0
      const current_page:number = 1

      return{
        page_list,

        page_list_starter,
        total_page,
        current_page,
      }
    },
    methods: {
      async reload() {
        const db = new Database()

        this.page_list_starter = 1
        this.current_page = 1

        if (this.query != null){
          this.total_page = Math.ceil(Number(await db.count(Product, this.query))/this.page_size)
        }
        this.update()
      },
      async update(){    
        this.removeHighlight()
        this.page_list = []

        for(let i = 0 ; i < 3 ; i++){
          if(this.page_list_starter + i > this.total_page){
            continue
          }
          this.page_list.push(this.page_list_starter + i)
        }

        await new Promise(f => setTimeout(f, 1))
        let page = document.getElementById(this.table_name + this.current_page)
        page?.classList.add('active')
      },
      async nextStarter(){
        if(this.page_list_starter + 3 > this.total_page){
          return
        }
        this.page_list_starter += 3
        this.update()
      },
      async prevStarter(){
        if(this.page_list_starter - 3 < 0){
          return
        }
        this.page_list_starter -= 3
        this.update()
      },
      async open(page: number){
        this.removeHighlight()
        this.current_page = page
        this.$emit('update', page)
        this.update()
      },
      removeHighlight(){
        let page = document.getElementById(this.table_name + this.current_page)
        page?.classList.remove('active')
      }

    }
  })

</script>

<template>
  <nav class="ms-3" style="height:40px">
    <ul class="pagination">
      <li class="page-item">
        <button class="page-link" @click="prevStarter()">
          <span aria-hidden="true">&laquo;</span>
        </button>
      </li>
      <div class="d-flex" v-for="page in page_list">
        <li class="page-item" :id="table_name + page"><button class="page-link rounded-0" @click="open(page)">{{ page }}</button></li>
      </div>
      <li class="page-item">
        <button class="page-link" href="#" @click="nextStarter()">
          <span aria-hidden="true">&raquo;</span>
        </button>
      </li>
    </ul>
  </nav>
</template>
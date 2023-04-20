<script lang="ts">
  import { Modal } from 'bootstrap';
  import { defineComponent } from 'vue';
 
  export default defineComponent({
    props:["confirm_message", "confirm_option", "table_name"],
    data(){
      const modal: Modal|null = null;
      return{
        modal
      }
    },
    mounted(){
      console.log(`${this.table_name}Confirm`)
      this.modal = new Modal(document.getElementById(`${this.table_name}Confirm`)!)
    },
    methods: {
      async show(){
        this.modal.show()
      },
      async hide(){
        this.modal.hide()
      }
    }
  })

</script>

<template>
  <div class="modal fade" :id="table_name+'Confirm'">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <h3 class="fw-bold">{{ confirm_message }}</h3>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="$emit('confirm'), hide()" >{{confirm_option}}</button>
          <button type="button" class="btn btn-secondary" @click="hide()">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
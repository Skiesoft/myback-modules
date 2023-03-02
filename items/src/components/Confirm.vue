<script lang="ts">
  import { Modal } from 'bootstrap';
  import { defineComponent } from 'vue';
 
  export default defineComponent({
    props:["confirm_message", "confirm_option", "confirm_operation"],
    data(){
      const modal: Modal|null = null;
      return{
        modal
      }
    },
    mounted(){
      this.modal = new Modal(document.getElementById('ConfirmModal'))
    },
    methods: {
      async show(){
        this.modal.show()
      }
    }
  })

</script>

<template>
  <div class="modal fade" id="ConfirmModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <h3 class="fw-bold">{{ confirm_message }}</h3>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="confirm_operation()" data-bs-dismiss="modal">{{confirm_option}}</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>

        </div>
      </div>
    </div>
  </div>
</template>
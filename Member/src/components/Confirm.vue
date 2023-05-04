<script lang="ts">
import { Modal } from 'bootstrap';
import { defineComponent } from 'vue';

export default defineComponent({
  props:["confirm_message", "confirm_option", "showModalIn"],
  emit:["delete"],
  data(){
    let modal: Modal;
    return{
      modal
    }
  },
  mounted(){
    this.modal = new Modal(document.getElementById('ConfirmModal')!)
  },
  methods: {
    async showModal() {
      this.modal.show();
    },
    async deleteMember() {
      this.$emit('delete');
      this.closeModal();
    },
    async closeModal() {
      this.modal.hide();
    }
  },
  watch: {
    showModalIn() {
      if (this.showModalIn == true) {
        this.showModal()
      }
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
          <button type="button" class="btn btn-danger" @click="deleteMember">{{ confirm_option }}</button>
          <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>

        </div>
      </div>
    </div>
  </div>
</template>
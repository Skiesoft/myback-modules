<script lang="ts">
import { defineComponent } from 'vue';
import { Database, QueryBuilder } from '@myback/sdk'
import { Contact } from '../model/contact'
import { Modal } from 'bootstrap'

export default defineComponent ({
  props:['showModalIn', 'memberId'],
  emits:['close'],
  data() {
    let modal: Modal;
    const member: Contact = new Contact();
    return {
      name: "",
      phoneNumber: "",
			email: "",
			role: "",
      modal,
      member
    }
  },
  mounted(){
    this.modal = new Modal(document.getElementById('addFrame')!)
    var myModal = document.getElementById('addFrame')
    myModal!.addEventListener('hidden.bs.modal', () => {
      this.closeModal()
    })
  },
  methods: {
    async showInfo(){
      const db = new Database();
      let query = QueryBuilder.equal("id", this.memberId);
      let found = await db.find(Contact, query);
      if (found.length != 0) {
        console.log('found')
        this.member = found[0]
        this.name = found[0].name;
        this.phoneNumber = found[0].phone_number;
        this.email = found[0].email;
        this.role = found[0].role;
      }
    },
    async saveMember() {
      const date = new Date()
      if (!(await this.validCheck())){
        this.member.name = this.name
        this.member.create_date = date
        this.member.email = this.email
        this.member.phone = this.phoneNumber
        //this.member.role = this.role
        
        const db = new Database()
        await db.save(Contact, this.member)
        this.closeModal()
      }
    },
    async showModal(){
      this.modal.show();
    },
    async closeModal() {
      this.modal.hide();
      this.$emit('close')
    },
    async validCheck(): Promise<boolean> {
      let empty = false;
      let message = '';

      if (this.name == "") {
        empty = true;
        message += '名字是必填項目\n';
      }

      if (this.phoneNumber == "") {
        empty = true;
        message += '手機號碼是必填項目\n';
      }

      if (this.email == "") {
        empty = true;
        message += 'Email是必填項目\n';
      }

      if (empty) {
        window.alert(message);
      }
      return empty;
    },
    async onlyNumber(evt: KeyboardEvent): Promise<void>{
      const keysAllowed: RegExp = /[0-9]/g
      const keyPressed: string = evt.key;
    
      if (!keysAllowed.exec(keyPressed)) {
        evt.preventDefault()
      }
    },
  },
  watch: {
    showModalIn() {
      if (this.showModalIn == true) {
        this.showModal();
        this.showInfo();
      }
      else {
        this.closeModal()
      }
    }
  }
})
</script>
    
<template>
  <div class="modal fade" id="addFrame" tabindex="-1">
		<div class="modal-dialog modal-lg modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-body d-flex justify-content-evenly">
					<div class="d-flex m-3 col-8 flex-wrap">
						<div class="d-flex w-100 mb-3">
							<h6 class="align-self-end flex-grow-1 ms-2 me-2 pe-2 col-2">名字</h6>
							<input type="text" class="form-control ms-2" placeholder="Name" v-model="name">
						</div>
            <div class="d-flex w-100 mb-3">
							<h6 class="align-self-end ms-2 me-2 pe-2 col-2">電話號碼</h6>
							<input type="text" class="form-control ms-2" placeholder="Phone Number" @keypress="onlyNumber($event)" v-model="phoneNumber">
						</div>
						<div class="d-flex w-100 mb-3">
							<h6 class="align-self-end ms-2 me-2 pe-2 col-2">Email</h6>
							<input type="text" class="form-control ms-2" placeholder="Email"  v-model="email">
						</div>
						<div class="d-flex w-100 mb-3">
							<h6 class="align-self-end ms-2 me-2 pe-2 col-2">層級</h6>
							<select class="form-select ms-2" aria-label="role" v-model="role">
								<option value=""></option>
								<option value="VIP">VIP</option>
							</select>
						</div>
						<button type="button" class="btn btn-primary mt-2 ms-1" @click="saveMember">保存</button>
					</div>
					<div>
						<i class="bi bi-person-circle" style="font-size: 100px"></i>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

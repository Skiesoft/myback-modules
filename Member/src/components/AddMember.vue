<script lang="ts">
import { defineComponent } from 'vue'
import { Database } from '@myback/sdk'
import { Contact } from '../model/contact'
import { Modal } from 'bootstrap'

type DataType = {
  name: string,
  phoneNumber: string,
  email: string,
  modal: Modal,
}

export default defineComponent({
  props: ['showModalIn'],
  emits: ['close'],
  data () {
    return {
      name: '',
      phoneNumber: '',
      email: ''
    } as DataType
  },
  mounted () {
    this.modal = new Modal(document.getElementById('addFrame')!)
    const myModal = document.getElementById('addFrame')
    myModal!.addEventListener('hidden.bs.modal', () => {
      this.$emit('close')
    })
  },
  methods: {
    async addMember () {
      const date = new Date()
      const member = new Contact()
      if (!(await this.validCheck())) {
        member.name = this.name
        member.create_date = date
        member.email = this.email
        member.phone = this.phoneNumber

        const db = new Database()
        await db.save(Contact, member)

        this.clear()

        this.closeModal()
      }
    },
    async showModal () {
      this.modal.show()
    },
    async closeModal () {
      this.modal.hide()
      this.$emit('close')
    },
    async validCheck (): Promise<boolean> {
      let empty = false
      let message = ''

      if (this.name === '') {
        empty = true
        message += '名字是必填項目\n'
      }

      if (this.phoneNumber === '') {
        empty = true
        message += '手機號碼是必填項目\n'
      }

      if (this.email === '') {
        empty = true
        message += 'Email是必填項目\n'
      }

      if (empty) {
        window.alert(message)
      }
      return empty
    },
    async clear () {
      this.name = ''
      this.phoneNumber = ''
      this.email = ''
    },
    async onlyNumber (evt: KeyboardEvent): Promise<void> {
      const keysAllowed: RegExp = /[0-9]/g
      const keyPressed: string = evt.key

      if (!keysAllowed.exec(keyPressed)) {
        evt.preventDefault()
      }
    }
  },
  watch: {
    showModalIn () {
      if (this.showModalIn === true) {
        this.showModal()
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
              <input type="text" class="form-control ms-2" placeholder="名字" v-model="name">
            </div>
            <div class="d-flex w-100 mb-3">
              <h6 class="align-self-end ms-2 me-2 pe-2 col-2">電話號碼</h6>
              <input type="text" class="form-control ms-2" placeholder="電話號碼" @keypress="onlyNumber($event)"
                v-model="phoneNumber">
            </div>
            <div class="d-flex w-100 mb-3">
              <h6 class="align-self-end ms-2 me-2 pe-2 col-2">Email</h6>
              <input type="text" class="form-control ms-2" placeholder="Email" v-model="email">
            </div>
            <button type="button" class="btn btn-primary mt-2 ms-1" @click="addMember">新增會員</button>
          </div>
          <div>
            <i class="bi bi-person-circle" style="font-size: 100px"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

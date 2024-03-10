<template>
  <div v-if="isStatusAuth">
    Registration
    <form class="form" @submit.prevent="sendInfo">
      <label>
        E-mail
        <input v-model="formData.email" />
      </label>
      <label>
        Password
        <input v-model="formData.password" />
      </label>
      <button>Send!</button>
    </form>
  </div>
  <div v-else-if='isStatusCode'>
    Check code
    <form class="form" @submit.prevent="sendCode">
      <label>
        code
        <input v-model="code" />
      </label>
      <button>check!</button>
    </form>
  </div>
  <div v-else-if="isStatusWelcome">Welcome!</div>
</template>
<script>
import axios from 'axios';
import { defineComponent } from 'vue' 

export default defineComponent({
  data() {
    return {
      formData: {
        email: '',
        password: ''
      },
      code: '',
      status: 'auth' // auth, code, welcome
    }
  },
  computed: {
    isStatusAuth() { 
      return this.status === 'auth'
    } ,
    isStatusCode() { 
      return this.status === 'code'
    },
    isStatusWelcome() { 
      return this.status === 'welcome'
    } 
  },
  methods: {
    async sendInfo() { 
      try {
        const email = this.formData.email

        const { data } = await axios.post('http://localhost:3000/send-code', {
          to: email,
        })

        alert(data.message)
        this.status = 'code'
        
      } catch (error) {
        console.error(error);
      }
    },
    async sendCode() { 
      try {
        const { data } = await axios.post('http://localhost:3000/code-confirm', { code: this.code })

        alert(data.message)
        this.status = 'welcome'
        
      } catch (error) {
        console.error(error);
      }
    }
  }
})
</script>
<style lang="scss">

.form {
  display: flex;
  flex-direction: column;
}
  
</style>
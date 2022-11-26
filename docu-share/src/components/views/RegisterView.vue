<script lang="ts">
import { defineComponent } from 'vue'
import { addUser } from "/Users/spreschlack/Desktop/applied internet technology/homework/final-project-StanPreschlack/docu-share/src/firebase exposure functions/dataFetchingFunctions"

export default defineComponent({
  data() {
    return {
      valid: 'register'
    }
  },
  methods: {
    //return user cred if sucessfull, errors if not
    async register(submitEvent:any) {
      const email = submitEvent.target.elements.email.value
      const password = submitEvent.target.elements.password.value
      const user = await addUser(email, password)
      if (typeof user === "string") {
        if (user === "auth/invalid-email") {
          this.valid = "email formatted incorrectly"
        } else if (user === "auth/weak-password") {
          this.valid = "password must be at least 8 characters"
        } else if (user === "auth/email-already-in-use") {
          this.valid = "there is already an account registered with this email."
        } else {
          this.valid = user
        }
      } else {
        this.$router.push({ name: 'docs' });
        console.log("success!!")
      }
    }
  }
})

</script>

<template>
  <div id="registerContainer">
    <p class="greeting">{{valid}}</p>
    <form @submit.prevent="register">
      <input type="text" name="email" placeholder="email"><br />
       <span class="focus-bg"></span>
      <input type="password" name="password" placeholder="password"><br />
       <span class="focus-bg"></span>
      <button class="focus" type="submit">Submit</button>
    </form>
    <a href="/login">login</a>
  </div>  
</template>

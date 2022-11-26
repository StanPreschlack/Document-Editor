<script lang="ts">
import { defineComponent } from 'vue'
import { login, googleSignIn } from "/Users/spreschlack/Desktop/applied internet technology/homework/final-project-StanPreschlack/docu-share/src/firebase exposure functions/dataFetchingFunctions"

export default defineComponent({
  data() {
    return {
      valid: 'login'
    }
  },
  methods: {
    //return user cred if sucessfull, errors if not
    async login(submitEvent:any) {
      const email = submitEvent.target.elements.email.value
      const password = submitEvent.target.elements.password.value
      const user = await login(email, password)
      if (typeof user === "string") {
        if (user === "auth/user-not-found" || user === "auth/invalid-email") {
          this.valid = "there is no email registered for this user"
        } else if (user === "auth/wrong-password" || user === "auth/internal-error") {
          this.valid = "incorrect password"
        } else {
          this.valid = user
        }
      } else {
        this.$router.push({ name: 'docs' });
        console.log("success!!")
      }
    },
  }
})

</script>

<template>
  <div id="login_form">
    <p class="greeting">{{ valid }}</p>
    <form @submit.prevent="login">
      <input type="text" name="email" placeholder="email"><br />
      <input type="password" name="password" placeholder="password"><br />
      <button type="submit" class="focus">Submit</button>
    </form>
    <a href="/register">register</a>
    <a href="/register">forgot password?</a>
  </div> 
</template>

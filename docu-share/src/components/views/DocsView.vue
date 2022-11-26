// @ts-nocheck 
<script lang="ts">
import { defineComponent } from 'vue'
import { getAuth } from "firebase/auth"
import { createDoc, getUserDocs, deleteDoc } from "/Users/spreschlack/Desktop/applied internet technology/homework/final-project-StanPreschlack/docu-share/src/firebase exposure functions/dataFetchingFunctions"

export default defineComponent({
  data() {
    return {
      docs: undefined,
      loading: true,
    }
  },
  async beforeMount(){
    //redirects unauthenticated users
    if(getAuth().currentUser === null) {
      this.$router.push({ name: 'login' });
    } else {
      //else display doc icons
      this.docs = await getUserDocs(getAuth().currentUser?.uid);
      this.loading = false
    }
  },
  methods: {
    async createDoc() {
      let id = await createDoc(getAuth().currentUser?.uid, "untitled document", "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Enter your content here...\"}]}]}");
      this.$router.push({ name: "doc", params: {slug: "untitled-document~" + id}});
    },
    loadDoc(slug) {
      this.$router.push({ name: "doc", params: {slug: slug}});
    },
    async deleteDoc(slug) {
      let id = slug.split("~")[1]
      await deleteDoc(getAuth().currentUser?.uid, id);
      this.docs = await getUserDocs(getAuth().currentUser?.uid);
    }
  }
})

</script>

<template>
  <div id="docContainer">
    <div id="newDocButton" class="doc">
      <form @submit.prevent="createDoc">
        <input type="submit" value="create document"/>
      </form>
    </div>  
    <template v-if="this.loading">
      <div class="container">
          <div class="box box1"></div>
          <div class="box box2"></div>
          <div class="box box3"></div>
          <div class="box box4"></div>
      </div>
    </template>
    <template v-else>  
      <div v-for="item in this.docs" :key="item.data" class="doc">
        <button @click="deleteDoc(item.slug)"><img src="/images/del.png"/></button>
        <p @click.capture="loadDoc(item.slug)">{{ item.name }}</p>
      </div>
    </template>
  </div>
</template>

<style>

.doc p {
  position: relative;
  height: 100%;
  width: 100%;
}

.doc button {
  background-color: white;
  z-index: 10;
  border: none;
  height: 25px;
  width: 25px;
  transform: translate(-10px, -10px);
  border-radius: 50%;
 box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
}

.doc button:hover {
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
}

.doc img {
  position: relative;
  height: 100%;
  width: 100%;
   border-radius: 50%;
}

#docContainer {
  position: absolute;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: fit-content;
  min-width: 80vw;
  height: 90vh;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

#newDocButton input, #newDocButton form {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: white;
  border: none;
}
#newDocButton input:hover {
  cursor: grab;
}
.doc {
  width: 200px;
  height: 300px;
  background-color: white;
  margin: 20px;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}
.doc:hover {
  cursor: grab;
} 

</style>

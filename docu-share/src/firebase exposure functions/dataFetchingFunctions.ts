import {signInWithPopup, GithubAuthProvider, GoogleAuthProvider, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import app from "./firebaseConfig"
import { getDatabase, ref, set, child, get, remove, type DatabaseReference } from 'firebase/database'
import slugify from "slugify"
import uniqid from 'uniqid';

//initialize auth
const auth = getAuth(app)

async function googleSignIn(router:Object) {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // The signed-in user info.
    const user = result.user;
    //@ts-ignore
    router.push({ name: 'docs' });
  }).catch((error) => {
    console.log("ERR GGL SGN IN")
  });
}

async function signInWithGitHub(router:Object) {
  const provider = new GithubAuthProvider();
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // The signed-in user info.
    const user = result.user;
    //@ts-ignore
    router.push({ name: 'docs' });
  }).catch((error) => {
    console.log("ERR GIT SGN IN")
  });
}

//returns user object if creation was sucessful, returns false if failed and prints error 

async function addUser(email:string, password:string) {
  let returnVal:any
  await createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    returnVal = userCredential;
  })
  .catch((error) => {
    returnVal = error.code
  });
  return returnVal
}

//same as addUser

async function login(email:string, password:string) {
  let returnVal:any
  await signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
      returnVal = userCredential.user;
  })
  .catch((error) => {
    returnVal = error.code;
  });
  return returnVal
}

//creates document and returns document id

async function createDoc(user:string, name:string, data:string) {
  const db = getDatabase(app)
  let id = uniqid()
  await set(ref(db, "docs/" + user + "/" + id), {
      title: name, 
      data: data, 
      slug: slugify(name) + "~" + id,
      id: id
    },
  )
  return id
}

//retreves all documents under a user uid

async function getUserDocs(user:string) {
  let docs
  await get(child(ref(getDatabase(app)), `docs/${user}`)).then((snapshot) => {
    if (snapshot.exists()) {
      docs = snapshot.val();
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  return docs
}

//called by autosave on change, saves document state to database and returns slug + doc id

async function saveDoc(user:string, id:string, data:Object, name:string) {
  await get(child(ref(getDatabase(app)), `docs/${user}`)).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((item:Object) => {
        //@ts-ignore
        if (item.val().slug.split("~")[1] === id) {
          //@ts-ignore
          set(item.ref, {
            data: JSON.stringify(data),
            slug: slugify(name) + "~" + id,
            name: name
          });
          console.log("saved.")
        }
      })
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  return slugify(name) + "~" + id;
}

//gets document body from user and doc id

async function getDataFromId(user:string, id:string) {
  let data = {}
  await get(child(ref(getDatabase(app)), `docs/${user}`)).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((item:Object) => {
        //@ts-ignore
        if (item.val().slug.split("~")[1] === id) {
          //@ts-ignore
          data = item.val().data;
        }
      })
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  return data;
}

//deletes doc from user and doc id

async function deleteDoc(user:string, id:string) {
  await get(child(ref(getDatabase(app)), `docs/${user}`)).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((item:Object) => {
        //@ts-ignore
        if (item.val().slug.split("~")[1] === id) {
          //@ts-ignore
          remove(item.ref);
          console.log("removed.")
        }
      })
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}

//gets doc name from doc id

async function getNameFromId(user:string, id:string) {
  let name = ""
  await get(child(ref(getDatabase(app)), `docs/${user}`)).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((item:Object) => {
        //@ts-ignore
        if (item.val().slug.split("~")[1] === id) {
          //@ts-ignore
          name = item.val().name;
        }
      })
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  return name;
}

export {
  addUser,
  login,
  createDoc,
  getUserDocs,
  saveDoc,
  getDataFromId,
  deleteDoc,
  getNameFromId,
  googleSignIn,
  signInWithGitHub,
}

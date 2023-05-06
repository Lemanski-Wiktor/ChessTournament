<script>
    import { user } from "../lib/store.js";
    import { navigate } from "svelte-routing";
    import {
        getFirestore,
        collection,
        getDocs,
        getDoc,
        setDoc,
        doc,
        deleteDoc,
        addDoc,
        where,
        serverTimestamp,
        updateDoc,
    } from "firebase/firestore";

    export let db;
    export let id;

    const get = async()=>{
        const snapshot = await getDoc(doc(db, "players", `${id}`));
        for(const[key, val] of Object.entries(snapshot.data())){
            if(key === 'name') $user.name = val
            if(key === 'surname') $user.surname = val
            if(key === 'age') $user.age = val
            if(key === 'city') $user.city = val
        }
    }
    get()

    const update = async(user)=>{
        for(const [key,value] of Object.entries(user)){
          if(value === null || value=== ""){
            alert('Fill all inputs!')
            return false
          }
        }
        const docRef = doc(db, "players", `${id}`)
        await updateDoc(docRef, {
            name: user.name,
            surname: user.surname,
            age: user.age,
            city: user.city
        });
        navigate("/players", { replace: true });
    }
    
</script>

<main>
    <h1>Update</h1>

    <form id="register-form" on:submit|preventDefault={()=>update($user)}>
        <section>
        <label for="name">Name</label>
        <input type="text" id="name" bind:value={$user.name}/>
        </section>
        <section>
        <label for="surname">Surname</label>
        <input type="text" id="surname" bind:value={$user.surname}/>
        </section>
        <section>
        <label for="age">Age</label>
        <input type="number" id="age" bind:value={$user.age}/>
        </section>
        <section>
        <label for="city">City</label>
        <input type="text" id="city" bind:value={$user.city}/>
        </section>

        <button type="submit" id="register-btn">Update</button>
    </form>
</main>

<style>
  #register-form{
    width: 50vw;
    height: 50vh;
    background-color: grey;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem
  }
  section{
    width: 60%;
    display: flex;
    justify-content: start;
    position: relative;
  }
  input{
    position: absolute;
    right: 0;
    height: 100%;
  }
  #register-btn{
    margin-top: 2vw;
  }
</style>
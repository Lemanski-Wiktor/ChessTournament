<script>
  import { user } from "../lib/store.js";
  // @ts-ignore
  import { navigate } from "svelte-routing";
  import {
    getFirestore,
    collection,
    getDocs,
    setDoc,
    doc,
    deleteDoc,
    addDoc,
    where,
    updateDoc,
    // @ts-ignore
  } from "firebase/firestore";

  export let db;

  $user.name = "";
  $user.surname = "";
  $user.age = "";
  $user.city = "";

  const add = async (data) => {
    const id = Math.floor(Math.random() * 1000000000 + 1);
    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === "") {
        alert("Fill all inputs!");
        return false;
      }
    }

    const docRef = doc(db, "players", `${id}`);
    await setDoc(docRef, data);
    await updateDoc(docRef, {
      id: id,
      timestamp: new Date().toLocaleString(),
    });

    navigate("/players", { replace: true });
  };
</script>

<main>
  <form id="register-form" on:submit|preventDefault={() => add($user)}>
    <section>
      <label for="name">Name</label>
      <input type="text" id="name" bind:value={$user.name} />
    </section>
    <section>
      <label for="surname">Surname</label>
      <input type="text" id="surname" bind:value={$user.surname} />
    </section>
    <section>
      <label for="age">Age</label>
      <input type="number" id="age" bind:value={$user.age} />
    </section>
    <section>
      <label for="city">City</label>
      <input type="text" id="city" bind:value={$user.city} />
    </section>

    <button type="submit" id="register-btn">Register</button>
  </form>
</main>

<style>
  #register-form {
    width: 50vw;
    height: 50vh;
    background-color: grey;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
  section {
    width: 60%;
    display: flex;
    justify-content: start;
    position: relative;
  }
  input {
    position: absolute;
    right: 0;
    height: 100%;
  }
  #register-btn {
    margin-top: 2vw;
  }
</style>

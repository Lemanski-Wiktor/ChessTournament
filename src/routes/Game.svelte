<script>
  import { user } from "../lib/store.js";
  import { navigate } from "svelte-routing";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
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
  import { detach } from "svelte/internal";

  export let db;
  let playersArr = writable([]);
  let ranNamesArr = writable([]);
  let ranNamesArrCopy = [];
  let currentPairs = [];

  const get = async () => {
    const snapshot = await getDocs(collection(db, "players"));
    snapshot.forEach((doc) => {
      playersArr.update((playersArr) => [...playersArr, doc.data()]);
    });
  };

  function getRandomValue(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex].name;
  }

  onMount(async () => {
    await get().then(() => {
      while ($ranNamesArr.length != $playersArr.length) {
        const randName = getRandomValue($playersArr);
        if (!$ranNamesArr.includes(randName)) {
          ranNamesArr.update((ranNamesArr) => [...ranNamesArr, randName]);
        }
      }
      ranNamesArrCopy = $ranNamesArr.slice();
      console.log(ranNamesArrCopy.length / 2);
      const numOfPairs = ranNamesArrCopy.length / 2;
      if (numOfPairs) {
        for (let i = 0; i < numOfPairs; i++) {
          console.log(ranNamesArrCopy);
          currentPairs = [
            ...currentPairs,
            [ranNamesArrCopy.shift(), ranNamesArrCopy.pop()],
          ];
        }
        console.log(JSON.stringify(currentPairs));
      }
    });
  });
</script>

<main>
  <h1>Game</h1>

  {#each currentPairs as pair, id}
    <p>{`${id + 1}: ${pair[0]}`}</p>
    <input type="number" />
    <input type="number" />
    <p>{`${pair[1]}`}</p>
  {/each}
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

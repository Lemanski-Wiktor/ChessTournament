<script>
  import { user } from "../lib/store.js";
  import { navigate } from "svelte-routing";
  import { Link } from "svelte-routing";
  import { writable } from "svelte/store";
  import {
    getFirestore,
    collection,
    getDocs,
    setDoc,
    doc,
    deleteDoc,
    addDoc,
    where,
    serverTimestamp,
    updateDoc,
    // @ts-ignore
  } from "firebase/firestore";

  export let db;
  let playersArr = writable([]);

  const get = async () => {
    const snapshot = await getDocs(collection(db, "players"));
    snapshot.forEach((doc) => {
      playersArr.update((playersArr) => [...playersArr, doc.data()]);
    });
  };
  get();

  const del = async (id) => {
    const docRef = doc(db, "players", JSON.stringify(id));
    await deleteDoc(docRef);

    playersArr.update((player) => player.filter((val) => val.id !== id));

    setTimeout(() => {
      alert("Record deleted!");
    }, 100);
  };

  const edit = (id) => {
    navigate(`/edit/${id}`, { replace: true });
  };
  const startGame = () => navigate("/game");
</script>

<main>
  <button on:click={startGame}>PLAY</button>

  <h1>List</h1>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Surname</th>
        <th>Age</th>
        <th>Timestamp</th>
      </tr>
    </thead>
    <tbody>
      {#each $playersArr as player}
        <tr>
          <td>{player.name}</td>
          <td>{player.surname}</td>
          <td>{player.age}</td>
          <td>{player.timestamp}</td>
          <button on:click={() => del(player.id)}>X</button>
          <button on:click={() => edit(player.id)}>Edit</button>
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<style></style>

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
  let rounds = [];
  let pairs = [];
  let id = 0;
  let winner = "";
  let isWinner = false;

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
  const setRanPairs = (arr) => {
    id++;

    let ranNamesArrCopy = arr.slice();
    const tmp = Math.pow(2, Math.floor(Math.log2(ranNamesArrCopy.length)));
    const numOfPairs = tmp / 2;
    if (numOfPairs >= 1) {
      for (let i = 0; i < numOfPairs; i++) {
        const player1 = ranNamesArrCopy.shift();
        const player2 = ranNamesArrCopy.pop();
        pairs = [...pairs, { player1, player2 }];
      }
      rounds = [{ id, pairs, current: true }, ...rounds];
      console.log(rounds);
    } else {
      winner = ranNamesArrCopy[0];
      isWinner = true;
      rounds = rounds.map((round) => {
        round.current = false;
        return round;
      });
    }
  };

  onMount(async () => {
    await get().then(() => {
      // console.log(JSON.stringify($playersArr));
      console.log($playersArr);

      while ($ranNamesArr.length != $playersArr.length) {
        console.log($ranNamesArr.length);

        const randName = getRandomValue($playersArr);
        if (!$ranNamesArr.includes(randName)) {
          ranNamesArr.update((ranNamesArr) => [...ranNamesArr, randName]);
        }
      }
      setRanPairs($ranNamesArr);
    });
  });

  const updateResults = (arr) => {
    const currentRound = arr.filter((el) => el.current === true);
    let isValid = false;
    for (const [i, round] of arr.entries()) {
      for (const [i, pair] of round.pairs.entries()) {
        if (
          (pair.res1 === 1 && pair.res2 === 0) ||
          (pair.res1 === 0 && pair.res2 === 1)
        ) {
          console.log(isValid);
          round.current = false;
          isValid = true;
        } else if (pair.res1 === 0.5) {
          round.current = true;
          alert("Draw is not valid!");
          return false;
        } else {
          round.current = true;
          alert("Invalid data!");
          return false;
        }
      }
    }
    if (isValid) {
      pairs = [];
      let curNames = [];
      currentRound[0].pairs.forEach((el) => {
        console.log(el);
        if (el.res1 > el.res2) {
          curNames = [...curNames, el.player1];
        } else curNames = [...curNames, el.player2];
      });
      setRanPairs(curNames);
    }
  };
</script>

<main>
  <h1>Game</h1>
  {#if isWinner}
    <h3>Winner {winner}!</h3>
  {/if}

  {#each rounds as round}
    <h2>Round {round.id}</h2>
    <form
      on:submit|preventDefault={() => {
        updateResults(rounds);
      }}
    >
      {#each round.pairs as pair, id}
        <section>
          <p>{`${id + 1}: ${pair.player1}`}</p>
          <input
            type="number"
            min="0"
            max="1"
            step="0.5"
            bind:value={pair.res1}
          />
          <p>-</p>
          <input
            type="number"
            min="0"
            max="1"
            step="0.5"
            bind:value={pair.res2}
          />
          <p>{`${pair.player2}`}</p>
        </section>
      {/each}
      {#if round.current}
        <button type="submit">Submit</button>
      {/if}
    </form>
  {/each}

  <!-- <form
    on:submit|preventDefault={() => {
      updateResults(results);
    }}
  >
    {#each pairs as pair, id}
      <section>
        <p>{`${id + 1}: ${pair.player1}`}</p>
        <input
          type="number"
          min="0"
          max="1"
          step="0.5"
          bind:value={pair.res1}
        />
        <p>-</p>
        <input
          type="number"
          min="0"
          max="1"
          step="0.5"
          bind:value={pair.res2}
        />
        <p>{`${pair.player2}`}</p>
      </section>
    {/each}
    {#if !isWinner}
      <button type="submit">Submit</button>
    {/if}
  </form> -->
</main>

<style>
  form {
    width: 40vw;
    border: 2px solid grey;
  }
  section {
    width: 100%;
    display: flex;
    position: relative;
    gap: 1vw;
    justify-content: center;
    align-items: center;
  }

  input {
    width: 15%;
    height: 50%;
  }
  button {
    background-color: green;
    margin-bottom: 1vw;
  }
</style>

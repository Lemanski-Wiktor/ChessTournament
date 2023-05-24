<script>
  // @ts-nocheck

  import Register from "./routes/Register.svelte";
  import PlayersList from "./routes/PlayersList.svelte";
  import Edit from "./routes/Edit.svelte";
  import Game from "./routes/Game.svelte";
  import { Router, Link, Route } from "svelte-routing";
  import { initializeApp } from "firebase/app";
  import { getFirestore } from "firebase/firestore";

  const firebaseConfig = {
    apiKey: "AIzaSyCt6_NhR-2DIMlTmb5j-oYtshIBRIPRTg4",
    authDomain: "svelte-firebase-b2408.firebaseapp.com",
    projectId: "svelte-firebase-b2408",
    storageBucket: "svelte-firebase-b2408.appspot.com",
    messagingSenderId: "333586373147",
    appId: "1:333586373147:web:4f0cd60766698ec765b6be",
    measurementId: "G-0836XRFHKE",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  export let url = "";
</script>

<main>
  <Router {url}>
    <nav>
      <Link to="/">Register</Link>
      <Link to="/players">Players List</Link>
    </nav>
    <div>
      <Route path="/"><Register {db} /></Route>
      <Route path="/players"><PlayersList {db} /></Route>
      <Route path="/edit/:id" let:params><Edit {db} id={params.id} /></Route>
      <Route path="/game"><Game {db} /></Route>
    </div>
  </Router>
</main>

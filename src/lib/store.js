import { writable } from "svelte/store";

export const user = writable({
  name: "",
  surname: "",
  age: "",
  city: "",
});

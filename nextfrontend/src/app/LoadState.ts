// import { useEffect } from "react";
// import useTaskStore from "./tasks";

// export function useLoadState() {
//   return useEffect(() => {
//     console.log("LoadState");
//     const store = localStorage.getItem("store");
//     if (store) {
//       useTaskStore.setState(JSON.parse(store));
//     }
//   }, []);
// }

// export function useSaveState() {
//   const store = useTaskStore();
//   localStorage.setItem("store", JSON.stringify(store));
// }

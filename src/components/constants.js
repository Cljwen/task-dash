import { red, orange, green } from "@mui/material/colors";

// functions
export function retrieveLocalStorage() {
  const entriesLocalStorage = localStorage.getItem("entriesLocalStorage");
  const parsedEntriesLocalStorage = JSON.parse(entriesLocalStorage);
  return parsedEntriesLocalStorage;
}

// colors for checkboxes
export const priorityColors = { 1: red[800], 2: orange[300], 3: green[800] };

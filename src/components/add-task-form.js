import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { v4 as uuidv4 } from "uuid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { retrieveLocalStorage } from "./constants";

import "../App.css";

export default function AddTaskForm() {
  const { format } = require("date-fns");

  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(2);
  const [dateInput, setDateInput] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);

  useEffect(() => {
    const parsedEntriesLocalStorage = retrieveLocalStorage();
    if (parsedEntriesLocalStorage) {
      setEntries(parsedEntriesLocalStorage);
    }
  }, [entries]);

  const handleDateChange = (e) => {
    var formattedDateInput = format(new Date(e), "dd/MM/yyyy", {
      timeZone: "Asia/Singapore",
    });
    setDateInput(e);
    setFormattedDate(formattedDateInput);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentEntry = {
      title: title,
      description: description,
      id: uuidv4(),
      date: dateInput,
      formattedDate: formattedDate,
      priority: priority,
      completed: false,
    };

    setEntries((entries) => {
      const updatedEntries = [...entries, currentEntry];
      const sortedEntryArray = updatedEntries.sort(
        (a, b) => -(new Date(b.date) - new Date(a.date))
      );
      localStorage.setItem(
        "entriesLocalStorage",
        JSON.stringify(sortedEntryArray)
      );
    });
    handleClearForm();
    // Clear local storage: testing purposes
    // localStorage.clear();
  };

  const handleClearForm = () => {
    setTitle("");
    setDescription("");
    setPriority(2);
    setDateInput(null);
    setFormattedDate(null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ margin: "20px", minWidth: "100%" }}>
          <div className="Task-display-header">
            <h2>What needs doing? Add a task here.</h2>
          </div>
          <TextField
            id="title"
            label="Task name"
            variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            required
            id="description"
            label="Description"
            placeholder="Add a little more details here"
            multiline
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <FormControl>
            <InputLabel id="priority">Priority</InputLabel>
            <Select
              required
              id="priority"
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value)}
            >
              <MenuItem value={1}>High</MenuItem>
              <MenuItem value={2}>Medium</MenuItem>
              <MenuItem value={3}>Low</MenuItem>
            </Select>
          </FormControl>
          <DatePicker
            value={dateInput}
            onChange={handleDateChange}
            required
            label="Due Date"
          />
          <Button variant="text" type="submit">
            Add
          </Button>
        </Stack>
      </form>
    </div>
  );
}

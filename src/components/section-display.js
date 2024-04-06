import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { priorityColors } from "./constants";
import "../App.css";

export default function SectionDisplay(props) {
  const { format } = require("date-fns");

  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(2);
  const [dateInput, setDateInput] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);
  const [entryToEditID, setEntryToEditID] = useState(null);
  // open the dialog
  const [open, setOpen] = useState(false);
  //to check if the filters are active, hence altering display of display when there are zero tasks
  const [filterOn, setFilterOn] = useState(props.filter ? props.filter : false);

  useEffect(() => {
    const entriesLocalStorage = localStorage.getItem("entriesLocalStorage");
    const parsedEntriesLocalStorage = JSON.parse(entriesLocalStorage);
    if (parsedEntriesLocalStorage) {
      setEntries(parsedEntriesLocalStorage);
    }
  }, [entries]);

  const handleCompletionStatus = (currEntry) => {
    setEntries((entries) => {
      const updatedEntries = entries.map((entry) => {
        if (entry.id === currEntry.id) {
          return {
            title: currEntry.title,
            description: currEntry.description,
            id: currEntry.id,
            date: currEntry.date,
            formattedDate: currEntry.formattedDate,
            priority: currEntry.priority,
            completed: !currEntry.completed,
          };
        }
        return entry;
      });
      localStorage.setItem(
        "entriesLocalStorage",
        JSON.stringify(updatedEntries)
      );
    });
  };

  const handleEditFunction = (entry) => {
    setTitle(entry.title);
    setDescription(entry.description);
    setPriority(entry.priority);
    setDateInput(new Date(entry.date));
    setEntryToEditID(entry.id);
    setFormattedDate(entry.formattedDate);
    setOpen(true);
  };

  const handleCloseEditForm = () => {
    setOpen(false);
  };

  const handleDateChange = (e) => {
    var formattedDateInput = format(new Date(e), "dd/MM/yyyy", {
      timeZone: "Asia/Singapore",
    });
    setDateInput(e);
    setFormattedDate(formattedDateInput);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setEntries((entries) => {
      const updatedEntries = entries.map((entry) => {
        if (entry.id === entryToEditID) {
          return {
            title: title,
            description: description,
            id: entryToEditID,
            date: dateInput,
            formattedDate: formattedDate,
            priority: priority,
            completed: false,
          };
        }
        return entry;
      });

      const sortedEntryArray = updatedEntries.sort(
        (a, b) => -(new Date(b.date) - new Date(a.date))
      );
      localStorage.setItem(
        "entriesLocalStorage",
        JSON.stringify(sortedEntryArray)
      );
    });
    handleCloseEditForm();
  };

  const handleDelete = () => {
    setEntries((entries) => {
      const updatedEntries = entries.filter(
        (entry) => entry.id !== entryToEditID
      );
      localStorage.setItem(
        "entriesLocalStorage",
        JSON.stringify(updatedEntries)
      );
    });
    handleCloseEditForm();
  };

  return (
    <div className="Section-display-container">
      <List>
        {props.entries && props.entries[0] ? (
          props.entries.map((entry, key) => {
            return (
              <div>
                <ListItem
                  key={key}
                  sx={{ paddingTop: 0, paddingBottom: 0 }}
                  secondaryAction={
                    <div>
                      <IconButton aria-label="edit">
                        <EditIcon onClick={() => handleEditFunction(entry)} />
                      </IconButton>
                      <Dialog
                        open={open}
                        onClose={handleCloseEditForm}
                        fullWidth
                      >
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogContent>
                          <Stack spacing={5}>
                            <TextField
                              autoFocus
                              fullWidth
                              required
                              margin="dense"
                              id="title"
                              label="Add Task"
                              variant="standard"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                            />

                            <TextField
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
                                id="priority"
                                value={priority}
                                label="Priority"
                                onChange={(e) => setPriority(e.target.value)}
                              >
                                <MenuItem value={1}>High</MenuItem>
                                <MenuItem value={2}>Mid</MenuItem>
                                <MenuItem value={3}>Low</MenuItem>
                              </Select>
                            </FormControl>
                            <DatePicker
                              value={dateInput}
                              onChange={handleDateChange}
                            />
                          </Stack>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={handleDelete}
                            sx={{ color: priorityColors[1] }}
                          >
                            Delete
                          </Button>
                          <Button onClick={handleCloseEditForm}>Cancel</Button>
                          <Button
                            variant="outlined"
                            onClick={handleSave}
                            sx={{ marginRight: "15px" }}
                          >
                            Save
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  }
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={entry.completed}
                      onClick={() => handleCompletionStatus(entry)}
                      sx={{
                        color: priorityColors[entry.priority],
                        "&.Mui-checked": {
                          color: priorityColors[entry.priority],
                        },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={entry.title}
                    primary={entry.title}
                    secondary={entry.description}
                  />
                  <ListItemText
                    id={entry.date}
                    secondary={
                      <div>
                        <div>Due</div>
                        {entry.formattedDate}
                      </div>
                    }
                    sx={{ textAlign: "right", padding: "10px" }}
                  />
                </ListItem>
                <Divider />
              </div>
            );
          })
        ) : filterOn ? null : (
          <div className="Zero-tasks-display">
            <WorkOutlineIcon sx={{ color: "#31363F", paddingRight: "5px" }} />
            Hmm. You don't have any tasks in this section.
          </div>
        )}
      </List>
    </div>
  );
}

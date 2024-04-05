import { useState, useEffect } from "react";

import ListItemButton from "@mui/material/ListItemButton";
import SearchBar from "./search-bar";
import { ListItemText } from "@mui/material";
import SectionDisplay from "./section-display";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function TaskDisplay() {
  const [entries, setEntries] = useState([]);
  const [entriesArray, setEntriesArray] = useState([]);
  const [upcomingOpen, setUpcomingOpen] = useState(true);
  const [completedOpen, setCompletedOpen] = useState(true);
  const [overdueOpen, setOverdueOpen] = useState(true);
  const [ongoingSearch, setOngoingSearch] = useState(false);

  //retrieve from local storage and filter into sections
  useEffect(() => {
    const entriesLocalStorage = localStorage.getItem("entriesLocalStorage");
    const parsedEntriesLocalStorage = JSON.parse(entriesLocalStorage);

    if (parsedEntriesLocalStorage) {
      setEntries(parsedEntriesLocalStorage);

      let completedEntries = parsedEntriesLocalStorage.filter(
        (entry) => entry.completed === true
      );

      let overdueEntries = parsedEntriesLocalStorage.filter(
        (entry) =>
          new Date(entry.date) < new Date() && entry.completed === false
      );

      let upcomingEntries = parsedEntriesLocalStorage.filter(
        (entry) =>
          new Date(entry.date) >= new Date() && entry.completed === false
      );

      setEntriesArray([
        {
          name: "Overdue",
          array: overdueEntries,
          open: overdueOpen,
        },
        {
          name: "Upcoming",
          array: upcomingEntries,
          open: upcomingOpen,
        },
        {
          name: "Completed",
          array: completedEntries,
          open: completedOpen,
        },
      ]);
    }
  }, [entries]);

  // function to handle collapsing of individual sections
  const handleClick = (entryArray) => {
    if (entryArray.name === "Overdue") {
      setOverdueOpen(!overdueOpen);
    } else if (entryArray.name === "Upcoming") {
      setUpcomingOpen(!upcomingOpen);
    } else {
      setCompletedOpen(!completedOpen);
    }
  };

  const handleSearchDisplay = (searchBoolean) => {
    setOngoingSearch(searchBoolean);
  };

  return (
    <div>
      <div className="Task-display-header">
        <h1>Hey Darren.</h1>
        <SearchBar onSearchChange={handleSearchDisplay} />
      </div>
      <div>
        {entriesArray && !ongoingSearch
          ? entriesArray.map((entryArray, key) => {
              return (
                <div key={key}>
                  <ListItemButton
                    onClick={() => handleClick(entryArray)}
                    sx={{ margin: "10px" }}
                  >
                    <ListItemText primary={entryArray.name} />
                    {entryArray.open ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={entryArray.open} timeout="auto" unmountOnExit>
                    <SectionDisplay entries={entryArray.array} />
                  </Collapse>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

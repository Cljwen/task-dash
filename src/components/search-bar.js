import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { priorityColors } from "./constants";
import SectionDisplay from "./section-display";

export default function SearchBar(props) {
  const [entries, setEntries] = useState([]);
  const [inputValue, setinputValue] = useState("");
  const [searchQuery, setsearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);

  // states to alter chip filtering
  const [highPriorityDisplay, setHighPriorityDisplay] = useState(false);
  const [mediumPriorityDisplay, setMediumPriorityDisplay] = useState(false);
  const [lowPriorityDisplay, setLowPriorityDisplay] = useState(false);
  const [completedDisplay, setCompletedDisplay] = useState(false);
  const [pendingDisplay, setPendingDisplay] = useState(false);

  //retrieve local storage
  useEffect(() => {
    const entriesLocalStorage = localStorage.getItem("entriesLocalStorage");
    const parsedEntriesLocalStorage = JSON.parse(entriesLocalStorage);
    if (parsedEntriesLocalStorage) {
      setEntries(parsedEntriesLocalStorage);
    }
  }, [entries]);

  // filter entries based on what chips are active
  useEffect(() => {
    // array to be used to filter entries based on entry key and condition to look out for
    let array = [
      {
        name: "highPriorityDisplay",
        addIntoResults: highPriorityDisplay,
        filterCondition: 1,
        filterKey: "priority",
      },
      {
        name: "mediumPriorityDisplay",
        addIntoResults: mediumPriorityDisplay,
        filterCondition: 2,
        filterKey: "priority",
      },
      {
        name: "lowPriorityDisplay",
        addIntoResults: lowPriorityDisplay,
        filterCondition: 3,
        filterKey: "priority",
      },
      {
        name: "completedDisplay",
        addIntoResults: completedDisplay,
        filterCondition: true,
        filterKey: "completed",
      },
      {
        name: "pendingDisplay",
        addIntoResults: pendingDisplay,
        filterCondition: false,
        filterKey: "completed",
      },
    ];

    // check which filters are active / true
    let trueFilters = array.filter((chip) => chip.addIntoResults === true);

    // if at least one filter is true, filter all entries based on filter conditions listed within
    if (trueFilters.length !== 0) {
      let results = entries.filter((entry) => {
        // usage of some here to implement OR condition instead of every (AND)
        return trueFilters.some((filterEntry) => {
          if (filterEntry.filterKey === "priority") {
            return entry.priority === filterEntry.filterCondition;
          } else if (filterEntry.filterKey === "completed") {
            return entry.completed === filterEntry.filterCondition;
          }
          return true;
        });
      });

      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  }, [
    highPriorityDisplay,
    mediumPriorityDisplay,
    lowPriorityDisplay,
    completedDisplay,
    pendingDisplay,
    entries,
  ]);

  //for search function
  const handleSearch = () => {
    let searchQuery = inputValue.toLowerCase();
    let results = entries.filter((entry) => {
      return (
        entry.title.toLowerCase().includes(searchQuery) ||
        entry.description.toLowerCase().includes(searchQuery)
      );
    });

    if (inputValue !== "") {
      setsearchQuery(inputValue);
    }
    setSearchResults(results);
    props.onSearchChange(true);
  };

  const handleClearSearch = () => {
    props.onSearchChange(false);
    setsearchQuery(null);
    setSearchResults(null);
    setinputValue("");
  };

  // Trigger search for enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleChange = (e) => {
    setinputValue(e.target.value);
  };

  const toggleFilter = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div>
      <ListItem disablePadding>
        <TextField
          placeholder="Search for tasks here"
          variant="outlined"
          size="small"
          fullWidth
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          sx={{ marginRight: "5px" }}
        />
        <Tooltip title="Toggle Filters">
          <IconButton edge="end" size="small" onClick={toggleFilter}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </ListItem>

      {showFilters ? (
        <Stack spacing={1} direction={"row"} sx={{ marginTop: "10px" }}>
          <Chip
            label="High"
            icon={
              highPriorityDisplay ? (
                <HighlightOffIcon color={priorityColors[1]} />
              ) : null
            }
            sx={{ color: priorityColors[1] }}
            onClick={() => setHighPriorityDisplay(!highPriorityDisplay)}
          />

          <Chip
            label="Medium"
            icon={
              mediumPriorityDisplay ? (
                <HighlightOffIcon color={priorityColors[2]} />
              ) : null
            }
            sx={{ color: priorityColors[2] }}
            onClick={() => setMediumPriorityDisplay(!mediumPriorityDisplay)}
          />

          <Chip
            label="Low"
            icon={
              lowPriorityDisplay ? (
                <HighlightOffIcon color={priorityColors[3]} />
              ) : null
            }
            sx={{ color: priorityColors[3] }}
            onClick={() => setLowPriorityDisplay(!lowPriorityDisplay)}
          />

          <Chip
            label="Completed"
            icon={completedDisplay ? <HighlightOffIcon /> : null}
            clickable
            onClick={() => setCompletedDisplay(!completedDisplay)}
          />
          <Chip
            label="Pending"
            icon={pendingDisplay ? <HighlightOffIcon /> : null}
            clickable
            onClick={() => setPendingDisplay(!pendingDisplay)}
          />
        </Stack>
      ) : null}

      {filteredResults ? (
        <div>
          <SectionDisplay entries={filteredResults} filter={true} />
        </div>
      ) : null}

      {searchResults && searchQuery ? (
        <Box sx={{ margin: "20px" }}>
          <IconButton edge="start" size="small" onClick={handleClearSearch}>
            <CloseIcon />
          </IconButton>

          {`Search results for "${searchQuery}"`}

          {searchResults[0] ? (
            <SectionDisplay entries={searchResults} />
          ) : (
            <p>No search results found. Please try again!</p>
          )}
        </Box>
      ) : null}
    </div>
  );
}

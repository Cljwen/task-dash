import { Box, ListItem, TextField, Tooltip } from "@mui/material";
import { useState, useEffect } from "react";
import SectionDisplay from "./section-display";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { priorityColors } from "./constants";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
export default function SearchBar(props) {
  const [entries, setEntries] = useState([]);
  const [inputValue, setinputValue] = useState("");
  const [searchQuery, setsearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);

  //to alter chip statuses
  const [highPriorityDisplay, setHighPriorityDisplay] = useState(false);
  const [mediumPriorityDisplay, setMediumPriorityDisplay] = useState(false);
  const [lowPriorityDisplay, setLowPriorityDisplay] = useState(false);

  const [completedDisplay, setCompletedDisplay] = useState(false);
  const [pendingDisplay, setPendingDisplay] = useState(false);

  useEffect(() => {
    const entriesLocalStorage = localStorage.getItem("entriesLocalStorage");
    const parsedEntriesLocalStorage = JSON.parse(entriesLocalStorage);
    if (parsedEntriesLocalStorage) {
      setEntries(parsedEntriesLocalStorage);
    }
  }, [entries]);

  useEffect(() => {
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

    let trueFilters = array.filter((chip) => chip.addIntoResults === true);

    if (trueFilters.length !== 0) {
      let results = entries.filter((entry) => {
        return trueFilters.some((filterEntry) => {
          // Use every to ensure all active filters pass
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

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Divider from "@mui/material/Divider";

import AddTaskForm from "./components/add-task-form";
import TaskDisplay from "./components/task-display";

import "./App.css";

function App() {
  return (
    <div className="App">
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        timeZone="Asia/Singapore"
      >
        <Grid2 container spacing={1}>
          <Grid2 xs={12} lg={7}>
            <TaskDisplay />
          </Grid2>

          <Divider orientation="vertical" flexItem sx={{ height: "100vh" }} />

          <Grid2 lg={4}>
            <AddTaskForm />
          </Grid2>
        </Grid2>
      </LocalizationProvider>
    </div>
  );
}

export default App;

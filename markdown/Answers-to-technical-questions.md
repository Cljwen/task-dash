## How long did I spent:

30 hours.

## What was the most useful feature that was added to the latest version of my chosen language?

That would be arrow functions for me!

Here’s a little snippet:

`const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };`
It looks so much more concise and also helps me avoid issues related to ‘this’ binding.

## How I would track down a performance issue in production: Have I ever had to do this?

I have not had to do this before. However, after reading up on it, I suppose the approach is rather similar to a marketing campaign. I would first define what's considered as good performance for the system (performance metrics: response time, error rates), set up monitoring tools to collect metrics and date over time, then look at details to try to isolate the problem.

For the performance metrics, it would be probably be good to compare the metrics with industry standards but tailor the benchmark to the individual application or software. The best monitoring tools in the market right now seem to be Prometheus, Grafana and Datadog.

I would then try to resolve the identified problem in a test environment, do thorough testing before shipping the updates out. After which, the whole cycle resumes again (more monitoring, more testing of live updates) and I'll follow up with documentation so the team is kept well-informed.

## If I had more time, additional features or improvements I would consider adding to the task management application:

Additional features:

- Adding the option to add a main task, and sub-tasks under the main task
- Calendar view of the pending tasks
- Add the option to add tags to a task (eg. Fitness Task, Learning Task)

User interface fixes:

- Making the edit button appear on hover as it’s too distracting
- Probably add in some transitions and feedback to enhance the UI, eg. adding a snack bar for deleted tasks to acknowledge a task was deleted and option to undo it
- Add branding elements (eg. color theme, logo)

Code improvements:
Definitely hope to reduce and clean up the code more, especially some sections with css / MUI sx.

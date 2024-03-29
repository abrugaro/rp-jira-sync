
# Roadmap

- [X] Get last launch and/or by id
- [X] Get items of launch
- [X] Get item logs
- [X] Group items by test suite
- [X] Create a Jira Task for each suite
- [X] Create a task for the launch and subtasks for each failed suite
- [X] Check if a Jira Task for that run is already created before creating one
- [X] Create an endpoint to trigger the execution
- [ ] Create a DockerFile for the project
- [ ] Save logs to files for late debugging
- [ ] Add item logs to the task description
- [ ] Filter tests that are affected by bugs to avoid creating tasks
- [ ] Create JSON file to associate features to owners

# Tech Debt

 - Create a good Logger class 
 - Create an actually useful README

# Install

1. Clone the repository
2. Copy the `.env.example`
 file and remove the `.example` suffix
3. Docker build and Docker run
# Build

```bash
npm run build 
```

# Execute


```bash
npm run start
```
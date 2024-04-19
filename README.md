
# Usage 

# Roadmap

- [x] Get last launch and/or by id
- [x] Get items of launch
- [x] Get item logs
- [x] Group items by test suite
- [x] Create a Jira Task for each suite
- [x] Create a task for the launch and subtasks for each failed suite
- [x] Check if a Jira Task for that run is already created before creating one
- [x] Create an endpoint to trigger the execution
- [x] Create a DockerFile for the project
- [x] Create JSON file to associate features to owners
- [ ] Add husky with lint-stage to enforce linting
- [ ] Merge owners file into env
- [ ] Add user guide to README
- [ ] Add time mark to logs
- [ ] Specify owners json file format in docs
- [ ] Add item logs to the task description
- [ ] Filter tests that are affected by bugs to avoid creating tasks

# Tech Debt

- Create a good Logger class
- Add prettier
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

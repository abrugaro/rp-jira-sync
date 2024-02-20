
# Roadmap

- [X] Get last launch and/or by id
- [X] Get items of launch
- [X] Get item logs
- [X] Group items by test suite
- [X] Create a Jira Task for each suite
- [X] Create a task for the launch and subtasks for each failed suite
- [ ] Check if a Jira Task for that run is already created before creating one
- [ ] Add item logs to the task description
- [ ] Filter tests that are affected by bugs to avoid creating tasks

# Build

```bash
npx npx webpack --config webpack.config.js 
```

# Execute


```bash
node dist/bundle.js 
```
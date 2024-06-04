# Usage

## Creating Jira Tickets from Report Portal Launches

Once the project has been deployed, you can create Jira tickets from a launch in Report Portal. To do this, make a request to the base URL where the project is deployed, appending the ID of the launch for which you want to create tasks.

**Basic Example:**

```
https://url-to-the-tool/{launch_id}
```

Where `{launch_id}` is replaced by the actual launch ID.

For example, here, 1234 is the ID of the launch.:

```
https://url-to-the-tool/1234
```

## Creating a Task under a Specific Epic

If you want to create the task under a specific epic, you can specify a query parameter epic with the code of the desired epic.

**Example with Epic:**

```
https://url-to-the-tool/{launch_id}?epic={epic_code}
```

Where `{epic_code}` is replaced by the actual Epic code.

For example, here, XX-11 is the code of the epic.:

```
https://url-to-the-tool/1234?epic=XX-11
```

<details><summary> How does it work?</summary>

```mermaid
flowchart TD
   A[Run RPJ providing the RP launch id\nOptional: Provide Jira Epic key] --> B
   B{Task for that launch\n already exists}
   B --> |Yes| Z
   B --> |No| C
   C[Get launch data] --> D
   D[Get next item] --> E
   E{**RP** - Item is marked as PB &&\nJ - Bug is not verified in Jira &&\nPB is not market in RP}
   E --> |No| D
   E --> |Yes| F
   F[RP - Mark item as PB in RP] --> G
   G{Suite or test marked as a bug in its name &&\n J - Bug not verified in Jira &&\nPB not marked in RP &&\n 'New' or 'In progress task' DOES NOT already exist for this item }
   G --> |No| C
   G --> |Yes| H
   H[J - Create Task For the RP run] --> I
   I{Epic key provided}
   I --> |Yes| J[J - Update Task to set Epic] --> K
   I --> |No| K
   K[J - Create Subtask Task for each suite in Jira\nContaining all the failed tests of that suite] --> L
   L[J - Update subtasks to set SP] --> Z
   Z(END)
   X[RP -> HTTP Request to Report Portal API\n J -> HTTP Request to Jira API]
```
</details>

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
- [x] Add user guide to README
- [ ] Add an env variable to map custom jira fields to usable names
- [ ] Add husky with lint-stage to enforce linting
- [ ] Merge owners file into env
- [ ] Add time mark to logs
- [ ] Specify owners json file format in docs
- [ ] Add item logs to the task description
- [ ] Filter tests that are affected by bugs to avoid creating tasks
- [ ] Reduce calls to Jira API by keeping a cache of issues queried

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

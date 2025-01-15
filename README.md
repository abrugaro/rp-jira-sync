# RPJ | Report portal to Jira

RPJ is a tool for automatically synchronizing items between Report Portal and Jira, creating tasks and subtasks in Jira
from failed items in Report Portal launches.

<details><summary> <b>How does it work?</b></summary>

```mermaid
flowchart TD
    A[Run RPJ providing the RP launch id\nOptional: Provide Jira Epic key] --> B
    B{Task for that launch\n already exists}
    B -->|Yes| Z
    B -->|No| C
    C[Get launch data] --> D
    D[Get next item] --> E
    E{**RP** - Item is marked as PB &&\nJ - Bug is not verified in Jira &&\nPB is not market in RP}
    E -->|No| D
    E -->|Yes| F
    F[RP - Mark item as PB in RP] --> G
    G{Suite or test marked as a bug in its name &&\n J - Bug not verified in Jira &&\nPB not marked in RP &&\n 'New' or 'In progress task' DOES NOT already exist for this item}
    G -->|No| C
    G -->|Yes| H
    H[J - Create Task For the RP run] --> I
    I{Epic key provided}
    I -->|Yes| J[J - Update Task to set Epic] --> K
    I -->|No| K
    K[J - Create Subtask Task for each suite in Jira\nContaining all the failed tests of that suite] --> L
    L[J - Update subtasks to set SP] --> Z
    Z(END)
    X[RP -> HTTP Request to Report Portal API\n J -> HTTP Request to Jira API]
```

</details>

# Configuration

### Environment Variables

These variables should be set in your environment before running the tool:

- `REPORT_PORTAL_TOKEN`: The access token for Report Portal.
- `REPORT_PORTAL_API_URL`: The API URL for Report Portal.
- `REPORT_PORTAL_PROJECT`: The name of the project in Report Portal.
- `JIRA_ACCESS_TOKEN`: The access token for Jira.
- `JIRA_API_URL`: The API URL for Jira.
- `JIRA_PROJECT`: The name of the project in Jira.
- `OWNERS`: A JSON string representing the owners for different test suites.
    - **key**: Name of test suite
    - **value**: Owner's Jira username

### Example Configuration

```env
REPORT_PORTAL_TOKEN=ZZZZZZ65431
REPORT_PORTAL_API_URL=https://my.report.portal.com/api/v1
REPORT_PORTAL_PROJECT=RPJ
JIRA_ACCESS_TOKEN=XXXXX123456
JIRA_API_URL=https://my.jira.cin/rest/api/2
JIRA_PROJECT=RPJ
OWNERS = {
    "Credentials Suite": "jane-doe",
    "Login validation": "john-doe",
    "Pagination validations": "smith"
}
```

# Usage

## Creating Jira Tickets from Report Portal Launches

Once the project has been deployed, you can create Jira tickets from a launch in Report Portal. To do this, make a
request to the base URL where the project is deployed, appending the ID of the launch for which you want to create
tasks.

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

If you want to create the task under a specific epic, you can specify a query parameter epic with the code of the
desired epic.

**Example with Epic:**

```
https://url-to-the-tool/{launch_id}?epic={epic_key}
```

Where `{epic_key}` is replaced by the actual Epic code.

For example, here, XX-11 is the code of the epic.:

```
https://url-to-the-tool/1234?epic=XX-11
```

# Assigning Subtasks to a Specific Parent Task

You can now use the optional `parentTask` parameter to automatically assign all created subtasks to a specific Jira task
instead of creating a new parent task.

Example with Parent Task:

```
https://url-to-the-tool/{launch_id}?parentTask={task_key}
```

Where `{task_key}` is replaced by the key of the specific parent task in Jira.

For example, if the parent task key is `ABC-123`:

```
https://url-to-the-tool/1234?parentTask=ABC-123
```

In this case A new parent task will not be created. and ll generated subtasks will be assigned to `ABC-123`.

**Note**: The parent task summary would be automatically modified to include the RP launch id as it is needed for checking
if the task already exists

# Roadmap

- [x] Get last launch and/or by id
- [x] Get items of launch
- [x] Group items by test suite
- [x] Create a Jira Task for each suite
- [x] Create a task for the launch and subtasks for each failed suite
- [x] Check if a Jira Task for that run is already created before creating one
- [x] Create an endpoint to trigger the execution
- [x] Create a DockerFile for the project
- [x] Create JSON file to associate features to owners
- [x] Add user guide to README
- [X] Filter tests that are affected by bugs to avoid creating tasks
- [ ] Add an env variable to map custom jira fields to usable names
- [ ] Add husky with lint-stage to enforce linting
- [ ] Add time mark to logs
- [ ] Include spec name in task description
- [ ] Add item logs to the task description
- [ ] Reduce calls to Jira API by keeping a cache of issues queried

# Install

1. Clone the repository
2. Docker build and Docker run setting env variables

# Development

## Running the Project
For running the project locally, you'll need access to a Jira and a Report Portal instances

1. Clone the repository
2. Copy the `env.example.ts` file and rename it to `env.ts`
   1. Replace the variables with your custom values (Check [Configuration](#Configuration) for more info)
3. Install the dependencies with `npm install`
4. Start the local environment with `npm run serve`


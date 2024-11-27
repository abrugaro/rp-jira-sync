import { main } from "./core";
import { Agent, setGlobalDispatcher } from "undici";
import { ExecutionResponseData, Response } from "./model/response";
import { Request } from "express";
import { getStatus } from "./features/status";
import path from "node:path";
// Ignore self signed certs
const agent = new Agent({
  connect: {
    rejectUnauthorized: false,
  },
});

setGlobalDispatcher(agent);

const logger = require("./common/common");
const express = require("express");
const app = express();
const port = 3000;

app.get("/pages/:folder/:file", async (req: Request, res: any) => {
  const { folder, file } = req.params;

  res.sendFile(file, { root: path.join(__dirname, `pages/${folder}`) });
});

app.get("/:id", async (req: Request, res: any) => {
  const { id } = req.params;
  if (isNaN(+id) || +id <= 0) {
    return;
  }

  const apiResponse: Response<ExecutionResponseData> = {
    success: false,
    message: "Something failed, see the logs for more info",
    data: null,
    logs: ""
  };

  try {
    const result = await main(+id, req.query);
    result.logs = logger.getLogs();
    res.send(result);
  } catch (e) {
    logger.error("General error");
    logger.error(e);
    apiResponse.logs = logger.getLogs();
    res.send(apiResponse);
  } finally {
    console.log(logger.getLogs());
    logger.clear();
  }
});


app.get("/", async (req: Request, res: any) => {
  const apiResponse: Response<string> = {
    success: false,
    message: "Something failed, see the logs for more info",
    data: "",
    logs: ""
  };

  try {
    const result = await getStatus();
    result.logs = logger.getLogs();
    res.send(result);
  } catch (e) {
    logger.error("General error");
    logger.error(e);
    apiResponse.logs = logger.getLogs();
    res.send(apiResponse);
  } finally {
    console.log(logger.getLogs());
    logger.clear();
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

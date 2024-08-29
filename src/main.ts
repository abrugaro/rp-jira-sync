import { main } from "./core";
import { Agent, setGlobalDispatcher } from "undici";
import { Response } from "./model/response";
import { Request } from "express";
import { getStatus } from "./pages/status";
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

app.get("/:id", async (req: Request, res: any) => {
  const { id } = req.params;
  if (isNaN(+id) || +id <= 0) {
    return;
  }

  const apiResponse: Response<string> = {
    success: false,
    message: "Something failed, see the logs for more info",
    data: "",
  };

  try {
    const result = await main(+id, req.query);
    result.data = logger.getLogs();
    res.send(result);
  } catch (e) {
    logger.error("General error");
    logger.error(e);
    apiResponse.data = logger.getLogs();
    res.send(apiResponse);
  } finally {
    console.log(logger.getLogs());
  }
});

app.get("/", async (req: Request, res: any) => {
  const apiResponse: Response<string> = {
    success: false,
    message: "Something failed, see the logs for more info",
    data: "",
  };

  try {
    const result = await getStatus();
    result.data = logger.getLogs();
    res.send(result);
  } catch (e) {
    logger.error("General error");
    logger.error(e);
    apiResponse.data = logger.getLogs();
    res.send(apiResponse);
  } finally {
    console.log(logger.getLogs());
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

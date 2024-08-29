import { Response } from "../model/response";
import { getJiraServerInfo } from "../requests/jira";

const logger = require("../common/common");

export const getStatus = async () => {
  const apiResponse: Response<string> = {
    success: true,
    message: "RPJ is deployed and all services are reachable",
    data: "",
  };

  try {
    await getJiraServerInfo();
    logger.info("Jira Instance is reachable");
  } catch (e) {
    apiResponse.success = false;
    apiResponse.message = "RPJ is deployed but one of the services is not reachable";
    logger.error(e);
  }

  try {
    await getJiraServerInfo();
    logger.info("Report Portal Instance is reachable");
  } catch (e) {
    apiResponse.success = false;
    apiResponse.message = "RPJ is deployed but one of the services is not reachable";
    logger.error(e);
  }

  return apiResponse
};

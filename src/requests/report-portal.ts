import {ENV} from "../../env";
import {ReportPortalLaunch} from "../model/report-portal-launch";
import {ReportPortalItem} from "../model/report-portal-item";
import {ReportPortalResponse} from "../model/report-portal-response";
import {ReportPortalItemLog} from "../model/report-portal-item-log";

const headers = {
    Authorization: `Bearer ${ENV.reportPortalToken}`,
    Accept: 'application/json',
    "Content-Type": "application/json"
}


export const getLatestLaunch = () => {
    const url = `${ENV.reportPortalApiUrl}/${ENV.reportPortalProject}/launch/latest`;
    const query = 'page.size=1&page.sort=endTime%2Cdesc';
    return fetch(`${url}?${query}`, {
        method: 'GET',
        headers
    }).then(response => response.json() as Promise<ReportPortalResponse<ReportPortalLaunch>>);
}

export const getLaunchById = (launchId: number) => {
    const url = `${ENV.reportPortalApiUrl}/${ENV.reportPortalProject}/launch/latest`;
    const query = `filter.eq.id=${launchId}`;
    return fetch(`${url}?${query}`, {
        method: 'GET',
        headers
    }).then(response => response.json() as Promise<ReportPortalResponse<ReportPortalLaunch>>);
}

export const getLaunchFailedItems = (launchId: number) => {
    const url = `${ENV.reportPortalApiUrl}/${ENV.reportPortalProject}/item`;
    const query = `filter.eq.launchId=${launchId}&filter.eq.status=FAILED&page.size=100&filter.eq.type=STEP`;
    return fetch(`${url}?${query}`, {
        method: 'GET',
        headers
    }).then(response => response.json() as Promise<ReportPortalResponse<ReportPortalItem>>);
}

export const getLaunchItemLogs = (launchId: number) => {
    const url = `${ENV.reportPortalApiUrl}/${ENV.reportPortalProject}/item`;
    const query = `filter.eq.status=FAILED&filter.eq.launchId=${launchId}&page.size=50`;
    return fetch(`${url}?${query}`, {
        method: 'GET',
        headers
    }).then(response => response.json() as Promise<ReportPortalResponse<ReportPortalItemLog>>);
}
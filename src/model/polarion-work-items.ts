export interface PolarionWorkItemResponse {
    links: PolarionWorkItemLinks
    data: PolarionWorkItemData[]
}

export interface PolarionWorkItemLinks {
    self: string
    first: string
    last: string
    portal: string
}

export interface PolarionWorkItemData {
    type: string
    id: string
    attributes: Attributes
    relationships: Relationships
    links: {self: string, portal: string}
}

export interface Attributes {
    id: string
    type: string
    title: string
    severity: string
    status: string
    trello?: string
}

export interface Relationships {
    assignee: PolarionAssignee
}

export interface PolarionAssignee {
    data: PolarionAssigneeData[]
}

export interface PolarionAssigneeData {
    type: string
    id: string
}

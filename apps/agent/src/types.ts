export interface Runner {
    id: string,
    name: string,
    platform: string,
    release: string,
    architecture: string,
}

export interface Job  {
    id: string,
    type: string,
    data: any
}
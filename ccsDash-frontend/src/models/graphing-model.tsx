export type GraphingInputs = {
    limit: string;
    selectUnitId: string[];
    refresh: string;
    from: string;
    to: string;
}

export const GraphEmptyObj: GraphingInputs = {
    limit: "300",
    selectUnitId: [],
    refresh: "5s",
    from: "now-15m",
    to: "now"
}
import { createSlice } from "@reduxjs/toolkit";
import { globalStates } from "./states/globalStates";
import { globalActions as GlobalAction } from "./actions/globalActions";

export const globalSlices = createSlice({
    name: 'global',
    initialState: globalStates,
    reducers: GlobalAction,

})


export const globalActions = globalSlices.actions
export default globalSlices.reducer;
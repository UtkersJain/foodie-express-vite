import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { rpcClient } from "@/lib/rpc-client"
import type { MenuItem } from "@/types"

interface MenuState {
  items: MenuItem[]
  loading: boolean
  error: string | null
}

const initialState: MenuState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchMenu = createAsyncThunk("menu/fetchMenu", async () => {
  const response = await rpcClient.call("getMenu", {})
  return response.result
})

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch menu"
      })
  },
})

export const selectMenuItems = (state: { menu: MenuState }) => state.menu.items
export const selectMenuLoading = (state: { menu: MenuState }) => state.menu.loading
export const selectMenuError = (state: { menu: MenuState }) => state.menu.error

export default menuSlice.reducer

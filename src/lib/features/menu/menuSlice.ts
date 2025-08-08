import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { rpcClient } from "../../rpc-client"
import type { MenuItem } from "../../../types"

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

export const fetchMenu = createAsyncThunk("menu/fetchMenu", async (_, { rejectWithValue }) => {
  try {
    console.log("🔄 fetchMenu: Starting API call...")
    const response = await rpcClient.call("getMenu", {})
    console.log("✅ fetchMenu: API response received:", response)

    if (!response.result) {
      throw new Error("No menu data received from server")
    }

    console.log("📊 fetchMenu: Menu items count:", response.result.length)
    return response.result
  } catch (error) {
    console.error("❌ fetchMenu: Error occurred:", error)
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch menu")
  }
})

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        console.log("⏳ fetchMenu: Loading started...")
        state.loading = true
        state.error = null
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        console.log("✅ fetchMenu: Loading completed with", action.payload?.length, "items")
        state.loading = false
        state.items = action.payload || []
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        console.error("❌ fetchMenu: Loading failed:", action.payload)
        state.loading = false
        state.error = (action.payload as string) || "Failed to fetch menu"
        // Keep existing items if any
      })
  },
})

export const { clearError } = menuSlice.actions

export const selectMenuItems = (state: { menu: MenuState }) => state.menu.items
export const selectMenuLoading = (state: { menu: MenuState }) => state.menu.loading
export const selectMenuError = (state: { menu: MenuState }) => state.menu.error

export default menuSlice.reducer

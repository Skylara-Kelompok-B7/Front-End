import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggin: null,
  lokasi: [],
  Halaman_Aktif: "",
  history: [],
  pin: null,
};

const TSlicer = createSlice({
  name: "condition",
  initialState,
  reducers: {
    reset: () => initialState,
    setLoginStatus: (state, action) => {
      state.isLoggin = action.payload;
    },
    setHistroy: (state, action) => {
      state.history = action.payload;
    },
    setPenerbangan: (state, action) => {
      state.lokasi = action.payload;
    },
    setHalaman: (state, action) => {
      state.Halaman_Aktif = action.payload;
    },
    isPINtrue: (state, action) => {
      state.pin = action.payload;
    },
  },
});

export const { setLoginStatus, setHalaman, setPenerbangan, setHistroy, reset, isPINtrue } =
  TSlicer.actions;

export default TSlicer.reducer;

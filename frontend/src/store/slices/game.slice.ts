import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  server: "localhost",
  id: undefined,
  game: [] as Array<{
    current_step: number;
    current_page: number;
  }>,
};

const gameSlice = createSlice({
  name: "games",
  initialState,
  reducers: {

    addStep: (state, action) => {
      state.game.push(action.payload);
    },
    addPage: (state, action) => {
      state.game.push(action.payload);
    }


  },
});

export const { addStep, addPage } =
  gameSlice.actions;

export default gameSlice.reducer;

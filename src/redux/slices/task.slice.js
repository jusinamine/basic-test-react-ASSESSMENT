import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todo: [],
  done: [],
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTodoTask: (state, action) => {
      state.todo = [...state.todo, action.payload];
    },
    addDoneTask: (state, action) => {
      state.done = [...state.done, action.payload];
    },
    removeTodoTaskByIndex: (state, action) => {
      state.todo = state.todo.filter((_, index) => index !== action.payload);
    },
    removeDoneTaskByIndex: (state, action) => {
      state.done = state.done.filter((_, index) => index !== action.payload);
    },
    updateTodoTaskByIndex: (state, action) => {
      state.todo = state.todo.map((item, index) =>
        index === action.payload.index ? action.payload.value : item
      );
    },
    changeTodoTasks: (state, action) => {
      state.todo = action.payload;
    },
    changeDoneTasks: (state, action) => {
      state.done = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addTodoTask,
  addDoneTask,
  removeTodoTaskByIndex,
  removeDoneTaskByIndex,
  updateTodoTaskByIndex,
  changeTodoTasks,
  changeDoneTasks,
} = taskSlice.actions;

export default taskSlice.reducer;

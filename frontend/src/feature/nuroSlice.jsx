import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl ="http://localhost:8000";

const nuroState = {
  updateState: false,
  loading: false,
  nuggetList: [],
  error: "",
  response: "",
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, password,fullname }) => {
    try {
      const response = await axios.post(apiUrl+"/api/register", { username, password, fullname });
      return response.data.message;


    } catch (error) {
      //console.error("Error occurred:", error);
      return error.response.data.message;

    }
  }
);


export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }) => {
    try {
      const response = await axios.post(apiUrl+"/api/login", { username, password });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const fetchNugget = createAsyncThunk(
  "nugget/fetchNugget",
  async (userId) => { // Accept userId as a parameter
    const response = await axios.get(apiUrl+`/api/items/${userId}`); // Use userId in the API request URL
    return response.data.response;
  }
);


export const fetchRandomNugget = createAsyncThunk(
  'nugget/fetchRandomNugget',
  async (userId) => {
    try {
      const response = await axios.get(apiUrl+`/api/items/random/${userId}`);
      return response.data.response; // Assuming the response contains the nugget object
    } catch (error) {
      throw error; // Throw the error for handling in the component
    }
  }
);
export const addNugget = createAsyncThunk(
  "nugget/addNugget",
  async (data) => {
    const response = await axios.post(apiUrl+"/api/items", {
      name: data.name,
      position: data.position,
      sessionUser:data.sessionUser,
      fileName1: data.fileName1,
    });
    return response.data.response;
  }
);

export const getTopic = createAsyncThunk(
  'nugget/getTopic',
  async (value) => {
    try {
      // Send a GET request to your API endpoint with the input value
      const response = await axios.get(apiUrl+`/api/items?name=${value}`);
      // Extract and return the response data
      return response.data;
    } catch (error) {
      // Handle errors if any
      console.error('Error fetching topics:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }
);

export const removeNugget = createAsyncThunk(
  "nugget/removeNugget",
  async (data) => {
    const response = await axios.delete(
      apiUrl+`/api/items/${data}`
    );
    return response.data.response;
  }
);

export const modifiedNugget = createAsyncThunk(
  "nugget/modifiedNugget",
  async (data) => {
    const response = await axios.put(
      apiUrl+`/api/items/${data.id}`,
      {
        name: data.name,
        position: data.position,
      }
    );
    return response.data.response;
  }
);

const nuggetSlice = createSlice({
  name: "nugget",
  initialState: nuroState,
  reducers: {
    changeStateTrue: (state) => {
      state.updateState = true;
    },
    changeStateFalse: (state) => {
      state.updateState = false;
    },
    clearResponse: (state) => {
      state.response = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNugget.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNugget.fulfilled, (state, action) => {
        state.loading = false;
        state.nuggetList.push(action.payload);
        state.response = "add";
      })
      .addCase(addNugget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(fetchNugget.fulfilled, (state, action) => {
        state.nuggetList = action.payload;
      })
      .addCase(fetchNugget.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder.addCase(removeNugget.fulfilled, (state, action) => {
      state.nuggetList = state.nuggetList.filter(
        (item) => item._id != action.payload
      );
      state.response = "delete";
    });

    builder.addCase(modifiedNugget.fulfilled, (state, action) => {
      const updateItem = action.payload;
      const index = state.nuggetList.findIndex(
        (item) => item._id === updateItem._id
      );
      if (index !== -1) {
        state.nuggetList[index] = updateItem;
      }
      state.response = "update";
    });
  },
});




export default nuggetSlice.reducer;
export const { changeStateTrue, changeStateFalse, clearResponse } =
  nuggetSlice.actions;
import React, { useEffect } from "react";
import "./App.css";
import Navigation from "./app/navigation";
import { login } from "./app/redux/reducers/authSlice";
import { useDispatch, useSelector } from "react-redux";

function App() {
  return <Navigation />;
}

export default App;

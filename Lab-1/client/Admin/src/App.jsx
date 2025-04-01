import React, { useEffect } from "react";

import "./App.css";
import Navigation from "./app/navigation";
import { login } from "./app/redux/reducers/authSlice";
import { useDispatch, useSelector } from "react-redux";

function App({ user, signOut }) {
  const disptach = useDispatch();
  const data = useSelector((state) => state?.authSlice?.user);

  useEffect(() => {
    if (!data) {
      // Save user info in Redux on login
      disptach(login(user));
    }
  }, []);

  return <Navigation />;
}

export default App;

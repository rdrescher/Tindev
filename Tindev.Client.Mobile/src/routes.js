import { createAppContainer, createSwitchNavigator } from "react-navigation";
import Login from "./views/Login";
import Main from "./views/Main";

export default createAppContainer(
  createSwitchNavigator({
    Login,
    Main
  })
);

import { ContextProvider } from "./src/context/api";
import HomeScreen from "./src/components/home";

import {LogBox} from 'react-native';
LogBox.ignoreAllLogs()
export default function App() {
  return (
    <ContextProvider>
      <HomeScreen />
    </ContextProvider>
  );
}

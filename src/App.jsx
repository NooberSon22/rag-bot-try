import SideBar from "./components/SideBar";
import MessageBody from "./components/MessageBody";
import { useState } from "react";

const App = () => {
  const [showSideBar, setShowSideBar] = useState(false);

  const toggleSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      <SideBar showSideBar={showSideBar} toggleSideBar={toggleSideBar} />
      <div
        className={`bg-gray-500/70 absolute top-0 w-full h-full ${
          showSideBar ? "absolute" : "hidden"
        }`}
      ></div>
      <MessageBody toggleSideBar={toggleSideBar} />
    </div>
  );
};

export default App;

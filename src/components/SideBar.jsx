import { useQuery } from "@tanstack/react-query";
import { IoCreate } from "react-icons/io5";
import { TbTable } from "react-icons/tb";
import { getConversations } from "../api/cody";
import chatStore from "../data/botStore";

const SideBar = ({ showSideBar, toggleSideBar }) => {
  const { data, isLoading } = useQuery({
    queryFn: () => getConversations(),
    queryKey: ["conversations"],
  });
  const { chooseConversation, clearCurrentConversation } = chatStore(
    (state) => state
  );

  const handleConversationClick = (conversation) => {
    chooseConversation(conversation);
    toggleSideBar();
  };

  const createNewConversation = () => {
    toggleSideBar();
    clearCurrentConversation();
  };

  return (
    <div
      className={`bg-blue-950 absolute px-5 py-4 top-0 left-0 h-screen w-[80%] max-w-[20em] z-10 transition-transform duration-300 ${
        showSideBar ? "translate-x-0" : "translate-x-[-100%]"
      }`}
    >
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <button className="bg-white p-3 rounded-md" onClick={toggleSideBar}>
            <TbTable />
          </button>

          <button onClick={createNewConversation}>
            <IoCreate className="text-white text-3xl" />
          </button>
        </div>

        {isLoading ? (
          <div className="text-white flex-1 text-center py-10 ">Loading...</div>
        ) : (
          <div className="space-y-4 overflow-y-auto max-h-[35em]">
            {data?.map((conversation) => {
              return (
                <div
                  key={conversation.id}
                  className="text-white bg-black/25 py-3 px-3 rounded-md"
                  onClick={() => handleConversationClick(conversation)}
                >
                  {conversation.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;

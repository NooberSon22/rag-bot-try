import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { TbTable } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import MessageBox from "./MessageBox";
import MessageContainer from "./MessageContainer";
import chatStore from "../data/botStore";
import { deleteConversation, getMessages } from "../api/cody";
import responseLoaderStore from "../data/responseLoaderStore";

const MessageBody = ({ toggleSideBar }) => {
  const [messages, setMessages] = useState([]);
  const [responseURL, setResponseURL] = useState("");
  const [responding, setResponding] = useState(false);
  // const [response, setResponse] = useState("");
  // const [isStreamClosed, setIsStreamClosed] = useState(false);
  const queryClient = useQueryClient();
  const {
    currentConversation,
    clearCurrentConversation,
    previousConversation,
  } = chatStore((state) => state);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteConversation(currentConversation.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
  const { data, isLoading } = useQuery({
    queryFn: () => getMessages(currentConversation?.id),
    queryKey: ["messages", currentConversation?.id],
    enabled: Boolean(currentConversation?.id),
  });
  const messageEndRef = useRef(null);
  const { recordingUserResponse } = responseLoaderStore((state) => state);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // useEffect(() => {
  //   if (currentConversation?.id != previousConversation?.id) {
  //     setResponse("");
  //   }
  // }, [currentConversation, previousConversation]);

  // Update messages when data changes
  useEffect(() => {
    if (data) {
      setMessages(data ? [...data].reverse() : []);
    } else if (!currentConversation?.id) {
      setMessages([]);
    }
  }, [data, currentConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, responding, recordingUserResponse]);

  // useEffect(() => {
  //   if (!responseURL) return;

  //   const evtSource = new EventSource(responseURL);

  //   evtSource.onmessage = (event) => {
  //     const data = event.data;

  //     if (data === "[END]") {
  //       evtSource.close();
  //       setIsStreamClosed(true);
  //     } else if (data !== "[START]") {
  //       try {
  //         const parsedData = JSON.parse(data);
  //         setResponse((prevMessage) => prevMessage + parsedData.chunk);
  //       } catch (error) {
  //         console.error("Failed to parse response data: ", error);
  //       }
  //     }
  //   };

  //   evtSource.onerror = (err) => {
  //     console.error("EventSource failed: ", err);
  //     evtSource.close();
  //   };

  //   return () => {
  //     evtSource.close();
  //     setResponseURL("");
  //   };
  // }, [responseURL]);

  const handleDeleteConversation = async () => {
    await mutateAsync();
    clearCurrentConversation();
    setMessages([]);
  };

  return (
    <div
      className="min-h-screen px-5 flex flex-col w-full "
      suppressContentEditableWarning={true}
    >
      <div className="py-4 flex justify-between items-center">
        <button
          className="border border-gray-400 p-3 rounded-md"
          onClick={toggleSideBar}
        >
          <TbTable />
        </button>

        {currentConversation?.id && (
          <button
            className="border border-gray-400 p-3 rounded-md"
            onClick={() => handleDeleteConversation()}
          >
            <MdDelete />
          </button>
        )}
      </div>

      <div className="mt-4 flex-1 flex flex-col px-4 overflow-hidden ">
        {isPending ? (
          <div className="grid place-items-center h-full">
            <p>Deleting Conversation...</p>
          </div>
        ) : (
          <ul className="max-h-[32em] overflow-y-auto space-y-5 flex flex-col h-full">
            {isLoading ? (
              <div className="flex-1 grid place-items-center h-max">
                Loading Messages...
              </div>
            ) : (
              messages?.map((message) => (
                <MessageContainer
                  key={message.id}
                  isMachine={message.machine}
                  content={message.content}
                >
                  {message.content}
                </MessageContainer>
              ))
            )}
            {/* {response && !isStreamClosed && (
              <MessageContainer
                isMachine={true}
                content={response}
                key={responseURL}
              />
            )} */}
            {/* Reference for scrolling */}
            {responding && (
              <MessageContainer
                isMachine={true}
                content={"Responding..."}
                key={responseURL}
              />
            )}

            {recordingUserResponse && (
              <MessageContainer
                isMachine={false}
                content={"Recording..."}
                userResponding={true}
              />
            )}

            <div ref={messageEndRef}></div>
          </ul>
        )}
      </div>
      <div className="w-full bg-white">
        <MessageBox
          currentConversation={currentConversation}
          setMessages={setMessages}
          scrollToBottom={scrollToBottom}
          setResponding={setResponding}
        />
      </div>
    </div>
  );
};

export default MessageBody;

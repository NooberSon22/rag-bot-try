import { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { sendMessage, createConversation } from "../api/cody";
import chatStore from "../data/botStore";
import { useQueryClient } from "@tanstack/react-query";

const MessageBox = ({
  currentConversation,
  setMessages,
  scrollToBottom,
  setResponding,
}) => {
  const queryClient = useQueryClient();
  const chooseConversation = chatStore((state) => state.chooseConversation);
  const [message, setMessage] = useState("");
  const contentRef = useRef(null);
  const { mutateAsync: createNewConversation } = useMutation({
    mutationFn: (message) => createNewConversation(message),
  });
  const { mutateAsync: sendMutateAsync } = useMutation({
    mutationFn: (message) => sendMessage(currentConversation.id, message),
    onSuccess: (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);

      //setResponseURL(data.stream_url);
    },
  });

  const handleSendMessage = async () => {
    scrollToBottom();
    const messageToSend = message.trim();
    if (!messageToSend) {
      return;
    }

    if (!currentConversation) {
      const data = await createConversation(messageToSend);
      chooseConversation(data);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { id: crypto.randomUUID(), machine: false, content: message },
    ]);

    setMessage("");
    await sendMutateAsync(messageToSend);
  };

  const moveCursorToEnd = () => {
    const range = document.createRange();
    const selection = window.getSelection();
    if (contentRef.current) {
      range.setStart(contentRef.current, contentRef.current.childNodes.length);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  useEffect(() => {
    moveCursorToEnd(); // Move cursor to end on message change
  }, [message]);

  return (
    <div className="flex px-5 py-3 my-5 border border-gray-300 justify-between items-end w-full">
      <div
        ref={contentRef} // Attach the ref here
        suppressContentEditableWarning={true}
        contentEditable="true"
        data-ph="Type your query..."
        className="w-[80%] p-0 outline-none pb-1 border-b"
        onInput={(e) => setMessage(e.currentTarget.textContent)}
        onBlur={(e) => {
          if (e.currentTarget.textContent.trim() === "") {
            setMessage("");
          }
        }}
      >
        {message || ""}
      </div>

      <button
        className="rounded-md p-2 bg-blue-500 text-white"
        onClick={handleSendMessage}
      >
        <IoSend />
      </button>
    </div>
  );
};

export default MessageBox;

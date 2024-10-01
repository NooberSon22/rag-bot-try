import ReactMarkdown from "react-markdown";
const MessageContainer = ({ isMachine, content, userResponding = false }) => {
  return (
    <ReactMarkdown
      className={`max-w-[17em] p-4 rounded-md ${
        userResponding
          ? "bg-red-400 text-white ml-auto"
          : !isMachine
          ? "bg-blue-500 text-white ml-auto"
          : "bg-gray-200 text-gray-700 mr-auto"
      }`}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MessageContainer;

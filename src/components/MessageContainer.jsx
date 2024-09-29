import ReactMarkdown from "react-markdown";
const MessageContainer = ({ isMachine, content }) => {
  return (
    <ReactMarkdown
      className={`max-w-[17em] p-4 rounded-md ${
        !isMachine
          ? "bg-blue-500 text-white ml-auto"
          : "bg-gray-200 text-gray-700 mr-auto"
      }`}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MessageContainer;

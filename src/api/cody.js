const GETURLS = (id = "") => {
  return {
    CREATE_CONVERSATION: "https://getcody.ai/api/v1/conversations",
    GET_FOLDERS: "https://getcody.ai/api/v1/folders",
    GET_CONVERSATIONS: "https://getcody.ai/api/v1/conversations",
    GET_MESSAGES: `https://getcody.ai/api/v1/messages?conversation_id=${id}`,
    SEND_MESSAGE: `https://getcody.ai/api/v1/messages/${id}`,
    DELETE_CONVERSATIONS: `https://getcody.ai/api/v1/conversations/${id}`,
  };
};

const HEADERS = {
  Authorization: `Bearer ${import.meta.env.VITE_CODY_KEY}`,
  "Content-Type": "application/json",
};

const createConversation = async (name) => {
  const response = await fetch(GETURLS().CREATE_CONVERSATION, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      name: name,
      bot_id: import.meta.env.VITE_BOT_ID,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create conversation");
  }

  const { data } = await response.json();
  console.log(data);
  return data;
};

// Fetch folder IDs
const getFolderIds = async () => {
  const response = await fetch(GETURLS().GET_FOLDERS, {
    headers: HEADERS,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch folders");
  }

  const data = await response.json();
  return data;
};

// Fetch conversations
const getConversations = async () => {
  const response = await fetch(GETURLS().GET_CONVERSATIONS, {
    headers: HEADERS,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }

  const { data } = await response.json();
  return data;
};

// Fetch messages
const getMessages = async (id) => {
  console.log("ID: " + id);
  const response = await fetch(GETURLS(id).GET_MESSAGES, {
    headers: HEADERS,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  const { data } = await response.json();
  return data;
};

const sendMessage = async (id, content, stream = false) => {
  console.log("ID: " + id);
  console.log("Content: " + content);

  const response = await fetch(GETURLS(stream ? "stream" : "").SEND_MESSAGE, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      content: content,
      conversation_id: id,
      redirect: false,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  const { data } = await response.json();
  console.log(data);
  return data;
};

// Delete conversations by ID
const deleteConversation = async (id) => {
  console.log("ID: " + id);
  const response = await fetch(GETURLS(id).DELETE_CONVERSATIONS, {
    method: "DELETE",
    headers: HEADERS,
  });

  if (!response.ok) {
    throw new Error("Failed to delete conversation");
  }

  return await response.json();
};

export {
  createConversation,
  getFolderIds,
  getConversations,
  deleteConversation,
  getMessages,
  sendMessage,
};

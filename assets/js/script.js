const container = document.querySelector("#chat-container");

const client = new tmi.Client({
  channels: [""],
});

client.connect();

function addEmoticonsToMessage(message, tags) {
  let messageWithEmoticons = message;
  const emotes = tags["emotes"];
  if (emotes) {
    for (const property in emotes) {
      const splitEmote = JSON.stringify(emotes[property][0])
        .replaceAll(`"`, "")
        .split("-");
      const start = parseInt(splitEmote[0]);
      const end = parseInt(splitEmote[1]) + 1;
      const emoteContent = message.substring(start, end);
      const emote = `<img src="https://static-cdn.jtvnw.net/emoticons/v1/${property}/1.0" />`;
      messageWithEmoticons = messageWithEmoticons.replaceAll(
        emoteContent,
        emote
      );
    }
  }

  return messageWithEmoticons;
}

function getRank(tags) {
  if (tags["mod"]) {
    return { text: `/sys/${tags["display-name"]}$`, class: "text-red-500" };
  }
  if (tags["vip"]) {
    return { text: `/etc/${tags["display-name"]}$`, class: "text-pink-500" };
  }
  if (tags["subscriber"]) {
    return {
      text: `/opt/${tags["display-name"]}$`,
      class: "text-green-500",
    };
  }

  return {
    text: `/usr/${tags["display-name"]}$`,
    class: "text-stone-500",
  };
}

client.on("message", (channel, tags, message, self) => {
  const messageWithEmoticons = addEmoticonsToMessage(message, tags);

  const messageContainer = document.createElement("div");
  const userInfo = document.createElement("span");
  const newMessage = document.createElement("span");

  const rank = getRank(tags);
  userInfo.textContent = rank.text;
  userInfo.classList.add(rank.class);

  messageContainer.classList.add(
    "message",
    "my-2",
    "block",
    "flex-col",
    "p-4",
    "bg-gray-100",
    "rounded-md"
  );

  userInfo.classList.add("text-gray-800", "mr-1", "max-h-6", "max-w-4");

  newMessage.textContent = messageWithEmoticons;
  newMessage.classList.add(
    "text-indigo-800",
    "flex",
    "gap-1",
    "flex-wrap",
    "mt-2"
  );

  messageContainer.appendChild(userInfo);
  messageContainer.appendChild(newMessage);
  container.appendChild(messageContainer);

  messageContainer.scrollIntoView(true);
});

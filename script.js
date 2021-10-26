const client = new tmi.Client({
    channels: ['']
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    let messageWithEmoticons = message;
    const emotes = tags['emotes'];
    if(emotes) {
        for(const property in emotes) {
            const splitEmote = JSON.stringify(emotes[property][0]).replaceAll(`"`, '').split('-');
            const start = parseInt(splitEmote[0]);
            const end = parseInt(splitEmote[1]) + 1;
            const emoteContent = message.substring(start, end);
            const emote = `<img src="https://static-cdn.jtvnw.net/emoticons/v1/${property}/1.0" />`;
            messageWithEmoticons = messageWithEmoticons.replaceAll(emoteContent, emote);
        }
    }

    const container = document.querySelector('#chat-container');
    const messageContainer = document.createElement('div');
    const userInfo = document.createElement('span');
    const newMessage = document.createElement('span');

    messageContainer.className += ' message my-1 block flex';
    userInfo.className += ' text-gray-800 mr-1 max-h-6 max-w-4';

    if(tags['mod'] === true) {
        userInfo.textContent = `/sys/${tags['display-name']}$`;
        userInfo.className += ' bg-red-200';
    } else if(tags['subscriber'] === true) {
        userInfo.textContent = `/opt/${tags['display-name']}$`;
        userInfo.className += ' bg-green-200';
    } else {
        userInfo.textContent = `/usr/${tags['display-name']}$`;
        userInfo.className += ' bg-gray-200';
    }

    newMessage.innerHTML = messageWithEmoticons;
    newMessage.className += ' text-indigo-800 flex gap-1 flex-wrap';

    messageContainer.appendChild(userInfo);
    messageContainer.appendChild(newMessage);
    container.appendChild(messageContainer);

    const messages = document.querySelectorAll('.message');
    const lastMessage = messages[messages.length - 1];
    lastMessage.scrollIntoView();
})
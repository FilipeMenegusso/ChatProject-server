const socket = io();

//?
const notify = (data) => {

};

socket.on('notify-onlines', (email) => {
    notify({ email, msg: 'Online' });
});
socket.on('notify-offlines', (email) => {
    notify({ email, msg: 'Offline' });
});

socket.on('new-message', (data) => {
    // add msg on text, data.email/data.sala
    // const chat = document.getElementById(`chat_${data.email}`);
    // if (chat.href.includes('?sala=')) {
    //   chat.href = chat.href.replace(/\?sala=[\w]+/, `?sala=${data.sala}`);
    // } else {
    //   chat.href += `?sala=${data.sala}`;
    // }
    // notify({ email: data.email, msg: 'Mensagem!' });
});

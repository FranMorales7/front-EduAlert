import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'pusher',
  key: '061022d80ee3f896a16d',
  cluster: 'eu', 
  forceTLS: true,
});

export default echo;

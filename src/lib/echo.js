// echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

let echo;

if (typeof window !== 'undefined') {
  window.Pusher = Pusher;

  echo = new Echo({
    broadcaster: 'pusher',
    key: '061022d80ee3f896a16d',
    cluster: 'eu',
    forceTLS: true,
  });
}

export default echo;

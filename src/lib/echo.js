import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import toast from 'react-hot-toast';

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'pusher',
  key: '061022d80ee3f896a16d',
  cluster: 'eu', 
  forceTLS: true,
});

echo.channel('notifications')
    .listen('.new-notification', (e) => {
      toast(`📢 Notificación recibida: ${e.notification?.message || 'Sin detalles'}`);
    });

export default echo;

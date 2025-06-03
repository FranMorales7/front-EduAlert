import Pusher from 'pusher-js';
import Echo from 'laravel-echo';

export function createEcho() {
  if (typeof window !== 'undefined') {
    window.Pusher = Pusher;

    return new Echo({
      broadcaster: 'pusher',
      key: '061022d80ee3f896a16d',
      cluster: 'eu',
      forceTLS: true,
    });
  }

  return null; // Retorna null si no está en el navegador
}

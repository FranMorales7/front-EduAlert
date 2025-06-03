export async function createEcho() {
  if (typeof window !== 'undefined') {
    const Pusher = (await import('pusher-js')).default;
    const Echo = (await import('laravel-echo')).default;

    window.Pusher = Pusher;

    return new Echo({
      broadcaster: 'pusher',
      key: '061022d80ee3f896a16d',
      cluster: 'eu',
      forceTLS: true,
    });
  }

  return null;
}

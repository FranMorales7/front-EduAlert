"use client"

import echo from '@/lib/echo';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function GlobalNotificationListener() {
  useEffect(() => {
    const channel = echo.channel('notifications');

    // En front-end el nombre del evento debe llevar el prefijo "."
    channel.listen('.new-notification', (event) => {
      console.log('Notification: ', event);
      
      toast.success(`🔔 ${event.title}`, {
        description: event.message,
        duration: 8000,
      });
    });

    return () => {
      echo.leaveChannel('notifications');
    };
  }, []);

  return null;
}

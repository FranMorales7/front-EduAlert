"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

export default function GlobalNotificationListener() {
  useEffect(() => {
    let echo;
    let channel;

    const setupEcho = async () => {
      const { createEcho } = await import('@/lib/echo');
      echo = createEcho();

      if (!echo) return;

      channel = echo.channel("notifications");
      channel.listen(".new-notification", (event) => {
        toast.success(`🔔 ${event.title}`, {
          description: event.message,
          duration: 8000,
        });
      });
    };

    setupEcho();

    return () => {
      if (channel) {
        channel.stopListening(".new-notification");
        channel.unsubscribe();
      }
    };
  }, []);

  return null;
}

"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function GlobalNotificationListener() {

  // Manejar notificación
  function NotificationToast({ t, event }) {
    const [expanded, setExpanded] = useState(false);
  
    return (
      <div
        onClick={() => setExpanded((prev) => !prev)}
        className={`bg-white text-gray-900 border border-gray-300 px-4 py-3 rounded-lg shadow-md w-80 cursor-pointer transition-all duration-300 ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
      >
        <strong className="flex gap-2">
          <BellRing className="bg-yellow-500" /> 
          {event.title}
        </strong>
        {expanded && (
          <p className="mt-2 text-sm text-gray-700 transition-opacity duration-300">
            {event.message}
          </p>
        )}
      </div>
    );
  }

  useEffect(() => {
    let echo;
    let channel;

    const setupEcho = async () => {
      const { createEcho } = await import('@/lib/echo');
      echo = await createEcho();

      if (!echo) return;

      channel = echo.channel("notifications");
      channel.listen(".new-notification", (event) => {
        toast.custom((t) => <NotificationToast t={t} event={event} />);
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

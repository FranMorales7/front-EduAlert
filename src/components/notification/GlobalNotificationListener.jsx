"use client";

import { BellRing } from "lucide-react";
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
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full">
            <BellRing className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-gray-900">{event.title}</h4>
            {expanded && (
              <p className="mt-1 text-sm text-gray-600 transition-opacity duration-300">
                {event.message}
              </p>
            )}
            {!expanded && (
              <p className="mt-1 text-xs text-blue-500">Haz clic para ver más</p>
            )}
          </div>
        </div>
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

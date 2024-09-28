"use client";
import { useEffect, useState } from 'react';
import { WhatsappScheduler } from '@/components/whatsapp-scheduler';
import { QRCodeCanvas } from 'qrcode.react';

export default function Scheduler() {
  const [qrCode, setQrCode] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Not connected');

  useEffect(() => {
    const ws = new WebSocket('wss://api.satriatama.me:3001'); 

    ws.onmessage = (event) => {
      console.log("Message from server: ", event.data);
      
      if (event.data === 'connected') {
        setConnectionStatus('Connected');
      } else {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'qr') {
            console.log("QR Code received: ", message.data);
            setQrCode(message.data);
            setConnectionStatus('QR code received');
          }
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    const handleBeforeUnload = () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <div>
        {qrCode ? (
          <QRCodeCanvas value={qrCode} size={256} />
        ) : (
          <p>{connectionStatus}</p>
        )}
      </div>
      <WhatsappScheduler />
    </div>
  );
}

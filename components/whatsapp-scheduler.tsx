"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function WhatsappScheduler() {
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [schedule, setSchedule] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [username, setUsername] = useState("");

  const addRecipient = () => {
    if (newRecipient && !recipients.includes(newRecipient)) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient("");
    }
  };

  const removeRecipient = (recipient: string) => {
    setRecipients(recipients.filter((r) => r !== recipient));
  };

  const handleSendMessage = async () => {
    // Mempersiapkan form data untuk dikirim ke server
    const formData = new FormData();
    formData.append("message", message);
    formData.append("recipients", recipients[0]);
    formData.append("schedule", schedule);
    formData.append("username", username);
    if (file) {
      formData.append("file", file); // Mengirim file hanya jika ada
    }

    try {
      const response = await fetch("https://api.satriatama.me:3001/api/send-message", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Pesan berhasil dikirim!");
      } else {
        alert("Gagal mengirim pesan: " + result.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Gagal mengirim pesan.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">WhatsApp Scheduler</h1>

      <div className="space-y-2">
        <Label htmlFor="message">Pesan</Label>
        <Textarea
          id="message"
          placeholder="Ketik pesan Anda di sini..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            setUsername(localStorage.getItem("username") || "");
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">Unggah Gambar/File</Label>
        <Input
          id="file"
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule">Jadwal Pengiriman</Label>
        <div className="flex space-x-2 text-white">
          <Input
            id="schedule"
            type="datetime-local"
            className=""
            style={{ colorScheme: "dark" }}
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Daftar Penerima</Label>
        <div className="flex space-x-2">
          <Input
            type="tel"
            placeholder="Tambah nomor penerima"
            value={newRecipient}
            onChange={(e) => setNewRecipient(e.target.value)}
          />
          <Button onClick={addRecipient}>Tambah</Button>
        </div>
        <ul className="mt-2 space-y-1">
          {recipients.map((recipient) => (
            <li
              key={recipient}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>{recipient}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeRecipient(recipient)}
              >
                Hapus
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <Button className="w-full" variant="outline" onClick={handleSendMessage}>
        Send Message
      </Button>
    </div>
  );
}

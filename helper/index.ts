// index.js
import * as whatsapp from "wa-multi-session";

export async function SendMessage() {
  try {
    // Create session with ID : mysessionid
    console.log(whatsapp.getAllSession());
    const session = await whatsapp.startSession("mysessionid");
    whatsapp.onConnected(async (sessionId) => {
        console.log("session connected :" + sessionId);
        whatsapp.loadSessionsFromStorage();
        await whatsapp.sendTextMessage({
            sessionId: "mysessionid", // session ID 
            to: "6287836672971", // always add country code (ex: 62)
            text: "Hi There, This is Message from Server!", // message you want to send
          });
      });

  } catch (error) {
    console.error("Error during WhatsApp session setup:", error);
  }
}

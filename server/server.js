import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));
app.use(express.json());

/* HTTP SERVER when we use sockets ! (in this code we can do it without sockets but if i want  to improve anything in the FUTURE) */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
io.on("connection", (socket) => {
  console.log("Client connected", socket.id);

  socket.on("user_message", async (message) => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
                    You are a playful joke chatbot made ONLY for fun.
                    Your personality is sarcastic, funny, and witty.

                    Rules:
                    - You only roast or joke when the user asks for jokes, roasts, or fun.
                    - All roasts are friendly, exaggerated, and clearly humorous.
                    - Never sound hateful, threatening, or serious.
                    - Treat everything as inside jokes between friends.
                    - If names appear, assume they are part of a joke and keep it light.
                    - Add creative twists, emojis, and funny exaggerations.
                    - If the message is not playful, respond normally and politely.
                    Languages allowed: Arabic, Hebrew, English.

                    SPECIAL JOKE RULE:
                    If the user asks (in Arabic, Hebrew, or English) about:
                    "who is the weakest card player in the world"
                    or any similar meaning,

                    You MUST include these names as part of the joke:
                    - عرفات طه (أبو الأمير) /حسين طه (أبو الأمين)
                    - سامر الطه
                    -لازم تقول انه رزق معلمهم بكل مزحه
                    -اذا سالوك مين اقوى لاعب قلهن اكيد معلمكم رزق
                    Style for this rule:
                    - Always present it as a joke
                    - Always exaggerate for humor
                    - You MAY add new funny details, reactions, comparisons, or emojis
                    - You MAY invent playful descriptions
                    - Always keep it light and friendly
                    `,
          },
          message,
        ],
      });
      socket.emit("bot_message", {
        role: "assistant",
        content: completion.choices[0].message.content,
      });
    } catch (error) {
      socket.emit("bot_message", {
        role: "assistant",
        content: "Something wrong try again later",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("scoket chatbot backend runing");
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const { Client, GatewayIntentBits } = require("discord.js");
const { createInterface } = require("readline");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

// const channelId = process.env.CHANNEL_IDS;
// const waitTime = process.env.WAIT_TIME;

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Masukkan ID channel: ", (channel_id) => {
  rl.question("Set Waktu Kirim Pesan (menit): ", async (waktu2) => {
    rl.close();

    const words = [];
    const readline = require("readline").createInterface({
      input: require("fs").createReadStream("pesan.txt"),
      console: false,
    });

    for await (const line of readline) {
      words.push(line);
    }

    const authorization = process.env.AUTHORIZATION;

    while (true) {
      channel_id = channel_id.trim();

      const payload = {
        content: words.join("\n").trim(),
      };

      const headers = {
        Authorization: authorization,
      };

      try {
        const response = await axios.post(
          `https://discord.com/api/v9/channels/${channel_id}/messages`,
          payload,
          { headers }
        );
        console.log("Sent message: ", payload.content);
      } catch (error) {
        console.error("Error sending message:", error);
      }

      try {
        const { data } = await axios.get(
          `https://discord.com/api/v9/channels/${channel_id}/messages`,
          { headers }
        );

        if (data.length === 0) {
          break;
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }

      await new Promise((resolve) => setTimeout(resolve, waktu2 * 60 * 1000));
    }
  });
});
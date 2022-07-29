const { Client } = require("discord.js");
const fetch = require("node-fetch");

// Conexão com banco de dados
const mongoose = require("mongoose");
const dbName = "dev-bot-discord";
// const dbUser = process.env.DB_USER;
// const dbPassword = process.env.DB_PASSWORD;

// Importação das models
const Models = require("../database/models/Models");

const { readdirSync } = require("fs");
const { join } = require("path");

module.exports = class extends Client {
  constructor(options) {
    super(options);

    this.commands = [];
    this.loadCommands();
    this.loadEvents();
  }

  registryCommands() {
    this.guilds.cache.get("408211319410655253").commands.set(this.commands);
  }

  loadCommands(path = "src/commands") {
    const categories = readdirSync(path);

    for (const category of categories) {
      const commands = readdirSync(`${path}/${category}`);

      for (const command of commands) {
        const commandClass = require(join(
          process.cwd(),
          `${path}/${category}/${command}`
        ));
        const cmd = new commandClass(this);

        this.commands.push(cmd);
      }
    }
  }

  loadEvents(path = "src/events") {
    const categories = readdirSync(path);

    for (const category of categories) {
      const events = readdirSync(`${path}/${category}`);

      for (const event of events) {
        const eventClass = require(join(
          process.cwd(),
          `${path}/${category}/${event}`
        ));

        const evt = new eventClass(this);

        this.on(evt.name, evt.run);
      }
    }
  }

  // async connectToDatabase() {
  //   const connection = await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.fmlsj.mongodb.net/${dbName}?retryWrites=true&w=majority`);
  //   if (connection) {
  //     console.log(`✅ - Banco de dados conectado com sucesso!`);

  //     this.db = {connection, ...Models}

  //   }
  // }

  async twitchNotificaions() {
    let { expires_in, access_token } = await this.get_token();

    setInterval(() => {
      fetch("https://api.twitch.tv/helix/streams?user_login=everton_dev", {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Client-Id": process.env.TWITCH_CLIENT,
        },
      }).then((response) => {
        response.json().then((json) => {
          var utcDate = json.data[0].started_at;
          let dataTime = utcDate.split("T");
          let data = dataTime[0];
          let time = dataTime[1].substring(0, dataTime[1].length - 1);
          let newTimeTemp = time.split(":");
          let newHour = parseInt(newTimeTemp[0]) - 3;
          let newTime = `${newHour}:${newTimeTemp[1]}:${newTimeTemp[2]}`;
        });
      });
      console.log(Date.now());
    }, 1000 * 600);
  }

  async get_token() {
    return fetch("https://id.twitch.tv/oauth2/token", {
      body: `client_id=${process.env.TWITCH_CLIENT}&client_secret=${process.env.TWITCH_SECRET}&grant_type=client_credentials`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })
      .then((response) => {
        return response.json(response).then((response_json) => {
          return response_json;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

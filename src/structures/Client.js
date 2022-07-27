const { Client } = require("discord.js");
const mongoose = require("mongoose");
const dbName = "dev-bot-discord";
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

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

  async connectToDatabase() {
    const connection = await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.fmlsj.mongodb.net/${dbName}?retryWrites=true&w=majority`);
    if (connection) {
      console.log("Banco de dados conectado com sucesso!");
      this.db = {connection}
    }
  }
};

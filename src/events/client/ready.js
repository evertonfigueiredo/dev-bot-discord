const Event = require("../../structures/Event");
const Discord = require("discord.js");

module.exports = class extends Event {
  constructor(client, options) {
    super(client, {
      name: "ready",
    });
  }
  run = async () => {
    console.log(
      `✅ - Logado em ${this.client.guilds.cache.size} servidor com sucesso!`
    );

    this.client.registryCommands()
    this.client.twitchNotificaions()

    let registrado = "884497986351157258"; // id do cargo registrado

    let cor_da_embed = "GREEN";

    let registro_embed = new Discord.MessageEmbed()
      .setTitle("Registro")
      .setDescription("Registre-se utilizando o botão abaixo!")
      .setImage("https://i.pinimg.com/originals/50/83/e0/5083e0a2a7dcaae07c142e8b87036a27.gif")
      .setColor("YELLOW");

    let boas_vindas = new Discord.MessageEmbed()
      .setTitle("Registrado com sucesso!")
      .setDescription("Seja bem vindo a nossa comunidade!")
      .setColor(cor_da_embed);

    let button_registre = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId("1")
        .setStyle("PRIMARY")
        .setLabel("REGISTRA-SE")
        .setDisabled(false)
    );

    let button_link = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
          .setStyle("LINK")
          .setURL("https://discord.com/channels/408211319410655253/883748426678931466")
          .setLabel("CHAT GERAL")
          .setDisabled(false)
      );

    const reply = await this.client.channels.fetch("884498491043377213");
    reply.bulkDelete(100, true).catch(console.error);
    let mensagem = await reply.send({
      embeds: [registro_embed],
      components: [button_registre],
      fetchReply: true,
    });

    const collector = mensagem.createMessageComponentCollector({
      time: 10 * 60000,
    });

    collector.on("collect", (i) => {
      switch (i.customId) {
        case "1":
          const membro = i.member;
          membro.roles.add(registrado);

          i.reply({
            content: `${i.member}`,
            embeds: [boas_vindas],
            components: [button_link],
            ephemeral: true,
          });

          break;

        default:
          break;
      }
    });
  };
};

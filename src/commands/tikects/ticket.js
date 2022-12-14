const { MessageActionRow, MessageButton } = require("discord.js");
const Discord = require("discord.js");
const Command = require("../../structures/Command");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

const actionRow = new MessageActionRow().addComponents([
  new MessageButton()
    .setStyle("SUCCESS")
    .setLabel("✅ - SIM")
    .setCustomId("SIM"),
  new MessageButton()
    .setStyle("DANGER")
    .setLabel("❌ - NÃO")
    .setCustomId("NÃO"),
]);

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "ticket",
      description: "Abre um novo ticket.",
    });
  }

  run = async (interaction) => {
    let confirmando_sistema = await db.get(
      `sistema_de_tickets_${interaction.guild.id}`
    );

    if (confirmando_sistema === null || false)
      return interaction.reply(`O sistema  de tickets está \`desativado\`!`);

    let canal_ticket = interaction.guild.channels.cache.find(
      (ticket) => ticket.name === `${interaction.user.id}`
    );

    if (canal_ticket)
      return interaction.reply(
        `Você ja possui um ticket aberto em ${canal_ticket}.`
      );

    let boas_vindas = new Discord.MessageEmbed()
      .setColor("AQUA")
      .setDescription(`${interaction.user} Boas Vindas ao seu ticket!`);

    let abrir = new Discord.MessageEmbed()
      .setColor("AQUA")
      .setDescription(`${interaction.user} Você deseja abrir um ticket?`);

    let cancelar = new Discord.MessageEmbed()
      .setColor("AQUA")
      .setDescription(`${interaction.user} O seu ticket foi cancelado.`);

    let time = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(`O tempo esgotou para a sua ação!`);

    const reply = await interaction.reply({
      embeds: [abrir],
      content: `${interaction.user}`,
      components: [actionRow],
      fetchReply: true,
    });

    const filter = (b) => b.user.id === interaction.user.id;

    const collector = reply.createMessageComponentCollector({
      filter,
      time: 10 * 60000,
    });

    collector.on("collect", async (i) => {
      switch (i.customId) {
        case "SIM":
          let everyoneRole = interaction.guild.roles.cache.find(
            (r) => r.name === "@everyone"
          );
          interaction.guild.channels.create(`${interaction.user.id}`, {
            type: "GUILD_TEXT",
            parent: process.env.CHANNEL_TICKET,
            permissionOverwrites: [
              {
                id: process.env.ID_STAFF,
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES"],
              },
              {
                id: everyoneRole.id,
                deny: ["VIEW_CHANNEL"],
              },
              {
                id: interaction.user.id,
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES"],
              },
            ],
          }).then((chat) =>{
            chat.send({ embeds: [boas_vindas] });
            i.message.delete()
          })
          break;

        case "NÃO":
          interaction.editReply('Cancelando').then(() =>{
            i.message.delete()
          })
          break;

        default:
          break;
      }

      i.update({
        components: [],
      });
    });

    collector.on("end", (collector, reason) => {
      if (reason === "time") {
        interaction.editReply({
          content: `Tempo do contador foi expirado.\n Contagem finalizada em:`,
          embeds: [time],
          components: [],
        });
      }
    });
    return;
  };
};

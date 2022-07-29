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
      name: "close",
      description: "Fecha o ticket.",
    });
  }

  run = async (interaction) => {
    let confirmando_sistema = await db.get(
      `sistema_de_tickets_${interaction.guild.id}`
    );

    let sistema_desativado = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(`O sistema  de tickets está \`desativado\`!`);

    if (confirmando_sistema === null || false)
      return interaction.reply({
        content: `${interaction.user}`,
        embeds: [sistema_desativado],
        ephemeral: true,
      });

    let confirmando_ticket = interaction.user.id;
    if (confirmando_ticket != interaction.channel.name)
      return interaction.reply(`Este canal não é seu ticket.`);

    let abrir = new Discord.MessageEmbed()
      .setColor("AQUA")
      .setDescription(`${interaction.user} Você deseja fechar o ticket?`);

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
          interaction.editReply("Fechando").then(() => {
            interaction.channel.delete();
          });

          break;

        case "NÃO":
          interaction.editReply("Cancelando").then(() => {
            i.message.delete();
          });
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

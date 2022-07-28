const { MessageActionRow, MessageButton } = require("discord.js");
const Discord = require("discord.js");
const Command = require("../../structures/Command");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

const actionRow = new MessageActionRow().addComponents([
  new MessageButton()
    .setStyle("SUCCESS")
    .setLabel("✅ - Ativar")
    .setCustomId("ATIVAR"),
  new MessageButton()
    .setStyle("PRIMARY")
    .setLabel("🗑️ - DESATIVAR")
    .setCustomId("DESATIVAR"),
  new MessageButton()
    .setStyle("DANGER")
    .setLabel("❌ - Cancelar")
    .setCustomId("CANCELAR"),
]);

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "tickets",
      description: "Ativa o sistema de tickets.",
    });
  }

  run = async (interaction) => {
    let sem_permissao = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(`**Você não permissão para usar esse comando.**`);

    let ativar = new Discord.MessageEmbed()
      .setColor("AQUA")
      .setDescription(`Você deseja ativar o sistema de tickets?`);

    let ativado = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription(`O sistema de tickets foi \`ativado\`!`);

    let desativado = new Discord.MessageEmbed()
      .setColor("GREY")
      .setDescription(`O sistema de tickets foi \`desativado\`!`);

    let time = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(`O tempo esgotou para a sua ação!`);

    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      return interaction.reply({
        content: `${interaction.user}`,
        embeds: [sem_permissao],
        ephemeral: true,
      });
    }

    const reply = await interaction.reply({
      content: `${interaction.user}`,
      components: [actionRow],
      embeds: [ativar],
      fetchReply: true,
    });

    const filter = (b) => b.user.id === interaction.user.id;

    const collector = reply.createMessageComponentCollector({
      filter,
      time: 10 * 60000,
    });

    collector.on("collect", async (i) => {
      switch (i.customId) {
        case "ATIVAR":
          await db.set(`sistema_de_tickets_${interaction.guild.id}`, "Ativado");
          interaction.editReply({
            content: `${interaction.user}`,
            embeds: [ativado],
          });
          break;

        case "CANCELAR":
          i.message.delete();
          break;

        case "DESATIVAR":
          await db.delete(`sistema_de_tickets_${interaction.guild.id}`);
          interaction.editReply({
            content: `${interaction.user}`,
            embeds: [desativado],
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
  };
};

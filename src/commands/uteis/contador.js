const Command = require("../../structures/Command");
const { MessageActionRow, MessageButton } = require("discord.js");

const actionRow = new MessageActionRow().addComponents([
  new MessageButton().setStyle("DANGER").setLabel("-1").setCustomId("REMOVER"),

  new MessageButton()
    .setStyle("PRIMARY")
    .setLabel("ZERAR")
    .setCustomId("ZERAR"),

  new MessageButton().setStyle("SUCCESS").setLabel("+1").setCustomId("ADD"),
]);

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "contador",
      description: "Inicia um contador no canal",
    });
  }

  run = async (interaction) => {
    let contagem = 0;

    const reply = await interaction.reply({
      content: `Contagem: \`${contagem}\``,
      components: [actionRow],
      fetchReply: true,
    });

    const filter = (b) => b.user.id === interaction.user.id;

    const collector = reply.createMessageComponentCollector({
      filter,
      time: 10 * 60000,
    });

    collector.on("collect", (i) => {
      switch (i.customId) {
        case "REMOVER":
            if (contagem == 0) {
                break;
            }
          contagem--;
          break;

        case "ADD":
          contagem++;
          break;

        case "ZERAR":
          contagem = 0;
          break;

        default:
          break;
      }

      i.update({
        content: `Contagem: \`${contagem}\``,
        components: [actionRow],
      });
    });

    collector.on("end", (collector, reason)=>{
        if (reason === 'time') {
            interaction.editReply({
                content: `Tempo do contador foi expirado.\n Contagem finalizada em: ${contagem}`,
                components: []
            })
        }
    })

  };
};

const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class extends Command {
  constructor(client, options) {
    super(client, {
      name: "registro",
      description: "Registra o usuário no servidor.",
    });
  }

  run = async (interaction) => {
    let registrado = "884497986351157258"; // id do cargo registrado

    let cor_da_embed = "GREEN";

    let registro_embed = new Discord.MessageEmbed()
      .setTitle("Registro")
      .setDescription("Registre-se utilizando o botão abaixo!")
      .setColor(cor_da_embed);

    let buttons = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId("1")
        .setStyle("PRIMARY")
        .setLabel("REGISTRA-SE")
        .setDisabled(false)
    );

    const reply = await interaction.reply({
      content: `${interaction.user}`,
      embeds: [registro_embed],
      components: [buttons],
      fetchReply: true,
    });

    const collector = reply.createMessageComponentCollector({
      time: 10 * 60000,
    });

    collector.on("collect", (i) => {
      switch (i.customId) {
        case "1":
          const membro = i.member;
          membro.roles.add(registrado);
          break;

        default:
          break;
      }
    });

    collector.on("end", (collector, reason) => {
      if (reason === "time") {
        interaction.editReply({
          content: `Tempo do contador foi expirado.\n Contagem finalizada em: ${contagem}`,
          components: [],
        });
      }
    });
  };
};

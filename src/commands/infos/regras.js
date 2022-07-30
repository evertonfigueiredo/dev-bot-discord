const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class extends Command {
  constructor(client, options) {
    super(client, {
      name: "regras",
      description: "Mostra as regras do servidor.",
    });
  }

  run = (interaction) => {
    let cor_da_embed = "YELLOW";

    let embed_1 = new Discord.MessageEmbed()
      .setTitle("📖 Regras")
      .setColor(cor_da_embed).setDescription(`Regra 1:
      Não Faça Spam Ou Flood No Chat
      ⤷ Envio De Mensagens Muito Rápido`);

    

    interaction.reply({
        content: `${interaction.user}`,
        embeds: [embed_1],
      })
  };
};

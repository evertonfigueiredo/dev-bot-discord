const Command = require("../../structures/Command");
const Discord = require("discord.js")

module.exports = class extends Command {
  constructor(client, options) {
    super(client, {
      name: "ping",
      description: "Mostra o ping do bot.",
    });
  }

  run = (interaction) => {
    
    let cor_da_embed = "GREEN";

    let ping_do_bot = this.client.ws.ping;

    let embed_1 = new Discord.MessageEmbed()
      .setColor(cor_da_embed)
      .setDescription(`**\`🏓\` Calculando ping.**`);

    let embed_2 = new Discord.MessageEmbed()
      .setColor(cor_da_embed)
      .setDescription(`**O meu ping está em \`${ping_do_bot} ms\`.**`);

    interaction
      .reply({ content: `${interaction.user}`, embeds: [embed_1],ephemeral: true })
      .then((msg) => {
        setTimeout(() => {
          interaction.editReply({
            content: `${interaction.user}`,
            embeds: [embed_2],
            ephemeral: true,
          });
        }, 2000);
      });

  };
};

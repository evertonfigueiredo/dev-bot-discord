const Command = require("../../structures/Command");

const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "limpar",
      description: "Limpa mensagens do canal.",
      options: [
        {
          name: "quantidade",
          type: "STRING",
          description: "Quantidade de mensagens a serem apagadas",
          required: true,
        },
      ],
    });
  }

  run = (interaction) => {
    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
      return interaction.reply({
        content:
          "Você precisa de permissão para excluir mensagens no servidor.",
        ephemeral: true,
      });
    }
    const quantidade = parseInt(interaction.options.get("quantidade").value);

    if (quantidade > 100) {
      return interaction.reply({
        content: `Erro, não é possível apagar mais de 100 mensagens simultaneamente.`,
        ephemeral: true,
      });
    }

    if (quantidade) {
      interaction.channel.bulkDelete(quantidade, true).catch(console.error);
      return interaction.reply({
        content: `As ${quantidade} foram apagadas desse canal.`,
        ephemeral: true,
      });
    } else {
      return interaction.reply({
        content: `Erro, não foi possível apagar as mensagens desse canal.`,
        ephemeral: true,
      });
    }
  };
};

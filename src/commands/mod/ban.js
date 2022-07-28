const Command = require("../../structures/Command");

const Discord = require("discord.js");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "banir",
      description: "Banir um usuário do servidor.",
      options: [
        {
          name: "usuário",
          type: "USER",
          description: "Usuário a ser banido",
          required: true,
        },
        {
          name: "motivo",
          type: "STRING",
          description: "Motivo da banição",
          required: false,
        },
      ],
    });
  }

  run = async (interaction) => {
    let cor_red = "RED";
    let cor_green = "GREEN";
    let cor_yellow = "YELLOW";

    const user = interaction.options.getUser("usuário");

    let sem_permissao = new Discord.MessageEmbed()
      .setColor(cor_red)
      .setDescription(
        "**Você precisa de permissão para banir membros no servidor.**"
      );

    let auto_banimento = new Discord.MessageEmbed()
      .setColor(cor_yellow)
      .setDescription("**Você não pode se banir.**");

    let baixo_cargo = new Discord.MessageEmbed()
      .setColor(cor_yellow)
      .setDescription(
        "**Você só pode banir membros com cargo abaixo do seu.**"
      );

    let auto_cargo = new Discord.MessageEmbed()
      .setColor(cor_yellow)
      .setDescription(
        "**Não consigo banir este usuário, o cargo dele não é mais baixo que o meu.**"
      );

    let sucesso = new Discord.MessageEmbed()
      .setColor(cor_green)
      .setDescription(`**Usuário \`${user.tag}\` foi banido com sucesso!**`);

    let error = new Discord.MessageEmbed()
      .setColor(cor_red)
      .setDescription(`**Erro ao banir o usuário \`${user.tag}\`!**`);

    if (!interaction.member.permissions.has("BAN_MEMBERS")) {
      return interaction.reply({
        content: `${interaction.user}`,
        embeds: [sem_permissao],
        ephemeral: true,
      });
    }

    if (interaction.user.id === user.id) {
      return interaction.reply({
        content: `${interaction.user}`,
        embeds: [auto_banimento],
        ephemeral: true,
      });
    }

    const member = interaction.guild.members.cache.get(user.id);
    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    ) {
      return interaction.reply({
        content: `${interaction.user}`,
        embeds: [baixo_cargo],
        ephemeral: true,
      });
    }

    if (
      interaction.guild.me.roles.highest.position <=
      member.roles.highest.position
    ) {
      return interaction.reply({
        content: `${interaction.user}`,
        embeds: [auto_cargo],
        ephemeral: true,
      });
    }

    const reason = interaction.options.getString("motivo");

    interaction.guild.members
      .ban(user, { reason })
      .then(() => {
        interaction.reply({
          content: `${interaction.user}`,
          embeds: [sucesso],
          ephemeral: true,
        });
      })
      .catch(() => {
        interaction.reply({
            content: `${interaction.user}`,
            embeds: [error],
            ephemeral: true
        });
      });
  };
};

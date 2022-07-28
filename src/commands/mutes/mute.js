const Discord = require("discord.js");
const Command = require("../../structures/Command");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "mute",
      description: "Muta o usuário do servidor.",
      options: [
        {
          name: "usuário",
          type: "USER",
          description: "Usuário a ser mutado.",
          required: true,
        },
      ],
    });
  }

  run = async (interaction) => {

    if (!interaction.member.permissions.has("MUTE_MEMBERS"))
      return interaction.reply({
        content: `${interaction.user} Você não tem permissão para isso.`,
        ephemeral: true,
      });

    let cargo_mute = await db.get(`cargo_mute_${interaction.guild.id}`);

    let nao_config = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(`**O cargo mute não esta configurado!**`);

    let error = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(`**Algo deu errado!**`);

    if (!cargo_mute || cargo_mute === null || cargo_mute === false) {
      return message.reply({
        content: `${interaction.user}`,
        embeds: [nao_config],
        ephemeral: true,
      });
    }

    const membro = interaction.guild.members.cache.get(
      interaction.options.getUser("usuário").id
    );

    let sucesso = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription(`**O ${membro} foi mutado com sucesso.**`);

    await db.set(`membro_${interaction.guild.id}`, membro.id);

    interaction
      .reply({
        content: `${interaction.user}`,
        embeds: [sucesso],
        ephemeral: true,
      })
      .then(() => {
        membro.roles.add(cargo_mute.id).catch((err) => {
          interaction.editReply({
            content: `${interaction.user}`,
            embeds: [err],
            ephemeral: true,
          });
        });
      });
  };
};

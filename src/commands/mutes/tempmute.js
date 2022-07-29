const Discord = require("discord.js");
const Command = require("../../structures/Command");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "tempmute",
      description: "Muta o usuário por um periodo de tempo.",
      options: [
        {
          name: "usuário",
          type: "USER",
          description: "Usuário a ser desmutado.",
          required: true,
        },
        {
          name: "tempo",
          type: "INTEGER",
          description: "Tempo para ser desmutado.",
          required: false,
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

    let servidor = interaction.guild.id;
    let cargo_mute = await db.get(`cargo_mute_${servidor}`);
    let tempo_mutado = interaction.options.getInteger("tempo");

    const membro = interaction.guild.members.cache.get(
      interaction.options.getUser("usuário").id
    );

    if (!tempo_mutado) {
      tempo_mutado = 10;
    }
    let tempo_millis = tempo_mutado * 60 * 1000;

    let nao_config = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(`**O cargo mute não esta configurado!**`);

    if (!cargo_mute || cargo_mute === null || cargo_mute === false) {
      return message.reply({
        content: `${interaction.user}`,
        embeds: [nao_config],
        ephemeral: true,
      });
    }

    let error = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(`**Algo deu errado!**`);

    let sucesso_desmute = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription(`**O ${membro} foi desmutado com sucesso.**`);

    let sucesso_mute = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription(`**O ${membro} foi mutado com sucesso.**`);

    await db.set(`membro_${interaction.guild.id}`, membro.id);

    membro.roles.add(cargo_mute.id).then(() => {
      interaction
        .reply({
          content: `${interaction.user}`,
          embeds: [sucesso_mute],
        })
        .then(async () => {
          setTimeout(async () => {
            await db.set(`membro_${interaction.guild.id}`, membro.id);
            membro.roles.remove(cargo_mute.id).then(() => {
              interaction
                .editReply({
                  content: `${interaction.user}`,
                  embeds: [sucesso_desmute],
                })
                .then((chat) => {
                  setTimeout(async () => {
                    chat.delete();
                  }, 1000);
                });
            });
          }, tempo_millis);
        });
    });
  };
};

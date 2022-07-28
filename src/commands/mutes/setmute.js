const Discord = require("discord.js");
const Command = require("../../structures/Command");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "setmute",
      description: "Expulsa um usuário do servidor.",
      options: [
        {
          name: "cargo",
          type: "ROLE",
          description: "Cargo a ser setado.",
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

    let servidor = interaction.guild.id;
    let cargo_mute = interaction.options.getRole("cargo");

    let embed_1 = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`!setmute [\`cargo\`]`);

    if (!cargo_mute)
      return interaction.reply({
        content: `${interaction.user}`,
        embeds: [embed_1],
        ephemeral: true,
      });

    let embed_2 = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription(`**O cargo ${cargo_mute} foi configurado com sucesso.**`);

    await db.set(`cargo_mute_${servidor}`, cargo_mute);

    interaction.reply({
      content: `${interaction.user}`,
      embeds: [embed_2],
      ephemeral: true,
    });
  };
};

const Command = require("../../structures/Command");

const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

module.exports = class extends Command {
  constructor(client, options) {
    super(client, {
      name: "falar",
      description: "Faz com que o bot fale alguma mensagem",
      options: [
        {
          name: "mensagem",
          type: "STRING",
          description: "A mensagem que será enviada no canal",
          required: true,
        },
      ],
    });
  }

  run = async (interaction) => {
    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
      return interaction.reply({
        content: "Você não tem permissão para usar este comando!",
        ephemeral: true,
      });
    }

    const channels = interaction.guild.channels.cache.filter(
      (c) =>
        c.type === "GUILD_TEXT" &&
        c
          .permissionsFor(this.client.user.id)
          .has(["SEND_MESSAGES", "EMBED_LINKS"]) &&
        c.permissionsFor(interaction.user.id).has("SEND_MESSAGES")
    );

    if (!channels.size) {
      return interaction.reply({
        content: "Não consigo enviar a mensagem aqui no servidor.",
        ephemeral: true,
      });
    }

    const actionRow = new MessageActionRow().addComponents([
      new MessageSelectMenu()
        .setCustomId("channelSelect")
        .setPlaceholder("Selecione um canal")
        .addOptions(
          channels.map((c) => {
            return {
              label: c.name,
              value: c.id,
            };
          })
        ),
    ]);

    const reply = await interaction.reply({
      content: "Selecione o canal que você deseja enviar a mensagem: ",
      components: [actionRow],
      ephemeral: true,
      fetchReply: true,
    });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = reply.createMessageComponentCollector({
      filter,
      max: 1,
      time: 3 * 60000,
    });

    collector.on("collect", (i) => {
      const idCanal = i.values[0];
      const canal = interaction.guild.channels.cache.get(idCanal);

      const texto = interaction.options.getString("mensagem");

      const embed = new MessageEmbed()
        .setTitle(`Uma mensagem foi enviada neste canal.`)
        .setDescription(texto)
        .setColor("#0000ff")
        .setTimestamp();

      canal
        .send({ embeds: [embed] })
        .then(() =>
          interaction.editReply({
            content: "Texto enviado com sucesso.",
            ephemeral: true,
            components: []
          })
        )
        .catch(() =>
          interaction.editReply({
            content: "Texto não enviado.",
            ephemeral: true,
            components: []
          })
        );
    });

    collector.on('end', (collected, reason) => {
        if(reason === 'time'){
            return interaction.editReply({
                content: "O tempo para informar o canal se esgotou.",
                components: []
            })
        }
    })

  };
};

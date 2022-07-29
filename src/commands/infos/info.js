const Command = require("../../structures/Command");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "info",
      description: "Informações do usuário.",
      options: [
        {
          name: "usuário",
          type: "USER",
          description: "Usuário a ser mutado.",
          required: false,
        },
      ],
    });
  }

  run = (interaction) => {
    const membro = interaction.guild.members.cache.get(
      interaction.options.getUser("usuário")?.id
    );

    if (membro) {
      interaction.reply(
        {content: `${membro}`}
      )
    } else if (interaction.user) {
      interaction.reply(
        {content: `${interaction.user}`}
      )
    }
   
    return
  };
};

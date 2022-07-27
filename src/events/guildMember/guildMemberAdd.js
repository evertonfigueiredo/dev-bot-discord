const Event = require('../../structures/Event')

module.exports = class extends Event{
    constructor(client, options){
        super(client, {
            name: 'guildMemberAdd'
        })
    }

    run = async (member) =>{
        console.log(member.user.username);
    }
}
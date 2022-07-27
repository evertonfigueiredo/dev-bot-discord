const Event = require('../../structures/Event')

module.exports = class extends Event{
    constructor(client, options){
        super(client, {
            name: 'ready'
        })
    }

    run = async () =>{
        console.log(`${this.client.user.username} logado com sucesso em ${this.client.guilds.cache.size} servidores.`);
        this.client.registryCommands()
        await this.client.connectToDatabase()
    }
}
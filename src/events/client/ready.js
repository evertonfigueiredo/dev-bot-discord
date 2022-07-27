const Event = require('../../structures/Event')

module.exports = class extends Event{
    constructor(client, options){
        super(client, {
            name: 'ready'
        })
    }

    run = () =>{
        console.log(`${this.client.user.username} logado com sucesso em ${this.client.guilds.cache.size} servidores.`);
        console.log("Teste de atualização pelo git");
        this.client.registryCommands()
        
    }
}
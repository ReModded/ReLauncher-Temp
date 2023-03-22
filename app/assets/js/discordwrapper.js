// Work in progress
const { LoggerUtil } = require('helios-core')

const logger = LoggerUtil.getLogger('DiscordWrapper')

const { Client } = require('discord-rpc-patch')

let client
let activity

exports.initRPC = function(genSettings, servSettings, initialDetails = ''){
    client = new Client({ transport: 'ipc' })

    activity = {
        details: servSettings.imageText,
        state: initialDetails,
        largeImageKey: genSettings.imageKey,
        largeImageText: genSettings.imageText,
        smallImageKey: servSettings.imageKey,
        smallImageText: servSettings.imageText,
        startTimestamp: new Date().getTime(),
        instance: false
    }

    client.on('ready', () => {
        logger.info('Discord RPC Connected')
        client.setActivity(activity)
    })
    
    client.login({clientId: genSettings.clientId}).catch(error => {
        if(error.message.includes('ENOENT')) {
            logger.info('Unable to initialize Discord Rich Presence, no client detected.')
        } else {
            logger.info('Unable to initialize Discord Rich Presence: ' + error.message, error)
        }
    })
}

exports.updateDetails = function(details){
    activity.state = details
    client.setActivity(activity)
}

exports.shutdownRPC = function(){
    if(!client) return
    client.clearActivity()
    client.destroy()
    client = null
    activity = null
}
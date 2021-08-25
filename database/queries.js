const { Op, Sequelize, Association } = require("sequelize");
const sequelize = require('./database.js');

const Server = require('./models/server.js');
const Channel = require('./models/channel');
const Topic = require('./models/topic.js');
const Link = require('./models/url.js');
const Language = require('./models/language.js');

const ChannelTopics = require('./models/channelTopics.js');

//Verify: Check if a record exists... if not, Insert one. (Check and Insert together)
//Check: Only check if record exists.
//Insert: Only Insert records.

module.exports = {

    verifyTopic: async function(topic) {
      const query = await Topic.findOne( { where: { topic: topic } }); 

      if(!query) //If Topic doesn't exists
        return Topic.create({ topic: topic }); //Create a new topic
      else 
        return query; 
    },

    verifyServer: async function(discordServer) {
      const query = await Server.findOne( { where: { discordServerId: discordServer.id } }); 

      if(!query) //If Server doesn't exists
        return Server.create({ discordServerId: discordServer.id }); //Create a new discord server.
      else 
        return query; 
    },

    verifyChannel: async function (discordChannel, server) {
      const query = await Channel.findOne( { where: { discordChannelId: discordChannel.id } }); 

      if(!query) //If Channel doesn't exists
        return Channel.create({ discordChannelId: discordChannel.id , serverId: server.id, languageId: 1 }); //Create a new discord server.
      else 
        return query; 
    },

    checkChannel: async function (discordChannel) {
      const query = await Channel.findOne( { where: { discordChannelId: discordChannel.id } }); 
      if(query) 
        return query;
      else 
        return null;
    }, 

    getLanguages: async function() {
      const query = await Language.findAll();
      return query;
    },

    insertChannel: async function (channel, server, languageId) {
      return Channel.create({ discordChannelId: channel.id , serverId: server.id, languageId: languageId }); //Create a new discord server.
    },

    findChannelsByServer: async function(server) {
      const query = await Channel.findAll( { where: { serverId: server.id } } ); 
      return query;
    },

    checkChannelTopics: async function (channel) {
      const query = await ChannelTopics.findAll( { where: { channelId: channel.id } } ); 
      if(!query.length === 0)
        return query;
      else 
        return null;
    },

    
    updateMessage: async function(discordChannelId, discordMessageId)  //record {
    {
      const query = await Channel.update({ discordMessageId: discordMessageId }, {
        where: {
          discordChannelId: discordChannelId
        }
      });

      return query;
    },

    findMessageByMessageId: async function(messageId) {
      let query = await Channel.findOne( { where: { messageId: messageId } });
      if(query)
        return query; 
      else 
        return null;
    },

    findMessageByChannelId: async function(channelId) {
      let query = await Channel.findOne( { where: { channelId: channelId  } });
      if(query)
        return query.messageId; 
      else 
        return null;
    },

    findChannelByChannelId: async function(channelId) {
      let query = await Channel.findOne( { where: { channelId: channelId } });
      if(query)
        return query;    
      else 
        return null;
    },

    insertTopic: async function(topic, channelId){
      let queryChannel = await Channel.findOne( { where: { discordChannelId: discordChannelId } } );

      if(queryChannel){
        let queryTopic = await Topic.findOne({ where: { [Op.and]: [ { channelId: queryChannel.id }, { topic: topic } ] } });

        if(queryTopic){
          console.log('That topic already exists');
        } else {
          await Topic.create({ topic: topic , channelId: queryChannel.id, used: false}); //Store the data in database.
          console.log('A topic has been created!');        
        }

      } else {
        console.log('There is no a poll on this channel');
      }
    },

    insertTopicTest: async function (topicName, discordChannelId) {
      //Check if topic exists.
        //If not... Create Topic -> Then Make Association
        //If so... Get topicId -> Then Make Association

      let topic = await Topic.findOne({ where: { topic: topicName } });

      if(!topic)
         topic = await Topic.create({ topic: topicName }); 
      

      //let channel = await Channel.create({ discordChannelId: "126459789" , serverId: 1 }); 
      let channel = await Channel.findOne({ where: { discordChannelId: discordChannelId } });

      channel.addTopic(topic);
      
    },

    findUnusedTopicsByChannelId: async function(discordChannelId){
      let query = await Topic.findAll({ where: { [Op.and]: [ { discordChannelId: discordChannelId } ] } }); 
      if(query)
        return query;
      else 
        console.log('We could not find topics on this channel');
    },
    
    updateUsageTopic: async function(topicId){
      await Topic.update({ used: true }, {
        where: {
          id: topicId
        }
      });
    },

    getLinks: async function(){
      let query = await sequelize.query("WITH cte AS ( SELECT *, ROW_NUMBER() OVER (PARTITION BY channelId ORDER BY id ASC) AS rn FROM links) SELECT * FROM cte WHERE rn = 1", { type: Sequelize.QueryTypes.SELECT });
      if(!(Object.keys(query).length === 0)) return query; 
      else return null; //If query doesn't have anything
    },

    deleteLinks: async function(){
      await sequelize.query("DELETE e.* FROM links e WHERE id IN (SELECT id FROM (WITH cte AS ( SELECT *, ROW_NUMBER() OVER (PARTITION BY channelId ORDER BY id ASC) AS rn FROM links) SELECT * FROM cte WHERE rn = 1) x);", { type: Sequelize.QueryTypes.DELETE }); //I have no idea why this subquery works, but it works.
      console.log('Links has been deleted');
    },

    getDiscordChannelIdByChannelId: async function (channelId){
      let query = await Channel.findAll({
        include: [{
        model: Link,
        required: true,
        where: {channelId: channelId}
       }]
      });

      if(query) return query[0].channelId;
      else return null;
    },
    
    insertLanguages: async function() {
      await Language.create({ language: 'English', code: 'EN', emoji: '🇬🇧'}); //Store the data in database.
      await Language.create({ language: 'Español', code: 'ES', emoji: '🇪🇸'}); //Store the data in database.
    },

    updateToPremium: async function(server) {
      await Server.update({ premium: true }, {
        where: {
          id: server.id
        }
      });
    }

    
}  



async function insertChannel(discordChannelId, discordMessageId, serverId) {
  let record = await Channel.create({ discordChannelId: discordChannelId , discordMessageId: discordMessageId, serverId: serverId, languageId: 1}); //Store the data in database.
  console.log('ChannelID as ' + record.discordChannelId + '  has ben created on database');
}


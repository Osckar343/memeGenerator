const Sequelize = require('sequelize');
const sequelize = require('../database.js');

const channelTopic = sequelize.define("channel_languageTopics", {
    /*Many to Many table relation*/
    /*The relation is made in the table relations file, and as result we have next fields: */

    //languageTopicsId
    //topicId

    },{
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    }
);

module.exports = channelTopic;
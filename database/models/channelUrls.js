const Sequelize = require('sequelize');
const sequelize = require('../database.js');

const channelTopic = sequelize.define("channel_urls", {
    /*Many to Many table relation*/
    /*The relation is made in the table relations file, and as result we have the next fields: */

    //channelId
    //UrlId

    },{
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    }
);

module.exports = channelTopic;
const Sequelize = require('sequelize');
const sequelize = require('../database.js');

const channelTopic = sequelize.define("channel_urls", {
    /*Many to Many table relation*/
    /*The relation is made in the table relations file, and as result we have the next fields: */

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    frequency: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 2
    },

    lastElement: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }

    //channelId
    //UrlId

    },{
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    }
);

module.exports = channelTopic;
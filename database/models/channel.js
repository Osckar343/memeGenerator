const Sequelize = require('sequelize');
const sequelize = require('../database.js');

const channel = sequelize.define("channel", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    
    discordChannelId: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    discordMessageId: {
        type: Sequelize.BIGINT,
        autoIncrement: false,
    },

    memesPerHour: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2
    },

    activePoll: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

    activeGif: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = channel;
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

    frequency: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 2,
        validate: {
            min: 1,
            max: 3
        }
    },

    poll: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

    pollDate: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
    },

    pollAnswers: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 3,
        validate: {
            min: 2,
            max: 5
        }
    },

    pollGif: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

    pollDuration: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 30,
        validate: {
            min: 5,
            max: 60
        }
    }
});

module.exports = channel;
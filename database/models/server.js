const Sequelize = require('sequelize');
const sequelize = require('../database.js');

const channel = sequelize.define("server", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    
    discordServerId: {
        type: Sequelize.STRING, //Probably INTEGER
        allowNull: false,
    },

    premium: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
});

module.exports = channel;
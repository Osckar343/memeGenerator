const Sequelize = require('sequelize');
const sequelize = require('../database.js');

const topic = sequelize.define("language", {
    id: {
        type: Sequelize.TINYINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    language: {
        type: Sequelize.STRING(12),
        allowNull: false,
    }, 

    code: {
        type: Sequelize.STRING(2),
        allowNull: false,
        unique: true,
    },

    emoji: {
        type: Sequelize.STRING(10),
        allowNull: false,
    }, 

    },{
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    });

module.exports = topic;
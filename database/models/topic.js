const Sequelize = require('sequelize');
const sequelize = require('../database.js');

const topic = sequelize.define("topic", {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    topic: {
        type: Sequelize.STRING,
        allowNull: false,
    }
    
    },{
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    });

module.exports = topic;
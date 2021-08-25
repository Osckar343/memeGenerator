const Sequelize = require('sequelize');
const sequelize = require('../database.js');

const topic = sequelize.define("category", {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    category: {
        type: Sequelize.STRING,
        allowNull: false,
    }
    },{
        updatedAt: false,
    });

module.exports = topic;
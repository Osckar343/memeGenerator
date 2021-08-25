const Sequelize = require('sequelize');
const sequelize = require('../database.js');

const channelTopic = sequelize.define("language_topics", {
    /*Many to Many table relation*/
    /*The relation is made in the table relations file, and as result we have next fields: */

    //languagelId
    //topicId

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    voted: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    uses: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    urlsUpdatedAt: {
        type: Sequelize.DATEONLY,
        allowNull: true,
    }

    },{
    timestamps: true,
    createdAt: true,
    updatedAt: false,
});

module.exports = channelTopic;
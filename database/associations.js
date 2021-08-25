//Defining all sql tables of the database
const Server = require('./models/server.js');
const Channel = require('./models/channel.js');
const Topic = require('./models/topic.js');
const Url = require('./models/url.js');
const Category = require('./models/category.js');
const Language = require('./models/language.js');
const ChannelTopics = require('./models/channelTopics.js');
const ChannelUrls = require('./models/channelUrls.js');
const CategoryTopics = require('./models/categoryTopics.js');
const LanguageTopics = require('./models/languageTopics.js');

const sequelize = require('./database.js');

/*For *-to-one relationships, always use JOIN
For *-to-many relationships, a second query might be faster*/

//Defining the associations
/*One to Many Association  - Server has many Channels*/
Channel.belongsTo(Server, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Server.hasMany(Channel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

/*One to Many Association  - LanguageTopics has many URLs*/
Url.belongsTo(LanguageTopics, {foreignKey:   { allowNull: false }, onDelete: 'CASCADE' });
LanguageTopics.hasMany(Url, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

/*One to Many Association  - Language has many Channels*/
Channel.belongsTo(Language, {foreignKey:   { allowNull: false }, onDelete: 'CASCADE' });
Language.hasMany(Channel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

/*Many to Many Association - Channel has many Topics, and Topics has Many Channels*/
Channel.belongsToMany(Topic, { through: ChannelTopics });
Topic.belongsToMany(Channel, { through: ChannelTopics });

/*Many to Many Association - Channel has many URLs, and URL has Many Channels*/
Channel.belongsToMany(Url, { through: ChannelUrls });
Url.belongsToMany(Channel, { through: ChannelUrls });

/*Many to Many Association - Category has many topics, and topics has Many categories*/
Topic.belongsToMany(Category, { through: CategoryTopics });
Category.belongsToMany(Topic, { through: CategoryTopics });

/*Many to Many Association - Language has many Topics, and Topics has Many Languages*/
Language.belongsToMany(Topic, { through: LanguageTopics });
Topic.belongsToMany(Language, { through: LanguageTopics });

sequelize.sync(/*{force: true}*/);
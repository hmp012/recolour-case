const Ticket = require('./Ticket');
const Asset = require('./Asset');

// A ticket references two assets: the source and the result
Ticket.belongsTo(Asset, { as: 'baseAsset', foreignKey: 'baseAssetId' });
Ticket.belongsTo(Asset, { as: 'resultAsset', foreignKey: 'resultAssetId' });

module.exports = {
    Ticket,
    Asset
};
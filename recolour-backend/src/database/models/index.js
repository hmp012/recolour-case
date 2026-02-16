const Ticket = require('./Ticket');
const Asset = require('./Asset');

// A ticket can have multiple base assets (source photos)
Ticket.belongsToMany(Asset, { as: 'baseAssets', through: 'TicketBaseAssets' });
Asset.belongsToMany(Ticket, { through: 'TicketBaseAssets' });

// A ticket has one result asset (the final recoloured photo)
Ticket.belongsTo(Asset, { as: 'resultAsset', foreignKey: 'resultAssetId' });

module.exports = {
    Ticket,
    Asset
};
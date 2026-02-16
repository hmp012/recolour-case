const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Ticket = require('./Ticket');
const Asset = require('./Asset');

// Explicitly define the junction model to avoid default unique constraints
const TicketBaseAssets = sequelize.define('TicketBaseAssets', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, { timestamps: true });

// A ticket can have multiple base assets (source photos)
Ticket.belongsToMany(Asset, { 
    as: 'baseAssets', 
    through: TicketBaseAssets,
    uniqueKey: 'fkey_ticket_asset' // Ensures the unique constraint is on the pair, not just TicketId
});
Asset.belongsToMany(Ticket, { 
    through: TicketBaseAssets,
    uniqueKey: 'fkey_ticket_asset'
});

// A ticket has one result asset (the final recoloured photo)
Ticket.belongsTo(Asset, { as: 'resultAsset', foreignKey: 'resultAssetId' });

module.exports = {
    Ticket,
    Asset,
    TicketBaseAssets
};
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Asset = sequelize.define('Asset', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    type: {
        type: DataTypes.ENUM('Original', 'Recoloured'),
        defaultValue: 'Original'
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Asset;

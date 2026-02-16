const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    style: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Sent', 'In Progress', 'Completed', 'Rejected'),
        defaultValue: 'Pending'
    },
    priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High'),
        defaultValue: 'Medium'
    },
    referenceCode: {
        type: DataTypes.STRING
    },
    partner: {
        type: DataTypes.STRING
    },
    targetColor: {
        type: DataTypes.STRING
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Ticket;

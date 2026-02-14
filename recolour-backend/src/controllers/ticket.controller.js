const { Ticket, Asset } = require('../database/models');

exports.createTicket = async (req, res) => {
    try {
        const { style, priority, referenceCode, baseAssetId } = req.body;
        const ticket = await Ticket.create({ style, priority, referenceCode, baseAssetId });
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create ticket: ' + error.message });
    }
};

exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.findAll({ 
            include: [
                { model: Asset, as: 'baseAsset' },
                { model: Asset, as: 'resultAsset' }
            ] 
        });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tickets: ' + error.message });
    }
};

exports.getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.id, { 
            include: [
                { model: Asset, as: 'baseAsset' },
                { model: Asset, as: 'resultAsset' }
            ] 
        });
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve ticket: ' + error.message });
    }
};
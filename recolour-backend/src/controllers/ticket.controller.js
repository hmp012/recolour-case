const { Ticket, Asset } = require('../database/models');
const sequelize = require('../database/db');

exports.createTicket = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { style, priority, referenceCode, baseAssetIds, partner, targetColor } = req.body;
        const ticket = await Ticket.create(
            { style, priority, referenceCode, partner, targetColor },
            { transaction: t }
        );
        
        if (baseAssetIds && baseAssetIds.length > 0) {
            // Find the assets first to ensure they exist
            const assets = await Asset.findAll({
                where: { id: baseAssetIds },
                transaction: t
            });
            
            if (assets.length > 0) {
                await ticket.setBaseAssets(assets, { transaction: t });
            }
        }
        
        await t.commit();
        res.status(201).json(ticket);
    } catch (error) {
        await t.rollback();
        console.error('Ticket Creation Error:', error);
        res.status(500).json({ error: 'Failed to create ticket: ' + error.message });
    }
};

exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.findAll({ 
            include: [
                { model: Asset, as: 'baseAssets' },
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

exports.updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.id);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        const { status, priority, isApproved, resultAssetId } = req.body;

        // Logic for Requirement 4: "reject to return to queue"
        // If the admin sets status to Rejected, we might want to reset approval
        await ticket.update({
            status: status || ticket.status,
            priority: priority || ticket.priority,
            isApproved: isApproved !== undefined ? isApproved : ticket.isApproved,
            resultAssetId: resultAssetId || ticket.resultAssetId
        });

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update ticket: ' + error.message });
    }
};
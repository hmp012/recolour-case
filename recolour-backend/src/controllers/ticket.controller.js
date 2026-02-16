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
        const ticket = await Ticket.findByPk(req.params.id, {
            include: [{ model: Asset, as: 'baseAssets' }]
        });
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        const { status, priority, isApproved, resultAssetId } = req.body;

        let effectiveResultAssetId = resultAssetId || ticket.resultAssetId;
        
        // Simulation: If status is 'Completed' (or transitioning to it) and there's no result asset
        if ((status === 'Completed' || (ticket.status === 'Completed' && !status)) && !effectiveResultAssetId && ticket.baseAssets && ticket.baseAssets.length > 0) {
            const baseAsset = ticket.baseAssets[0];
            const resultPath = baseAsset.filePath.replace('.jpg', '_recoloured.jpg');
            
            try {
                // Find or create the recoloured asset
                let [resultAsset] = await Asset.findOrCreate({
                    where: { filePath: resultPath },
                    defaults: {
                        type: 'Recoloured',
                        isApproved: isApproved === true // Approve immediately if the ticket is being approved
                    }
                });
                effectiveResultAssetId = resultAsset.id;
            } catch (err) {
                console.error('Error creating simulated result asset:', err);
            }
        }

        await ticket.update({
            status: status || ticket.status,
            priority: priority || ticket.priority,
            isApproved: isApproved !== undefined ? isApproved : ticket.isApproved,
            resultAssetId: effectiveResultAssetId
        });

        // Requirement 4: If ticket is approved, ensure the result asset is also approved
        if (isApproved === true && effectiveResultAssetId) {
            await Asset.update({ isApproved: true }, { where: { id: effectiveResultAssetId } });
        } else if (isApproved === false && effectiveResultAssetId) {
            await Asset.update({ isApproved: false }, { where: { id: effectiveResultAssetId } });
        }

        res.json(ticket);

        // Requirement 4: If ticket is approved, also approve the result asset
        if (isApproved === true && ticket.resultAssetId) {
            const resultAsset = await Asset.findByPk(ticket.resultAssetId);
            if (resultAsset) {
                await resultAsset.update({ isApproved: true });
            }
        } else if (isApproved === false && ticket.resultAssetId) {
            // If explicitly rejected/unapproved, unapprove the asset too
            const resultAsset = await Asset.findByPk(ticket.resultAssetId);
            if (resultAsset) {
                await resultAsset.update({ isApproved: false });
            }
        }

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update ticket: ' + error.message });
    }
};
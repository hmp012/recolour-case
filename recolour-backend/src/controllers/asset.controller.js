const { Asset, Ticket } = require('../database/models');

/**
 * Get all assets
 * Optional query param: type (Original, Recoloured), isApproved
 */
exports.getAllAssets = async (req, res) => {
    try {
        const { type, isApproved } = req.query;
        const whereClause = {};
        if (type) whereClause.type = type;
        if (isApproved !== undefined) whereClause.isApproved = isApproved === 'true';
        
        const assets = await Asset.findAll({
            where: whereClause,
            include: [
                { model: Ticket, as: 'ticket' }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        res.json(assets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve assets: ' + error.message });
    }
};

/**
 * Get asset by ID
 */
exports.getAssetById = async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id);
        if (!asset) return res.status(404).json({ error: 'Asset not found' });
        res.json(asset);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve asset: ' + error.message });
    }
};

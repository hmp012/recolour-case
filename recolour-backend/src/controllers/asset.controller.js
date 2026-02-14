const { Asset } = require('../database/models');

/**
 * Get all assets
 * Optional query param: type (Original, Recoloured)
 */
exports.getAllAssets = async (req, res) => {
    try {
        const { type } = req.query;
        const whereClause = type ? { type } : {};
        
        const assets = await Asset.findAll({
            where: whereClause,
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

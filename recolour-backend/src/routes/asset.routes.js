const express = require('express');
const router = express.Router();
const assetController = require('../controllers/asset.controller');

/**
 * @openapi
 * tags:
 *   name: Assets
 *   description: Library of original and recoloured photos
 * components:
 *  schemas:
 *     Asset:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         filePath:
 *           type: string
 *         type:
 *           type: string
 *           enum: [Original, Recoloured]
 *       required:
 *         - filePath
 */

/**
 * @openapi
 * /assets:
 *   get:
 *     summary: Get all assets
 *     tags: [Assets]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Original, Recoloured]
 *         description: Filter assets by type
 *     responses:
 *       '200':
 *         description: List of assets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asset'
 */
router.get('/', assetController.getAllAssets);

/**
 * @openapi
 * /assets/{id}:
 *   get:
 *     summary: Get asset by ID
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: Asset retrieved successfully
 *       '404':
 *         description: Asset not found
 */
router.get('/:id', assetController.getAssetById);

module.exports = router;

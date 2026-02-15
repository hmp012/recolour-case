const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');

/**
 * @openapi
 * tags:
 *   name: Tickets
 *   description: API for managing recolouring tickets
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         style:
 *           type: string
 *         status:
 *           type: string
 *           enum: [Pending, Sent, In Progress, Completed, Rejected]
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *         referenceCode:
 *           type: string
 *         isApproved:
 *           type: boolean
 *         baseAssetId:
 *           type: string
 *           format: uuid
 *         resultAssetId:
 *           type: string
 *           format: uuid
 *       required:
 *         - style
 *         - priority
 */

/**
 * @openapi
 * /tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       '201':
 *         description: Ticket created successfully
 *       '500':
 *         description: Failed to create ticket
 */
router.post('/', ticketController.createTicket);

/**
 * @openapi
 * /tickets:
 *   get:
 *     summary: Get all tickets
 *     tags: [Tickets]
 *     responses:
 *       '200':
 *         description: List of all tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       '500':
 *         description: Failed to retrieve tickets
*/
router.get('/', ticketController.getAllTickets);

/**
 * @openapi
 * /tickets/{id}:
 *   get:
 *     summary: Get ticket by ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ticket ID
 *     responses:
 *       '200':
 *         description: Ticket retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       '404':
 *         description: Ticket not found
 *       '500':
 *         description: Failed to retrieve ticket
 */
router.get('/:id', ticketController.getTicketById);

/**
 * @openapi
 * /tickets/{id}:
 *   patch:
 *     summary: Update a ticket (Status, Priority, Approval)
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Sent, In Progress, Completed, Rejected]
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *               isApproved:
 *                 type: boolean
 *               resultAssetId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       '200':
 *         description: Ticket updated successfully
 *       '404':
 *         description: Ticket not found
 */
router.patch('/:id', ticketController.updateTicket);

module.exports = router;
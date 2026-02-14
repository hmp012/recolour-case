const sequelize = require('./db');
const { Asset } = require('./models');
const fs = require('fs');
const path = require('path');

const seed = async () => {
    try {
        await sequelize.sync();
        
        // Define the path to the assets (relative to this script)
        const caseDir = path.join(__dirname, '../../../recolour-case');
        
        const tickets = ['Ticket 1', 'Ticket 2', 'Ticket 3', 'Ticket 4'];
        let count = 0;

        for (const ticket of tickets) {
            const ticketPath = path.join(caseDir, ticket);
            if (!fs.existsSync(ticketPath)) continue;

            const files = fs.readdirSync(ticketPath);
            for (const file of files) {
                if (file.toLowerCase().endsWith('.jpg')) {
                    // We store the relative path from the project root for portability
                    const relativePath = path.join('recolour-case', ticket, file);
                    
                    const [asset, created] = await Asset.findOrCreate({
                        where: { filePath: relativePath },
                        defaults: { type: 'Original' }
                    });

                    if (created) count++;
                }
            }
        }

        console.log(`Successfully seeded ${count} new assets into the library.`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding assets:', error);
        process.exit(1);
    }
};

seed();

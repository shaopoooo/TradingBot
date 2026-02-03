const logger = require('../src/utils/Logger');
const fs = require('fs');
const path = require('path');

describe('Logger Utility', () => {
    const logDir = path.join(__dirname, '../logs');

    test('Should create log files and write content', (done) => {
        const testMessage = `Test Log Entry ${Date.now()}`;

        logger.info(testMessage);
        logger.error('Test Error Entry');

        // Allow some time for winston async write
        setTimeout(() => {
            try {
                const files = fs.readdirSync(logDir);

                const appLog = files.find(f => f.startsWith('application-'));
                const errorLog = files.find(f => f.startsWith('error-'));

                expect(appLog).toBeDefined();
                expect(errorLog).toBeDefined();

                const appLogContent = fs.readFileSync(path.join(logDir, appLog), 'utf8');
                expect(appLogContent).toContain(testMessage);

                done();
            } catch (error) {
                done(error);
            }
        }, 1000);
    });
});

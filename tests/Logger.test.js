const logger = require('../src/utils/Logger');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Running Verification: Logger.js');

try {
    // 1. Log a test message
    const testMessage = `Test Log Entry ${Date.now()}`;
    logger.info(testMessage);
    logger.error('Test Error Entry');

    // 2. Allow some time for the file stream to flush
    setTimeout(() => {
        try {
            // 3. Verify log files creation
            const logDir = path.join(__dirname, '../logs');
            const files = fs.readdirSync(logDir);

            console.log('Log files found:', files);

            // Should have at least one application log and potentially an error log
            const appLog = files.find(f => f.startsWith('application-'));
            const errorLog = files.find(f => f.startsWith('error-'));

            assert.ok(appLog, 'Application log file should be created');
            assert.ok(errorLog, 'Error log file should be created');

            console.log('PASS: Log file creation');

            // 4. Verify content in application log
            const appLogContent = fs.readFileSync(path.join(logDir, appLog), 'utf8');
            assert.ok(appLogContent.includes(testMessage), 'Log content should include test message');
            console.log('PASS: Log content verification');

            console.log('Verification SUCCESS');
        } catch (innerErr) {
            console.error('Verification FAILED during file check');
            console.error(innerErr);
            process.exit(1);
        }
    }, 1000); // Wait 1 sec for winston async write

} catch (err) {
    console.error('Verification FAILED');
    console.error(err);
    process.exit(1);
}

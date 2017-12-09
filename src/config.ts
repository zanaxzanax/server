const config = require('./config.json');

export default config as {
    jwtSecret: string;
    clientName: string;
    fieldResolutionX: number;
    fieldResolutionY: number;
};

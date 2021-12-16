// Custom class for error handling, customised message and status
class ExpressError extends Error {
    constructor(message, status){
        super();
        this.message = message;
        this.status = status;
    }
}

module.exports = ExpressError;
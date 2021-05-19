class RadioError extends Error{
    constructor(message, status, type) {
        super(message);
        this.status = status;
        this.type = type;
        console.log('RadioError');
    }
}

module.exports = {RadioError};
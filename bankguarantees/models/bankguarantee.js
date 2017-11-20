class BankGuarantee {
    constructor(id, type) {
        this.id = id;
        this.type = type;
        this._fsm();
    }
}
module.exports = BankGuarantee;
export default class Event {
    constructor(id, name, underageFlag=false, price = null) {
        this.id = id;
        this.name = name;
        this.allowUnderage = underageFlag;
        this.price = price;
        this.clients = [];
    }
}

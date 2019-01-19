export default class Event {
    constructor(id, name, underageFlag=false) {
        this.id = id;
        this.name = name;
        this.allowUnderage = underageFlag;
        this.clients = [];
    }
}

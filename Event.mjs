export default class {
    constructor(id, name, underageFlag = false, price = null, clients = []) {
        this.id = id;
        this.name = name;
        this.allowUnderage = underageFlag;
        this.price = price;
        this.clients = clients;
        this.date = null;
        this.archived = false;
        this.rating = 0;
        this.ratingsCount = 0;
    }
    //
    // static jsonMap(json) {
    //     return Object.assign(new Event(), json);
    // }
    //
    // set archived(state) {
    //     if (state) {
    //         this._name = '~' + this._name;
    //         this._archived = state;
    //         console.log('Event archived successfully');
    //     }
    // }
    //
    // set rating(rating) {
    //     if (this._archived && rating > 0 && rating < 11) {
    //         this._rating += rating;
    //         this._ratingsCount++;
    //     }
    // }
    //
    // get rating() {
    //     let avgRating = this._rating / this._ratingsCount;
    //     return ((avgRating * 0.1) * 6).toFixed(2);
    // }
    //
    // get underageFlag() {
    //     return this._underageFlag;
    // }
    //
    //
    // get price() {
    //     return this._price;
    // }
    //
    // printEvent() {
    //     let underAgeStatus = this._allowUnderage ? ': Open' : ': 18+';
    //     let price = this._price ? this._price : 'Free';
    //     let archived = this._archived ? 'Yes' : 'No';
    //     console.log(
    //         'Id: ' + this._id + '\n' +
    //         'Name: ' + this._name + underAgeStatus + '\n' +
    //         'Price: ' + price + '\n' +
    //         'Clients signed: ' + this._clients.length + '\n' +
    //         'Archived: ' + archived + '\n' +
    //         'Rating: ' + this.rating
    //     );
    // }
    //
    // updateEvent(name, underageFlag, price) {
    //     this._name = name;
    //     this._allowUnderage = underageFlag;
    //     this._price = price;
    // }

}

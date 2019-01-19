import fs from 'fs';

class SaveHandler {
    static save(data) {
        fs.writeFile("data/data.json", data, function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
}

export default SaveHandler;
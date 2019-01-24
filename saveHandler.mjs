import fs from 'fs';

class SaveHandler {
    static save(filename, data) {
        fs.writeFile(filename, JSON.stringify(data), function(err) {
            if (err) {
                console.log(err);
            }
            console.log('Saved successfully!');
        });
    }
}

export default SaveHandler;
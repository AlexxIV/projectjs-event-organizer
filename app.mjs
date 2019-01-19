import Event from './Event';
import Client from './Client';
import data from './data/data';
import SaveHandler from './saveHandler';

function getSingleEvent(input, id) {
    return input.find(e => e.id === id)
}

function listAllEvents(input) {
    input.forEach((event) => {
        let name = event.name;
        let restriction = event.allowUnderage ? 'open' : '18+';

        console.log(name + ': ' + restriction);
    });
}

function deleteEventById(input, id) {
    let found = getSingleEvent(input, id);
    if (found) {
        input.splice(id - 1, 1);
        console.log(`Event with id: ${id} deleted successfully`);
        return;
    }
    console.log(`Cannot find event with id: ${id}`);
}

function createEvent(input, eventName, underageFlag = false) {
    let lastElm = [...input].pop();
    let latestId = lastElm.id;
    latestId++;

    if (eventName !== undefined) {
        let evn = new Event(latestId, eventName, underageFlag);
        console.log(`Created event: ${eventName}`);
        input.push(JSON.parse(JSON.stringify(evn)));
        return;
    }
    console.log('The event name cannot be empty!');
}

function updateEvent(input, id, newName, newFlag=false) {
    let found = getSingleEvent(input, id);
    let index = input.indexOf(found);
    if (found) {
        if (newName !== undefined && typeof newName === 'string') {
            found.name = newName;
            found.allowUnderage = newFlag;

            input[index] = found;
            console.log(`Event updated successfully`);
            return;
        }
        console.log('The event name cannot be empty!');
        return;
    }
    console.log(`Event with id: ${id} does not exists`);
}

function registerClientToEvent(event, client){
    if (event.allowUnderage || client.age >= 18) {
        event.clients.push(client);
        console.log('Client successfully signed for the event');
        return
    }
    console.log('The client is underage and cannot participate in the event!');
}

function listAllClients(event, filters = null) {
    if (filters) {
        event
            .clients
            .forEach((client) => {
            Object
                .keys(filters)
                .forEach((filter) => {
                if (client[filter] === filters[filter]) {
                    console.log(client);
                }
            })
        })
    } else {
        event.clients.forEach((client) => {
            console.log(client);
        })
    }
}

function removeClientFromEvent(event, client) {
    let clientToRemove = event.clients.find(c => c.id === client.id);

    if (clientToRemove) {
        let index = event.clients.indexOf(clientToRemove);
        event.clients.splice(index, 1);
        console.log(`Client with id: ${client.id} removed successfully`);
        return
    }
    console.log(`Cannot find client with id: ${client.id} signed for the event`);
}

function checkLockedStatus(input) {
    return input.isLocked;
}

function changeLockedStatus(input, locked) {
    return input.isLocked = locked;
}

//listAllClients(data.Events[0], {gender: 'female'});


// listAllEvents(data.Events);
// createEvent(data.Events, 'Test13', true);
// updateEvent(data.Events, 1, 'Test', true);
// deleteEventById(data.Events, 10);
// registerClient(data.Events[0], data.Clients[7]);
//removeClientFromEvent(data.events[0], data.events[0].clients[1]);
// changeLockedStatus(data,true);



// SaveHandler.save(JSON.stringify(data));


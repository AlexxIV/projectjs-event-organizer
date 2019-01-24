import Event from './Event';
import Client from './Client';
import events from './data/events';
import clients from './data/clients';

// Save function for 1. saves the current list to json file
import SaveHandler from './saveHandler';


// Helpers
function getSingleEvent(input, id) {
    return input.find(e => e.id === id)
}

function createClient(input, name, gender, age, moneyInWallet = 0) {
    if (name && gender && age) {
        let lastElm = [...input].pop() || null;
        let latestId = 0;
        if (lastElm) {
            latestId = lastElm.id + 1;
        }
        let client = new Client(latestId, name, gender, age, moneyInWallet);
        console.log('Client created successfully!');
        input.push(client);
        return;
    }
    console.log('Missing required fields for client creation');
}

function stringToDate(dateStr) {
    const [day, month, year] = dateStr.split("/");
    return new Date(year, month - 1, day)
}

// 2.
function listAllEvents(input) {
    input.forEach((event) => {
        let name = event.name;
        let restriction = event.allowUnderage ? 'open' : '18+';
        let paid = event.price ? '$' : '!';

        console.log(paid + name + ': ' + restriction);
    });
}

// 3.
function deleteEventById(input, id) {
    let found = getSingleEvent(input, id);
    if (found) {
        input.splice(id - 1, 1);
        console.log(`Event with id: ${id} deleted successfully`);
        return;
    }
    console.log(`Cannot find event with id: ${id}`);
}

// 4.
function createEvent(input, eventName, underageFlag = false, price = null) {
    if (!checkLockedStatus(input)) {
        let lastElm = [...input].pop() || null;
        let latestId = 0;
        if (lastElm) {
            latestId = lastElm.id + 1;
        }
        if (eventName !== undefined) {
            let evn = new Event(latestId, eventName, underageFlag, price);
            console.log(`Created event: ${eventName}`);
            input.push(evn);
            return;
        }
        console.log('The event name cannot be empty!');
        return;
    }
    console.log('You cannot add new event the system is locked!');
}

// 5.
function updateEvent(input, id, newName, newFlag = false) {
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

// 6.
function registerClientToEvent(event, client) {
    if (event.allowUnderage || client.age >= 18) {
        if (event.price && !client.vipStatus) {
            if (event.price > client.wallet) {
                console.log('The client does not have enough money');
                return;
            }
            client.wallet -= event.price;
        }

        event.clients.push(client.id);
        client.eventsVisited.push(event.id);

        if (client.vipStatus) {
            client.vipStatus = false;
        }
        if (client.eventsVisited.length > 0 && client.eventsVisited.length % 5 === 0) {
            client.vipStatus = true;
        }
        console.log('Client successfully signed for the event');
        return
    }
    console.log('The client is underage and cannot participate in the event!');
}

// 7.
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

// 8.
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

// 1.1
function checkLockedStatus(input) {
    return input.isLocked;
}

// 1.1
function changeLockedStatus(input, locked) {
    return input.isLocked = locked;
}

// 1.2
function setEventDate(event, date) {
    event.date = stringToDate(date);
    console.log(event.date);
}

// 1.3
function listEventWithMostClients(events) {
    let eventsWithClients = events.filter((event) => event.clients.length > 0);
    if (!eventsWithClients) {
        console.log('There are no events with clients signed');
    } else {
        if (eventsWithClients.length > 1) {
            console.log(eventsWithClients.reduce((prev, current) => (prev.clients > current.clients) ? prev : current, 0));
        } else {
            console.log(eventsWithClients[0]);
        }
    }
}

// 1.4
function listEventsSuitableForUnderaged(events) {
    let result = events.filter(event => event.allowUnderage === true);
    console.log(result);
}

// 1.5
function listAllEventsGroupedByUnderagedFlag(events) {
    let underageResultsMapped = events.filter(event => event.allowUnderage === true)
        .map(element => `#` + element.name);
    let overageResultsMapped = events.filter(event => event.allowUnderage === false)
        .map(element => '*' + element.name);
    console.log([...underageResultsMapped, ...overageResultsMapped]);
}

// 1.6
function filterEvents(events, filters) {
    return events.filter((event) => {
        let match = true;
        Object.keys(filters).forEach((filter) => {
            if (event[filter] !== filters[filter]) {
                match = false;
            }
        });
        if (match) {
            console.log(event);
        }
    })
}


// createEvent(events.events, 'Party', true, 20);
// createClient(clients.clients, 'Alex', 'male', 20, 1000);

// createEvent(events.events, 'NewParty', false, 100);
// createEvent(events.events, 'TomorrowLand', false, 200);
// createEvent(events.events, 'SelksiSabor', true, 2);
// createEvent(events.events, 'Parteee', true, 5);
//
// registerClientToEvent(events.events[2], clients.clients[0]);
// registerClientToEvent(events.events[3], clients.clients[0]);
registerClientToEvent(events.events[5], clients.clients[0]);
//
SaveHandler.save('data/events.json', events);
SaveHandler.save('data/clients.json', clients);




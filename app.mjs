// 1.
import Event from './Event';
import Client from './Client';

// Import data from the json file
import data from './data/data';
// Import the save function
import SaveHandler from './SaveHandler';

// Split the data into variables
let events = data.events;
let clients = data.clients;
let status = data.isLocked;
///////////////////////////////////

// Define some helper functions
function saveData() {
    data.isLocked = status;
    data.events = events;
    data.clients = clients;

    SaveHandler.save('data/data.json', data);
}
function listEventProperties(event) {
    console.log(`Event id: ${event.id}`);
    console.log(`Event name: ${event.price ? '$' : '!'}${event.name}`);
    console.log(`Event age restriction: ${event.allowUnderage ? `Open` : `18+`}`);
    console.log(`Event price: ${event.price}`);
    console.log(`Event clients signed: ${event.clients.length}`);
    console.log(`Event date: ${event.date}`);
    console.log(`Event archived: ${event.archived ? `Yes` : `No`}`);
    if (event.rating !== 0) {
        console.log(`Event rating: ${(((event.rating / event.ratingsCount) * 0.1) * 6).toFixed(2)}`)
    } else {
        console.log('Event rating: Update pending');
    }
    console.log('==============================');
}
function getSingleItemById(input, id) {
    return input.find(elm => elm.id === id)
}
function stringToDate(dateStr) {
    const [day, month, year] = dateStr.split("/");
    return new Date(Date.UTC(year, month - 1, day))
}
function createClient(input, name, gender, age, moneyInWallet = 0) {
    if (!checkLockedStatus()) {
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
    } else {
        console.log('The system is locked');
    }
}

// 2.
function listAllEvents(events, archived = null) {
    if (archived !== null) {
        console.log(`All events which ${archived ? 'are' : 'are not'} archived from db`);
        events.filter(event => event.archived === archived).forEach(event => {
            listEventProperties(event);
        })
    } else {
        console.log('All events in db: ');
        events.forEach((event) => {
            listEventProperties(event);
        });
    }
}

// 3.
function deleteEventById(events, id) {
    let found = getSingleItemById(events, id);
    if (found) {
        events.splice(id, 1);
        console.log(`Event with id: ${id} deleted successfully`);
        return;
    }
    console.log(`Cannot find event with id: ${id}`);
}

// 4.
function createEvent(input, eventName, underageFlag = false, price = null) {
    if (!checkLockedStatus()) {
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
function updateEvent(input, id, newName, newFlag, newPrice) {
    let found = getSingleItemById(input, id);
    if (found) {
        let index = input.indexOf(found);
        if (newName !== undefined &&
            typeof newName === 'string' &&
            newFlag !== undefined &&
            newPrice !== undefined) {
            found.name = newName;
            found.allowUnderage = newFlag;
            found.price = newPrice;
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
    if (!checkLockedStatus()) {
        if (!event.archived) {
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
        } else {
            console.log('The event is archived');
        }
    } else {
        console.log('The system is locked');
    }
}

// 7.
function listAllClients(event, clients, filters = null) {
    if (event.clients.length > 0) {
        if (filters) {
            event
                .clients
                .forEach((id) => {
                    let client = getSingleItemById(clients, id);
                    if (client) {
                        Object
                            .keys(filters)
                            .forEach((filter) => {
                                if (client[filter] === filters[filter]) {
                                    console.log(client);
                                }
                            })
                    }
                })
        } else {
            event.clients.forEach((id) => {
                let client = getSingleItemById(clients, id);
                console.log(client);
            })
        }
    } else {
        console.log('There are no clients signed for this event');
    }
}

// 8.
function removeClientFromEvent(event, client) {

    let clientToRemoveIndex = event.clients.find(id => id === client.id);
    if (clientToRemoveIndex !== undefined) {
        let clientToRemove = getSingleItemById(clients, clientToRemoveIndex);
        if (clientToRemove) {
            event.clients.splice(clientToRemoveIndex, 1);
            let eventIndex = client.eventsVisited.indexOf(event.id);
            client.eventsVisited.splice(eventIndex, 1);
            console.log(`Client with id: ${client.id} removed successfully`);
            return
        }
    }
    console.log(`Cannot find client with id: ${client.id} signed for the event`);
}

// 1.1
function checkLockedStatus() {
    return status;
}
function lockSystem() {
    status = true;
    console.log('The system is locked');
}
function unlockSystem() {
    status = false;
    console.log('The system is unlocked');
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
            listEventProperties(eventsWithClients.reduce((prev, current) => (prev.clients > current.clients) ? prev : current, 0));
        } else {
            listEventProperties(eventsWithClients[0]);
        }
    }
}

// 1.4
function listEventsSuitableForUnderaged(events) {
    let result = events.filter(event => event.allowUnderage === true);
    result.forEach(event => {
        listEventProperties(event);
    })
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
    events.filter((event) => {
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

// 3.1
function archiveEvent(event) {
    event.archived = true;
    event.name = '~' + event.name;
}

// 3.4
function earningsFromEvent(event) {
    if (event && event.archived) {
        if (event.price !== null && event.clients.length > 0) {
            console.log(event.clients.length * event.price + '$');
        } else {
            console.log('The event was free or no clients where signed');
        }
    } else {
        console.log('The event is not archived yet');
    }
}

// 3.5
function rateEvent(event,client, rating) {
    if (event.archived) {
        if (event.clients.indexOf(client.id) !== -1) {
            if (rating > 0 && rating < 11) {
                event.rating += rating;
                event.ratingsCount++;
                console.log('Thank you for your rating!');
            } else {
                console.log('Please enter valid rating [1-10]');
            }
        } else {
            console.log('The client was not signed for the event');
        }
    } else {
        console.log('The event is not archived yet');
    }
}


// //Test 1
// //List all events
//listAllEvents(events);

// //Test 2
// //Delete event by id
// deleteEventById(events, 1);
// saveData();

// //Test 3
// //Create new event
// createEvent(events, 'TestEvent', false, 20);
// saveData();

// //Test 4
// //Edit event by id
// updateEvent(events, 0, 'EditedName', false, 200);
// saveData();

// //Test 5
// //Register client for event
// registerClientToEvent(events[0],clients[1]);
// registerClientToEvent(events[1],clients[1]);
// saveData();

// //Test 6
// //List all clients for event
// listAllClients(events[0],clients);
// //List all female clients
// listAllClients(events[0],clients, {gender: 'female'});

// //Test 7
// //Remove client from event
// removeClientFromEvent(events[0],clients[1]);
// saveData();

// Test 8
// //Stop the creation of new events or clients signing.
// lockSystem();
// createEvent(events,'Test');

// //Test 9
// //Setting the current date of event
// setEventDate(events[0], '30/01/2019');
// saveData();

// //Test 10
// //List event with most clients signed
// listEventWithMostClients(events);

// //Test 11
// //List all events suitable for underaged visitors
// listEventsSuitableForUnderaged(events);

// //Test 12
// //List all events and group them if they are suitable for underaged
// listAllEventsGroupedByUnderagedFlag(events);

// //Test 13
// // List events by filter
// filterEvents(events, {allowUnderage: false});
// filterEvents(events, {name: "Party"});

// //Test 14
// //List all paid events with '$' before their name and '!' before free events
// listAllEvents(events);

// //Test 15
// //Test client wallet
// registerClientToEvent(events[0],clients[2]);
// saveData();
// registerClientToEvent(events[1],clients[2]);
// saveData();

// //Test 16
// //Test vip client
// registerClientToEvent(events[0],clients[3]);
// saveData();

// //Test 17
// //Test event archiving
// archiveEvent(events[0]);
// registerClientToEvent(events[0],clients[1]);
// saveData();

// //Test 18
// //Test the listing with filters
// //List all archived
// listAllEvents(events, true);
// //List all available
// listAllEvents(events, false);
// //List all
// listAllEvents(events);

// // Test 19
// // List earning from single event
// earningsFromEvent(events[2]);

// Test 20
// Rate event
// rateEvent(events[0],clients[3], 5);
// rateEvent(events[2],clients[3], 19);
// rateEvent(events[2],clients[3], 9);
// saveData();

// Test 21
// List events with rating
// listAllEvents(events);
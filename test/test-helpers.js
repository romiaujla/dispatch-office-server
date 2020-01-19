const bcrypt = require('bcryptjs');
const TEST_WAREHOUSES = 30;

function getLogins(){
    return [
        {
            "username": "new_user_01",
            "password" : "password",
        },
        {
            "username": "new_user_02",
            "password" : "password",
        },
        {
            "username": "new_user_03",
            "password" : "password",
        }
    ]
}

function makeUsersArray(){
    
    const userLogins = getLogins();
    let usersArray = [];
    for(let i = 0; i < userLogins.length; i++){
        usersArray.push({
            "username" : userLogins[i].username,
            "password" : '$2a$12$SMJzCwSwHENCV7/TG7p6Gev/mD2U6I9fWXaa9TSABCOUdz9GM5FAS',
            "company_name" : "New User Company",
            "full_name" : `new user ${i+1}`,
            "mc_num": `00000${i+1}`,
        })
    }
    return usersArray;
}

function makeEquipmentsArray() {
    return [
        { unit_num: '101', carrier_id: 1, status: 'active' },
        { unit_num: '102', carrier_id: 1, status: 'active' },
        { unit_num: '103', carrier_id: 1, status: 'active' },
        { unit_num: '104', carrier_id: 1, status: 'active' },
        { unit_num: '105', carrier_id: 1, status: 'active' },
        { unit_num: '106', carrier_id: 1, status: 'active' },
        { unit_num: '107', carrier_id: 2, status: 'active' },
        { unit_num: '108', carrier_id: 2, status: 'active' },
        { unit_num: '109', carrier_id: 2, status: 'active' },
        { unit_num: '110', carrier_id: 2, status: 'active' },
        { unit_num: '111', carrier_id: 2, status: 'active' },
        { unit_num: '112', carrier_id: 2, status: 'active' },
        { unit_num: '1001', carrier_id: 1, status: 'inactive' },
        { unit_num: '5145', carrier_id: 2, status: 'inactive' },
        { unit_num: '3333', carrier_id: 1, status: 'inactive' },
    ]
}

function makeDriversArray() {
    return [
        {full_name: 'Driver 01', pay_rate: 0.36, equipment_id: 1, carrier_id: 1},
        {full_name: 'Driver 02', pay_rate: 0.36, equipment_id: 2, carrier_id: 1},
        {full_name: 'Driver 03', pay_rate: 0.36, equipment_id: 3, carrier_id: 1},
        {full_name: 'Driver 04', pay_rate: 0.36, equipment_id: 4, carrier_id: 1},
        {full_name: 'Driver 05', pay_rate: 0.36, equipment_id: 5, carrier_id: 1},
        {full_name: 'Driver 07', pay_rate: 0.36, equipment_id: 6, carrier_id: 1},
        {full_name: 'Driver 08', pay_rate: 0.36, equipment_id: 7, carrier_id: 2},
        {full_name: 'Driver 09', pay_rate: 0.36, equipment_id: 8, carrier_id: 2},
        {full_name: 'Driver 10', pay_rate: 0.36, equipment_id: null, carrier_id: 1},
        {full_name: 'Driver 11', pay_rate: 0.36, equipment_id: null, carrier_id: 2},
        {full_name: 'Driver 12', pay_rate: 0.36, equipment_id: null, carrier_id: 2},
        {full_name: 'Driver 13', pay_rate: 0.36, equipment_id: null, carrier_id: 2},
    ]
}

function makeShipmentsArray(){
    return [
        {status: 'un-assigned', driver_id: null, pickup_warehouse: getRandomWarehouse(),  delivery_warehouse: getRandomWarehouse(), carrier_id: 1},
        {status: 'un-assigned', driver_id: null, pickup_warehouse: getRandomWarehouse(),  delivery_warehouse: getRandomWarehouse(), carrier_id: 1},
        {status: 'dispatched', driver_id: 2, pickup_warehouse: getRandomWarehouse(),  delivery_warehouse: getRandomWarehouse(), carrier_id: 1},
        {status: 'dispatched', driver_id: 1, pickup_warehouse: getRandomWarehouse(),  delivery_warehouse: getRandomWarehouse(), carrier_id: 1},
        {status: 'dispatched', driver_id: 4, pickup_warehouse: getRandomWarehouse(),  delivery_warehouse: getRandomWarehouse(), carrier_id: 1},
        {status: 'loading', driver_id: 8, pickup_warehouse: getRandomWarehouse(),  delivery_warehouse: getRandomWarehouse(), carrier_id: 2},
        {status: 'loading', driver_id: 7, pickup_warehouse: getRandomWarehouse(),  delivery_warehouse: getRandomWarehouse(), carrier_id: 2},
        {status: 'in transit', driver_id: 6, pickup_warehouse: getRandomWarehouse(),  delivery_warehouse: getRandomWarehouse(), carrier_id: 1},
        {status: 'in transit', driver_id: 3, pickup_warehouse: getRandomWarehouse(),  delivery_warehouse: getRandomWarehouse(), carrier_id: 1},
        {status: 'unloading', driver_id: 5, pickup_warehouse: getRandomWarehouse(),  delivery_warehouse: getRandomWarehouse(), carrier_id: 1},
        {status: 'completed', driver_id: 1, pickup_warehouse: getRandomWarehouse(),  delivery_warehouse: getRandomWarehouse(), carrier_id: 1},
        {status: 'completed', driver_id: 2, pickup_warehouse: getRandomWarehouse(),  delivery_warehouse: getRandomWarehouse(), carrier_id: 1},
        {status: 'completed', driver_id: 6, pickup_warehouse: getRandomWarehouse(),  delivery_warehouse: getRandomWarehouse(), carrier_id: 1},
        {status: 'un-assigned', driver_id: null, pickup_warehouse: getRandomWarehouse(),  delivery_warehouse: getRandomWarehouse(), carrier_id: 1},
        {status: 'un-assigned', driver_id: null, pickup_warehouse: getRandomWarehouse(),  delivery_warehouse: getRandomWarehouse(), carrier_id: 2},
        {status: 'un-assigned', driver_id: null, pickup_warehouse: getRandomWarehouse(),  delivery_warehouse: getRandomWarehouse(), carrier_id: 1},
    ];
}

function getRandomWarehouse(){
    return Math.floor(Math.random() * TEST_WAREHOUSES)+1;
}

function makeWarehousesArray(){
    let warehouses = [];
    for(let i = 0; i < TEST_WAREHOUSES; i++){
        warehouses.push({
            city: `City ${i}`,
            state: `ST`,
            zipcode: `0000${i < 10 ? `0${i}` : i}`,
        })
    }
    return warehouses;
}

function cleanTables(db){
    return db.raw(`
        TRUNCATE 
        shipments,
        warehouses,
        drivers,
        equipments,
        carriers
        RESTART IDENTITY CASCADE;
    `)
}

function splitArrayWithComma(arr){
    let tempArr = [...arr];
    let [lastWord, ...restOftheArray] = [
        tempArr.pop(),
        ...tempArr
    ]
    return `${restOftheArray.join(', ')} or ${lastWord}`;
}

module.exports = {
    makeUsersArray,
    cleanTables,
    getLogins,
    makeEquipmentsArray,
    makeDriversArray,
    makeShipmentsArray,
    makeWarehousesArray,
    splitArrayWithComma,
}
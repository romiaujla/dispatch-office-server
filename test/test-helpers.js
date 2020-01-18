const bcrypt = require('bcryptjs');

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
            "username" : getLogins()[i].username,
            "password" : '$2a$12$SMJzCwSwHENCV7/TG7p6Gev/mD2U6I9fWXaa9TSABCOUdz9GM5FAS',
            "company_name" : "New User Company",
            "full_name" : `new user ${i+1}`,
            "mc_num": `00000${i+1}`,
        })
    }
    return usersArray;
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

module.exports = {
    makeUsersArray,
    cleanTables,
    getLogins,
}
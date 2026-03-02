const pool = require('../db')

const findMatchingContacts = async (email, phoneNumber)=>{
    let query = 'SELECT * FROM Contact WHERE '
    let conditions = []
    let values = []

    if(email){
        conditions.push('email = ?');
        values.push(email);
    }
    if(phoneNumber){
        conditions.push('phoneNumber = ?');
        values.push(phoneNumber);
    }

    if (conditions.length === 0) return [];

    query += conditions.join(' OR ')

    const [rows] = await pool.execute(query, values);
    return rows;
}

const createContact = async(email, phoneNumber, linkedId=null, linkPrecedence='primary')=>{
    const query = 'INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence) VALUES(?, ?, ?, ?)'

    const [results] = await pool.execute(query, [email, phoneNumber, linkedId, linkPrecedence]);
    return results.insertId;
}

const updateToSecondary = async (contactIdToDemote, newPrimaryId) => {
    const query = `
        UPDATE Contact 
        SET linkedId = ?, linkPrecedence = 'secondary' 
        WHERE id = ? OR linkedId = ?
    `;

    await pool.execute(query, [newPrimaryId, contactIdToDemote, contactIdToDemote]);
};

const getAllLinkedContacts = async (primaryId) => {
    const query = `
        SELECT * FROM Contact 
        WHERE id = ? OR linkedId = ? 
        ORDER BY createdAt ASC
    `;
    
    const [rows] = await pool.execute(query, [primaryId, primaryId]);
    return rows;
};

module.exports = { 
    findMatchingContacts, 
    createContact,
    updateToSecondary,
    getAllLinkedContacts
};


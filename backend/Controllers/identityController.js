const { findMatchingContacts, createContact, updateToSecondary, getAllLinkedContacts } = require('../Models/identityModel');

const identifyContact = async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;

        if (!email && !phoneNumber) {
            return res.status(400).json({ error: "Email or phone number is required" });
        }

        const existingContacts = await findMatchingContacts(email, phoneNumber);

        // case 1 :- if the user is new 
        if (existingContacts.length === 0) {
            const newContactId = await createContact(email, phoneNumber, null, 'primary');

            return res.status(200).json({
                contact: {
                    primaryContatctId: newContactId,
                    emails: email ? [email] : [],
                    phoneNumbers: phoneNumber ? [phoneNumber] : [],
                    secondaryContactIds: [] 
                }
            });
        }
        
        // case 2 :- When the user already exist (have same email or phoneNumber)
        let primaryContactId = existingContacts[0].linkedId || existingContacts[0].id;
        
        for (const contact of existingContacts) {
            const rootId = contact.linkedId || contact.id;
            if (rootId < primaryContactId) {
                primaryContactId = rootId;
            }
        }

        const primaryIdsToDemote = new Set();
        for (const contact of existingContacts) {
            const rootId = contact.linkedId || contact.id;
            if (rootId !== primaryContactId) {
                primaryIdsToDemote.add(rootId);
            }
        }

        if (primaryIdsToDemote.size > 0) {
            for (const id of primaryIdsToDemote) {
                await updateToSecondary(id, primaryContactId);
            }
        }

        const emailIsNew = email && !existingContacts.some(c => c.email === email);
        const phoneIsNew = phoneNumber && !existingContacts.some(c => c.phoneNumber === phoneNumber);

        if (emailIsNew || phoneIsNew) {
            await createContact(email, phoneNumber, primaryContactId, 'secondary');
        }

        const allContactsCluster = await getAllLinkedContacts(primaryContactId);

        const emails = [];
        const phoneNumbers = [];
        const secondaryContactIds = [];

        allContactsCluster.forEach(contact => {
            if (contact.email && !emails.includes(contact.email)) {
                emails.push(contact.email);
            }

            if (contact.phoneNumber && !phoneNumbers.includes(contact.phoneNumber)) {
                phoneNumbers.push(contact.phoneNumber);
            }
        
            if (contact.id !== primaryContactId) {
                secondaryContactIds.push(contact.id);
            }
        });

        return res.status(200).json({
            contact: {
                primaryContactId: primaryContactId,
                emails: emails,
                phoneNumbers: phoneNumbers,
                secondaryContactIds: secondaryContactIds
            }
        });

    }

    catch (error) {
        console.error("Error in identifyContact:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { identifyContact };
'use strict';

const { getDatabase, resetDatabase } = require('../db');

const db = getDatabase();
resetDatabase(db);
console.log('Database wiped and re-seeded successfully.');

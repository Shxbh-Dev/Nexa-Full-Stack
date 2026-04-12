// backend/data/users.js

import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@NEXA.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Customer One',
    email: 'customer@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
];

export default users;
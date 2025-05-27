// models/user.js
const { DataTypes } = require('sequelize');
const {dbcon} = require('../DB/dbConn.js'); // Your dbcon instance

let Users;

const UserModel = async () => {
    // const sequelize = await dbcon();
    Users = dbcon.define('Users', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4], // Minimum length validation
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Default to false if not provided
    
  }
}, {
  // timestamps: true, // adds createdAt and updatedAt
  freezeTableName: true
});

    return Users;

}
// console.log(User === sequelize.models.User); 

module.exports = UserModel;

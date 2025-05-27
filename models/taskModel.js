const { DataTypes } = require('sequelize');
const {dbcon} = require('../DB/dbConn.js'); // Your dbcon instance

let Tasks;
const TaskModel = async () => {
    // const sequelize = await dbcon();
    Tasks = dbcon.define('Tasks', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending', // Default status
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // Name of the referenced table
                key: 'id' // Key in the referenced table
            },
            onUpdate: 'CASCADE', // Update the foreign key if the referenced key is updated
            onDelete: 'SET NULL', // Set the foreign key to NULL if the referenced key is deleted
        },
        timeSpent: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0, // Default time spent in minutes
            comment: 'Time spent on the task in minutes',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW, // Automatically set to current date
        }
    }, {
        freezeTableName: true
    });

    return Tasks;
}

module.exports = TaskModel;
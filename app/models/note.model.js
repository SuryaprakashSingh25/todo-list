module.exports = (sequelize, Sequelize) => {
    const Note = sequelize.define("notes", {
      task: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM,
        values: ['Pending','Done','Completed','Cancelled','Overdue'],
        defaultValue: 'Pending'
      },
      dueDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
    },
    { timestamps: false });
  
    return Note;
  };
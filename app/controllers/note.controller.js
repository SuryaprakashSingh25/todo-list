const db = require("../models");
const config = require("../config/auth.config");
const Note = db.note;
const User = db.user;

exports.createTask = async (req, res) => {
  try {
    const { task, dueDate, user_id } = req.body;
    const note = await Note.create({
      task: task,
      dueDate: dueDate,
      user_id: user_id,
    });
    res.status(200).send({ note });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.readAllTasks = async (req, res) => {
  try {
    const notes = await Note.findAll({});
    res.status(200).send({ notes });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.readSingleTask = async (req, res) => {
  try {
    const note_id=req.params.note_id;
    
    let currentDate = new Date().toJSON().slice(0, 10);
    const note = await Note.findOne({
      where: {note_id:note_id} 
    },)
    if (!note) {
      return res.status(404).send({ message: "No Task Exist" });
    }
    if ((currentDate.valueOf() > note.dueDate.valueOf()) && note.status!='Done') {
      note.update({ status: "Overdue" },
      {where:{note_id:note_id}});
    }
    
    return res.status(200).send({ note });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const note_id=req.params.note_id;
    const { status, dueDate } = req.body;
    const note = await Note.update({
      status:status,
      dueDate:dueDate,
    },{
      where: {note_id:note_id} 
    });
    if (!note) {
      return res
        .status(404)
        .send({ message: "No Task Exist with the given id" });
    }
    return res.status(200).json({
        success: true,
      });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const note_id=req.params.note_id;
    const note = await Note.destroy({
      where: {note_id:note_id},
    });
    if (!note) {
      return res
        .status(404)
        .send({ message: "No Task Exist with the given id" });
    }
    res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

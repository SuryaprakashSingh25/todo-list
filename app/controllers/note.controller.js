const db = require("../models");
const config = require("../config/auth.config");
const Note = db.note;
const User = db.user;

exports.createTask = async (req, res) => {
  try {
    const note = await Note.create(req.body);
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
    let currentDate = new Date().toJSON().slice(0, 10);
    const note = await Note.findOne({
      where: {
        id: req.params.id,
      },
    });
    if(currentDate.toString<=note.dueDate.toString){
      note.update({status:'Overdue'})
    }
    await note.update({
      status: req.body.status,
    },
    {
      where: { id: req.params.id },
    })
    if (!note) {
      return res.status(404).send({ message: "No Task Exist" });
    }
    res.status(200).send({ note });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    let currentDate = new Date().toJSON().slice(0, 10);
    const note=await Note.findOne({
      where: {id: req.params.id}
    })
    if(currentDate.toString<=note.dueDate.toString && req.body.status!=='Overdue'){
      res.status(200).send({message: "The task is overdue at the current moment"})
      return;
    }
    await note.update({
      status: req.body.status,
    },
    {
      where: { id: req.params.id },
    })
    if (!note) {
      return res
        .status(404)
        .send({ message: "No Task Exist with the given id" });
    }
    
    res.status(200).json({
      success: true,
  });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const note = await Note.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!note) {
      return res
        .status(404)
        .send({ message: "No Task Exist with the given id" });
    }
    res.status(200).json({ success: true, });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

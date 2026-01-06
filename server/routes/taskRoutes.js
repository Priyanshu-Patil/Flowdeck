import express from "express"
import { createTask, deleteTask, updateTask } from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.post('/', createTask)
taskRouter.put('/delete', deleteTask)
taskRouter.put('/:id', updateTask)

export default taskRouter
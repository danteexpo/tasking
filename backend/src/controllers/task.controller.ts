import { Request, Response } from 'express'
import {
    CreateTaskInput,
    UpdateTaskInput,
    ReadTaskInput,
    DeleteTaskInput,
} from '../schemas/task.schema'
import {
    createTask,
    deleteTask,
    findAndUpdateTask,
    findTask,
} from '../services/task.service'
import logger from '../utils/logger'

export async function createTaskHandler(
    req: Request<{}, {}, CreateTaskInput['body']>,
    res: Response
) {
    try {
        const userId = res.locals.user._id

        const body = req.body

        const task = await createTask({ ...body, user: userId })

        return res.send(task)
    } catch (error) {
        logger.error('Error creating task', error)
        res.status(500).send('An error occurred while creating the task')
    }
}

export async function updateTaskHandler(
    req: Request<UpdateTaskInput['params']>,
    res: Response
) {
    try {
        const userId = res.locals.user._id

        const _id = req.params._id
        const update = req.body

        const task = await findTask({ _id })

        if (!task) {
            return res.sendStatus(404)
        }

        if (String(task.user) !== userId) {
            return res.sendStatus(403)
        }

        const updatedTask = await findAndUpdateTask({ _id }, update, {
            new: true,
        })

        return res.send(updatedTask)
    } catch (error) {
        logger.error('Error updating task', error)
        res.status(500).send('An error occurred while updating the task')
    }
}

export async function getTaskHandler(
    req: Request<ReadTaskInput['params']>,
    res: Response
) {
    try {
        const _id = req.params._id
        const task = await findTask({ _id })

        if (!task) {
            return res.sendStatus(404)
        }

        return res.send(task)
    } catch (error) {
        logger.error('Error fetching task', error)
        res.status(500).send('An error occurred while fetching the task')
    }
}

export async function deleteTaskHandler(
    req: Request<DeleteTaskInput['params']>,
    res: Response
) {
    try {
        const userId = res.locals.user._id
        const _id = req.params._id

        const task = await findTask({ _id })

        if (!task) {
            return res.sendStatus(404)
        }

        if (String(task.user) !== userId) {
            return res.sendStatus(403)
        }

        await deleteTask({ _id })

        return res.sendStatus(200)
    } catch (error) {
        logger.error('Error deleting task', error)
        res.status(500).send('An error occurred while deleting the task')
    }
}

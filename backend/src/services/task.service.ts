import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
import TaskModel, { TaskDocument, TaskInput } from '../models/task.model'

export async function createTask(input: TaskInput) {
    try {
        const result = await TaskModel.create(input)
        return result
    } catch (e) {
        throw e
    }
}

export async function findTask(
    query: FilterQuery<TaskDocument>,
    options: QueryOptions = { lean: true }
) {
    try {
        const result = await TaskModel.findOne(query, {}, options)
        return result
    } catch (e) {
        throw e
    }
}

export async function findAndUpdateTask(
    query: FilterQuery<TaskDocument>,
    update: UpdateQuery<TaskDocument>,
    options: QueryOptions
) {
    return TaskModel.findOneAndUpdate(query, update, options)
}

export async function deleteTask(query: FilterQuery<TaskDocument>) {
    return TaskModel.deleteOne(query)
}

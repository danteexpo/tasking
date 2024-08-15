import { optional, object, date, string, TypeOf } from 'zod'

const payload = {
    body: object({
        title: string({
            required_error: 'Title is required',
        }),
        description: optional(string()),
        category: optional(string()),
        priority: optional(string()),
        status: optional(string()),
        dueAt: optional(date()),
    }),
}

const params = {
    params: object({
        _id: string({
            required_error: '_id is required',
        }),
    }),
}

export const createTaskSchema = object({
    ...payload,
})

export const updateTaskSchema = object({
    ...payload,
    ...params,
})

export const deleteTaskSchema = object({
    ...params,
})

export const getTaskSchema = object({
    ...params,
})

export type CreateTaskInput = TypeOf<typeof createTaskSchema>
export type UpdateTaskInput = TypeOf<typeof updateTaskSchema>
export type ReadTaskInput = TypeOf<typeof getTaskSchema>
export type DeleteTaskInput = TypeOf<typeof deleteTaskSchema>

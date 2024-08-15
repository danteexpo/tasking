import { Express, Request, Response } from 'express'
import validateResource from './middleware/validateResource'
import requireUser from './middleware/requireUser'
import { createUserHandler } from './controllers/user.controller'
import { createUserSchema } from './schemas/user.schema'
import {
    createUserSessionHandler,
    getUserSessionsHandler,
    deleteSessionHandler,
} from './controllers/session.controller'
import { createSessionSchema } from './schemas/session.schema'
import {
    createTaskHandler,
    getTaskHandler,
    updateTaskHandler,
    deleteTaskHandler,
} from './controllers/task.controller'
import {
    createTaskSchema,
    getTaskSchema,
    updateTaskSchema,
    deleteTaskSchema,
} from './schemas/task.schema'

function routes(app: Express) {
    app.get('/healthcheck', (req: Request, res: Response) =>
        res.sendStatus(200)
    )

    app.post(
        '/api/users',
        validateResource(createUserSchema),
        createUserHandler
    )

    app.post(
        '/api/sessions',
        validateResource(createSessionSchema),
        createUserSessionHandler
    )

    app.get('/api/sessions', requireUser, getUserSessionsHandler)

    app.delete('/api/sessions', requireUser, deleteSessionHandler)

    app.post(
        '/api/tasks',
        [requireUser, validateResource(createTaskSchema)],
        createTaskHandler
    )

    app.get(
        '/api/tasks/:_id',
        [requireUser, validateResource(getTaskSchema)],
        getTaskHandler
    )

    app.put(
        '/api/tasks/:_id',
        [requireUser, validateResource(updateTaskSchema)],
        updateTaskHandler
    )

    app.delete(
        '/api/tasks/:_id',
        [requireUser, validateResource(deleteTaskSchema)],
        deleteTaskHandler
    )
}

export default routes

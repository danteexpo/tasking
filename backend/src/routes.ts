import { Express, Request, Response } from 'express'
import { createUserHandler } from './controllers/user.controller'
import { createTaskHandler, deleteTaskHandler, getTaskHandler, updateTaskHandler } from './controllers/task.controller'
import { createUserSessionHandler, getUserSessionsHandler, deleteSessionHandler } from './controllers/session.controller'
import validateResource from './middleware/validateResource'
import requireUser from './middleware/requireUser'
import { createUserSchema } from './schemas/user.schema'
import { createSessionSchema } from './schemas/session.schema'
import { createTaskSchema, deleteTaskSchema, getTaskSchema, updateTaskSchema } from './schemas/task.schema'

function routes(app: Express) {
	app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200))

	app.post('/api/users', validateResource(createUserSchema), createUserHandler)

	app.post('/api/sessions', validateResource(createSessionSchema), createUserSessionHandler)

	app.get('/api/sessions', requireUser, getUserSessionsHandler)

	app.delete('/api/sessions', requireUser, deleteSessionHandler)

	app.post('/api/tasks', [requireUser, validateResource(createTaskSchema)], createTaskHandler)

	app.get('/api/tasks/:taskId', validateResource(getTaskSchema), getTaskHandler)

	app.put('/api/tasks/:taskId', [requireUser, validateResource(updateTaskSchema)], updateTaskHandler)

	app.delete('/api/tasks/:taskId', [requireUser, validateResource(deleteTaskSchema)], deleteTaskHandler)
}

export default routes

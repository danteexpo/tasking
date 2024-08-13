import { Request, Response } from "express";
import {
	CreateTaskInput,
	UpdateTaskInput,
	ReadTaskInput,
	DeleteTaskInput
} from "../schemas/task.schema";
import {
	createTask,
	deleteTask,
	findAndUpdateTask,
	findTask,
} from "../services/task.service";

export async function createTaskHandler(
	req: Request<{}, {}, CreateTaskInput["body"]>,
	res: Response
) {
	const userId = res.locals.user._id;

	const body = req.body;

	const task = await createTask({ ...body, user: userId });

	return res.send(task);
}

export async function updateTaskHandler(
	req: Request<UpdateTaskInput["params"]>,
	res: Response
) {
	const userId = res.locals.user._id;

	const taskId = req.params.taskId;
	const update = req.body;

	const task = await findTask({ taskId });

	if (!task) {
		return res.sendStatus(404);
	}

	if (String(task.user) !== userId) {
		return res.sendStatus(403);
	}

	const updatedTask = await findAndUpdateTask({ taskId }, update, {
		new: true,
	});

	return res.send(updatedTask);
}

export async function getTaskHandler(
	req: Request<ReadTaskInput["params"]>,
	res: Response
) {
	const taskId = req.params.taskId;
	const task = await findTask({ taskId });

	if (!task) {
		return res.sendStatus(404);
	}

	return res.send(task);
}

export async function deleteTaskHandler(
	req: Request<DeleteTaskInput["params"]>,
	res: Response
) {
	const userId = res.locals.user._id;
	const taskId = req.params.taskId;

	const task = await findTask({ taskId });

	if (!task) {
		return res.sendStatus(404);
	}

	if (String(task.user) !== userId) {
		return res.sendStatus(403);
	}

	await deleteTask({ taskId });

	return res.sendStatus(200);
}

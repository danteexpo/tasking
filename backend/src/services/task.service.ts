import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import TaskModel, {
	TaskDocument,
	TaskInput,
} from "../models/task.model";
// import { databaseResponseTimeHistogram } from "../utils/metrics";

export async function createTask(input: TaskInput) {
	const metricsLabels = {
		operation: "createTask",
	};

	// const timer = databaseResponseTimeHistogram.startTimer();
	try {
		const result = await TaskModel.create(input);
		// timer({ ...metricsLabels, success: "true" });
		return result;
	} catch (e) {
		// timer({ ...metricsLabels, success: "false" });
		throw e;
	}
}

export async function findTask(
	query: FilterQuery<TaskDocument>,
	options: QueryOptions = { lean: true }
) {
	const metricsLabels = {
		operation: "findTask",
	};

	// const timer = databaseResponseTimeHistogram.startTimer();
	try {
		const result = await TaskModel.findOne(query, {}, options);
		// timer({ ...metricsLabels, success: "true" });
		return result;
	} catch (e) {
		// timer({ ...metricsLabels, success: "false" });

		throw e;
	}
}

export async function findAndUpdateTask(
	query: FilterQuery<TaskDocument>,
	update: UpdateQuery<TaskDocument>,
	options: QueryOptions
) {
	return TaskModel.findOneAndUpdate(query, update, options);
}

export async function deleteTask(query: FilterQuery<TaskDocument>) {
	return TaskModel.deleteOne(query);
}

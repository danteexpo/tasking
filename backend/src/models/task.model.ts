import mongoose from 'mongoose'
import { customAlphabet } from "nanoid";
import { UserDocument } from './user.model'

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface TaskInput {
	user: UserDocument["_id"];
	title: string;
	description?: string;
	category?: string;
	priority?: string;
	status?: string;
	dueAt?: Date;
}

export interface TaskDocument extends TaskInput, mongoose.Document {
	createdAt: Date;
	updatedAt: Date;
}

const taskSchema = new mongoose.Schema(
	{
		taskId: {
			type: String,
			required: true,
			unique: true,
			default: () => `task_${nanoid()}`,
		},
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		title: { type: String, required: true },
		description: { type: String, required: false },
		category: { type: String, required: false },
		priority: { type: String, required: false },
		status: { type: String, required: false },
		dueAt: { type: Date, required: false },
	},
	{
		timestamps: true,
	}
);

const TaskModel = mongoose.model<TaskDocument>("Task", taskSchema);

export default TaskModel;

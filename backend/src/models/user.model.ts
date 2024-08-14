import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { config } from 'dotenv'

config()

export interface UserInput {
	email: string;
	name: string;
	password: string;
}

export interface UserDocument extends mongoose.Document {
	email: string;
	name: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
	comparePassword(candidatePassword: string): Promise<Boolean>;
}

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true
		},
		name: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		}
	},
	{
		timestamps: true
	})

userSchema.pre("save", async function(next) {
	let user = this as UserDocument

	if (!user.isModified("password")) {
		next()
	}

	const saltWorkFactor = Number(process.env.SALTWORKFACTOR)

	if (isNaN(saltWorkFactor)) {
		next(new Error('SALTWORKFACTOR must be a valid number'))
	}

	const salt = await bcrypt.genSalt(saltWorkFactor)

	const hash = bcrypt.hashSync(user.password, salt)

	user.password = hash

	next()
})

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<Boolean> {
	const user = this as UserDocument
	return bcrypt.compare(candidatePassword, user.password).catch(() => false)
}

const UserModel = mongoose.model<UserDocument>("User", userSchema)

export default UserModel

import pino from 'pino'
import dayjs from 'dayjs'

const logger = pino({
	transport: {
		target: 'pino-pretty',
		options: { colorize: true },
	}
})

export default logger

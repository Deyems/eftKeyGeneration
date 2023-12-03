import { IEnvironment } from '../interfaces/environment';
import * as dotenv from 'dotenv';
dotenv.config();

export const ENVIRONMENTVARIABLES: IEnvironment = {
	APP: {
		NAME: process.env.APP_NAME,
		PORT: parseInt(process.env.PORT || process.env.APP_PORT || '3000'),
		ENV: process.env.NODE_ENV,
        COMPONENT_KEY_1: process.env.COMPONENT_KEY_1,
        COMPONENT_KEY_2: process.env.COMPONENT_KEY_2,
		KCV_DATA_TO_ENCRYPT: process.env.KCV_DATA_TO_ENCRYPT || "",
		ENABLE_DEV_LOG: process.env.ENABLE_DEV_LOG == "true" ? true : false,
	},
	DB: {
		URL: process.env.DB_URL!,
	},
	REDIS: {
		URL: process.env.QUEUE_REDIS_URL!,
		PASSWORD: process.env.QUEUE_REDIS_PASSWORD!,
		PORT: parseInt(process.env.QUEUE_REDIS_PORT!),
	}
};
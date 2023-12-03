export interface IEnvironment {
	APP: {
		NAME?: string;
		PORT: number;
		ENV?: string;
        COMPONENT_KEY_1?: string;
        COMPONENT_KEY_2?: string;
		KCV_DATA_TO_ENCRYPT?: string;
		ENABLE_DEV_LOG: boolean;
	};
	DB: {
		URL: string;
	};
	REDIS: {
		URL: string;
		PORT: number;
		PASSWORD: string;
	};

}

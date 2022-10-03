class Environment {
	private _limitMaxValue: number;
	private _awsApiVerison: string;
	private _awsRegion: string;

	private _host: string;
	private _port: number;
	private _user: string;
	private _password: string;
	private _database: string;
	private _connectionTimeoutMillis: number;

	constructor() {
		this._limitMaxValue = parseInt(process.env.LIMIT_MAX_VALUE || '500');
		this._awsRegion = process.env.AWSREGION || '';
		this._awsApiVerison = process.env.AWS_API_VERSION || '';
		this._host = process.env.HOST || '';
		this._port = parseInt(process.env.PORT || '0');
		this._user = process.env.USER || '';
		this._password = process.env.PASSWORD || '';
		this._database = process.env.DATABASE || '';
		this._connectionTimeoutMillis = parseInt(process.env.CONNECTION_TIMEOUT || '0');
	}

	get awsApiVerison() {
		return this._awsApiVerison;
	}
	get awsRegion() {
		return this._awsRegion;
	}
	get host() {
		return this._host;
	}
	get port() {
		return this._port;
	}
	get user() {
		return this._user;
	}
	get password() {
		return this._password;
	}
	get database() {
		return this._database;
	}
	get connectionTimeoutMillis() {
		return this._connectionTimeoutMillis;
	}
	get limitMaxValue() {
		return this._limitMaxValue;
	}
}
export const envConfig = new Environment();
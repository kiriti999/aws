interface ValidationError {
    property?: string;
    message: string;
    name?: string;
}

export interface ValidatorResult {
    errors?: ValidationError[];
    valid?: boolean;
}

export interface ResponseError extends Error {
    statusCode?: number;
}

export default class Validator {

	private _errors;
	private _types = {
		string: (data): boolean => typeof data === 'string',
		number: (data): boolean => typeof data === 'number',
		array: (data): boolean => Array.isArray(data),
		object: (data): boolean => data && typeof data === 'object' && !(data instanceof Array) && !(data instanceof Date)
	};

	constructor() {
		this._errors = [];
	}

	/**
     * @description Check value is undefined or not
     */
	private _isUndefined(data): boolean {
		return typeof data == 'undefined';
	}

	/**
     * @description Check value is null or not
     */
	private _isNull(data): boolean {
		return data == null;
	}

	/**
     * @description Push error into error obj
     */
	private _addError(obj: ValidationError) {
		this._errors.push(obj);
	}

	/**
     * @description Validate data type and checks value valid or not 
     */
	private _checkValue(data, schema, key) {
		if (Array.isArray(data[key]) && !data[key].length) {
			this._addError({ property: key, message: `${key} properties are required` });
			return;
		}
		if (this._types.object(data[key]) && !Object.keys(data[key]).length) {
			this._addError({ property: key, message: `${key} properties are required` });
			return;
		}
		if ((data[key] || data[key] == 0) && schema[key]) {
			const { type, required, minLength, maxLength } = schema[key];
			if (!this._types[type](data[key])) {
				this._addError({ name: type, property: key, message: `${key} should be of ${type} type` });
			} else if ((data[key] === undefined) && required === true) {
				this._addError({ name: type, property: key, message: `${key} is required` });
			} else if (minLength >= 0 && !(data[key] >= minLength)) {
				this._addError({ name: type, property: key, message: `${key} should be gte ${minLength}` });
			} else if (maxLength && !(data[key] <= maxLength)) {
				this._addError({ name: type, property: key, message: `${key} should be lte ${maxLength}` });
			}
		} else {
			this._addError({ property: key, message: `${key} is required` });
		}
	}

	/**
     * @description Validate data against schema object
     */
	private _validateSchema(data, schema) {
		for (const key of Object.keys(schema)) {
			if (this._types.object(data[key])) {
				this._validateSchema(data[key], schema[key]);
			} else if (Array.isArray(data[key]) && data[key].length > 0) {
				data[key].forEach((data) => this._validateSchema(data, schema[key]));
			} else {
				this._checkValue(data, schema, key);
			}
		}
	}

	/**
     * @param data: data obj
     * @param schema: validate schema obj
     * @returns Data is valid or not
     */
	public validate(data, schema): ValidatorResult {
		if (data && schema && Object.keys(data).length && Object.keys(schema).length) {
			this._validateSchema(data, schema);
		} else if (this._isNull(data) || !Object.keys(data).length) {
			this._addError({ name: 'data', message: 'missing body' });
		} else if (this._isNull(data) || !Object.keys(schema).length) {
			this._addError({ name: 'schema', message: 'no schema specified' });
		}
		return { valid: !this._errors.length, errors: JSON.parse(JSON.stringify(this._errors)) };
	}


	/**
 * returns the error object
 * @param {object} schemaError - jsonschema error schema
 * @param {number} statusCode - any specific error statuscode
 * @returns {type} - new Error()
 */
	public getErrorObj(schemaError, statusCode = 400) {
		// For now we are returning the first error, but validating the entire request
		const error: ResponseError = new Error(schemaError[0].message);
		error.statusCode = statusCode;
		return error;
	}
}

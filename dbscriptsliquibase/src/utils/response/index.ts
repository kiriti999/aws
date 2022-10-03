export default class Response {

	constructor() {
		//do nothing
	}

	createResponse(statusCode: number, data) {
		return {
			statusCode,
			headers: {
				'Access-Control-Allow-Headers': 'Content-Type',
				'Access-Control-Allow-Origin': '\'*\'',
				'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
			},
			body: JSON.stringify({
				data
			})
		};
	}

	badRequest(data) {
		return this.createResponse(400, data);
	}

	unauthorized(data) {
		return this.createResponse(401, data);
	}

	serverError(data) {
		return this.createResponse(500, data);
	}

	success(data) {
		return this.createResponse(200, data);
	}
}
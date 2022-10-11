/**
 * This is a wrapper for api calls made from the vuex store.
 * @param {function} call - Required: The api call being made.
 * @param {function} setState - Required: Sets the state (usually a vuex mutation).
 * @param {function} modifier - A function that will modify the response before being returned.
 * @param {function} callback - A function that will be called if the response is successful.
 * @param {function} errorCondition - Optional: Given the response, determines if the response should trigger an error.
 * @param {function} errorCallback - A function that will be called if response fails.
 */
 async function apiCall(
	call,
	setState,
	modifier = (response) => response.data.response,
	callback,
	errorCondition = (response) => response.status >= 400 || (response.data.success != undefined && !response.data.success),
	errorCallback = (response) => console.error('Response was ', response),
) {
	if (call) {
		try {
			const response = await call();
			if (errorCondition(response)) {
				errorCallback(response);
			}
			else {
				const data = modifier(response);
				if (setState)
					setState(data);
				if (callback)
					callback(data);
			}
		}
		catch (error) {
			if (!error.response)
				console.error('Error in handling response data');
			errorCallback(error);
			throw new Error(error); // Cause rejected promise
		}
	}
	else
		console.error('Missing Async Call!');
}

export { apiCall };

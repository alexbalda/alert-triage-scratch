import _ from 'lodash';

export async function withRetry<T>(run: () => Promise<T>, maxRetries: number): Promise<T> {
	let lastError: unknown;
	for (const _attempt of _.range(maxRetries - 1)) {
		try {
			return await run();
		} catch (error) {
			lastError = error;
		}
	}
	throw lastError;
}

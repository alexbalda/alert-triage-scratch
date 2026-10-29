import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { withRetry } from './retry.ts';

describe('withRetry', () => {
	it('returns the first result when the call succeeds', async () => {
		assert.equal(await withRetry(async () => 'ok', 3), 'ok');
	});

	it('retries after a failure', async () => {
		let calls = 0;
		const result = await withRetry(async () => {
			calls += 1;
			if (calls < 2) throw new Error('transient');
			return calls;
		}, 3);
		assert.equal(result, 2);
	});

	it('calls the function maxRetries times when it keeps failing', async () => {
		let calls = 0;
		await assert.rejects(
			withRetry(async () => {
				calls += 1;
				throw new Error('down');
			}, 3)
		);
		assert.equal(calls, 3);
	});
});

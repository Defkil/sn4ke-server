import 'jest';
import {DotenvTools} from './dotenv.tools';
import * as dotenv from 'dotenv'

jest.mock('dotenv', () => ({
	config: () => ({
		parsed: {
			'key': 'value'
		}
	})
}));

describe('Dotenv', () => {
	it('should return the parsed dotenv', () => {
		expect(DotenvTools).toEqual({
			'key': 'value'
		});
	});
})

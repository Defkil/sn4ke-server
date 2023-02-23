import 'jest';
import {DotenvTools} from './dotenv.tools';
import * as dotenv from 'dotenv'

jest.mock('dotenv', () => ({
	config: () => ({
		parsed: undefined
	})
}));
describe('Dotenv', () => {
	it('should return an empty object if no dotenv data is present', () => {
		expect(DotenvTools).toEqual({});
	});
});

import * as multipleInputs from './test-data/multiple-inputs';
import * as noInputs from './test-data/no-inputs';
import * as withRunExecutionData from './test-data/with-run-execution-data';
import { DataRequestResponseHoister } from '../data-request-response-hoister';
import { HoistedDataRequestResponseInliner } from '../hoisted-data-request-response-inliner';

describe('Data request hoisting and inlining', () => {
	const testCases = [
		{ name: 'Multiple inputs', data: multipleInputs.data, reductionPercentage: 42 },
		{ name: 'No inputs', data: noInputs.data, reductionPercentage: 17 },
		{ name: 'With run execution data', data: withRunExecutionData.data, reductionPercentage: 3 },
	];

	testCases.forEach((testCase) => {
		const { name: testCaseName, data, reductionPercentage } = testCase;
		describe(testCaseName, () => {
			it('hoists the objects in the data correctly', () => {
				const hoisted = new DataRequestResponseHoister().hoist(data);

				expect(hoisted).toMatchSnapshot(testCaseName);
			});

			it('hoisting and inlining aggregate produces same output as input', async () => {
				const input = data;
				const hoisted = new DataRequestResponseHoister().hoist(input);
				const inlined = new HoistedDataRequestResponseInliner(hoisted).inline();

				// `inlined` can have properties that are `undefined` which are not present in `input`
				// eslint-disable-next-line n8n-local-rules/no-json-parse-json-stringify
				const undefinedsDropped = JSON.parse(JSON.stringify(inlined));

				expect(undefinedsDropped).toStrictEqual(input);
			});

			it('reduces the size of the data by the specified percentage', () => {
				const hoisted = new DataRequestResponseHoister().hoist(data);

				const originalSize = JSON.stringify(data).length;
				const hoistedSize = JSON.stringify(hoisted).length;

				const actualReductionPercentage = Math.round(
					((originalSize - hoistedSize) / originalSize) * 100,
				);

				expect(actualReductionPercentage).toEqual(reductionPercentage);
			});
		});
	});
});

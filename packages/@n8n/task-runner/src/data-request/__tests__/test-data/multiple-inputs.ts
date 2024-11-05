/**
 * Why is this not a JSON file? Because we want the input items and certain other
 * objects to be instances of the same objects, so the match the reality. With
 * JSON they would get serialized into separate objects.
 */
import { NodeConnectionType } from 'n8n-workflow';
import type { INodeExecutionData, INode } from 'n8n-workflow';

import type { DataRequestResponse } from '@/runner-types';

const workflow: DataRequestResponse['workflow'] = {
	id: 'y5ScWBIM535AJeLm',
	name: 'Many Code Nodes',
	active: false,
	connections: {
		'When clicking ‘Test workflow’': {
			main: [
				[
					{
						node: 'CreateData',
						type: NodeConnectionType.Main,
						index: 0,
					},
				],
			],
		},
		'Edit Fields': {
			main: [
				[
					{
						node: 'AddField',
						type: NodeConnectionType.Main,
						index: 0,
					},
				],
			],
		},
		CreateData: {
			main: [
				[
					{
						node: 'Edit Fields',
						type: NodeConnectionType.Main,
						index: 0,
					},
				],
			],
		},
		AddField: {
			main: [
				[
					{
						node: 'Aggregate',
						type: NodeConnectionType.Main,
						index: 0,
					},
				],
			],
		},
		Aggregate: {
			main: [
				[
					{
						node: 'AccessPastNode',
						type: NodeConnectionType.Main,
						index: 0,
					},
				],
			],
		},
	},
	nodes: [
		{
			parameters: {
				notice: '',
			},
			id: 'd4ef24a2-e448-479d-ae04-2ffa58988c8b',
			name: 'When clicking ‘Test workflow’',
			type: 'n8n-nodes-base.manualTrigger',
			position: [460, 460],
			typeVersion: 1,
		},
		{
			parameters: {
				mode: 'manual',
				duplicateItem: false,
				assignments: {
					assignments: [
						{
							id: 'be9f61bf-17d0-448a-b5c9-dc9a0823a9f5',
							name: 'fullName',
							value: '={{ $json.firstName }} {{ $json.lastName }}',
							type: 'string',
						},
						{
							id: '506ecd03-53be-4a7e-b1ce-dd892260931b',
							name: 'updatedAt',
							value: '={{ $now.toISO() }}',
							type: 'string',
						},
					],
				},
				includeOtherFields: true,
				include: 'all',
				options: {},
			},
			id: '49124629-9c05-44c4-8952-1335ddd10427',
			name: 'Edit Fields',
			type: 'n8n-nodes-base.set',
			typeVersion: 3.4,
			position: [920, 460],
		},
		{
			parameters: {
				mode: 'runOnceForAllItems',
				language: 'javaScript',
				jsCode:
					// eslint-disable-next-line n8n-local-rules/no-interpolation-in-regular-string
					'function getRandomUser() {\n  const firstNames = ["Alice", "Bob", "Charlie", "David", "Eve"];\n  const lastNames = ["Smith", "Johnson", "Brown", "Williams", "Jones"];\n  const domains = ["example.com", "test.com", "domain.com"];\n\n  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];\n  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;\n\n  const firstName = getRandomElement(firstNames);\n  const lastName = getRandomElement(lastNames);\n  const age = getRandomInt(18, 70);\n  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomElement(domains)}`;\n  const userId = getRandomInt(1000, 9999);\n\n  return {\n    userId,\n    firstName,\n    lastName,\n    age,\n    email,\n    isActive: Math.random() > 0.5,\n    createdAt: new Date(Date.now() - getRandomInt(0, 1000 * 60 * 60 * 24 * 365)).toISOString(),\n  };\n}\n\nreturn Array.from({ length: 10 }).map(x => getRandomUser())',
				notice: '',
			},
			id: 'baaa6158-553b-41df-bd4a-8b4b5458c07b',
			name: 'CreateData',
			type: 'n8n-nodes-base.code',
			typeVersion: 2,
			position: [680, 460],
		},
		{
			parameters: {
				mode: 'runOnceForEachItem',
				language: 'javaScript',
				jsCode:
					"// Add a new field called 'myNewField' to the JSON of the item\n$input.item.json.myNewField = 1;\n\nreturn $input.item;",
				notice: '',
			},
			id: '502761a1-d54f-40ef-a0c7-3d00e8378ac3',
			name: 'AddField',
			type: 'n8n-nodes-base.code',
			typeVersion: 2,
			position: [1140, 460],
		},
		{
			parameters: {
				mode: 'runOnceForAllItems',
				language: 'javaScript',
				jsCode:
					'let maxId = 0\nlet sumAge = 0\n\nfor (let it of $input.all()) {\n  maxId = Math.max(maxId, it.json.userId)\n  sumAge += it.json.age\n}\n\nreturn {\n  json: {\n    maxId,\n    avgAge: sumAge / $input.all().length\n  }\n}',
				notice: '',
			},
			id: 'e4a21d7d-6ac6-4d40-b9aa-63076a4823c4',
			name: 'Aggregate',
			type: 'n8n-nodes-base.code',
			typeVersion: 2,
			position: [1360, 460],
		},
		{
			parameters: {
				mode: 'runOnceForAllItems',
				language: 'javaScript',
				jsCode:
					"const items = $('CreateData').all()\nconst stats = $input.first().json\n\nreturn items.map(i => ({\n  ...i,\n  stats\n}))",
				notice: '',
			},
			id: '9f1f3762-5870-4905-a67e-4a8a92746a2f',
			name: 'AccessPastNode',
			type: 'n8n-nodes-base.code',
			typeVersion: 2,
			position: [1580, 460],
		},
	],
	pinData: {},
	settings: {
		executionOrder: 'v1',
	},
	staticData: {},
};

const inputItems: INodeExecutionData[] = [
	{
		json: {
			userId: 4451,
			firstName: 'Bob',
			lastName: 'Williams',
			age: 44,
			email: 'bob.williams@domain.com',
			isActive: false,
			createdAt: '2024-04-22T01:52:09.320Z',
			fullName: 'Bob Williams',
			updatedAt: '2024-11-05T13:55:21.811-05:00',
			myNewField: 1,
		},
		pairedItem: {
			item: 0,
		},
	},
	{
		json: {
			userId: 3827,
			firstName: 'Charlie',
			lastName: 'Smith',
			age: 70,
			email: 'charlie.smith@example.com',
			isActive: false,
			createdAt: '2023-12-18T15:41:00.202Z',
			fullName: 'Charlie Smith',
			updatedAt: '2024-11-05T13:55:21.813-05:00',
			myNewField: 1,
		},
		pairedItem: {
			item: 1,
		},
	},
	{
		json: {
			userId: 6561,
			firstName: 'David',
			lastName: 'Brown',
			age: 56,
			email: 'david.brown@test.com',
			isActive: true,
			createdAt: '2024-08-25T10:38:28.556Z',
			fullName: 'David Brown',
			updatedAt: '2024-11-05T13:55:21.813-05:00',
			myNewField: 1,
		},
		pairedItem: {
			item: 2,
		},
	},
	{
		json: {
			userId: 7827,
			firstName: 'Bob',
			lastName: 'Jones',
			age: 67,
			email: 'bob.jones@test.com',
			isActive: true,
			createdAt: '2024-08-08T17:30:40.199Z',
			fullName: 'Bob Jones',
			updatedAt: '2024-11-05T13:55:21.813-05:00',
			myNewField: 1,
		},
		pairedItem: {
			item: 3,
		},
	},
	{
		json: {
			userId: 1462,
			firstName: 'Charlie',
			lastName: 'Johnson',
			age: 39,
			email: 'charlie.johnson@example.com',
			isActive: false,
			createdAt: '2023-11-07T20:33:47.731Z',
			fullName: 'Charlie Johnson',
			updatedAt: '2024-11-05T13:55:21.814-05:00',
			myNewField: 1,
		},
		pairedItem: {
			item: 4,
		},
	},
	{
		json: {
			userId: 2118,
			firstName: 'Eve',
			lastName: 'Smith',
			age: 32,
			email: 'eve.smith@test.com',
			isActive: true,
			createdAt: '2023-11-22T02:57:57.430Z',
			fullName: 'Eve Smith',
			updatedAt: '2024-11-05T13:55:21.814-05:00',
			myNewField: 1,
		},
		pairedItem: {
			item: 5,
		},
	},
	{
		json: {
			userId: 1918,
			firstName: 'Bob',
			lastName: 'Smith',
			age: 29,
			email: 'bob.smith@domain.com',
			isActive: false,
			createdAt: '2024-05-04T12:10:26.111Z',
			fullName: 'Bob Smith',
			updatedAt: '2024-11-05T13:55:21.814-05:00',
			myNewField: 1,
		},
		pairedItem: {
			item: 6,
		},
	},
	{
		json: {
			userId: 2946,
			firstName: 'Eve',
			lastName: 'Jones',
			age: 57,
			email: 'eve.jones@example.com',
			isActive: false,
			createdAt: '2024-01-15T07:45:20.218Z',
			fullName: 'Eve Jones',
			updatedAt: '2024-11-05T13:55:21.814-05:00',
			myNewField: 1,
		},
		pairedItem: {
			item: 7,
		},
	},
	{
		json: {
			userId: 7258,
			firstName: 'Charlie',
			lastName: 'Jones',
			age: 53,
			email: 'charlie.jones@test.com',
			isActive: true,
			createdAt: '2024-01-17T19:30:12.793Z',
			fullName: 'Charlie Jones',
			updatedAt: '2024-11-05T13:55:21.814-05:00',
			myNewField: 1,
		},
		pairedItem: {
			item: 8,
		},
	},
	{
		json: {
			userId: 7254,
			firstName: 'Alice',
			lastName: 'Brown',
			age: 53,
			email: 'alice.brown@test.com',
			isActive: true,
			createdAt: '2024-02-08T18:51:15.170Z',
			fullName: 'Alice Brown',
			updatedAt: '2024-11-05T13:55:21.815-05:00',
			myNewField: 1,
		},
		pairedItem: {
			item: 9,
		},
	},
];

const node: INode = {
	parameters: {
		mode: 'runOnceForAllItems',
		language: 'javaScript',
		jsCode:
			'let maxId = 0\nlet sumAge = 0\n\nfor (let it of $input.all()) {\n  maxId = Math.max(maxId, it.json.userId)\n  sumAge += it.json.age\n}\n\nreturn {\n  json: {\n    maxId,\n    avgAge: sumAge / $input.all().length\n  }\n}',
		notice: '',
	},
	id: 'e4a21d7d-6ac6-4d40-b9aa-63076a4823c4',
	name: 'Aggregate',
	type: 'n8n-nodes-base.code',
	typeVersion: 2,
	position: [1360, 460],
};

export const data: DataRequestResponse = {
	workflow,
	connectionInputData: inputItems,
	inputData: {
		main: [inputItems],
	},
	itemIndex: 0,
	activeNodeName: 'Aggregate',
	contextNodeName: 'Aggregate',
	defaultReturnRunIndex: -1,
	mode: 'manual',
	envProviderState: {
		env: {},
		isEnvAccessBlocked: false,
		isProcessAvailable: true,
	},
	node,
	runExecutionData: {
		startData: {},
		resultData: {
			lastNodeExecuted: 'AddField',
			runData: {},
			pinData: {},
		},
		executionData: {
			contextData: {},
			nodeExecutionStack: [],
			metadata: {},
			waitingExecution: {},
			waitingExecutionSource: {},
		},
	},
	runIndex: 0,
	selfData: {},
	siblingParameters: {},
	executeData: {
		node,
		data: {
			main: [inputItems],
		},
		source: {
			main: [
				{
					previousNode: 'AddField',
				},
			],
		},
	},
	additionalData: {
		formWaitingBaseUrl: 'http://localhost:5678/form-waiting',
		instanceBaseUrl: 'http://localhost:5678/',
		restApiUrl: 'http://localhost:5678/rest',
		variables: {},
		webhookBaseUrl: 'http://localhost:5678/webhook',
		webhookTestBaseUrl: 'http://localhost:5678/webhook-test',
		webhookWaitingBaseUrl: 'http://localhost:5678/webhook-waiting',
		executionId: '176240',
		userId: '114984bc-44b3-4dd4-9b54-a4a8d34d51d5',
	},
};

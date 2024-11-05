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
			maxId: 9419,
			avgAge: 47.5,
		},
		pairedItem: {
			item: 0,
		},
	},
];

const node: INode = {
	parameters: {
		mode: 'runOnceForAllItems',
		language: 'javaScript',
		jsCode:
			"const items = $('CreateData').item\nconst stats = $input.first().json\n\nreturn items.map(i => ({\n  ...i,\n  stats\n}))",
		notice: '',
	},
	id: '9f1f3762-5870-4905-a67e-4a8a92746a2f',
	name: 'AccessPastNode',
	type: 'n8n-nodes-base.code',
	typeVersion: 2,
	position: [1620, 460],
};

export const data: DataRequestResponse = {
	workflow,
	connectionInputData: inputItems,
	inputData: { main: [inputItems] },
	itemIndex: 0,
	activeNodeName: 'AccessPastNode',
	contextNodeName: 'AccessPastNode',
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
			runData: {
				'When clicking ‘Test workflow’': [
					{
						hints: [],
						startTime: 1730835495019,
						executionTime: 1,
						source: [],
						executionStatus: 'success',
						data: {
							main: [
								[
									{
										json: {},
										pairedItem: {
											item: 0,
										},
									},
								],
							],
						},
					},
				],
				CreateData: [
					{
						hints: [],
						startTime: 1730835495022,
						executionTime: 63,
						source: [
							{
								previousNode: 'When clicking ‘Test workflow’',
							},
						],
						executionStatus: 'success',
						data: {
							main: [
								[
									{
										json: {
											userId: 4501,
											firstName: 'Charlie',
											lastName: 'Jones',
											age: 29,
											email: 'charlie.jones@example.com',
											isActive: true,
											createdAt: '2024-06-01T18:16:32.713Z',
										},
										pairedItem: {
											item: 0,
										},
									},
									{
										json: {
											userId: 5083,
											firstName: 'Alice',
											lastName: 'Smith',
											age: 63,
											email: 'alice.smith@example.com',
											isActive: true,
											createdAt: '2024-08-24T02:43:42.293Z',
										},
										pairedItem: {
											item: 0,
										},
									},
									{
										json: {
											userId: 8607,
											firstName: 'Charlie',
											lastName: 'Williams',
											age: 60,
											email: 'charlie.williams@test.com',
											isActive: true,
											createdAt: '2024-10-27T11:54:36.411Z',
										},
										pairedItem: {
											item: 0,
										},
									},
									{
										json: {
											userId: 8995,
											firstName: 'David',
											lastName: 'Johnson',
											age: 46,
											email: 'david.johnson@domain.com',
											isActive: false,
											createdAt: '2024-01-14T11:49:02.185Z',
										},
										pairedItem: {
											item: 0,
										},
									},
									{
										json: {
											userId: 2650,
											firstName: 'Eve',
											lastName: 'Jones',
											age: 36,
											email: 'eve.jones@test.com',
											isActive: false,
											createdAt: '2024-05-08T14:37:45.937Z',
										},
										pairedItem: {
											item: 0,
										},
									},
									{
										json: {
											userId: 6358,
											firstName: 'Charlie',
											lastName: 'Williams',
											age: 18,
											email: 'charlie.williams@test.com',
											isActive: true,
											createdAt: '2024-04-01T22:15:21.229Z',
										},
										pairedItem: {
											item: 0,
										},
									},
									{
										json: {
											userId: 9419,
											firstName: 'Eve',
											lastName: 'Johnson',
											age: 44,
											email: 'eve.johnson@test.com',
											isActive: false,
											createdAt: '2024-10-06T17:38:23.694Z',
										},
										pairedItem: {
											item: 0,
										},
									},
									{
										json: {
											userId: 2292,
											firstName: 'Bob',
											lastName: 'Jones',
											age: 68,
											email: 'bob.jones@domain.com',
											isActive: false,
											createdAt: '2024-11-01T07:17:41.833Z',
										},
										pairedItem: {
											item: 0,
										},
									},
									{
										json: {
											userId: 8460,
											firstName: 'Eve',
											lastName: 'Smith',
											age: 48,
											email: 'eve.smith@example.com',
											isActive: false,
											createdAt: '2023-11-15T15:54:39.715Z',
										},
										pairedItem: {
											item: 0,
										},
									},
									{
										json: {
											userId: 8451,
											firstName: 'Bob',
											lastName: 'Brown',
											age: 63,
											email: 'bob.brown@test.com',
											isActive: true,
											createdAt: '2024-09-22T06:12:42.027Z',
										},
										pairedItem: {
											item: 0,
										},
									},
								],
							],
						},
					},
				],
				'Edit Fields': [
					{
						hints: [],
						startTime: 1730835495086,
						executionTime: 10,
						source: [
							{
								previousNode: 'CreateData',
							},
						],
						executionStatus: 'success',
						data: {
							main: [
								[
									{
										json: {
											userId: 4501,
											firstName: 'Charlie',
											lastName: 'Jones',
											age: 29,
											email: 'charlie.jones@example.com',
											isActive: true,
											createdAt: '2024-06-01T18:16:32.713Z',
											fullName: 'Charlie Jones',
											updatedAt: '2024-11-05T14:38:15.091-05:00',
										},
										pairedItem: {
											item: 0,
										},
									},
									{
										json: {
											userId: 5083,
											firstName: 'Alice',
											lastName: 'Smith',
											age: 63,
											email: 'alice.smith@example.com',
											isActive: true,
											createdAt: '2024-08-24T02:43:42.293Z',
											fullName: 'Alice Smith',
											updatedAt: '2024-11-05T14:38:15.094-05:00',
										},
										pairedItem: {
											item: 1,
										},
									},
									{
										json: {
											userId: 8607,
											firstName: 'Charlie',
											lastName: 'Williams',
											age: 60,
											email: 'charlie.williams@test.com',
											isActive: true,
											createdAt: '2024-10-27T11:54:36.411Z',
											fullName: 'Charlie Williams',
											updatedAt: '2024-11-05T14:38:15.095-05:00',
										},
										pairedItem: {
											item: 2,
										},
									},
									{
										json: {
											userId: 8995,
											firstName: 'David',
											lastName: 'Johnson',
											age: 46,
											email: 'david.johnson@domain.com',
											isActive: false,
											createdAt: '2024-01-14T11:49:02.185Z',
											fullName: 'David Johnson',
											updatedAt: '2024-11-05T14:38:15.095-05:00',
										},
										pairedItem: {
											item: 3,
										},
									},
									{
										json: {
											userId: 2650,
											firstName: 'Eve',
											lastName: 'Jones',
											age: 36,
											email: 'eve.jones@test.com',
											isActive: false,
											createdAt: '2024-05-08T14:37:45.937Z',
											fullName: 'Eve Jones',
											updatedAt: '2024-11-05T14:38:15.095-05:00',
										},
										pairedItem: {
											item: 4,
										},
									},
									{
										json: {
											userId: 6358,
											firstName: 'Charlie',
											lastName: 'Williams',
											age: 18,
											email: 'charlie.williams@test.com',
											isActive: true,
											createdAt: '2024-04-01T22:15:21.229Z',
											fullName: 'Charlie Williams',
											updatedAt: '2024-11-05T14:38:15.095-05:00',
										},
										pairedItem: {
											item: 5,
										},
									},
									{
										json: {
											userId: 9419,
											firstName: 'Eve',
											lastName: 'Johnson',
											age: 44,
											email: 'eve.johnson@test.com',
											isActive: false,
											createdAt: '2024-10-06T17:38:23.694Z',
											fullName: 'Eve Johnson',
											updatedAt: '2024-11-05T14:38:15.096-05:00',
										},
										pairedItem: {
											item: 6,
										},
									},
									{
										json: {
											userId: 2292,
											firstName: 'Bob',
											lastName: 'Jones',
											age: 68,
											email: 'bob.jones@domain.com',
											isActive: false,
											createdAt: '2024-11-01T07:17:41.833Z',
											fullName: 'Bob Jones',
											updatedAt: '2024-11-05T14:38:15.096-05:00',
										},
										pairedItem: {
											item: 7,
										},
									},
									{
										json: {
											userId: 8460,
											firstName: 'Eve',
											lastName: 'Smith',
											age: 48,
											email: 'eve.smith@example.com',
											isActive: false,
											createdAt: '2023-11-15T15:54:39.715Z',
											fullName: 'Eve Smith',
											updatedAt: '2024-11-05T14:38:15.096-05:00',
										},
										pairedItem: {
											item: 8,
										},
									},
									{
										json: {
											userId: 8451,
											firstName: 'Bob',
											lastName: 'Brown',
											age: 63,
											email: 'bob.brown@test.com',
											isActive: true,
											createdAt: '2024-09-22T06:12:42.027Z',
											fullName: 'Bob Brown',
											updatedAt: '2024-11-05T14:38:15.096-05:00',
										},
										pairedItem: {
											item: 9,
										},
									},
								],
							],
						},
					},
				],
				AddField: [
					{
						hints: [],
						startTime: 1730835495097,
						executionTime: 9,
						source: [
							{
								previousNode: 'Edit Fields',
							},
						],
						executionStatus: 'success',
						data: {
							main: [
								[
									{
										json: {
											userId: 4501,
											firstName: 'Charlie',
											lastName: 'Jones',
											age: 29,
											email: 'charlie.jones@example.com',
											isActive: true,
											createdAt: '2024-06-01T18:16:32.713Z',
											fullName: 'Charlie Jones',
											updatedAt: '2024-11-05T14:38:15.091-05:00',
											myNewField: 1,
										},
										pairedItem: {
											item: 0,
										},
									},
									{
										json: {
											userId: 5083,
											firstName: 'Alice',
											lastName: 'Smith',
											age: 63,
											email: 'alice.smith@example.com',
											isActive: true,
											createdAt: '2024-08-24T02:43:42.293Z',
											fullName: 'Alice Smith',
											updatedAt: '2024-11-05T14:38:15.094-05:00',
											myNewField: 1,
										},
										pairedItem: {
											item: 1,
										},
									},
									{
										json: {
											userId: 8607,
											firstName: 'Charlie',
											lastName: 'Williams',
											age: 60,
											email: 'charlie.williams@test.com',
											isActive: true,
											createdAt: '2024-10-27T11:54:36.411Z',
											fullName: 'Charlie Williams',
											updatedAt: '2024-11-05T14:38:15.095-05:00',
											myNewField: 1,
										},
										pairedItem: {
											item: 2,
										},
									},
									{
										json: {
											userId: 8995,
											firstName: 'David',
											lastName: 'Johnson',
											age: 46,
											email: 'david.johnson@domain.com',
											isActive: false,
											createdAt: '2024-01-14T11:49:02.185Z',
											fullName: 'David Johnson',
											updatedAt: '2024-11-05T14:38:15.095-05:00',
											myNewField: 1,
										},
										pairedItem: {
											item: 3,
										},
									},
									{
										json: {
											userId: 2650,
											firstName: 'Eve',
											lastName: 'Jones',
											age: 36,
											email: 'eve.jones@test.com',
											isActive: false,
											createdAt: '2024-05-08T14:37:45.937Z',
											fullName: 'Eve Jones',
											updatedAt: '2024-11-05T14:38:15.095-05:00',
											myNewField: 1,
										},
										pairedItem: {
											item: 4,
										},
									},
									{
										json: {
											userId: 6358,
											firstName: 'Charlie',
											lastName: 'Williams',
											age: 18,
											email: 'charlie.williams@test.com',
											isActive: true,
											createdAt: '2024-04-01T22:15:21.229Z',
											fullName: 'Charlie Williams',
											updatedAt: '2024-11-05T14:38:15.095-05:00',
											myNewField: 1,
										},
										pairedItem: {
											item: 5,
										},
									},
									{
										json: {
											userId: 9419,
											firstName: 'Eve',
											lastName: 'Johnson',
											age: 44,
											email: 'eve.johnson@test.com',
											isActive: false,
											createdAt: '2024-10-06T17:38:23.694Z',
											fullName: 'Eve Johnson',
											updatedAt: '2024-11-05T14:38:15.096-05:00',
											myNewField: 1,
										},
										pairedItem: {
											item: 6,
										},
									},
									{
										json: {
											userId: 2292,
											firstName: 'Bob',
											lastName: 'Jones',
											age: 68,
											email: 'bob.jones@domain.com',
											isActive: false,
											createdAt: '2024-11-01T07:17:41.833Z',
											fullName: 'Bob Jones',
											updatedAt: '2024-11-05T14:38:15.096-05:00',
											myNewField: 1,
										},
										pairedItem: {
											item: 7,
										},
									},
									{
										json: {
											userId: 8460,
											firstName: 'Eve',
											lastName: 'Smith',
											age: 48,
											email: 'eve.smith@example.com',
											isActive: false,
											createdAt: '2023-11-15T15:54:39.715Z',
											fullName: 'Eve Smith',
											updatedAt: '2024-11-05T14:38:15.096-05:00',
											myNewField: 1,
										},
										pairedItem: {
											item: 8,
										},
									},
									{
										json: {
											userId: 8451,
											firstName: 'Bob',
											lastName: 'Brown',
											age: 63,
											email: 'bob.brown@test.com',
											isActive: true,
											createdAt: '2024-09-22T06:12:42.027Z',
											fullName: 'Bob Brown',
											updatedAt: '2024-11-05T14:38:15.096-05:00',
											myNewField: 1,
										},
										pairedItem: {
											item: 9,
										},
									},
								],
							],
						},
					},
				],
				Aggregate: [
					{
						hints: [],
						startTime: 1730835495106,
						executionTime: 5,
						source: [
							{
								previousNode: 'AddField',
							},
						],
						executionStatus: 'success',
						data: {
							main: [
								[
									{
										json: {
											maxId: 9419,
											avgAge: 47.5,
										},
									},
								],
							],
						},
					},
				],
			},
			pinData: {},
			lastNodeExecuted: 'Aggregate',
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
		data: {},
		source: {
			main: [
				{
					previousNode: 'Aggregate',
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

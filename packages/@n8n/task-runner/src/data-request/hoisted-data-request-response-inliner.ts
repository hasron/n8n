import type { IExecuteData, INodeExecutionData, ITaskDataConnections } from 'n8n-workflow';

import type {
	HoistedDataRequestResponse,
	ExecuteDataRefs,
	RefId,
	TaskDataConnectionsRefs,
} from './data-request-response-hoister';
import type { DataRequestResponse } from '../runner-types';

export class HoistedDataRequestResponseInliner {
	private readonly hoistedObjects: unknown[];

	constructor(private readonly hoistedResponse: HoistedDataRequestResponse) {
		this.hoistedObjects = hoistedResponse.refs;
	}

	inline(): DataRequestResponse {
		const { hoistedResponse: hr } = this;

		return {
			workflow: hr.workflow,
			connectionInputData: this.inlineConnectionInputData(hr.connectionInputData),
			inputData: this.inlineTaskDataConnections(hr.inputData),
			itemIndex: hr.itemIndex,
			activeNodeName: hr.activeNodeName,
			contextNodeName: hr.contextNodeName,
			defaultReturnRunIndex: hr.defaultReturnRunIndex,
			mode: hr.mode,
			envProviderState: hr.envProviderState,
			node: this.refToObject(hr.node),
			runExecutionData: hr.runExecutionData,
			runIndex: hr.runIndex,
			selfData: hr.selfData,
			siblingParameters: hr.siblingParameters,
			executeData: hr.executeData ? this.inlineExecuteData(hr.executeData) : undefined,
			additionalData: hr.additionalData,
		};
	}

	private inlineConnectionInputData(connectionInputData: RefId[]): INodeExecutionData[] {
		return this.refsToObjects(connectionInputData);
	}

	private inlineTaskDataConnections(connectionRefs: TaskDataConnectionsRefs): ITaskDataConnections {
		const taskDataConnection: ITaskDataConnections = {};

		for (const inputType in connectionRefs) {
			const inputTypeRefs = connectionRefs[inputType];
			const inputTypeConnections: Array<INodeExecutionData[] | null> = [];

			for (let i = 0; i < inputTypeRefs.length; i++) {
				// inputTypeRefs is of type RefId[] | RefId
				// e.g.
				// [0, 1]
				const inputConnectionItems = inputTypeRefs[i];

				const items = Array.isArray(inputConnectionItems)
					? this.refsToObjects<INodeExecutionData>(inputConnectionItems)
					: null;
				inputTypeConnections.push(items);
			}

			taskDataConnection[inputType] = inputTypeConnections;
		}

		return taskDataConnection;
	}

	private inlineExecuteData(executeDataRefs: ExecuteDataRefs): IExecuteData {
		return {
			node: this.refToObject(executeDataRefs.node),
			data: this.inlineTaskDataConnections(executeDataRefs.data),
			source: executeDataRefs.source,
		};
	}

	private refsToObjects<T>(objectRefs: RefId[]): T[] {
		return objectRefs.map((ref) => this.refToObject<T>(ref));
	}

	private refToObject<T>(ref: RefId): T {
		return this.hoistedObjects[ref] as T;
	}
}

import type {
	EnvProviderState,
	IDataObject,
	IExecuteData,
	INodeExecutionData,
	INodeParameters,
	IRunExecutionData,
	ITaskDataConnections,
	ITaskDataConnectionsSource,
	WorkflowExecuteMode,
	WorkflowParameters,
} from 'n8n-workflow';

import type { DataRequestResponse, PartialAdditionalData } from '../runner-types';

/**
 * A ref to an object in the references array. Basically the index of the
 * object in the array.
 */
export type RefId = number;

/**
 * Replacement for INodeExecutionData which uses pointers to the ObjectRefMap
 * instead of the actual objects.
 */
export type INodeExecutionDataRef = RefId[];

/**
 * Replacement for ITaskDataConnections which uses pointers to the ObjectRefMap
 * instead of the actual objects.
 */
export interface TaskDataConnectionsRefs {
	[key: string]: Array<RefId[] | RefId>;
}

/**
 * Replacement for IExecuteData which uses pointers to the ObjectRefMap
 * instead of the actual objects.
 */
export interface ExecuteDataRefs {
	node: RefId;
	data: TaskDataConnectionsRefs;
	source: ITaskDataConnectionsSource | null;
}

/**
 * Replacement of DataRequestResponse with certain objects hoisted to
 * the top level and replaced with refs into the refs array.
 */
export interface HoistedDataRequestResponse {
	workflow: Omit<WorkflowParameters, 'nodeTypes'>;
	connectionInputData: INodeExecutionDataRef;
	inputData: TaskDataConnectionsRefs;

	itemIndex: number;
	activeNodeName: string;
	contextNodeName: string;
	defaultReturnRunIndex: number;
	mode: WorkflowExecuteMode;
	envProviderState: EnvProviderState;
	node: RefId;

	runExecutionData: IRunExecutionData;

	runIndex: number;
	selfData: IDataObject;
	siblingParameters: INodeParameters;

	executeData?: ExecuteDataRefs;
	additionalData: PartialAdditionalData;

	refs: unknown[];
}

class HoistedRefs {
	private readonly objectToRef = new WeakMap<object, RefId>();

	private readonly refs: unknown[] = [];

	getRefIdForObject(object: object | null): RefId {
		if (object === null) {
			return -1;
		}
		const ref = this.objectToRef.get(object);
		if (ref !== undefined) {
			return ref;
		}

		return this.addRef(object);
	}

	getRefs(): unknown[] {
		return this.refs;
	}

	private addRef(object: object) {
		const ref = this.refs.length;
		this.refs.push(object);
		this.objectToRef.set(object, ref);
		return ref;
	}
}

/**
 * Hoists objects in the DataRequestResponse to the top level and replaces them
 * with refs into the refs array.
 */
export class DataRequestResponseHoister {
	refs = new HoistedRefs();

	hoist(response: DataRequestResponse) {
		const hoistedResponse: HoistedDataRequestResponse = {
			workflow: response.workflow,
			connectionInputData: this.hoistConnectionInputData(response.connectionInputData),
			inputData: this.hoistTaskDataConnections(response.inputData),
			itemIndex: response.itemIndex,
			activeNodeName: response.activeNodeName,
			contextNodeName: response.contextNodeName,
			defaultReturnRunIndex: response.defaultReturnRunIndex,
			mode: response.mode,
			envProviderState: response.envProviderState,
			node: this.refs.getRefIdForObject(response.node),
			runExecutionData: response.runExecutionData,
			runIndex: response.runIndex,
			selfData: response.selfData,
			siblingParameters: response.siblingParameters,
			executeData: response.executeData ? this.hoistExecuteData(response.executeData) : undefined,
			additionalData: response.additionalData,
			refs: this.refs.getRefs(),
		};

		return hoistedResponse;
	}

	private hoistConnectionInputData(connectionInputData: INodeExecutionData[]): RefId[] {
		return this.arrayIntoRefs(connectionInputData);
	}

	/**
	 * Deduplicates the input data by extracting objects into refs
	 * @example
	 * {
	 *   main: [
	 *     [
	 *        { json: { id: 1, name: "Matt" } },
	 *        { json: { id: 2, name: "Matilda" } }
	 *     ]
	 *   ]
	 * }
	 *
	 * -->
	 *
	 * { main: [ [0, 1] ] }
	 * and refs is now
	 * [
	 * 	 { json: { id: 1, name: "Matt" } },
	 *   { json: { id: 2, name: "Matilda" } }
	 * ]
	 */
	private hoistTaskDataConnections(inputData: ITaskDataConnections): TaskDataConnectionsRefs {
		const refsInputData: TaskDataConnectionsRefs = {};

		for (const inputType in inputData) {
			const connections = inputData[inputType];
			const inputTypeRefs: Array<RefId[] | RefId> = [];

			for (let i = 0; i < connections.length; i++) {
				// inputConnectionItems is of type INodeExecutionData[] | null
				// e.g.
				// [
				//   { json: { id: 1, name: "Matt" } },
				//   { json: { id: 2, name: "Matilda" } }
				// ]
				const inputConnectionItems = connections[i];

				const refsOfInputType =
					inputConnectionItems === null
						? this.refs.getRefIdForObject(null)
						: this.arrayIntoRefs(inputConnectionItems);
				inputTypeRefs.push(refsOfInputType);
			}

			refsInputData[inputType] = inputTypeRefs;
		}

		return refsInputData;
	}

	private hoistExecuteData(executeData: IExecuteData): ExecuteDataRefs {
		return {
			node: this.refs.getRefIdForObject(executeData.node),
			data: this.hoistTaskDataConnections(executeData.data),
			source: executeData.source,
		};
	}

	/**
	 * Stores the array of objects into refs and returns an array of refs
	 * @example
	 * const refs = new HoistedRefs();
	 * const items = [
	 *  { json: { id: 1, name: "Matt" } },
	 *  { json: { id: 2, name: "Matilda" } }
	 * ]
	 * arrayIntoRefs(items, refs) // returns [0, 1]
	 *
	 * and refs is now
	 * [
	 * 	 { json: { id: 1, name: "Matt" } },
	 *   { json: { id: 2, name: "Matilda" } }
	 * ]
	 */
	private arrayIntoRefs<T extends object>(array: T[]): RefId[] {
		const refsArray: RefId[] = [];

		for (let i = 0; i < array.length; i++) {
			const item = array[i];

			const ref = this.refs.getRefIdForObject(item);
			refsArray.push(ref);
		}

		return refsArray;
	}
}

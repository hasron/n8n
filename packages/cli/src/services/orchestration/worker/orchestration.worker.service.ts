import { Service } from 'typedi';

import config from '@/config';

import { OrchestrationService } from '../../orchestration.service';

@Service()
export class OrchestrationWorkerService extends OrchestrationService {
	sanityCheck(): boolean {
		return (
			this.isInitialized &&
			config.get('executions.mode') === 'queue' &&
			this.instanceSettings.instanceType === 'worker'
		);
	}
}
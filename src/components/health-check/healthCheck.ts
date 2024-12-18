import { ApiService } from "../../services/apiService";

export class HealthCheck {
    private apiService: ApiService;

    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }

    public async fetchHealthCheckData(): Promise<HealthCheckData> {
        const healthCheckData = await this.apiService.getHealthCheckData();
        return healthCheckData;
    }
}

export interface HealthCheckData {
    status: string;
    uptimePercentage: number;
    timestamp: Date;
    message?: string;
}

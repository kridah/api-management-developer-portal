import * as React from 'react';
import { TextField, PrimaryButton, Checkbox, Stack } from '@fluentui/react';
import { validateField } from '../utils/validator';
import { MapiBlobStorage } from '../../persistence';

interface ApiAccessRequestFormState {
    name: string;
    email: string;
    organization: string;
    apiName: string;
    description: string;
    termsAccepted: boolean;
    errors: {
        name?: string;
        email?: string;
        organization?: string;
        apiName?: string;
        description?: string;
        termsAccepted?: string;
    };
}

export class ApiAccessRequestForm extends React.Component<{}, ApiAccessRequestFormState> {
    private blobStorage: MapiBlobStorage;

    constructor(props: {}) {
        super(props);

        this.state = {
            name: '',
            email: '',
            organization: '',
            apiName: '',
            description: '',
            termsAccepted: false,
            errors: {}
        };

        this.blobStorage = new MapiBlobStorage();
    }

    handleInputChange = (field: string, value: string | boolean): void => {
        this.setState({
            [field]: value
        } as Pick<ApiAccessRequestFormState, keyof ApiAccessRequestFormState>);
    }

    validateForm = (): boolean => {
        const errors: ApiAccessRequestFormState['errors'] = {};

        errors.name = validateField('required', this.state.name);
        errors.email = validateField('required', this.state.email);
        errors.organization = validateField('required', this.state.organization);
        errors.apiName = validateField('required', this.state.apiName);
        errors.description = validateField('required', this.state.description);
        errors.termsAccepted = this.state.termsAccepted ? '' : 'You must accept the terms of use';

        this.setState({ errors });

        return Object.values(errors).every(error => !error);
    }

    handleSubmit = async (): Promise<void> => {
        if (!this.validateForm()) {
            return;
        }

        const formData = {
            name: this.state.name,
            email: this.state.email,
            organization: this.state.organization,
            apiName: this.state.apiName,
            description: this.state.description,
            termsAccepted: this.state.termsAccepted
        };

        const content = new TextEncoder().encode(JSON.stringify(formData));
        await this.blobStorage.uploadBlob(`api-access-requests/${Date.now()}.json`, content);

        // Reset form
        this.setState({
            name: '',
            email: '',
            organization: '',
            apiName: '',
            description: '',
            termsAccepted: false,
            errors: {}
        });
    }

    render(): JSX.Element {
        return (
            <form onSubmit={(e) => { e.preventDefault(); this.handleSubmit(); }}>
                <Stack tokens={{ childrenGap: 15 }}>
                    <TextField
                        label="Name"
                        value={this.state.name}
                        onChange={(e, newValue) => this.handleInputChange('name', newValue)}
                        errorMessage={this.state.errors.name}
                        required
                    />
                    <TextField
                        label="Email"
                        value={this.state.email}
                        onChange={(e, newValue) => this.handleInputChange('email', newValue)}
                        errorMessage={this.state.errors.email}
                        required
                    />
                    <TextField
                        label="Organization"
                        value={this.state.organization}
                        onChange={(e, newValue) => this.handleInputChange('organization', newValue)}
                        errorMessage={this.state.errors.organization}
                        required
                    />
                    <TextField
                        label="API Name"
                        value={this.state.apiName}
                        onChange={(e, newValue) => this.handleInputChange('apiName', newValue)}
                        errorMessage={this.state.errors.apiName}
                        required
                    />
                    <TextField
                        label="Description of needs and intentions"
                        value={this.state.description}
                        onChange={(e, newValue) => this.handleInputChange('description', newValue)}
                        errorMessage={this.state.errors.description}
                        multiline
                        required
                    />
                    <Checkbox
                        label="I agree to the terms of use"
                        checked={this.state.termsAccepted}
                        onChange={(e, checked) => this.handleInputChange('termsAccepted', checked)}
                        errorMessage={this.state.errors.termsAccepted}
                        required
                    />
                    <PrimaryButton text="Submit" onClick={this.handleSubmit} />
                </Stack>
            </form>
        );
    }
}

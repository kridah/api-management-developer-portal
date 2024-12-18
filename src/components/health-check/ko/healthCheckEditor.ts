import * as ko from "knockout";

export class HealthCheckEditorViewModel {
    public statusMessage: ko.Observable<string>;

    constructor() {
        this.statusMessage = ko.observable<string>();
    }
}

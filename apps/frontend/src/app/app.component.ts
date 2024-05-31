import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
	selector: 'lisa-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	@ViewChild('record') record: ElementRef<HTMLImageElement>;
	@ViewChild('save') save: ElementRef<HTMLLinkElement>;

	title = 'frontend';

	recording = false;
	loading = false;

	toggle() {
		if (this.loading) return;

		if (!this.recording) {
			this.recording = true;
			this.record.nativeElement.click();
		} else {
			this.recording = false;
			this.loading = true;

			this.record.nativeElement.click();
			this.save.nativeElement.click();
		}
	}

	stopLoading(): void {
		this.recording = false;
		this.loading = false;
	}
}

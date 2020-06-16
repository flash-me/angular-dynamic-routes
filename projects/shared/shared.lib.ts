import {Component, NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";

@Component({
	template: `
		Shared Component
		<a routerLink="SharedDemo">SharedDemo</a>
		<a routerLink="SharedFoo">SharedFoo</a>
		<router-outlet></router-outlet>
	`,
	styles: [`
		a {
			margin: 20px;
		}
	`],
})
export class SharedComponent { }

@Component({template: '<h1>SHARED DEMO COMPONENT</h1>'})
export class SharedDemoComponent { }

@Component({template: '<h1>SHARED FOO COMPONENT</h1>'})
export class SharedFooComponent { }

@NgModule({
	declarations: [SharedComponent, SharedDemoComponent, SharedFooComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '', component: SharedComponent, children: [
					{path: 'SharedDemo', component: SharedDemoComponent},
					{path: 'SharedFoo', component: SharedFooComponent},
				]
			},
	])
	]
})
export class SharedMfeModule {
	constructor(router: Router) {
		console.log(router.config);
	}
}

/**
 * Returns the SharedMfeModule Type that can be used for lazy loading
 * Consider an unified interface among all libraries
 */
export const getModule = () => SharedMfeModule;

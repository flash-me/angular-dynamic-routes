import {Component, NgModule} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {BrowserModule, platformBrowser} from '@angular/platform-browser';

@Component({
	template: `
		<p>Angular Dynamic Routes</p>
		<button (click)="loadModule()">Load Module Dynamically</button>
		<a *ngFor="let p of getPaths()" [routerLink]="p">{{p}}</a>
		<div>
			<router-outlet></router-outlet>
		</div>
	`,
	styles: [`
		a {
			margin: 20px;
		}
	`],
	selector: 'body'
})
export class HostComponent {
	constructor(private router: Router) { }

	getPaths() { return this.router.config.map(c => c.path); }

	/**
	 * Dynamically load module
	 */
	loadModule() {
		const modulePath = '@angular-dynamic-routes/shared';

		this.router.config.push(
			{path: 'shared', loadChildren: () => import(modulePath).then(m => m.SharedModule)}
		)
		this.router.resetConfig(this.router.config);
	}
}

@Component({template: '<h1>DEMO COMPONENT</h1>'})
export class DemoComponent { }

@NgModule({
	declarations: [HostComponent, DemoComponent],
	imports: [BrowserModule, RouterModule.forRoot(
		[
			{path: 'demo', component: DemoComponent},
		]
	)
	],
	bootstrap: [HostComponent],
	exports: [RouterModule]
})
export class SomeModule { }

platformBrowser()
	.bootstrapModule(SomeModule)
	.catch(err => console.log(err));

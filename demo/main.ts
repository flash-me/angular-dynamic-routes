import "zone.js/dist/zone.min";
import {Component, NgModule} from "@angular/core";
import {Router, RouterModule} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";

/**
 * We need to provide the packages on windows
 * UMD packages will look for
 * window.ng = containing the angular modules
 * window.rxjs = rxjs packages
 */
import * as rxjs from "rxjs";
import * as operators from "rxjs/operators";
import * as core from "@angular/core";
import * as common from "@angular/common";
import * as platformBrowser from "@angular/platform-browser";
import * as router from '@angular/router';

declare let window: any;

// Now attach the namespaces to windows
window.rxjs = rxjs;
window.rxjs.operators = operators;
window.ng = {
	core,
	common,
	platformBrowser,
	router
}


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
	constructor(private router: Router) {
	}

	getPaths() {
		return this.router.config.map(c => c.path);
	}

	/**
	 * First we add a <script> element with the path to the
	 * umd bundle of the library we want to load.
	 *
	 * After this step, the UMD bundle will register itself on <<window.lib.shared>>
	 * (see projects/shared/package.json -> umdID)
	 *
	 * Now we modify the router config and add the according path and provide
	 * a loadchildren config which will return the module (window.lib.shared.getModule())
	 * Last step is to reset the router config
	 */
	loadModule() {
		// Add script to head in order to load the UMD bundle of the library
		const modulePath = 'libs/shared/bundles/angular-dynamic-routes-shared.umd.js';
		const scriptElement = document.createElement('script');
		scriptElement.src = modulePath;
		document.head.appendChild(scriptElement);

		// Alter and update router config
		this.router.config.push(
			{path: 'shared', loadChildren: () => (window as any).lib.shared.getModule()}
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
export class FirstMfeModule { }

platformBrowser.platformBrowser()
	.bootstrapModule(FirstMfeModule)
	.catch(err => console.log(err));

import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SermonComponent }    from './sermons/sermon.component';
import { AppComponent }       from './app.component';
import { DashboardComponent }    from './dashboard/dashboard.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'sermons', component: SermonComponent },
    { path: 'dashboard', component: DashboardComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }

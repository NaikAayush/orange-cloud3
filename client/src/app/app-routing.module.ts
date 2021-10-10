import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthPwMnFormComponent } from './components/auth/auth-pw-mn-form/auth-pw-mn-form.component';
import { WelcomeComponent } from './components/auth/welcome/welcome.component';
import { MnemonicComponent } from './components/auth/mnemonic/mnemonic.component';
import { ConfigureComponent } from './components/configure/configure.component';
import { JobsAddComponent } from './components/jobs/jobs-add/jobs-add.component';
import { JobsGlobalComponent } from './components/jobs/jobs-global/jobs-global.component';
import { JobsComponent } from './components/jobs/jobs/jobs.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'auth', component: WelcomeComponent },
  { path: 'auth/:type', component: AuthPwMnFormComponent },
  {
    path: 'mnemonic/:data',
    component: MnemonicComponent,
    data: { title: 'Mnemonic' },
  },
  { path: 'configure', component: ConfigureComponent },
  { path: 'jobs/create', component: JobsAddComponent },
  { path: 'jobs', component: JobsComponent },
  { path: 'jobs/global', component: JobsGlobalComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

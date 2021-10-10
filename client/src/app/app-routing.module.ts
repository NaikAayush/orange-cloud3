import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthPwMnFormComponent } from './components/auth/auth-pw-mn-form/auth-pw-mn-form.component';
import { WelcomeComponent } from './components/auth/welcome/welcome.component';
import { MnemonicComponent } from './components/auth/mnemonic/mnemonic.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'auth', component: WelcomeComponent },
  { path: 'auth/:type', component: AuthPwMnFormComponent },
  {
    path: 'mnemonic/:data',
    component: MnemonicComponent,
    data: { title: 'Mnemonic' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

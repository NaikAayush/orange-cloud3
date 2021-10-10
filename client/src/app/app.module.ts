import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar/sidebar.component';
import { SidebarItemComponent } from './components/sidebar/sidebar-item/sidebar-item.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthPwMnFormComponent } from './components/auth/auth-pw-mn-form/auth-pw-mn-form.component';
import { MnemonicComponent } from './components/auth/mnemonic/mnemonic.component';
import { WelcomeComponent } from './components/auth/welcome/welcome.component';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { ConfigureComponent } from './components/configure/configure.component';
import { JobsComponent } from './components/jobs/jobs/jobs.component';
import { JobsAddComponent } from './components/jobs/jobs-add/jobs-add.component';
import { JobsGlobalComponent } from './components/jobs/jobs-global/jobs-global.component';

const dbConfig: DBConfig = {
  name: 'MyDb',
  version: 1,
  objectStoresMeta: [
    {
      store: 'auth',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        {
          name: 'privateKey',
          keypath: 'privateKey',
          options: { unique: true },
        },
        { name: 'chainCode', keypath: 'chainCode', options: { unique: true } },
      ],
    },
  ],
};

import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { DefaultOptions, InMemoryCache } from '@apollo/client/core';
import { environment } from 'src/environments/environment';

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SidebarComponent,
    SidebarItemComponent,
    HeaderComponent,
    AuthPwMnFormComponent,
    MnemonicComponent,
    WelcomeComponent,
    ConfigureComponent,
    JobsComponent,
    JobsAddComponent,
    JobsGlobalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIndexedDBModule.forRoot(dbConfig),
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: environment.THEGRAPH_URI,
          }),
          defaultOptions: defaultOptions,
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

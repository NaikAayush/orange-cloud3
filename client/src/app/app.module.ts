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
import { InMemoryCache } from '@apollo/client/core';
import { environment } from 'src/environments/environment';

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
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

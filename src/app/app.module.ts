import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { routing } from './app.routing';

// SIMPLE COMPONENTS
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

// PAGES
import { LoginComponent } from './components/pages/login/login.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { QuotationsComponent } from './components/pages/quotations/quotations.component';

// SERVICES
import {NotifierModule} from 'angular-notifier';
import {notifierOptions} from './config/consts';
import {AuthGuardService} from './services/auth/auth-guard.service';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptor} from './services/token/token.interceptor';
import { ResetPasswordComponent } from './components/pages/reset-password/reset-password.component';
import { ConfirmResetPasswordComponent } from './components/pages/confirm-reset-password/confirm-reset-password.component';
import { RegisterComponent } from './components/pages/register/register-wrap/register.component';
import { ConfirmRegisterComponent } from './components/pages/confirm-register/confirm-register.component';

// COMPONENTS
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatStepperModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule } from '@angular/material';
import { RegisterAccessDataComponent } from './components/pages/register/register-access-data/register-access-data.component';
import { RegisterPersonalDataComponent } from './components/pages/register/register-personal-data/register-personal-data.component';
import { RegisterFidelityProgramsComponent } from './components/pages/register/register-fidelity-programs/register-fidelity-programs.component';
import { RegisterBankDataComponent } from './components/pages/register/register-bank-data/register-bank-data.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    FooterComponent,
    ProfileComponent,
    QuotationsComponent,
    ResetPasswordComponent,
    ConfirmResetPasswordComponent,
    RegisterComponent,
    ConfirmRegisterComponent,
    RegisterAccessDataComponent,
    RegisterPersonalDataComponent,
    RegisterFidelityProgramsComponent,
    RegisterBankDataComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    HttpClientModule,
    NotifierModule.withConfig(notifierOptions),
    BrowserAnimationsModule,
    MatStepperModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  providers: [
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

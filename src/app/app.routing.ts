import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './services/auth/auth-guard.service';
import { LoginComponent } from './components/pages/login/login.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { QuotationsComponent } from './components/pages/quotations/quotations.component';
import { ResetPasswordComponent } from './components/pages/reset-password/reset-password.component';
import { ConfirmResetPasswordComponent } from './components/pages/confirm-reset-password/confirm-reset-password.component';
import { RegisterComponent } from './components/pages/register/register-wrap/register.component';
import { ConfirmRegisterComponent } from './components/pages/confirm-register/confirm-register.component';

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'esqueci-minha-senha', component: ResetPasswordComponent},
    {path: 'recuperar-senha/:code/:username', component: ConfirmResetPasswordComponent},
    {path: 'confirmar-cadastro/:code/:username', component: ConfirmRegisterComponent},
    {path: 'cadastro/:token', component: RegisterComponent},

    {path: '', redirectTo: 'minhas-cotacoes', pathMatch: 'full'},
    {path: 'minhas-cotacoes', component: QuotationsComponent, canActivate: [AuthGuardService]},
    {path: 'editar', component: ProfileComponent, canActivate: [AuthGuardService]},

    {path: '**', component: LoginComponent},
];

export const routing = RouterModule.forRoot(routes, {useHash: true});


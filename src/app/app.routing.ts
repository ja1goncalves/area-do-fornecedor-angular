import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './services/auth/auth-guard.service';
import { LoginComponent } from './components/pages/login/login.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { QuotationsComponent } from './components/pages/quotations/quotations.component';
import { ResetPasswordComponent } from './components/pages/reset-password/reset-password';

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'esqueci-minha-senha', component: ResetPasswordComponent},
    {path: '', component: QuotationsComponent, canActivate: [AuthGuardService]},
    {path: 'editar', component: ProfileComponent, canActivate: [AuthGuardService]},
];

export const routing = RouterModule.forRoot(routes, {useHash: true});


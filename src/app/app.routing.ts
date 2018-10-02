import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { QuotationsComponent } from './components/pages/quotations/quotations.component';

const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'cotacoes', component: QuotationsComponent},
    {path: 'perfil', component: ProfileComponent}
]

export const routing = RouterModule.forRoot(routes);


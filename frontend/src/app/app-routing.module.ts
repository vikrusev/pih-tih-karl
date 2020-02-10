import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedUserGuard } from './guards/logged-user.guard'

import { MainLayout } from './components/layout/main.layout';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RaceComponent } from './components/race/race.component';


const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: '',
                component: HomeComponent 
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'race',
                canActivate: [LoggedUserGuard],
                component: RaceComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

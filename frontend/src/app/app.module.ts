import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

// Custom modules
import { SharedModule } from './shared/shared.module' 

// Material modules
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material';

// Interceptors
import { UrlInterceptor } from './interceptors/url.interceptor';

// Guards
import { LoggedUserGuard } from './guards/logged-user.guard';

// Layouts
import { MainLayout } from './components/layout/main.layout';
import { NavbarLayout } from './components/layout/navbar/navbar.layout';

// Components
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { GameComponent } from './components/race/game/game.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RaceComponent } from './components/race/race.component';
import { RaceMatTableComponent } from './components/race/race-mat-table/race-mat-table.component';


@NgModule({
    declarations: [
        AppComponent,
        MainLayout,
        NavbarLayout,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        GameComponent,
        ProfileComponent,
        RaceComponent,
        RaceMatTableComponent
    ],
    imports: [
        SharedModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatSliderModule,
        MatToolbarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: UrlInterceptor,
            multi: true
        },
        LoggedUserGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

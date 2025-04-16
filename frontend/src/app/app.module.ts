import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResourceComponent } from './resource/resource.component';
import { RessourceComponent } from './components/ressource/ressource.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './components/category/category.component'; // ✅ Import this

@NgModule({
  declarations: [
    AppComponent,
    ResourceComponent,
    RessourceComponent,
    HomeComponent,
    CategoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule // ✅ Add it here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

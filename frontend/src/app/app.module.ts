import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'; // Your main component
import { TaskComponent } from './task/task.component';
import {FormsModule} from "@angular/forms";
import { AddTaskComponent } from './task/add/add.component';
import { UpdateTaskComponent } from './task/update/update.component'; // Import your new component (if you have one)

@NgModule({
  declarations: [
    AppComponent, // Declare the AppComponent
    TaskComponent, AddTaskComponent, UpdateTaskComponent // Declare your TaskComponent (if you create one to display tasks)
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    // Add HttpClientModule to the imports to make HTTP requests
  ],
  providers: [],
  bootstrap: [AppComponent] // Bootstrap your main component
})
export class AppModule { }

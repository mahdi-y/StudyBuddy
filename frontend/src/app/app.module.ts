import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudyGroupComponent } from './components/study-group/study-group.component';
import { ChatComponent } from './components/chat/chat.component';
import { MessageService } from './services/message.service';

@NgModule({
  declarations: [
    AppComponent,
    StudyGroupComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: 'API_URL', useValue: 'http://localhost:9099/api' },
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

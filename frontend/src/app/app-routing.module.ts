import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudyGroupComponent } from './components/study-group/study-group.component';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  { path: '', redirectTo: '/study-group/1', pathMatch: 'full' },
  { path: 'study-group/:userId', component: StudyGroupComponent },
  { path: 'chat/:chatId/user/:userId', component: ChatComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

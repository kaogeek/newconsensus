/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import {
  DebatePage, RoomPage, MainPage, TagPage,RerateTagPage, PageContentPage, MainPageSlidePage, MainPageVideoPage, ActivityNewsPage, ProposalPage, VotePage, LoginPage, PartnerPage, ConfigPage, LoginLogPage, ProposalLogsPage, DebateLogsPage, SlideLogsPage, VideoLogsPage, HomeContentPage, UserPage, AdminPage,
} from './components/components';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  },
  {
    path: LoginPage.PAGE_NAME,
    component: LoginPage
  },
  {
    path: 'main',
    component: MainPage,
    children: [
      {
        path: RoomPage.PAGE_NAME,
        component: RoomPage
      },
      {
        path: TagPage.PAGE_NAME,
        component: TagPage
      },
      {
        path: RerateTagPage.PAGE_NAME,
        component: RerateTagPage
      },
      {
        path: ConfigPage.PAGE_NAME,
        component: ConfigPage
      },
      {
        path: PartnerPage.PAGE_NAME,
        component: PartnerPage
      },
      {
        path: PageContentPage.PAGE_NAME,
        component: PageContentPage
      },
      // {
      //   path: HomeContentPage.PAGE_NAME,
      //   component: HomeContentPage,
      //   children: [
          {
            path: MainPageSlidePage.PAGE_NAME,
            component: MainPageSlidePage
          },
          {
            path: MainPageVideoPage.PAGE_NAME,
            component: MainPageVideoPage
        //   }
        // ]
      },
      {
        path: ActivityNewsPage.PAGE_NAME,
        component: ActivityNewsPage
      },
      {
        path: DebatePage.PAGE_NAME,
        component: DebatePage
      },
      { 
        path: ProposalPage.PAGE_NAME,
        component: ProposalPage
      },
      {
        path: VotePage.PAGE_NAME,
        component: VotePage
      },
      {
        path: LoginLogPage.PAGE_NAME,
        component: LoginLogPage
      },
      {
        path: ProposalLogsPage.PAGE_NAME,
        component: ProposalLogsPage
      },
      {
        path: DebateLogsPage.PAGE_NAME,
        component: DebateLogsPage
      },
      {
        path: SlideLogsPage.PAGE_NAME,
        component: SlideLogsPage
      },
      {
        path: UserPage.PAGE_NAME,
        component: UserPage
      },
      {
        path: AdminPage.PAGE_NAME,
        component: AdminPage
      },
      {
        path: VideoLogsPage.PAGE_NAME,
        component: VideoLogsPage
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }

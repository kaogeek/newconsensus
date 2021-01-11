/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  // Pages
  LoginPage, MainPage, DebatePage, DebateCreatePage, DebatePostPage, DebateTopPostPage, DebateCommentPage,
  ProposalPage, ProposalCommentPage, ProposalTopPostPage, ProposalPostPage, ProposalCreatePage, ProposalEditPage, RoomPage,
  VotePage, VoteCommentPage, HomePage, RegisterPage, ContentPage, ContentMainPage, ActivitiesDetailPage, ActivitiesAllPage,
  VoteCommentPostPage, ProfileUserPage, ContentPostPage, EditProfileUserPage, DebateUserPage, VoteCommentUserPage, ProposalUserPage, DebateListPage, ProposalListPage, ProposalRoomListPage,
  RegisterEmailPage } from './components/components';

import { TestComponent } from './components/TestComponent.component';
import { ListPage } from './components/pages/main.internal/content.internal/ListPage.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: MainPage.PAGE_NAME,
    component: MainPage,
    children: [
      {
        path: '',
        component: HomePage,
      },
      {
        path: HomePage.PAGE_NAME,
        component: HomePage,
      },
      {
        path: LoginPage.PAGE_NAME,
        component: LoginPage,
      },
      {
        path: RegisterEmailPage.PAGE_NAME,
        component: RegisterEmailPage,
      },
      {
        path: ProfileUserPage.PAGE_NAME,
        component: ProfileUserPage,
        children: [
          {
            path: EditProfileUserPage.PAGE_NAME,
            component: EditProfileUserPage,
          },
          {
            path: DebateUserPage.PAGE_NAME,
            component: DebateUserPage,
          },
          {
            path: ProposalUserPage.PAGE_NAME,
            component: ProposalUserPage,
          },
          {
            path: VoteCommentUserPage.PAGE_NAME,
            component: VoteCommentUserPage,
          },
        ]
      },
      {
        path: RegisterPage.PAGE_NAME,
        component: RegisterPage,
      },
      {
        path: DebatePage.PAGE_NAME,
        component: DebatePage,
        children: [
          {
            path: '',
            component: DebateTopPostPage,
          },
          {
            path: ':mode',
            component: DebateListPage,
          },
          {
            path: DebateTopPostPage.PAGE_NAME,
            component: DebateTopPostPage,
          },
          {
            path: 'comment',
            component: DebateCommentPage,
            children: [

              {
                path: '',
                component: DebatePostPage,
              },
              {
                path: 'create',
                component: DebateCreatePage,
              },
              {
                path: 'post',
                component: DebatePostPage,
                children: [
                  {
                    path: '**',
                    component: DebatePostPage,
                  }
                ]
              }
            ]
          },
        ]
      },
      {
        path: ProposalPage.PAGE_NAME,
        component: RoomPage,
        children: [
          {
            path: '', 
            component: ProposalPage,
            children: [
              {
                path: '',
                component: ProposalTopPostPage,
              },
              {
                path: ':mode',
                component: ProposalListPage,
              },
              {
                path: "comment",
                component: ProposalCommentPage,
                children: [
                  {
                    path: '',
                    component: ProposalPostPage,
                  },
                  {
                    path: 'create',
                    component: ProposalCreatePage,
                  },
                  {
                    path: 'edit',
                    component: ProposalEditPage,
                  },
                  {
                    path: 'post',
                    component: ProposalPostPage,
                    children: [
                      {
                        path: '**',
                        component: ProposalPostPage,
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            path: RoomPage.PAGE_NAME + "/:id",
            component: ProposalPage,
            children: [
              {
                path: '',
                component: ProposalTopPostPage,
              },
              {
                path: ':mode',
                component: ProposalRoomListPage,
              },
              {
                path: "post",
                component: ProposalTopPostPage,
              },
              {
                path: "comment",
                component: ProposalCommentPage,
                children: [
                  {
                    path: '',
                    component: ProposalPostPage,
                  },
                  {
                    path: 'create',
                    component: ProposalCreatePage,
                  },
                  {
                    path: 'edit',
                    component: ProposalEditPage,
                  },
                  {
                    path: 'post',
                    component: ProposalPostPage,
                    children: [
                      {
                        path: '**',
                        component: ProposalPostPage,
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: ContentPage.PAGE_NAME,
        component: ContentPage,
        children: [
          {
            path: '',
            component: ContentMainPage,
          },
          {
            path: "main",
            component: ContentMainPage,
          },
          {
            path: "activities",
            component: ActivitiesAllPage,
          },
          {
            path: "activities" + '/:id',
            component: ActivitiesDetailPage,
          },
          {
            path: "list",
            component: ListPage,
          },
          {
            path: "postpage" + '/:id',
            component: ContentPostPage,
          },
        ]
      },
      {
        path: VoteCommentPage.PAGE_NAME,
        component: VoteCommentPage,
        children: [
          {
            path: '',
            component: VotePage,
          },
          {
            path: VotePage.PAGE_NAME,
            component: VotePage,
          },
          {
            path: 'comment',
            component: VoteCommentPostPage,
            children: [
              {
                path: '**',
                component: VoteCommentPostPage,
              }
            ]
          }
        ]
      },
    ]
  },

  {
    path: 'test',
    component: TestComponent
  },
];

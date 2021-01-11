/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { NgxGalleryModule } from 'ngx-gallery';
import { GalleryModule, GALLERY_CONFIG } from '@ngx-gallery/core';
import { LightboxModule, LIGHTBOX_CONFIG } from '@ngx-gallery/lightbox';
import { GallerizeModule } from '@ngx-gallery/gallerize';
import { ImageCropperComponent } from "ngx-img-cropper";
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr'
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {NgxPaginationModule} from 'ngx-pagination';

// material ag
import {
  MatCheckboxModule, MatButtonModule, MatInputModule, MatAutocompleteModule, MatDatepickerModule,
  MatFormFieldModule, MatRadioModule, MatSelectModule, MatSliderModule, MatGridListModule,
  MatSlideToggleModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatListModule,
  MatStepperModule, MatTabsModule, MatExpansionModule, MatButtonToggleModule,
  MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule, MatDialogModule,
  MatTooltipModule, MatSnackBarModule, MatTableModule, MatSortModule, MatPaginatorModule, MatNativeDateModule, MatCardModule, MatRippleModule, MAT_DIALOG_DATA, MatDialogRef, MatBadgeModule, DateAdapter
} from '@angular/material';

import {
  PrefixNumberPipe, ShortNumberPipe, SafePipe, RemoveBadWords
} from './components/shares/pipes/pipes';

import {
  DebounceClickDirective
} from './components/shares/directive/directives';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_ROUTES } from './app-routing.module'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  HeaderTop,
  HeaderBottom,
  Footer,
  // page
  HomePage,
  LoginPage,
  RegisterEmailPage,
  ProfileUserPage,
  RoomPage,
  MainPage,
  DebatePage,
  DebateCommentPage,
  DebateCreatePage,
  DebatePostPage,
  DebateTopPostPage,
  DebateListPage,
  DialogEditComment,
  ContentPage,
  ContentMainPage,
  ListPage,
  ActivitiesAllPage,
  ActivitiesDetailPage,
  ContentPostPage,
  ProposalPage,
  ProposalListPage,
  ProposalRoomListPage,
  ProposalCommentPage,
  ProposalTopPostPage,
  ProposalPostPage,
  ProposalCreatePage,
  ProposalEditPage,
  VotePage,
  VoteCommentPage,
  VoteCommentPostPage,
  RegisterPage,
  DebateUserPage,
  EditProfileUserPage,
  ProposalUserPage,
  VoteCommentUserPage,
  VideoView,
  Pagination,
  // shares
  DialogImage,
  DialogAlert,
  NewConButton,
  NewConButtonSave,
  NewConButtonLoadMore,
  RoomButton,
  VoteCard,
  ContentCard,
  CommentItem,
  SupporterBar,
  TopicProfile,
  ProposalProfile,
  AddDebate,
  VoteContentCard,
  Content,
  CommentVoteItem,
  AuthenCheckPage,
  Loading,
  IconUser,
  SwiperSlider,
  AutoComp,
  Rd,
  AutoCompSelector,
  MultipleSelectAutoComp,
  UserPostCard,
  UserCommentCard,
  PaginatorCard,
  PaginatorCardComment,
  EditUserDebate,
  EditUserProposal,
  DialogWarningComponent,
  AutoCompEducation,
  AutoCompCareer


} from './components/components';

// remove when finished test
import { TestComponent } from './components/TestComponent.component';

import {
  // Manager
  AuthenManager,
  HotConfigInfo,
  PageUserInfo,
  ObservableManager,
  CacheConfigInfo,
  // Facade
  DebateFacade,
  DebateCommentFacade,
  TagFacade,
  RelateTagFacade,
  RoomFacade,
  PartnerFacade,
  ProposalFacade,
  ProposalCommentFacade,
  ActivityNewsFacade,
  MainPageVideoFacade,
  VoteFacade,
  VoteCommentFacade,
  PageContentFacade,
  PageContentHasTagFacade,
  ImageFacade,
  EditProfileUserPageFacade,
  PostcodeFacade,
  MainPageSlideFacade,
  ActionLogFacade
} from './services/services';

import { registerLocaleData } from '@angular/common';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

export const BOOSTRAP_CLASSES: any[] = [AppComponent];

const COMPONENTS: any[] = [
  // Bootstrap Classes
  AppComponent,
  HeaderTop,
  HeaderBottom,
  Footer,
  // Pages
  HomePage,
  LoginPage,
  RegisterEmailPage,
  ProfileUserPage,
  RoomPage,
  MainPage,
  DebatePage,
  DebateCommentPage,
  DebateCreatePage,
  DebatePostPage,
  DebateTopPostPage,
  DebateListPage,
  DialogEditComment,
  ContentPage,
  ContentMainPage,
  ListPage,
  ActivitiesAllPage,
  ActivitiesDetailPage,
  ContentPostPage,
  ProposalPage,
  ProposalListPage,
  ProposalRoomListPage,
  ProposalCommentPage,
  ProposalTopPostPage,
  ProposalPostPage,
  ProposalCreatePage,
  ProposalEditPage,
  VotePage,
  VoteCommentPage,
  VoteCommentPostPage,
  RegisterPage,
  DebateUserPage,
  EditProfileUserPage,
  ProposalUserPage,
  VoteCommentUserPage,
  VideoView,
  Pagination,
  // shares
  DialogImage,
  DialogAlert,
  NewConButton,
  NewConButtonSave,
  NewConButtonLoadMore,
  RoomButton,
  VoteCard,
  ContentCard,
  CommentItem,
  SupporterBar,
  TopicProfile,
  ProposalProfile,
  AddDebate,
  Rd,
  VoteContentCard,
  Content,
  CommentVoteItem,
  AuthenCheckPage,
  ImageCropperComponent,
  Loading,
  IconUser,
  SwiperSlider,
  AutoComp,
  AutoCompSelector,
  MultipleSelectAutoComp,
  UserCommentCard,
  PaginatorCard,
  UserPostCard,
  PaginatorCardComment,
  EditUserDebate,
  EditUserProposal,
  DialogWarningComponent,
  AutoCompEducation,
  AutoCompCareer,
  // test
  TestComponent
];

const PIPE_CLASSES: any[] = [
  //Pipe
  ShortNumberPipe,
  PrefixNumberPipe,
  SafePipe,
  RemoveBadWords,
];

const DIRECTIVE_CLASSES: any[] = [
  //Directive
  DebounceClickDirective
];

const SERVICE_CLASSES: any[] = [
  // manager
  AuthenManager,
  HotConfigInfo,
  PageUserInfo,
  ObservableManager,
  CacheConfigInfo,
  // facade
  DebateFacade,
  DebateCommentFacade,
  TagFacade,
  RelateTagFacade,
  RoomFacade,
  PartnerFacade,
  ActivityNewsFacade,
  MainPageVideoFacade,
  VoteFacade,
  ProposalFacade,
  ActivityNewsFacade,
  MainPageSlideFacade,
  VoteCommentFacade,
  ProposalCommentFacade,
  PageContentFacade,
  PageContentHasTagFacade,
  ImageFacade,
  EditProfileUserPageFacade,
  PostcodeFacade,
  ActionLogFacade,
  { provide: MAT_DIALOG_DATA, useValue: {} },
  { provide: MatDialogRef, useValue: {} },
  // other
  {
    provide: SWIPER_CONFIG,
    useValue: DEFAULT_SWIPER_CONFIG
  },
  {
    provide: GALLERY_CONFIG,
    useValue: {
      dots: false,
      counter: false,
      loop: false,
      imageSize: 'cover',
      thumbWidth: '160',
      thumbHeight: '120'
    }
  },
  {
    provide: LIGHTBOX_CONFIG,
    useValue: {
      keyboardShortcuts: false
    }
  },
];
registerLocaleData(localeFr, 'th-TH', localeFrExtra);

@NgModule({

  imports: [
    BrowserModule,
    FontAwesomeModule,
    GalleryModule,
    LightboxModule,
    GallerizeModule,
    NgxPaginationModule,
    NgxGalleryModule,
    SwiperModule,
    FormsModule,
    CKEditorModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot(APP_ROUTES),
    BrowserAnimationsModule,
    MatCheckboxModule, MatButtonModule, MatInputModule, MatAutocompleteModule, MatDatepickerModule,
    MatFormFieldModule, MatRadioModule, MatSelectModule, MatSliderModule, MatGridListModule,
    MatSlideToggleModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatListModule,
    MatStepperModule, MatTabsModule, MatExpansionModule, MatButtonToggleModule,
    MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule, MatDialogModule,
    MatTooltipModule, MatSnackBarModule, MatTableModule, MatSortModule, MatPaginatorModule, MatNativeDateModule, MatCardModule,
    MatRippleModule, MatBadgeModule
  ],
  providers: SERVICE_CLASSES,
  bootstrap: BOOSTRAP_CLASSES,
  declarations: COMPONENTS.concat(PIPE_CLASSES).concat(DIRECTIVE_CLASSES),
  entryComponents: COMPONENTS,
})
export class AppModule {

}

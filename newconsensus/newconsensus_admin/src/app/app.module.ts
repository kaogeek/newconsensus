import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { ColorChromeModule } from 'ngx-color/chrome';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

// material ag
import {
  MatCheckboxModule, MatButtonModule, MatInputModule, MatAutocompleteModule, MatDatepickerModule,
  MatFormFieldModule, MatRadioModule, MatSelectModule, MatSliderModule, MatGridListModule,
  MatSlideToggleModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatListModule,
  MatStepperModule, MatTabsModule, MatExpansionModule, MatButtonToggleModule,
  MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule, MatDialogModule,
  MatTooltipModule, MatSnackBarModule, MatTableModule, MatSortModule, MatPaginatorModule, MatNativeDateModule, MatCardModule, MatRippleModule
} from '@angular/material';

import { AppRoutingModule } from './app.routing';
// import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { RoomPage,
  UserPage,
  AdminPage,
  PartnerPage,
  LoginPage,
  LoginLogPage,
  TagPage,
  RerateTagPage,
  PageContentPage, FooterComponent, DebatePage,
  DebateLogsPage,
  SlideLogsPage,
  VideoLogsPage,
  DebateCommentPage,
  MainPageSlidePage,
  MainPageVideoPage,
  DialogDeleteComponent,
  ColumnTable,
  ActivityNewsPage,
  ProposalPage,
  ProposalLogsPage,
  ProposalCommentPage,
  ConfigPage,
  VotePage,
  VoteCommentPage,
  HomeContentPage, MainPage,
  AutoComp,
  VideoView,
  MenuItem,
  AutoCompSelector, FormComponent,
TableComponent, 
DialogWarningComponent} from './components/components';
import { AuthenManager, DebateFacade,
  UserFacade, DebateCommentFacade, TagFacade,RerateTagFacade,
  ConfigFacade, RoomFacade,
  PartnerFacade,
PageContentFacade,
ProposalFacade,
ProposalCommentFacade,
PageUserFacade,
VoteFacade,
VoteCommentFacade,
MainPageVideoFacade,
LoginLogFacade,
ActivityNewsFacade,
MainPageSlideFacade } from './services/services';
import { SafePipe,
ShortNumberPipe,
PrefixNumberPipe } from './components/shares/pipes/pipes';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

export const BOOSTRAP_CLASSES: any[] = [AppComponent];

const COMPONENTS: any[] = [
  AppComponent,

  // Bootstrap Classes
  FooterComponent,
  MainPage,
  AutoComp,
  VideoView,
  MenuItem,
  AutoCompSelector,
  RoomPage,
  UserPage,
  AdminPage,
  PartnerPage,
  LoginPage,
  LoginLogPage,
  TagPage,
  RerateTagPage,
  PageContentPage,
  DebatePage,
  DebateLogsPage,
  SlideLogsPage,
  VideoLogsPage,
  DebateCommentPage,
  MainPageSlidePage,
  MainPageVideoPage,
  ActivityNewsPage,
  ProposalPage,
  ProposalLogsPage,
  ProposalCommentPage,
  ConfigPage,
  VotePage,
  VoteCommentPage,
  HomeContentPage,
  // component 
  FormComponent,
  DialogDeleteComponent,
  ColumnTable,
  DialogWarningComponent,
  TableComponent
];

const PIPE_CLASSES: any[] = [
  //Pipe
  SafePipe,
  ShortNumberPipe,
  PrefixNumberPipe,
]

const SERVICE_CLASSES: any[] = [
  // manager
  AuthenManager,
  // facade
  DebateFacade,
  UserFacade,
  DebateCommentFacade,
  TagFacade, 
  RerateTagFacade,
  ConfigFacade,
  RoomFacade,
  PartnerFacade,
  PageContentFacade,
  ProposalFacade,
  ProposalCommentFacade,
  PageUserFacade,
  VoteFacade,
  VoteCommentFacade,
  MainPageVideoFacade,
  LoginLogFacade,
  ActivityNewsFacade, 
  MainPageSlideFacade,
  // other 
  {
    provide: SWIPER_CONFIG,
    useValue: DEFAULT_SWIPER_CONFIG
  },
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CKEditorModule,
    DragDropModule,
    ColorChromeModule,
    RouterModule,
    AppRoutingModule,
    SwiperModule,
    NgbModule,
    ToastrModule.forRoot(),
    MatCheckboxModule, MatButtonModule, MatInputModule, MatAutocompleteModule, MatDatepickerModule,
    MatFormFieldModule, MatRadioModule, MatSelectModule, MatSliderModule, MatGridListModule,
    MatSlideToggleModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatListModule,
    MatStepperModule, MatTabsModule, MatExpansionModule, MatButtonToggleModule,
    MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule, MatDialogModule,
    MatTooltipModule, MatSnackBarModule, MatTableModule, MatSortModule, MatPaginatorModule, MatNativeDateModule, MatCardModule,
    MatRippleModule
  ],
  providers: SERVICE_CLASSES,
  bootstrap: BOOSTRAP_CLASSES,
  declarations: COMPONENTS.concat(PIPE_CLASSES),
  entryComponents: COMPONENTS
})
export class AppModule { }

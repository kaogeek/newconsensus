/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenManager } from 'src/app/services/AuthenManager.service';
import { ImageFacade, DebateFacade, VoteFacade, ProposalFacade, VoteCommentFacade } from 'src/app/services/services';
import { ObservableManager } from 'src/app/services/ObservableManager.service';
import { SearchFilter } from 'src/app/models/models';
import { AbstractPage } from '../AbstractPage';
import { MatDialog } from '@angular/material';
import { CacheConfigInfo } from '../../../services/CacheConfigInfo.service';
import { DEBATE_MENU_ENABLE, VOTE_MENU_ENABLE } from '../../../Constants';

const DEFAULT_USER_ICON: string = '../../../assets/components/pages/icons8-female-profile-128.png';
const PAGE_NAME: string = 'profile';
const SEARCH_LIMIT: number = 5;
const SEARCH_OFFSET: number = 0;

@Component({
  selector: 'newcon-profile-user-page',
  templateUrl: './ProfileUserPage.component.html',
})
export class ProfileUserPage extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private imageAvatarFacade: ImageFacade;
  private debateFacade: DebateFacade;
  private observManager: ObservableManager;
  private proposalFacade: ProposalFacade;
  private voteCommentFacade: VoteCommentFacade;
  private userImage: any;
  private profileUser: any;
  private cacheConfigInfo: CacheConfigInfo;

  public isProfileMenu: boolean = false;
  public resDebate: any = [];
  public resVote: any = [];
  public resProposal: any = [];
  public debateCount: number;
  public voteCount: number;
  public proposalCount: number;
  public totalPost: any;
  public isShowDebate: boolean;
  public isShowVote: boolean;

  constructor(router: Router, authenManager: AuthenManager,
    observManager: ObservableManager, imageAvatarFacade: ImageFacade,
    debateFacade: DebateFacade, proposalFacade: ProposalFacade,
    voteCommentFacade: VoteCommentFacade, dialog: MatDialog,cacheConfigInfo: CacheConfigInfo) {
    super(PAGE_NAME, authenManager, dialog, router);
    this.router = router;
    this.authenManager = authenManager;
    this.observManager = observManager;
    this.imageAvatarFacade = imageAvatarFacade;
    this.debateFacade = debateFacade;
    this.proposalFacade = proposalFacade;
    this.voteCommentFacade = voteCommentFacade;
    this.isShowDebate = false;
    this.isShowVote = false;
    this.cacheConfigInfo = cacheConfigInfo;

    this.cacheConfigInfo.getConfig(DEBATE_MENU_ENABLE).then((config: any) => {
      if (config.value !== undefined) {
        this.isShowDebate = (config.value.toLowerCase() === 'true');
      }
    }).catch((error: any) => { console.log(error) });

    this.cacheConfigInfo.getConfig(VOTE_MENU_ENABLE).then((config: any) => {
      if (config.value !== undefined) {
        this.isShowVote = (config.value.toLowerCase() === 'true');
      }
    }).catch((error: any) => { console.log(error) });

    this.observManager.subscribe('authen.check', (data: any) => {
      this.reloadUserImage();
      this.searchDebateCount();
      this.searchVoteCount();
      this.searchProposalCount();
    });
    this.observManager.subscribe('authen.pageUser', (pageUser: any) => {
      this.profileUser = pageUser;
    });
    this.observManager.subscribe('authen.image', (image: any) => {
      this.userImage = image;
    });

    if (this.router.url === "/main/profile") {
      this.router.navigateByUrl('/main/profile/edit');
    }

  }
  ngOnInit(): void {
    super.ngOnInit();
    this.searchDebateCount();
    this.searchVoteCount();
    this.searchProposalCount();
    this.reloadUserImage();
  }

  public clickprofilemenu() {
    if (window.innerWidth > 768) {
      this.isProfileMenu = false;
    } else {
      this.isProfileMenu = !this.isProfileMenu;
    }
  }

  public reloadUserImage(): void {
    this.userImage = undefined;
    this.profileUser = this.authenManager.getCurrentUser();
    if (this.profileUser !== undefined && this.profileUser !== null) {
      this.imageAvatarFacade.avatarProfile(this.profileUser.avatar, this.profileUser.avatarPath).then((result: any) => {
        let blob = result;
        this.getBase64ImageFromBlob(blob);
      }).catch((error: any) => {
        // console.log('error: ' + JSON.stringify(error));
        this.userImage = undefined;
      });
    }
  }

  public getBase64ImageFromBlob(imageUrl): void {
    var reader = new FileReader();
    reader.readAsDataURL(imageUrl);
    reader.onloadend = () => {
      var base64data = reader.result;
      this.userImage = base64data;
    }
  }

  public getCurrentUserImage(): string {
    return (this.userImage) ? this.userImage : DEFAULT_USER_ICON;
  }

  public searchDebateCount(): void {
    let user = this.authenManager.getCurrentUser();
    if (user != null && user != undefined) {
      let userId = user.id;
      let filter = new SearchFilter();
      filter.limit = SEARCH_LIMIT;
      filter.offset = SEARCH_OFFSET;
      filter.whereConditions = [{
        'createdBy': userId
      }];
      filter.count = true;
      this.debateFacade.search(filter).then((res: any) => {
        if (res.length != 0) {
          this.debateCount = res;
        } else {
          this.debateCount = 0;
        }
      }).catch((err: any) => {
        // console.log(err);
      })
    }
  }
  public searchVoteCount(): void {
    let user = this.authenManager.getCurrentUser();
    if (user != null && user != undefined) {
      let userId = user.id;
      let filter = new SearchFilter();
      filter.limit = SEARCH_LIMIT;
      filter.offset = SEARCH_OFFSET;
      filter.whereConditions = [{
        'createdBy': userId
      }];
      filter.count = true;
      this.voteCommentFacade.searchUserVoteComment(filter).then((res: any) => {
        if (res.length != 0) {
          this.voteCount = res;
        } else {
          this.voteCount = 0;
        }
      }).catch((err: any) => {
        // console.log(err);
      })
    }
  }
  public searchProposalCount(): void {
    let user = this.authenManager.getCurrentUser();
    if (user != null && user != undefined) {
      let userId = user.id;
      let filter = new SearchFilter();
      filter.limit = SEARCH_LIMIT;
      filter.offset = SEARCH_OFFSET;
      filter.whereConditions = [{
        'createdBy': userId
      }];
      filter.count = true;
      this.proposalFacade.search(filter).then((res: any) => {
        if (res.length != 0) {
          this.proposalCount = res;
        } else {
          this.proposalCount = 0;
        }

      }).catch((err: any) => {
        // console.log(err);
      })
    }
  }

  public getAllCount(): number {
    return ((this.debateCount !== undefined) ? this.debateCount : 0) + ((this.proposalCount !== undefined) ? this.proposalCount : 0) + ((this.voteCount !== undefined) ? this.voteCount : 0);
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatDialog } from '@angular/material';
import { VoteFacade } from '../../../../services/facade/VoteFacade.service';
import { ConfigFacade } from '../../../../services/facade/ConfigFacade.service';
import { Vote } from '../../../../models/Vote';
import { VoteCommentPage } from './VoteCommentPage.component';
import { AbstractPage } from '../../AbstractPage.component';
import { FieldRadio } from '../../../shares/FormComponent.component';
import { VideoForm } from '../../../shares/VideoView.component';

const PAGE_NAME: string = "vote";
const VOTE_PROPOSAL_REQUIRED_NAME: string = "vote.proposal.required";

@Component({
  selector: 'admin-vote-page',
  templateUrl: './VotePage.component.html'
})
export class VotePage extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private voteFacade: VoteFacade;
  private configFacade: ConfigFacade;

  @ViewChild("drawerComment")
  public drawerComment: MatDrawer;
  @ViewChild("voteComment")
  public voteComment: VoteCommentPage;
  public dataForm: Vote;
  public fieldRadios: FieldRadio[];
  public videoForm: VideoForm;
  public isProposalRequired: boolean;

  constructor(voteFacade: VoteFacade, dialog: MatDialog, configFacade: ConfigFacade) {
    super(PAGE_NAME, dialog);
    this.voteFacade = voteFacade;
    this.configFacade = configFacade;
    // fetch config
    {
      this.isProposalRequired = false;
      this.configFacade.find(VOTE_PROPOSAL_REQUIRED_NAME).then((result: any) => {
        if (result && result.value !== undefined) {
          try{
            this.isProposalRequired = result.value.toLocaleLowerCase() === 'true';
          }catch(error){}
        }
      }).catch(() => {});
    }
    this.videoForm = {
      width: "",
      height: "47vw",
      class: "newcon-vote-comment-content-layout-video",
    }
    this.fieldTable = [
      {
        name: "proposalId",
        label: "รหัสกระทู้รับรอง",
        width: "100pt",
        class: "", formatColor: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: true,
        align: "center"
      },
      {
        name: "roomId",
        label: "รหัสห้องพูดคุย",
        width: "100pt",
        class: "", formatColor: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: true,
        align: "center"
      },
      {
        name: "title",
        label: "ชื่อ",
        width: "150pt",
        class: "", formatColor: false, formatImage: false,
        link: [
          {
            link: "https://newconsen.io:4200/main/vote/comment/",
            isField: false
          },
          {
            link: "id",
            isField: true
          },
          {
            link: "-",
            isField: false
          },
          {
            link: "title",
            isField: true
          }
        ],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "content",
        label: "เนื้อหา",
        width: "300pt",
        class: "", formatColor: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "description",
        label: "คำอธิบาย",
        width: "200pt",
        class: "", formatColor: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "voteCount",
        label: "จำนวนโหวต",
        width: "100pt",
        class: "", formatColor: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "center"
      },
      {
        name: "isActive",
        label: "สถานะ",
        width: "70pt",
        class: "", formatColor: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "center"
      },
      {
        name: "tagline",
        label: "Tagline",
        width: "100pt",
        class: "", formatColor: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "coverImage",
        label: "รูปปก",
        width: "175pt",
        class: "", formatColor: false, formatImage: true,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "videoUrl",
        label: "วิดีโอ",
        width: "175pt",
        class: "", formatColor: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "imageUrl",
        label: "รูปภาพ",
        width: "175pt",
        class: "", formatColor: false, formatImage: true,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "link",
        label: "ลิงค์",
        width: "175pt",
        class: "", formatColor: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "left"
      },
      {
        name: "likeCount",
        label: "จำนวนไลค์",
        width: "70pt",
        class: "", formatColor: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "right"
      },
      {
        name: "dislikeCount",
        label: "จำนวนดิสไลค์",
        width: "70pt",
        class: "", formatColor: false, formatImage: false,
        link: [],
        formatDate: false,
        formatId: false,
        align: "right"
      },
      {
        name: "endDate",
        label: "วันที่สิ้นสุด",
        width: "70pt",
        class: "", formatColor: false, formatImage: false,
        link: [],
        formatDate: true,
        formatId: false,
        align: "left"
      },
    ]
    this.actions = {
      isOfficial: false, isBan: false,
      isApprove: false,
      isCreate: true,
      isEdit: true,
      isDelete: true,
      isComment: true,
      isBack: false
    };
    this.setFields();
  }

  public ngOnInit() {
  }

  private setFields(): void {
    this.fieldRadios = [
      // {
      //     name: "เลือก",
      //     fieldSelect: "",
      //     field: [
      //         {
      //             name: "กระทู้รับรอง",
      //             field: "proposalId",
      //             type: "autocomp",
      //             placeholder: "",
      //             required: false,
      //             disabled: false
      //         },
      // {
      //     name: "ห้องพูดคุย",
      //     field: "roomId",
      //     type: "autocomp",
      //     placeholder: "",
      //     required: false,
      //     disabled: false
      // }
      //     ]
      // },
      {
        name: "เลือก",
        fieldSelect: "videoUrl",
        field: [
          {
            name: "วิดีโอ",
            field: "videoUrl",
            type: "text",
            placeholder: "http://example.com",
            required: true,
            disabled: false
          },
          {
            name: "ลิ้งค์รูปภาพ",
            field: "imageUrl",
            type: "text",
            placeholder: "http://example.com",
            required: true,
            disabled: false
          }
        ]
      }
    ];
    this.fields = [
      {
        name: "กระทู้รับรอง",
        field: "proposalId",
        type: "autocomp",
        placeholder: "",
        required: this.isProposalRequired,
        disabled: false
      },
      {
        name: "ชื่อ",
        field: "title",
        type: "text",
        placeholder: "",
        required: true,
        disabled: false
      },
      {
        name: "เนื้อหา",
        field: "content",
        type: "contentEditor",
        placeholder: "",
        required: true,
        disabled: false
      },
      {
        name: "คำอธิบาย",
        field: "description",
        type: "textarea",
        placeholder: "ใส่คำอธิบาย",
        required: true,
        disabled: false
      },
      {
        name: "รูปปก",
        field: "coverImage",
        type: "text",
        placeholder: "http://example.com",
        required: true,
        disabled: false
      },
      {
        name: "คำอธิบาย",
        field: "tagline",
        type: "text",
        placeholder: "",
        required: false,
        disabled: false
      },
      {
        name: "สถานะ",
        field: "isActive",
        type: "boolean",
        placeholder: "",
        required: false,
        disabled: false
      },
      {
        name: "ลิงค์",
        field: "link",
        type: "text",
        placeholder: "http://example.com",
        required: false,
        disabled: false
      },
      {
        name: "วันที่สิ้นสุด",
        field: "endDate",
        type: "date",
        placeholder: "",
        required: false,
        disabled: false
      }
    ];
    this.dataForm = new Vote();
    this.dataForm.title = "";
    this.dataForm.content = "";
    this.dataForm.description = "";
    this.dataForm.proposalId = undefined;
    this.dataForm.roomId = undefined;
    this.dataForm.isActive = true;
    this.dataForm.coverImage = "";
    this.dataForm.tagline = "";
    this.dataForm.link = "";
    this.dataForm.endDate = undefined;
  }

  public clickComment(data: any): void {
    this.drawerComment.toggle();
    this.voteComment.table.parentId = data.id;
    this.voteComment.table.setTableConfig(data);
    this.voteComment.table.searchData();
  }

  public clickCreateForm(): void {
    this.drawer.toggle();
    this.setFields();
  }

  public clickEditForm(data: any): void {
    this.drawer.toggle();
    this.dataForm = JSON.parse(JSON.stringify(data));
    // if (this.dataForm.proposalId) {
    //     this.fieldRadios[0].fieldSelect = "proposalId";
    // } else if (this.dataForm.roomId) {
    //     this.fieldRadios[0].fieldSelect = "roomId";
    // }
    if (this.dataForm.videoUrl) {
      this.fieldRadios[0].fieldSelect = "videoUrl";
    } else if (this.dataForm.imageUrl) {
      this.fieldRadios[0].fieldSelect = "imageUrl";
    }
  }

  public clickVoteCommentBack(): void {
    this.drawerComment.toggle();
    if (this.dataForm.proposalId) {
      this.fieldRadios[0].fieldSelect = "proposalId";
    } else if (this.dataForm.roomId) {
      this.fieldRadios[0].fieldSelect = "roomId";
    }
  }

  public clickSave(): void {
    if (this.dataForm.proposalId === undefined) {
      this.dataForm.proposalId = null;
    }
    if (this.dataForm.id !== undefined && this.dataForm.id !== null) {
      this.voteFacade.edit(this.dataForm.id, this.dataForm).then((res: any) => {
        let index = 0;
        let data = this.table.data;
        for (let d of data) {
          if (d.id == res.id) {
            data[index] = res;
            break;
          }
          index++;
        }
        this.table.setTableConfig(data);
        this.drawer.toggle();
      }).catch((err: any) => {
        this.dialogWarning(err.error.message);
      });
    } else {
      this.voteFacade.create(this.dataForm).then((res: any) => {
        this.table.data.push(res);
        this.table.setTableConfig(this.table.data);
        this.drawer.toggle();
      }).catch((err: any) => {
        this.dialogWarning(err.error.message);
      });
    }
  }

  public clickDelete(data: any): void {
    this.voteFacade.delete(data.id).then((res) => {
      let index = 0;
      let dataTable = this.table.data;
      for (let d of dataTable) {
        if (d.id == data.id) {
          dataTable.splice(index, 1);
          this.table.setTableConfig(dataTable);
          this.dialogWarning("ลบข้อมูลสำเร็จ");
          break;
        }
        index++;
      }
    }).catch((err) => {
      this.dialogWarning(err.error.message);
    });
  }
}

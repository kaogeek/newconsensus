/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, Input, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper"; 

@Component({
  selector: 'dialog-image',
  templateUrl: './DialogImage.component.html'
  
})
export class DialogImage {

    @Input() name: string;
    public cropperSettings: CropperSettings;  
    public imageCropData:any;
    @ViewChild('cropper', undefined)
    public cropper:ImageCropperComponent;

    @ViewChild('fileimg', undefined)
    public fileimg: ElementRef<HTMLElement>;

  constructor(public dialogRef: MatDialogRef<DialogImage>, @Inject(MAT_DIALOG_DATA) public data: any) {    
    
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 100;
    this.cropperSettings.height = 100;
    this.cropperSettings.croppedWidth = 300;
    this.cropperSettings.croppedHeight = 300; 
    this.cropperSettings.rounded = true;
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings.minWidth = 300;
    this.cropperSettings.minHeight = 300;
    this.imageCropData = {};
  }  

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public onClickImg(): void {

    const inputimage = document.getElementById("inputimage");

    if (inputimage != null) {

      this.dialogRef.close(this.imageCropData);
      
    }  
  }

  public fileChangeListener($event) {
    var image:any = new Image();
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        that.cropper.setImage(image);
    };
    myReader.readAsDataURL(file);
  }

  public getImageData(){
    fetch(this.imageCropData.image)
        .then(res => res.blob())
        .then(blob => {
          var fd = new FormData()
          fd.append('image', blob, 'filename')
          // Upload
          // fetch('upload', {method: 'POST', body: fd})
        })
  }

  public ngOnInit(): void {
    setTimeout(() => {
      this.fileimg.nativeElement.click();
    }, 1);
  }
}
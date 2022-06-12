import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  image: File;
}

@Component({
  selector: 'app-profile-picture-dialog',
  templateUrl: './profile-picture-dialog.component.html',
  styleUrls: ['./profile-picture-dialog.component.scss']
})
export class ProfilePictureDialogComponent implements OnInit {

  private readonly fileTypes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/jpg'
  ]

  private imageUrl = '';
  private imageToUpload: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<ProfilePictureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
  }

  handleFileInput(event: any) {
    this.imageToUpload = (event.target.files as FileList).item(0);

    if (this.isFileTypeValid()) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
      }
      reader.readAsDataURL(this.imageToUpload as File);
    }
  }

  isFileTypeValid() {
    if (this.imageToUpload === null) return false;

    for (var i = 0; i < this.fileTypes.length; i++) {
      if (this.imageToUpload.type === this.fileTypes[i]) {
        this.data.image = this.imageToUpload;
        return true;
      }
    }

    return false;
  }

  isFileFormatWrong() {
    return this.imageToUpload !== null && !this.isFileTypeValid();
  }

  getImageUrl() {
    return this.imageUrl;
  }

  onDiscardClick() {
    return this.dialogRef.close();
  }
}

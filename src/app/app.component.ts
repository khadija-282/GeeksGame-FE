import { Globals } from './services/globalService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { Animations } from './animations/animations';
import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { HostListener } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [Animations]
})
export class AppComponent implements AfterViewInit {
  @ViewChild('imagediv', { static: false }) imageDiv: ElementRef;

  title = 'Geeks Game';
  total = 0;
  serviceUri = Globals.ServiceUri;
  imagesList: any = [];
  currentImagePath = '';
  currentImage: any;
  currentImageIndex: any;
  animationState = 'out';
  gameStarted = false;
  draggedItem: any;
  droppedItem: any;
  screenHeight: any;
  screenWidth: any;
  imageHeight: any = 0;
  jumpSize: any;
  topBottomInterval: any;
  panningScale = Globals.PanningScale;
  backgroundColor = 'rgb(255,255,255)';
  constructor(public httpClient: HttpClient, private renderer: Renderer2, private spinner: NgxSpinnerService) {
    this.onResize();
  }
  ngAfterViewInit(): void {
    let timer = Globals.TopBottomAnimationDuration * Globals.TopBottomAnimationDuration * Globals.TopBottomAnimationDuration * 100;
    this.topBottomInterval = setInterval(() => {
      if (this.gameStarted) {
        if (this.imageHeight > this.screenHeight) {
          // when the image height is more than the screen height then change image and start animation from top
          this.changePicture();
          this.imageHeight = 0;
        }
        this.renderer.setStyle(this.imageDiv.nativeElement, 'top', this.imageHeight + 'px');
        this.imageHeight += (this.jumpSize);
      }
    }, timer);
  }
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    let divider: number = Globals.TopBottomAnimationDuration;
    this.jumpSize = this.screenHeight / divider; // the image will jump pixels for animation
  }
  getImageFiles(): any {
    this.spinner.show();
    this.httpClient.get(this.serviceUri + '/default').subscribe((res: any) => {
      this.spinner.hide();
      if (res.result.length <= 0) {
        alert('No images found in the given path');
        return;
      }
      this.gameStarted = true;
      this.imagesList = res.result;
      this.imagesList.forEach((item: any) => {
        item.fullName = item.path;
        item.path = 'assets/images/' + item.path;
      });
      this.currentImageIndex = 0;
      this.currentImage = this.imagesList[0];
      this.changePicture();
    }, e => {
      alert('No response from API');
      this.spinner.hide();
    });
  }
  changePicture(): void {
    this.currentImagePath = this.currentImage?.path;
    this.currentImageIndex++;
    if (this.currentImageIndex >= 0 && this.currentImageIndex < this.imagesList.length) {
      this.currentImagePath = this.imagesList[this.currentImageIndex]?.path;
      this.currentImage = this.imagesList[this.currentImageIndex];
    } else { // if the currentImageIndex increases the size of the imagelist then the game is over
      this.resetGame();
    }
  }
  startGame(): any {
    this.total = 0; // not included in reset because total should turn 0 only when new game is started
    this.resetGame();
    this.getImageFiles();
  }
  onDragStart(item: any): void {
    this.draggedItem = item;
  }
  onDragEnd(): void {
    this.draggedItem = null;
  }
  onDrop(type: string, position: any): void {
    console.log({ di: this.draggedItem, type });
    if (this.draggedItem?.type?.toLowerCase() == type.toLowerCase()) {
      this.total = this.total + Globals.WinningPoint; // type contains the nationality of the person in the picture
    } else {
      this.total = this.total - Globals.LosingPoint;
    }
    if (this.gameStarted) {
      this.changePosition(position); // move towards the box 
      setTimeout(() => {
        this.currentImagePath = ''; // remove the picture and reset the image
        this.resetTurn(position);
      }, Globals.ResetTurnafterDrop);
    }
  }
  resetGame(): void {
    this.gameStarted = false;
    this.imagesList = [];
    this.currentImage = undefined;
    this.currentImagePath = '';
    this.animationState = 'in'; // default animation for fading the image after drag
  }
  resetTurn(position: any): void {
    this.imageHeight = 0;
    this.changePicture();
    this.renderer.setStyle(this.imageDiv.nativeElement, position.pos1 == 'left' ? 'right' : 'left', '0');
    // center aligning everything 
    this.renderer.setStyle(this.imageDiv.nativeElement, 'top', this.imageHeight + 'px');
    // moving image right to the top of the screen 
  }
  changePosition(position: any): void {
    this.animationState = this.animationState === 'out' ? 'in' : 'out'; // for fade animation to work
    this.renderer.setStyle(this.imageDiv.nativeElement, position.pos1 == 'left' ? 'right' : 'left', '65vw');
    // moving the image to respective side 
    this.renderer.setStyle(this.imageDiv.nativeElement, 'top', position.pos2 ? '65vh' : '15vh');
    // moving the image to bottom or to top if the pos2 value exists it means that the drag is towards the bottom boxes
  }
}

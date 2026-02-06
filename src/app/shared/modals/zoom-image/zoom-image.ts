import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-zoom-image',
  imports: [MatDialogModule],
  templateUrl: './zoom-image.html',
  styleUrl: './zoom-image.scss',
})
export class ZoomImage {
  readonly data = inject<any>(MAT_DIALOG_DATA);

  rotetRightImage(): void {
    const img = document.getElementById("image") as HTMLImageElement;
    if (img.style.transform === '') {
      img.style.transform = 'rotate(90deg)';
    } else {
      switch (img.style.transform) {
        case 'rotate(90deg)':
        case 'rotate(-270deg)':
          img.style.transform = 'rotate(180deg)';
          break;
        case 'rotate(180deg)':
        case 'rotate(-180deg)':
          img.style.transform = 'rotate(270deg)';
          break;
        case 'rotate(270deg)':
          img.style.transform = 'rotate(360deg)';
          break;
        case 'rotate(360deg)':
        case 'rotate(0deg)':
        case 'rotate(-360deg)':
          img.style.transform = 'rotate(90deg)';
          break;
        default:
          img.style.transform = 'rotate(0deg)';
          break;
      }
    }
  }

  rotetLeftImage(): void {
    const img = document.getElementById("image") as HTMLImageElement;
    if (img.style.transform === '') {
      img.style.transform = 'rotate(-90deg)';
    } else {
      switch (img.style.transform) {
        case 'rotate(-90deg)':
        case 'rotate(270deg)':
          img.style.transform = 'rotate(-180deg)';
          break;
        case 'rotate(-180deg)':
        case 'rotate(180deg)':
          img.style.transform = 'rotate(-270deg)';
          break;
        case 'rotate(-270deg)':
        case 'rotate(90deg)':
          img.style.transform = 'rotate(-360deg)';
          break;
        case 'rotate(-360deg)':
        case 'rotate(360deg)':
        case 'rotate(0deg)':
          img.style.transform = 'rotate(-90deg)';
          break;
        default:
          img.style.transform = 'rotate(0deg)';
          break;
      }
    }
  }

  zoomInImage(): void {
    let GFG = document.getElementById("image") as HTMLImageElement;
    let currWidth = GFG.clientWidth;
    let currHeight = GFG.clientHeight;
    GFG.style.width = (currWidth + 50) + "px";
    GFG.style.height = (currHeight + 50) + "px";
  }

  zoomOutImage(): void {
    let GFG = document.getElementById("image") as HTMLImageElement;
    let currWidth = GFG.clientWidth;
    let currHeight = GFG.clientHeight;
    GFG.style.width = (currWidth - 50) + "px";
    GFG.style.height = (currHeight - 50) + "px";
  }
}

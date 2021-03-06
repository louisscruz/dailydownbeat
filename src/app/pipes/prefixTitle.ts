import {Pipe, PipeTransform, ChangeDetectorRef, OnDestroy} from '@angular/core';

@Pipe({name: 'prefixTitle'})

export class PrefixTitlePipe implements PipeTransform, OnDestroy {
  constructor(private _cdRef: ChangeDetectorRef) {};

  transform(title: string): string {
    return title;
  }
  ngOnDestroy(): void {
  }
}

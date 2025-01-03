import { Injectable } from '@angular/core';
import { TranslateEventService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class TranslateControllerService {

  constructor(public TranslateEvent: TranslateEventService,

  ) {

  }

  getTranslation(key) {
    return this.TranslateEvent.Configs[key] ?? {}
  }

  getCurrentTranslation() {
    const key = document.body.getAttribute('language')

    return key ? this.TranslateEvent.Configs[key] ?? {} : {}
  }

}

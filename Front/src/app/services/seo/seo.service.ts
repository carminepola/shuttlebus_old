import { Injectable, OnChanges } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { SharedModule } from 'src/app/module/shared/shared.module';
import { ThrowStmt } from '@angular/compiler';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';
@Injectable({
  providedIn: 'root'
})
export class SEOService {

  constructor(private title: Title, private meta: Meta, private share: SharedModule) { }




  public updateTitle(title: string) {
    try {


      this.title.setTitle(title);
      this.meta.updateTag({ name: 'twitter:title', content: title });
      this.meta.updateTag({ property: 'og:title', content: title });
      //this.meta.updateTag({ itemprop: 'name', content: title });
    }
    catch (ex) {
      console.log(ex.message);
    }

  }

  public updateAllMeta() {


    var data = this.share.getDataFromRoute();

    var title = data["title"][this.share.getLenguage()];
    var description = data["description"][this.share.getLenguage()]
    this.updateTitle(title);
    this.updateMeta(data["keywords"], description, data["theme_color"], data["author"], data["type"]);
    this.updatetwitter(title, data["author"], data["type"], data["img"], description);
    this.updateOgUrl(title, data["type"], data["img"], description);
    //  this.updateGoogeMeta(title,data["img"],description);
    this.updateKey(data["keywords"]);
  }

  /**
   *  
   */
  public updateKey(valori) {
    try {

      if (this.share.commonF.isEmpty(valori)) {
        valori = ["pintour", "trasporti", "napoli", "amalfi", "noleggio", "pullman", "traferta", "viaggio", "gita"];
      }
      var key = valori.join(', ');
      this.meta.updateTag({ name: 'keywords', content: key });

    } catch (ex) {
      console.error(ex.message);
    }

  }
  public updateAllDescription(description: string) {
    try {
      this.meta.updateTag({ name: 'description', content: description });
      // this.meta.updateTag({ itemprop: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ property: 'twitter:description', content: description });
    }
    catch (ex) {
      console.error(ex.message)
    }
  }

  public updatetwitter(title: string, author: string, type: string, img: string, description: string) {
    try {

      this.meta.updateTag({ name: 'twitter:creator', content: author });
      this.meta.updateTag({ name: 'twitter:card', content: "summary" });
      this.meta.updateTag({ name: 'twitter:title', content: title });
      this.meta.updateTag({ property: 'twitter:description', content: description });
      if (!this.share.commonF.isEmpty(img)) {
        this.meta.updateTag({ name: 'twitter:image', content: img });
      }
      else {
        this.meta.updateTag({ name: 'twitter:image', content: this.share.getUrl() + "icon/apple-touch-icon.png" });

      }
      this.meta.updateTag({ name: 'twitter:type', content: type });
    }
    catch (ex) {
      console.error(ex.message);
    }
  }

  public updateGoogeMeta(title: string, img: string, description: string) {
    this.meta.updateTag({ itemprop: 'name', content: title });
    this.meta.updateTag({ itemprop: 'description', content: description });
    if (!this.share.commonF.isEmpty(img)) {
      this.meta.updateTag({ property: 'image', content: img });
    }
    else {
      this.meta.updateTag({ itemprop: 'image', content: this.share.getUrl() + "icon/apple-touch-icon.png" });
    }
  }

  public updateOgUrl(title: string, type: string, img: string, description: string) {
    try {

      this.meta.updateTag({ property: 'og:type', content: type });
      this.meta.updateTag({ property: 'og:url', content: window.location.href });
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ property: 'og:description', content: description });
      if (!this.share.commonF.isEmpty(img)) {
        this.meta.updateTag({ property: 'og:image', content: img });
      }
      else {
        this.meta.updateTag({ property: 'og:image', content: this.share.getUrl() + "icon/apple-touch-icon.png" });
      }

    }
    catch (ex) {
      console.error(ex.message);
    }

  }

  public updateMeta(keywords: string[], description: string, theme_color: string, author: string, type: string) {

    try {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ name: 'theme-color', content: theme_color });
      this.meta.updateTag({ name: 'author ', content: author });
      this.meta.updateTag({ name: 'type', content: type });
      this.meta.updateTag({ name: 'keywords', content: keywords.join(',') });
    }
    catch (ex) {
      console.error(ex.message);
    }

  }


}

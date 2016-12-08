import { NgModule } from "@angular/core";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptModule } from "nativescript-angular/platform";
import {NativeScriptHttpModule} from "nativescript-angular/http";
import { HttpModule } from '@angular/http';
import { AppComponent } from "./app.component";

@NgModule({
  imports: [NativeScriptFormsModule , NativeScriptModule, HttpModule, NativeScriptHttpModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}

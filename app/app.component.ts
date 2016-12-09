import * as app from 'application';
import { Component , OnInit, ElementRef, ViewChild} from "@angular/core";
import { User, LatLong, ListCities} from "./shared/user/user";
import { UserService } from "./shared/user/user.service";
import { PanGestureEventData, GestureStateTypes } from "ui/gestures";
import geolocation = require("nativescript-geolocation");
import { Observable } from "rxjs/Observable";
var mapbox = require("nativescript-mapbox");
import { registerElement } from "nativescript-angular/element-registry";
//registerElement("MapBox", () => require("nativescript-mapbox").Mapbox);

declare var java;
declare var android;

/* https://customlocation.cit.api.here.com/v1/search/bbox?layerId=30&bbox=48.9299%2C8.9883%3B47.4209%2C10.2957&app_id=DemoAppId01082013GAL&app_code=AJKnXv84fjrb0KIHawS0Tg
*/
@Component({
  selector: "my-app",
  templateUrl: "./pages/login/login.html"
})
export class AppComponent implements OnInit {
    //@ViewChild("mapboxContainer") FirstCheckBox: ElementRef;
    user : User;
    a : Number;
    isLoading : boolean = false;
    showLoading : boolean = false;
    people: ListCities[] = [];
    errorMessage: string = '';
    latiNew : LatLong ;

    public myItems : Observable<Array<ListCities>>;

    ngOnInit(){
        this.myItems = this.userservice.getCityDetails();

        if (!geolocation.isEnabled()) {
            geolocation.enableLocationRequest().then(() => {
                this.getLocation();
            },(e) => {
                 console.log("Error Native: " + e.message);
            });
        }
        else {
            this.getLocation();
        }
        //this.showMap();
    }

    constructor(private userservice : UserService) {
        this.user = new User();
    }

    getLocation() {
        var location = geolocation.getCurrentLocation({desiredAccuracy: 3, updateDistance: 10,  timeout: 20000})
        .then((loc) => {
            if (loc) {
                console.log("latitude: " + loc.latitude + 'longitute: '+loc.longitude);
                let lati = <LatLong>({
                    latitude : loc.latitude,
                    longitude : loc.longitude,
                });
                this.latiNew = loc;

                // Use rxjs observables instead
                // don't use {N} observable with Angular+{N} projects
                // this.eventData = {eventName: "myCustomEventName",object: this};
                // observableObject.notify(this.eventData);

                /*this.userservice.getCityDetails().subscribe((r) => {
                    //console.log('after service call');
                    //this.myItems = r;
                    //console.dump(this.myItems);
                   this.ngZone.run(()=>{
                        this.myItems.next([...r]);
                    console.dump(this.myItems);
                    })
                });*/
            }
        }, (e) => {
            console.log("Error: " + e.message);
            /*this.userservice.getCityDetails().subscribe((r) => {
                //console.log('after service call');
                //this.myItems = r;
                //console.dump(this.myItems);
                this.ngZone.run(()=>{
                 this.myItems.next([...r]);
                 console.dump(this.myItems);
                });

        this.myItems = this.userservice.getCityDetails();

            });*/
            //this.myItems = this.userservice.getCityDetails();
           // console.dump(this.myItems);
        });

        // instead subscribe to standard rxjs event stream
        // observableObject.on('myCustomEventName', (eventData) => {
        //      //this.myItems = this.userservice.getCityDetails();
        // },this);

    }


    test() {
        this.isLoading = !this.isLoading;
        this.showLoading = !this.showLoading;
    }

    getCities() {

    }

    redirect() {
        if(app.android){
            app.android.currentContext.startActivityForResult(new android.content.Intent(android.provider.Settings.ACTION_SETTINGS), 0);
         }
    }
    test1(args: PanGestureEventData) {

         console.log("Pan deltaX:" + args.deltaX + "; deltaY:" + args.deltaY + ";");
        console.log((<any>args.object).className);
           let image = <any>args.object;
         image.animate({
                    translate: { x: args.deltaX, y: 0 },
                    duration: 100
                }).then(() => {
                                   //console.log("Animation finished.");
                               })
                               .catch((e) => {
                                   console.log(e.message);
                               });


    }

    showMap() {
        mapbox.show({
          accessToken: 'pk.eyJ1IjoibWFkaHVzdWRoYW5iaGFza2FyIiwiYSI6ImNpd2R2MXY2cTAwOXUyeXA1d3M5cHM2cnoifQ.LJP0xOzPGLT3wWk4F-SvmA', // see 'Prerequisites' above
          style: mapbox.MapStyle.DARK, // mapbox.MapStyle enum in the source for other options, default mapbox.MapStyle.STREETS
          margins: {
            left: 0, // default 0
            right: 0, // default 0
            top: 450, // default 0
            bottom: 0,// default 0
            width : 100,
            height : 100
          },
          center: { // optional without a default
            lat: 52.3702160,
            lng: 4.8951680
          },
          zoomLevel: 9.25, // 0-20, default 0
          showUserLocation: true, // default false - requires location permissions on Android which you can remove from AndroidManifest.xml if you don't need them
          hideAttribution: false, // default false, Mapbox requires this default if you're on a free plan
          hideLogo: false, // default false, Mapbox requires this default if you're on a free plan
          hideCompass: false, // default false
          disableRotation: false, // default false
          disableScroll: true, // default false
          disableZoom: false, // default false
          markers: [ // optional without a default
            {
              lat: 52.3732160, // mandatory
              lng: 4.8941680, // mandatory
              title: 'Nice location', // recommended to pass in
              subtitle: 'Really really nice location', // one line is available on iOS, multiple on Android
              iconPath: 'res/markers/green_pin_marker.png', // anywhere in your app folder
              onTap: function(marker) { console.log("This marker was tapped"); },
              onCalloutTap: function(marker) { console.log("The callout of this marker was tapped"); }
            }
          ]
        }).then(
            function(result) {
              console.log("Mapbox show done");
            },
            function(error) {
              console.log("mapbox show error: " + error);
            }
        )
    }
}
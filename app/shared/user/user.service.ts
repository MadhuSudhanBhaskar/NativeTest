import { Injectable } from "@angular/core";
import { User, ListCities} from "./user";
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class UserService {

    private baseUrl : String = "https://customlocation.cit.api.here.com/v1/search/bbox?layerId=30&bbox=48.9299%2C8.9883%3B47.4209%2C10.2957&app_id=DemoAppId01082013GAL&app_code=AJKnXv84fjrb0KIHawS0Tg";


    constructor(private http : Http) { }

    public getCityDetails() : Observable<ListCities[]> {
console.log('service call');

       return this.http
         .get(`${this.baseUrl}`, {headers: this.getHeaders()})
         .map(mapPersons)
         .catch(handleError);

    }


    private getHeaders(){
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        return headers;
    }

}



function mapPersons(response:Response): ListCities[]{
  console.log('mapPersons');
  let data = response.json();
  // console.log(data);
  // for (let key in data) {
  //   console.log(`${key}: ${data[key]}`);
  // }
    return response.json().bblocations.map(toPerson);
}

function toPerson(r:any): ListCities{

  let person = <ListCities>({
    name: r.city,
    street: r.street,
    longitude: r.coordinate.longitude,
    latitude: r.coordinate.latitude,
  });

  return person;
}

function handleError (error: any) {
console.log('handleError');
  let errorMsg = `There was some issue`;
  return Observable.throw(errorMsg);
}


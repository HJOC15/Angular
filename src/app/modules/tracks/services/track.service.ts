import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import{catchError, map} from 'rxjs/operators';
import { TrackModel } from '@core/models/tracks.model';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private readonly URL = environment.api
  httpClient: any;
  constructor(private http : HttpClient) {
   

  }
  /**
   * 
   * @returns Devolver todas las rolonas molonas!!
   */

private  skipById(listTracks:TrackModel[],id:number):Promise<TrackModel[]>{
  return new Promise((resolve, reject) =>
  {
    //const listTmp = listTracks.filter(a => a._id =≠= id)
    //resolve([listTmp])a
  })
}

   getAllTracks$(): Observable<any> {
    return this.http.get(`${this.URL}/tracks`)
    .pipe(
      map(({data} : any) =>{
        return data
      })
    )
  }

  getAllRandom$(): Observable<any> {
    return this.http.get(`${this.URL}/tracks`)
    .pipe(
      map(({data} : any) =>{
        return data.reverse()
      }),
      catchError((err)=>{
        const[status, statusText] = err;
        console.log('Algo paso mal, revísame', [status, statusText])
        return of([])
      })
    )
}
}

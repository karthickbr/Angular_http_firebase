import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { Post } from './post.model';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  error = new Subject<string>();

  storingPost(title: string, content: string) {
    const postData: Post = { title, content};

    return this.http
      .post<{name: string}> // response type
      (
        'https://angular-demo-370a7.firebaseio.com/posts.json',
        postData,
        {
          observe: 'response' // 'body'
        }
      )
      .subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      });
  }

  fetchPost() {

    let searchParams =  new HttpParams(); // for multi params

    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');

    return this.http.get<{[key: string]: Post}> // response type,   return here is because subscribe is in component

     ('https://angular-demo-370a7.firebaseio.com/posts.json', {

       headers: new HttpHeaders({'Custom-Header': 'Hello'}),
       // params: new HttpParams().set('print', 'pretty') // for single params
       params: searchParams,
       responseType: 'json'

     })
      .pipe(map(responseData => {
      const postArray: Post[] = [];
      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          postArray.push({...responseData[key], id: key});
        }
      }
      return postArray;
    }),
    catchError(errorRes => {
      // its not for UI,for analytics server
      // catchError is a operator
      return throwError(errorRes);
    })
    );
    // .subscribe(post => {
    //    // console.log(post);
    // });
  }

  deletePost() {
   return this.http.delete('https://angular-demo-370a7.firebaseio.com/posts.json',
   {
     observe: 'events',
     responseType: 'json'
   }).pipe(tap(event => {

     console.log('Event', event);
     if (event.type === HttpEventType.Sent) {
          //
          console.log('Inside Sent');
     }
     if (event.type === HttpEventType.Response) {
       console.log('Response', event.body);
     }
   }));
  }


}




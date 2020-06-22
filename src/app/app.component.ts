import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map} from 'rxjs/operators';
import { Post } from './post.model';
import { PostService } from './post.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('postForm', {static: false}) postForm: NgForm;

  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit() {

   this.errorSub =  this.postService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    });

   this.isFetching = true;
   this.postService.fetchPost().subscribe(post => {
      this.loadedPosts = post;
    }, error => {
      this.error = error.message;
      this.isFetching = false;
    });
   this.isFetching = false;
  }

  onCreatePost(postData: { title: string; content: string }) {
    this.postService.storingPost(postData.title, postData.content);
    // .subscribe(responseData => {
    //   this.onFetchPosts();
    //   this.postForm.reset();
    // });
  }

  onFetchPosts() {
    this.isFetching = true;
    this.postService.fetchPost().subscribe(post => {
      this.loadedPosts = post;
    }, errorRes => {
          this.error = errorRes.message;
          this.isFetching = false;
    });
    this.isFetching = false;
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePost().subscribe(() => {
      this.loadedPosts = [];
    });
  }
  onHandelError() {
      this.error = null;
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }

}

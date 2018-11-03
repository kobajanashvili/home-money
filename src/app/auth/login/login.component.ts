import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { UsersService } from '../../shared/services/users.service';
import { User } from '../../shared/models/user.model';
import { Message } from '../../shared/models/message.model';
import { AuthService } from '../../shared/services/auth.service';
import { fadeStateTrigger } from '../../shared/animations/fade.animation';

@Component({
  selector: 'wfm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeStateTrigger]
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  message: Message;

  constructor(private userService: UsersService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private title: Title,
              private meta: Meta
            ) {
                title.setTitle('Enter page');
                meta.addTags([
                  { name: 'keywords', content: 'enter,login,system' },
                  { name: 'description', content: 'page for enter this system' }
                ]);
              }

  ngOnInit() {
    this.message = new Message('danger', '');

    this.route.queryParams.subscribe((params: Params) => {
      if (params['nowCanLogin']) {
        this.showMessage({
          text: 'Now you can enter in system!',
          type: 'success'});
      } else if (params['accessDenied']) {
        this.showMessage({
          text: 'כדעי לעבוד במערכת צריך להתחבר',
          type: 'warning'});
      }
    });

    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  private showMessage(message: Message) {
    this.message = message;
    window.setTimeout(() => {
      this.message.text = '';
    }, 5000);
  }

  onSubmit() {
    const formData = this.form.value;

    this.userService.getUserByEmail(formData.email)
      .subscribe((user: User) => {
        if ( user) {
          if (user.password === formData.password) {
            this.message.text = '';
            window.localStorage.setItem('user', JSON.stringify(user));
            this.authService.login();
            this.router.navigate(['/system', 'bill']);
          } else {
            this.showMessage({
              text: 'סיסמה לא נכונה !',
              type: 'danger'
            });
          }
        } else {
          this.showMessage({
            text: 'משתמש לא קיים !',
            type: 'danger'
          });
        }
      });
  }

}

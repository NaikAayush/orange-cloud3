import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-auth-pw-mn-form',
  templateUrl: './auth-pw-mn-form.component.html',
  styleUrls: ['./auth-pw-mn-form.component.css'],
})
export class AuthPwMnFormComponent implements OnInit {
  new: boolean = true;
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.paramMap.get('type') == 'old') {
      this.new = false;
    }
    this.auth.getCredentials();
  }

  newAccount(newForm: NgForm) {
    console.log(newForm.value);
    const mnemonic = this.auth.createAccount(newForm.value.pwd);
    this.router.navigateByUrl('mnemonic/' + mnemonic.mnemonic);
  }
  oldAccount(oldForm: NgForm) {
    console.log(oldForm.value);
    this.auth.retrieveAccount(oldForm.value.mnemonic, oldForm.value.pwd);
  }
}

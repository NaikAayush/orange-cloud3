import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { CoreService } from './services/core/core.service';
import { Web3Service } from './services/web3/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor(
    public web3: Web3Service,
    public core: CoreService,
    private auth: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    if ((await this.auth.getLoginStatus()) == false) {
      this.router.navigateByUrl('auth');
    }
  }
}

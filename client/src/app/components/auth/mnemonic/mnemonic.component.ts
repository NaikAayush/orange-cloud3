import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mnemonic',
  templateUrl: './mnemonic.component.html',
  styleUrls: ['./mnemonic.component.css'],
})
export class MnemonicComponent implements OnInit {
  mnemonic: any;
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.mnemonic = this.activatedRoute.snapshot.paramMap.get('data');
  }

  redirect() {
    this.router.navigateByUrl('upload');
  }
}

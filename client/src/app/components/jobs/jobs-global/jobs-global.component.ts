import { Component, OnInit } from '@angular/core';
import { TheGraphService } from 'src/app/services/the-graph/the-graph.service';

@Component({
  selector: 'app-jobs-global',
  templateUrl: './jobs-global.component.html',
  styleUrls: ['./jobs-global.component.css'],
})
export class JobsGlobalComponent implements OnInit {
  constructor(private theGraph: TheGraphService) {}

  async ngOnInit() {
    const x = await this.theGraph.getAvailableJobs();
    console.log(x);
  }
}

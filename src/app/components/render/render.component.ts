import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getRouteData$ } from 'src/app/services/helper';
import { Result } from 'src/app/services/render.service';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'd-render',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RenderComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}
  html$ = getRouteData$<Result>('result').pipe(map((result) => result.html));
  ngOnInit(): void {}

  click(event: MouseEvent) {
    const target = event.target;
    if (target instanceof HTMLAnchorElement) {
      event.preventDefault();
      const href = target.getAttribute('href');
      if (!href) {
        return;
      }
      this.router.navigate([href], { relativeTo: this.route });
    }
  }
}

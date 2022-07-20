import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { map } from 'rxjs';

export function getRouteData<T>(key: string) {
  const route = inject(ActivatedRoute);
  return route.snapshot.data[key] as T;
}

export function getRouteData$<T>(key: string) {
  const route = inject(ActivatedRoute);
  return route.data.pipe(map((data) => data[key] as T));
}

export function isBrowser() {
  const platformID = inject(PLATFORM_ID);
  return isPlatformBrowser(platformID);
}

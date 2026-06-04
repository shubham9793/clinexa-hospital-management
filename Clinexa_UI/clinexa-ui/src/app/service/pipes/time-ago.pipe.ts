import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const key of Object.keys(intervals) as Array<keyof typeof intervals>) {
      const interval = Math.floor(seconds / intervals[key]);

      if (interval >= 1) {
        return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
      }
    }

    return 'Just now';
  }
}

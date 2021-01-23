import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const displayTime = (createdAt: string | Date, showTime = false) => {
    const now = dayjs();
    const created = dayjs(createdAt);
    const oneDay = 24 * 60 * 60 * 1000;
    const twelveHours = 12 * 60 * 60 * 1000;
    const timeDisplay = !showTime ? '' : ` | ${dayjs(createdAt).format('hh:mm a')}`;

    if (now.diff(created) < twelveHours) {
        return dayjs(createdAt).fromNow();
    } else if (now.diff(created) < oneDay) {
        return `${dayjs(createdAt).fromNow()} ${timeDisplay}`;
    } else if (now.diff(createdAt, 'year') >= 1) {
        return `${dayjs(createdAt).format('MMM. DD, YYYY')} ${timeDisplay}`;
    } else {
        return `${dayjs(createdAt).format('MMM. DD')} ${timeDisplay}`;
    }
}
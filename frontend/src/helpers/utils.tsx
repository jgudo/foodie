import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const displayTime = (createdAt: string | Date) => {
    const now = dayjs();
    const created = dayjs(createdAt);
    const oneDay = 24 * 60 * 60 * 1000;
    const twelveHours = 12 * 60 * 60 * 1000;

    if (now.diff(created) < twelveHours) {
        return dayjs(createdAt).fromNow();
    } else if (now.diff(created) < oneDay) {
        return dayjs(createdAt).fromNow() + ' | ' + dayjs(createdAt).format('hh:mm a');
    } else {
        return dayjs(createdAt).format('MMM. DD, YYYY') + ' | ' + dayjs(createdAt).format('hh:mm a');
    }
}
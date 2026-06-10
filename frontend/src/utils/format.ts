import dayjs from 'dayjs';

export const formatPrice = (price: number | string) => `¥${Number(price).toFixed(2)}`;

export const formatDateTime = (value: string | Date) => dayjs(value).format('MM月DD日 HH:mm');

export const formatFullDateTime = (value: string | Date) => dayjs(value).format('YYYY-MM-DD HH:mm');

export const maskPhone = (phone: string) => phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');

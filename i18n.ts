import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  if (!['en', 'zh'].includes(locale as string)) {
    throw new Error('Invalid locale');
  }
  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'Asia/Shanghai',
    now: new Date(),
  };
});

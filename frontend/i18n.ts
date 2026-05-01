import { getRequestConfig } from 'next-intl/server'

const locales = ['en', 'pl']

export default getRequestConfig(async ({ requestLocale }) => {
  const resolvedLocale = await requestLocale
  const validLocale = locales.includes(resolvedLocale as string) ? resolvedLocale : 'en'

  const [
    homeHeader,
    supportersTicker,
    footer,
    notFound,
    home,
    subpageHeader,
    qa,
    reality,
    about,
    changelog,
  ] = await Promise.all([
    import(`./messages/${validLocale}/homeHeader.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/supportersTicker.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/footer.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/notFound.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/home.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/subpageHeader.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/qa.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/reality.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/about.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/changelog.json`, { with: { type: 'json' } }),
  ])

  const messages = {
    ...homeHeader.default,
    ...supportersTicker.default,
    ...footer.default,
    ...notFound.default,
    ...home.default,
    ...subpageHeader.default,
    ...qa.default,
    ...reality.default,
    ...about.default,
    ...changelog.default,
  }

  return {
    locale: validLocale as string,
    messages,
  }
})

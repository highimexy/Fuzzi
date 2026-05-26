import { getRequestConfig } from 'next-intl/server'

const locales = ['en', 'pl']

export default getRequestConfig(async ({ requestLocale }) => {
  const resolvedLocale = await requestLocale
  const validLocale = locales.includes(resolvedLocale as string) ? resolvedLocale : 'en'

  const [
    homeHeader,
    problemSection,
    solutionSection,
    educationSection,
    trustSection,
    conversionSection,
    lastSection,
    supportersTicker,
    footer,
    notFound,
    subpageHeader,
    qa,
    reality,
    about,
    changelog,
    lessons,
    navbar,
    quest,
  ] = await Promise.all([
    import(`./messages/${validLocale}/homeHeader.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/problemSection.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/solutionSection.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/educationSection.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/trustSection.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/conversionSection.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/lastSection.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/supportersTicker.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/footer.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/notFound.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/subpageHeader.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/qa.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/reality.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/about.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/changelog.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/lessons.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/navbar.json`, { with: { type: 'json' } }),
    import(`./messages/${validLocale}/quest.json`, { with: { type: 'json' } }),
  ])

  const messages = {
    ...homeHeader.default,
    ...problemSection.default,
    ...solutionSection.default,
    ...educationSection.default,
    ...trustSection.default,
    ...conversionSection.default,
    ...lastSection.default,
    ...supportersTicker.default,
    ...footer.default,
    ...notFound.default,
    ...subpageHeader.default,
    ...qa.default,
    ...reality.default,
    ...about.default,
    ...changelog.default,
    ...lessons.default,
    ...navbar.default,
    ...quest.default,
  }

  return {
    locale: validLocale as string,
    messages,
  }
})

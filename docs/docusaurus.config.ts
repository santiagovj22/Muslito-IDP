import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Muslito IDP',
  tagline: 'Golden paths and paved roads for your engineering team',
  favicon: 'img/favicon.ico',

  url: 'https://santiagovj22.github.io',
  baseUrl: '/Muslito-IDP/',

  organizationName: 'santiagovj22',
  projectName: 'Muslito-IDP',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/santiagovj22/Muslito-IDP/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Muslito IDP',
      logo: {
        alt: 'Muslito IDP Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/santiagovj22/Muslito-IDP',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Getting Started', to: '/docs/getting-started/quickstart' },
            { label: 'CLI Reference', to: '/docs/cli/overview' },
            { label: 'Scaffolds', to: '/docs/scaffolds/overview' },
            { label: 'Blueprints', to: '/docs/blueprints/overview' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'GitHub', href: 'https://github.com/santiagovj22/Muslito-IDP' },
            { label: 'Contributing', to: '/docs/contributing' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Muslito IDP. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'yaml', 'typescript', 'python', 'json', 'docker'],
    },
    algolia: undefined,
  } satisfies Preset.ThemeConfig,
};

export default config;

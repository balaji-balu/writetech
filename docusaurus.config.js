/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'WriteTech',
  tagline: 'write technical stuff',
  url: 'https://writetech.vercel.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'balaji-balu', // Usually your GitHub org/user name.
  projectName: 'writetech', // Usually your repo name.
  themeConfig: {
    prisma: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
    navbar: {
      title: 'WriteTech',
      logo: {
        alt: '',
        src: 'img/writetechlogo.svg',
      },
      
      // items: [
      //   {
      //     to: 'docs/',
      //     activeBasePath: 'docs',
      //     label: 'Docs',
      //     position: 'left',
      //   },
      //   {to: 'blog', label: 'Blog', position: 'left'},
      //   {
      //     href: 'https://github.com/balaji-balu',
      //     label: 'GitHub',
      //     position: 'right',
      //   },
      // ],
    },
    footer: {
      style: 'dark',
      links: [
        // {
        //   title: 'Docs',
        //   items: [
        //     {
        //       label: 'Getting Started',
        //       to: 'docs/',
        //     },
        //   ],
        // },
        // {
        //   title: 'Community',
        //   items: [
        //     {
        //       label: 'Github',
        //       href: 'https://github.com/balaji-balu',
        //     },
        //     {
        //       label: 'Twitter',
        //       href: 'https://twitter.com/balajibalutvm',
        //     },
        //   ],
        // },
        // {
        //   title: 'More',
        //   items: [
        //     // {
        //     //   label: 'Blog',
        //     //   to: 'blog',
        //     // },
        //     {
        //       label: 'GitHub',
        //       href: 'https://github.com/balaji-balu',
        //     },
        //   ],
        // },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} WriteTech. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        // docs: {
        //   sidebarPath: require.resolve('./sidebars.js'),
        //   // Please change this to your repo.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/edit/master/website/',
        // },
        docs: false,
        blog: {
          showReadingTime: true,
          // added for blog only mode 
          path: './blog',
          routeBasePath: '/', // Set this value to '/'.
          blogTitle: 'Docusaurus blog!',
          blogDescription: 'A docusaurus powered blog!',
          // Please change this to your repo.
          editUrl:
            'https://github.com/balaji-balu/writetech/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};

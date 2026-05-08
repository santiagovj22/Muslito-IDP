import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '👋 Introduction',
    },
    {
      type: 'category',
      label: '🚀 Getting Started',
      collapsed: false,
      items: [
        'getting-started/installation',
        'getting-started/quickstart',
      ],
    },
    {
      type: 'category',
      label: '⌨️ CLI Reference',
      items: [
        'cli/overview',
      ],
    },
    {
      type: 'category',
      label: '🏗️ Scaffolds',
      items: [
        'scaffolds/overview',
        'scaffolds/nodejs',
        'scaffolds/fastapi',
      ],
    },
    {
      type: 'category',
      label: '☁️ Blueprints',
      items: [
        'blueprints/overview',
        'blueprints/apigw-lambda-dynamodb',
        'blueprints/ecs-fargate-rds',
        'blueprints/cache-layer',
        'blueprints/event-driven',
        'blueprints/secrets-and-config',
      ],
    },
    {
      type: 'category',
      label: '🔄 Pipelines',
      items: [
        'pipelines/overview',
        'pipelines/nodejs',
        'pipelines/python',
      ],
    },
    {
      type: 'doc',
      id: 'contributing',
      label: '🤝 Contributing',
    },
  ],
};

export default sidebars;

import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

type FeatureItem = {
  icon: string;
  title: string;
  description: string;
};

const features: FeatureItem[] = [
  {
    icon: '⌨️',
    title: 'IDP CLI',
    description:
      'One command to scaffold a production-ready service or deploy a cloud blueprint. No tickets, no waiting.',
  },
  {
    icon: '🏗️',
    title: 'Service Scaffolds',
    description:
      'Node.js (Fastify) and FastAPI templates with layered architecture, logging, error handling, CORS, and CI/CD baked in.',
  },
  {
    icon: '☁️',
    title: 'Infra Blueprints',
    description:
      'AWS CDK stacks for common patterns — serverless APIs, containerised services, caching, eventing, and secrets management.',
  },
  {
    icon: '🔄',
    title: 'Reusable Pipelines',
    description:
      'GitHub Actions and GitLab CI templates with lint, test, security scan, build, and deploy stages ready to go.',
  },
  {
    icon: '🔒',
    title: 'Security by Default',
    description:
      'Encryption at rest, least-privilege IAM, input sanitization, secrets rotation, and audit logging ship with every golden path.',
  },
  {
    icon: '📈',
    title: 'Observability Included',
    description:
      'Structured logging, X-Ray tracing, CloudWatch alarms, and Container Insights are pre-configured on every scaffold and blueprint.',
  },
];

function HeroBanner(): ReactNode {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Muslito IDP
        </Heading>
        <p className="hero__subtitle">
          Golden paths and paved roads for your engineering team.
          <br />
          From idea to running service in minutes, not days.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/quickstart"
          >
            Quick Start — 5 min ⚡
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/intro"
            style={{ marginLeft: '1rem' }}
          >
            Learn More
          </Link>
        </div>
      </div>
    </header>
  );
}

function Feature({ icon, title, description }: FeatureItem): ReactNode {
  return (
    <div className={clsx('col col--4')}>
      <div className="feature-card text--center padding-horiz--md">
        <div className="feature-icon">{icon}</div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

function FeaturesSection(): ReactNode {
  return (
    <section className="features">
      <div className="container">
        <div className="row" style={{ gap: '1.5rem 0' }}>
          {features.map((props) => (
            <Feature key={props.title} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickStartSection(): ReactNode {
  return (
    <section style={{ background: 'var(--ifm-color-emphasis-100)', padding: '3rem 0' }}>
      <div className="container">
        <Heading as="h2" className="text--center" style={{ marginBottom: '2rem' }}>
          Get Started in Seconds
        </Heading>
        <div className="row">
          <div className="col col--4">
            <div className="feature-card">
              <Heading as="h3">1. Install the CLI</Heading>
              <pre>
                <code>npm install -g @muslito/idp-cli</code>
              </pre>
            </div>
          </div>
          <div className="col col--4">
            <div className="feature-card">
              <Heading as="h3">2. Generate a service</Heading>
              <pre>
                <code>{'idp scaffold new \\\n  --type nodejs \\\n  --name my-service'}</code>
              </pre>
            </div>
          </div>
          <div className="col col--4">
            <div className="feature-card">
              <Heading as="h3">3. Deploy infrastructure</Heading>
              <pre>
                <code>
                  {'idp blueprint deploy \\\n  apigw-lambda-dynamodb \\\n  --name my-api --env dev'}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HeroBanner />
      <main>
        <FeaturesSection />
        <QuickStartSection />
      </main>
    </Layout>
  );
}